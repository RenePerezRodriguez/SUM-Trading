# 🚀 Guía de Despliegue a Producción - Firebase App Hosting

**Última actualización:** 2025-11-30

## 📋 Índice

1. [Checklist Pre-Despliegue](#checklist-pre-despliegue)
2. [Configurar Secrets](#configurar-secrets)
3. [Métodos de Despliegue](#métodos-de-despliegue)
4. [Post-Despliegue](#post-despliegue)
5. [Troubleshooting](#troubleshooting)

---

## 📋 Checklist Pre-Despliegue

### 1. Variables de Entorno Configuradas
- ✅ `.env.production` actualizado con todas las variables
- ✅ `apphosting.yaml` configurado con secrets
- ✅ Firebase CLI actualizado (`firebase --version` >= 14.4.0)

### 2. Secrets de Firebase (OBLIGATORIO)

Antes de desplegar, debes crear los siguientes **secrets** en Firebase App Hosting:

---

## 🔐 Configurar Secrets

### Método 1: CLI de Firebase (RECOMENDADO)

```bash
# 1. Instalar/actualizar Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Configurar secrets interactivamente
firebase apphosting:secrets:set GEMINI_API_KEY --project studio-6719476275-3891a
firebase apphosting:secrets:set STRIPE_SECRET_KEY --project studio-6719476275-3891a
firebase apphosting:secrets:set STRIPE_WEBHOOK_SECRET --project studio-6719476275-3891a
firebase apphosting:secrets:set FIREBASE_SERVICE_ACCOUNT_JSON --project studio-6719476275-3891a

# 4. Dar permisos de acceso al backend (automático con CLI pero verifica)
firebase apphosting:secrets:grantaccess GEMINI_API_KEY --backend studio
```

**Valores de los secrets:**

```bash
# GEMINI_API_KEY (AI Chatbot)
AIzaSyCK-wRtUQI606fwuaqkpjcogVv6IV7vCms

# STRIPE_SECRET_KEY (Pagos)
# TEST: sk_test_51SGPcIBh7oiw3HEvk74l9Jgj...
# LIVE: sk_live_XXXXXXXXXXXXXXXXX

# STRIPE_WEBHOOK_SECRET
# Obtener desde Stripe Dashboard > Developers > Webhooks
whsec_your_webhook_secret_here

# FIREBASE_SERVICE_ACCOUNT_JSON
# JSON completo de service account (una sola línea)

```

### Método 2: Firebase Console (Manual)

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto: `studio-6719476275-3891a`
3. Ve a **App Hosting** > Tu backend `studio`
4. Pestaña **Secrets** > **Add Secret**
5. Agrega cada secret con su nombre y valor
6. Luego otorga permisos:
   ```bash
   firebase apphosting:secrets:grantaccess GEMINI_API_KEY --backend studio
   ```

---

## 🚀 Métodos de Despliegue

### Opción 1: Deploy desde Código Local con CLI (NUEVO - Más Rápido)

```bash
# 1. Asegúrate de tener firebase.json configurado
# Ya está configurado en tu proyecto:
# {
#   "apphosting": {
#     "backendId": "studio",
#     "rootDir": ".",
#     "alwaysDeployFromSource": true
#   }
# }

# 2. Deploy directo desde tu máquina local
firebase deploy --only apphosting

# Firebase subirá tu código local, compilará y desplegará
# ¡No necesitas hacer git push!
```

**Ventajas:**
- ⚡ Más rápido (no espera a GitHub)
- 🔧 Pruebas rápidas sin commits
- 🚀 Deploy desde cualquier rama local

### Opción 2: Deploy desde GitHub (CI/CD Automático)

1. Ve a **Firebase Console > App Hosting**
2. Conecta tu repositorio de GitHub si no lo has hecho
3. Selecciona la rama: `main` o `pruebas`
4. Click en **Deploy** o habilita **Auto-deploy**
5. Firebase automáticamente:
   - Clona el repo desde GitHub
   - Ejecuta `npm install`
   - Ejecuta `npm run build`
   - Despliega con las variables de `apphosting.yaml`

**Ventajas:**
- 🔄 CI/CD automático al hacer push
- 📝 Historial de deploys vinculado a commits
- 👥 Colaboración en equipo

### Opción 3: Rollout Manual desde CLI

```bash
# Ver backends disponibles
firebase apphosting:backends:list

# Ver rollouts recientes
firebase apphosting:rollouts:list --backend studio

# Crear nuevo rollout (no recomendado, usa deploy)
# Este comando es solo para referencia
```

---

## ✅ Post-Despliegue

Tu configuración actual:

```yaml
runConfig:
  maxInstances: 3      # Máximo 3 instancias simultáneas
  minInstances: 0      # Escala a cero cuando no hay tráfico
  memory: 1GiB         # 1GB RAM por instancia
  cpu: 1               # 1 vCPU por instancia
```

### Ajustes Recomendados por Tráfico

**Tráfico Bajo (actual - desarrollo/pre-launch):**
```yaml
maxInstances: 3
minInstances: 0
memory: 1GiB
cpu: 1
```

**Tráfico Medio (producción inicial):**
```yaml
maxInstances: 10
minInstances: 1      # Mantener 1 instancia siempre caliente
memory: 2GiB
cpu: 2
```

**Tráfico Alto (producción con muchos usuarios):**
```yaml
maxInstances: 50
minInstances: 3
memory: 4GiB
cpu: 2
```

---

## 🔥 Troubleshooting

### Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `GEMINI_API_KEY is required` | Secret no configurado | `firebase apphosting:secrets:set GEMINI_API_KEY` |
| `STRIPE_SECRET_KEY is not defined` | Secret no creado | `firebase apphosting:secrets:set STRIPE_SECRET_KEY` |
| `FIREBASE_SERVICE_ACCOUNT_JSON is undefined` | Secret falta | `firebase apphosting:secrets:set FIREBASE_SERVICE_ACCOUNT_JSON` |
| `Failed to connect to scrap.sumtrading.us` | Backend ScraptPress down | Verificar Cloud Run: https://scrap.sumtrading.us |
| `Memory limit exceeded` | Tráfico alto o leak | Aumentar `memory: 2GiB` en apphosting.yaml |
| Chatbot no responde | API key inválida o límite excedido | Verificar Gemini API Console |
| `Permission denied` en Admin | Usuario sin role admin | Ejecutar script: `npx tsx scripts/fix-admin-permissions.ts` |

### Comandos de Diagnóstico

```bash
# Verificar configuración de secrets
firebase apphosting:secrets:list

# Ver logs en tiempo real
firebase apphosting:logs --backend studio --tail

# Ver backends disponibles
firebase apphosting:backends:list

# Ver historial de rollouts
firebase apphosting:rollouts:list --backend studio

# Verificar chatbot y Gemini
npx tsx scripts/check-chatbot-env.ts

# Arreglar permisos de admin
npx tsx scripts/fix-admin-permissions.ts admin@sumtrading.us
```

### Rollback de Emergency

Si el deploy rompe producción:

```bash
# Método 1: CLI
firebase apphosting:rollouts:list --backend studio
firebase apphosting:rollouts:rollback <ROLLOUT_ID>

# Método 2: Console
# 1. Firebase Console > App Hosting > Rollouts
# 2. Selecciona rollout anterior funcional
# 3. Click "Promote to live"
```

### Logs Útiles

```bash
# Ver errores solo
firebase apphosting:logs --backend studio | grep "ERROR"

# Ver logs del chatbot
firebase apphosting:logs --backend studio | grep "chatbot"

# Ver logs de Stripe
firebase apphosting:logs --backend studio | grep "stripe"
```

---

## 🎯 Checklist Final de Producción

Antes de considerar el despliegue completo:

**Secrets & Configuración:**
- [ ] `GEMINI_API_KEY` configurado y con permisos
- [ ] `STRIPE_SECRET_KEY` configurado (TEST o LIVE)
- [ ] `STRIPE_WEBHOOK_SECRET` configurado
- [ ] `FIREBASE_SERVICE_ACCOUNT_JSON` configurado
- [ ] `apphosting.yaml` tiene todos los secrets referenciados

**Build & Deploy:**
- [ ] Build local exitoso (`npm run build`)
- [ ] Deploy exitoso sin errores
- [ ] Rollout en estado "DEPLOYED"
- [ ] No hay errores en logs

**Funcionalidades:**
- [ ] Chatbot AI responde correctamente
- [ ] Búsqueda Copart funciona (< 5s)
- [ ] Login/Registro/Reset password
- [ ] Checkout Stripe funciona (modo TEST)
- [ ] Admin panel accesible para admins

**Seguridad:**
- [ ] SSL/HTTPS funcionando
- [ ] Secrets no expuestos en código
- [ ] CORS configurado correctamente
- [ ] Stripe webhook secret validado
- [ ] Solo modo TEST hasta validar todo

**Monitoreo:**
- [ ] Analytics configurado (opcional)
- [ ] Logs accesibles y sin errores críticos
- [ ] Métricas de performance < 500ms latencia
- [ ] Error rate < 1%

**Stripe Production (cuando estés listo):**
- [ ] Cambiar a keys LIVE (`pk_live_*`, `sk_live_*`)
- [ ] Configurar webhook production
- [ ] Actualizar secret: `firebase apphosting:secrets:set STRIPE_SECRET_KEY`
- [ ] Redeploy

---

## 📝 Notas Importantes

### Diferencias entre Entornos

| Archivo | Uso | Ubicación |
|---------|-----|-----------|
| `.env.local` | Desarrollo local | Tu máquina (no en git) |
| `.env.production` | Build production | Repo (valores no sensibles) |
| `apphosting.yaml` | Runtime variables | Repo + Firebase secrets |
| Firebase Secrets | Valores sensibles | Cloud Secret Manager |

### Secrets vs Variables

**Variables normales** (`value:` en apphosting.yaml):
- ✅ URLs públicas
- ✅ Configuración no sensible
- ❌ API keys privadas

**Secrets** (`secret:` en apphosting.yaml):
- ✅ API keys privadas (Gemini, Stripe)
- ✅ Service accounts JSON
- ✅ Tokens y passwords
- Encriptados en Cloud Secret Manager

### Stripe Modes

**TEST Mode** (actual):
- Keys: `pk_test_*`, `sk_test_*`
- Tarjeta prueba: 4242 4242 4242 4242
- No cobra dinero real
- Para desarrollo/QA

**LIVE Mode** (producción):
- Keys: `pk_live_*`, `sk_live_*`
- Cobra dinero real
- Requiere cuenta Stripe verificada
- Cambiar cuando todo esté validado

---

## 🆘 Soporte

**Documentación Adicional:**
- [PRODUCTION-QUICK-FIX.md](../PRODUCTION-QUICK-FIX.md) - Guía rápida de fixes
- [PRODUCTION-FIXES.md](./PRODUCTION-FIXES.md) - Soluciones detalladas
- [Firebase App Hosting Docs](https://firebase.google.com/docs/app-hosting)

**Troubleshooting:**
1. Revisa logs: `firebase apphosting:logs --backend studio`
2. Verifica secrets: `firebase apphosting:secrets:list`
3. Ejecuta scripts de diagnóstico en `scripts/`
4. Chequea backend: https://scrap.sumtrading.us
5. Firebase Console > App Hosting > Metrics

---

**Última actualización:** 2025-11-30

---

---

## ⚙️ Configuración de apphosting.yaml

```yaml
runConfig:
  maxInstances: 3
  minInstances: 0
  memory: 1GiB
  cpu: 1
  concurrency: 80
environmentVariables:
  - name: NEXT_PUBLIC_SITE_URL
    value: https://sumtrading.us
  - name: NEXT_PUBLIC_FIREBASE_PROJECT_ID
    value: studio-6719476275-3891a
secrets:
  - variable: GEMINI_API_KEY
    secret: GEMINI_API_KEY
  - variable: STRIPE_SECRET_KEY
    secret: STRIPE_SECRET_KEY
  - variable: STRIPE_WEBHOOK_SECRET
    secret: STRIPE_WEBHOOK_SECRET
  - variable: FIREBASE_SERVICE_ACCOUNT_JSON
    secret: FIREBASE_SERVICE_ACCOUNT_JSON
```
