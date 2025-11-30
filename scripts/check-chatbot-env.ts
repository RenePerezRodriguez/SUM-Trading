/**
 * Script para verificar configuración del chatbot
 * 
 * USO:
 * npx tsx scripts/check-chatbot-env.ts
 */

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function checkGeminiApi() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    log('❌ GEMINI_API_KEY no está definida', 'red');
    return false;
  }

  log(`✅ GEMINI_API_KEY encontrada: ${apiKey.substring(0, 10)}...`, 'green');

  // Verificar si la API key funciona
  log('\n🔍 Probando conexión con Gemini API...', 'cyan');
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Hola, responde solo con "OK"' }] }],
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      log(`❌ Error al conectar con Gemini API (${response.status}):`, 'red');
      log(JSON.stringify(error, null, 2), 'yellow');
      return false;
    }

    const data = await response.json();
    log('✅ Conexión exitosa con Gemini API', 'green');
    log(`Respuesta de prueba: ${JSON.stringify(data.candidates?.[0]?.content?.parts?.[0]?.text || 'N/A')}`, 'yellow');
    return true;
  } catch (error: any) {
    log(`❌ Error de red: ${error.message}`, 'red');
    return false;
  }
}

async function main() {
  log('\n🤖 Verificando configuración del chatbot\n', 'cyan');
  log('='.repeat(60), 'cyan');

  // 1. Verificar variables de entorno
  log('\n📋 Variables de entorno:', 'blue');
  log(`  NODE_ENV: ${process.env.NODE_ENV || 'no definido'}`, 'yellow');
  log(`  VERCEL_ENV: ${process.env.VERCEL_ENV || 'no definido'}`, 'yellow');

  // 2. Verificar GEMINI_API_KEY
  log('\n🔑 API Key de Gemini:', 'blue');
  const geminiOk = await checkGeminiApi();

  // 3. Verificar archivo de configuración
  log('\n📁 Configuración de deployment:', 'blue');
  const fs = await import('fs');
  const path = await import('path');
  
  const apphostingPath = path.resolve(process.cwd(), 'apphosting.yaml');
  if (fs.existsSync(apphostingPath)) {
    log('✅ apphosting.yaml encontrado', 'green');
    const content = fs.readFileSync(apphostingPath, 'utf-8');
    
    if (content.includes('GEMINI_API_KEY')) {
      log('✅ GEMINI_API_KEY está configurada en apphosting.yaml', 'green');
      
      // Verificar si es secret o value
      if (content.includes('secret: GEMINI_API_KEY')) {
        log('⚠️  GEMINI_API_KEY está como SECRET (requiere configuración en Firebase Console)', 'yellow');
      } else if (content.includes('value:') && content.includes('GEMINI_API_KEY')) {
        log('✅ GEMINI_API_KEY está como VALUE directo', 'green');
      }
    } else {
      log('❌ GEMINI_API_KEY NO está en apphosting.yaml', 'red');
    }
  } else {
    log('⚠️  apphosting.yaml no encontrado', 'yellow');
  }

  // Resumen
  log('\n' + '='.repeat(60), 'cyan');
  log('📊 RESUMEN', 'blue');
  log('='.repeat(60), 'cyan');
  
  if (geminiOk) {
    log('✅ El chatbot debería funcionar correctamente', 'green');
  } else {
    log('❌ HAY PROBLEMAS CON LA CONFIGURACIÓN', 'red');
    log('\n🔧 SOLUCIONES:', 'yellow');
    log('1. Verifica que GEMINI_API_KEY esté en apphosting.yaml', 'yellow');
    log('2. Si es un secret, configúralo en Firebase Console:', 'yellow');
    log('   - Firebase Console > App Hosting > Secrets', 'cyan');
    log('   - Agrega GEMINI_API_KEY con tu API key', 'cyan');
    log('3. Si es un valor directo, verifica que la API key sea válida', 'yellow');
    log('4. Redeploy tu aplicación después de cambios', 'yellow');
  }
  
  log('='.repeat(60) + '\n', 'cyan');
}

main();
