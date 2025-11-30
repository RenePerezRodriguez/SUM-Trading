/**
 * Script para diagnosticar y corregir permisos de administrador
 * 
 * USO:
 * 1. npm install -D tsx
 * 2. npx tsx scripts/fix-admin-permissions.ts <email-del-admin>
 * 
 * Ejemplo:
 * npx tsx scripts/fix-admin-permissions.ts admin@sumtrading.us
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as path from 'path';
import * as fs from 'fs';

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function main() {
  const userEmail = process.argv[2];

  if (!userEmail) {
    log('❌ Error: Debes proporcionar el email del usuario', 'red');
    log('Uso: npx tsx scripts/fix-admin-permissions.ts <email>', 'yellow');
    log('Ejemplo: npx tsx scripts/fix-admin-permissions.ts admin@sumtrading.us', 'cyan');
    process.exit(1);
  }

  log('\n🔧 Iniciando diagnóstico de permisos de administrador...', 'cyan');
  log(`📧 Usuario: ${userEmail}\n`, 'blue');

  // Inicializar Firebase Admin
  try {
    let serviceAccount: any;

    // Intentar cargar service account desde variable de entorno (producción)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      log('📦 Cargando credenciales desde variable de entorno...', 'yellow');
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } else {
      // Cargar desde archivo local (desarrollo)
      log('📦 Cargando credenciales desde archivo local...', 'yellow');
      const serviceAccountPath = path.resolve(process.cwd(), 'service-account.json');
      
      if (!fs.existsSync(serviceAccountPath)) {
        log('❌ No se encontró service-account.json', 'red');
        log('Por favor, descarga tu service account desde Firebase Console:', 'yellow');
        log('1. Ve a Firebase Console > Project Settings > Service Accounts', 'cyan');
        log('2. Click en "Generate New Private Key"', 'cyan');
        log('3. Guarda el archivo como service-account.json en la raíz del proyecto', 'cyan');
        process.exit(1);
      }

      serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
    }

    initializeApp({
      credential: cert(serviceAccount),
    });

    log('✅ Firebase Admin inicializado correctamente\n', 'green');
  } catch (error) {
    log(`❌ Error al inicializar Firebase Admin: ${error}`, 'red');
    process.exit(1);
  }

  const auth = getAuth();
  const firestore = getFirestore();

  try {
    // 1. Buscar usuario por email
    log('🔍 Paso 1: Buscando usuario en Firebase Auth...', 'cyan');
    const userRecord = await auth.getUserByEmail(userEmail);
    log(`✅ Usuario encontrado: ${userRecord.uid}`, 'green');

    // 2. Verificar custom claims actuales
    log('\n🔍 Paso 2: Verificando custom claims...', 'cyan');
    const customClaims = userRecord.customClaims || {};
    log(`Custom claims actuales: ${JSON.stringify(customClaims, null, 2)}`, 'yellow');

    // 3. Verificar documento en Firestore
    log('\n🔍 Paso 3: Verificando documento en Firestore...', 'cyan');
    const userDocRef = firestore.collection('users').doc(userRecord.uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      log('❌ El documento del usuario NO existe en Firestore', 'red');
      log('Creando documento...', 'yellow');
      
      await userDocRef.set({
        email: userRecord.email,
        displayName: userRecord.displayName || '',
        photoURL: userRecord.photoURL || '',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      log('✅ Documento creado con role: admin', 'green');
    } else {
      const userData = userDoc.data();
      log(`Documento encontrado. Role actual: ${userData?.role || 'NO DEFINIDO'}`, 'yellow');

      if (userData?.role !== 'admin') {
        log('❌ El role NO es admin. Actualizando...', 'red');
        await userDocRef.update({
          role: 'admin',
          updatedAt: new Date(),
        });
        log('✅ Role actualizado a admin en Firestore', 'green');
      } else {
        log('✅ El role ya es admin en Firestore', 'green');
      }
    }

    // 4. Actualizar custom claims
    log('\n🔍 Paso 4: Actualizando custom claims...', 'cyan');
    if (customClaims.role !== 'admin') {
      await auth.setCustomUserClaims(userRecord.uid, { role: 'admin' });
      log('✅ Custom claims actualizadas a role: admin', 'green');
      log('⚠️  IMPORTANTE: El usuario debe cerrar sesión y volver a iniciar para que los cambios surtan efecto', 'yellow');
    } else {
      log('✅ Custom claims ya tienen role: admin', 'green');
    }

    // 5. Verificar token
    log('\n🔍 Paso 5: Verificando token ID...', 'cyan');
    const freshUserRecord = await auth.getUser(userRecord.uid);
    log('Token metadata:', 'yellow');
    log(`  - Última actualización: ${new Date(freshUserRecord.metadata.lastRefreshTime || '').toISOString()}`, 'yellow');
    log(`  - Custom claims: ${JSON.stringify(freshUserRecord.customClaims, null, 2)}`, 'yellow');

    // Resumen final
    log('\n' + '='.repeat(60), 'cyan');
    log('📊 RESUMEN FINAL', 'green');
    log('='.repeat(60), 'cyan');
    log(`✅ Usuario: ${userEmail}`, 'green');
    log(`✅ UID: ${userRecord.uid}`, 'green');
    log(`✅ Role en Firestore: admin`, 'green');
    log(`✅ Custom Claims: { role: 'admin' }`, 'green');
    log('\n⚠️  ACCIÓN REQUERIDA:', 'yellow');
    log('1. El usuario debe CERRAR SESIÓN completamente', 'yellow');
    log('2. Limpiar cookies y caché del navegador (o usar modo incógnito)', 'yellow');
    log('3. Iniciar sesión nuevamente', 'yellow');
    log('4. Los permisos de admin deberían funcionar ahora', 'yellow');
    log('='.repeat(60) + '\n', 'cyan');

  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      log(`❌ Error: No se encontró ningún usuario con el email ${userEmail}`, 'red');
      log('Verifica que el email sea correcto y que el usuario exista en Firebase Auth', 'yellow');
    } else {
      log(`❌ Error: ${error.message}`, 'red');
      console.error(error);
    }
    process.exit(1);
  }
}

main();
