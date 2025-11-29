# 🚀 Guía de Despliegue a Producción - Firebase App Hosting

## 📋 Checklist Pre-Despliegue

### 1. Variables de Entorno Configuradas
- ✅ `.env.production` actualizado con todas las variables
- ✅ `apphosting.yaml` configurado con secrets

### 2. Secrets de Firebase (OBLIGATORIO)

Antes de desplegar, debes crear los siguientes **secrets** en Firebase App Hosting:

#### 🔐 Crear Secrets en Firebase Console

Ve a: **Firebase Console > App Hosting > Secrets**

O usa Firebase CLI:

```bash
# 1. FIREBASE_SERVICE_ACCOUNT_JSON
firebase apphosting:secrets:set FIREBASE_SERVICE_ACCOUNT_JSON

# Cuando te pida el valor, pega el JSON completo de tu service account (una sola línea):
# Ejemplo: {"type":"service_account","project_id":"tu-proyecto",...}
```

```bash
# 2. STRIPE_SECRET_KEY
firebase apphosting:secrets:set STRIPE_SECRET_KEY

# Pega tu Stripe Secret Key (TEST o LIVE)
# TEST mode: sk_test_XXXXXXXXXXXXXXXXX
# LIVE mode: sk_live_XXXXXXXXXXXXXXXXX
# ⚠️ IMPORTANTE: Usa TEST para desarrollo, LIVE para producción
```

```bash
# 3. STRIPE_WEBHOOK_SECRET
firebase apphosting:secrets:set STRIPE_WEBHOOK_SECRET

# Valor actual (placeholder - debes obtener el real):
whsec_your_webhook_secret_here

# Para obtener el secret real:
# 1. Ve a Stripe Dashboard > Developers > Webhooks
# 2. Crea un endpoint: https://tu-dominio.com/api/webhook/stripe
# 3. Selecciona eventos: payment_intent.succeeded, checkout.session.completed
# 4. Copia el "Signing secret" que te da Stripe
```

### 3. Verificar Secrets Creados

```bash
# Listar todos los secrets
firebase apphosting:secrets:list

# Deberías ver:
# - FIREBASE_SERVICE_ACCOUNT_JSON
# - STRIPE_SECRET_KEY
# - STRIPE_WEBHOOK_SECRET
```

## 🚀 Despliegue

### Opción 1: Desde Firebase Console (Recomendado)

1. Ve a **Firebase Console > App Hosting**
2. Conecta tu repositorio de GitHub si no lo has hecho
3. Selecciona la rama: `recuperacion-home-limpia` (o la que quieras desplegar)
4. Click en **Deploy**
5. Firebase automáticamente:
   - Clona el repo
   - Ejecuta `npm install`
   - Ejecuta `npm run build` (usa `.env.production`)
   - Despliega con las variables de `apphosting.yaml`

### Opción 2: Desde CLI

```bash
# Asegúrate de estar en la rama correcta
git checkout recuperacion-home-limpia

# Push a GitHub (Firebase App Hosting se sincroniza con GitHub)
git push origin recuperacion-home-limpia

# O despliega manualmente (no recomendado)
firebase deploy --only apphosting
```

## ⚙️ Configuración de apphosting.yaml

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

## 🔍 Post-Despliegue

### 1. Verificar Variables de Entorno

```bash
# Ver logs del despliegue
firebase apphosting:logs

# Buscar errores de variables faltantes
# Común: "STRIPE_SECRET_KEY is not defined"
```

### 2. Probar Endpoints Críticos

```bash
# 1. Health check
curl https://tu-dominio.com

# 2. API de Copart (debe conectar a scrap.sumtrading.us)
curl https://tu-dominio.com/api/copart-search?query=mazda

# 3. Autenticación (debe conectar a Firebase)
# Prueba login desde la UI

# 4. Stripe (en modo TEST)
# Prueba checkout con tarjeta de prueba: 4242 4242 4242 4242
```

### 3. Monitoreo

**Firebase Console:**
- App Hosting > Métricas → Ver requests, latencia, errores
- App Hosting > Logs → Ver logs en tiempo real

**Errores Comunes:**

| Error | Causa | Solución |
|-------|-------|----------|
| `STRIPE_SECRET_KEY is not defined` | Secret no creado | Ejecutar `firebase apphosting:secrets:set STRIPE_SECRET_KEY` |
| `FIREBASE_SERVICE_ACCOUNT_JSON is undefined` | Secret no creado | Ejecutar `firebase apphosting:secrets:set FIREBASE_SERVICE_ACCOUNT_JSON` |
| `Failed to connect to scrap.sumtrading.us` | Backend down | Verificar Cloud Run backend |
| `Memory limit exceeded` | Tráfico alto | Aumentar `memory: 2GiB` |

## 🔄 Rollback

Si algo sale mal:

```bash
# Ver historial de despliegues
firebase apphosting:rollouts:list

# Rollback a versión anterior
firebase apphosting:rollouts:rollback <ROLLOUT_ID>
```

O desde Firebase Console:
1. App Hosting > Rollouts
2. Selecciona el deployment anterior
3. Click "Promote to live"

## 🎯 Checklist Final

Antes de considerar el despliegue completo:

- [ ] Secrets creados en Firebase (3 secrets)
- [ ] Build local exitoso (`npm run build`)
- [ ] Variables de entorno verificadas
- [ ] Stripe en modo TEST (cambiar a LIVE cuando estés listo)
- [ ] Dominio personalizado configurado (opcional)
- [ ] SSL/HTTPS funcionando
- [ ] Analytics configurado (si quieres activarlo)
- [ ] Webhook de Stripe configurado con la URL correcta
- [ ] Pruebas de login/registro
- [ ] Pruebas de búsqueda de Copart
- [ ] Pruebas de checkout (modo TEST)

## 📝 Notas Importantes

### Diferencias entre .env.local y .env.production

- **`.env.local`**: Solo para desarrollo local (tu máquina)
- **`.env.production`**: Para build de producción (Firebase App Hosting)
- **`apphosting.yaml`**: Variables de runtime en Firebase (equivalente a Cloud Run `.env.yaml`)

### Secrets vs Variables Normales

**Variables normales** (en `apphosting.yaml` con `value:`):
- Son visibles en logs
- OK para: URLs públicas, API keys no sensibles

**Secrets** (en `apphosting.yaml` con `secret:`):
- Encriptados, no visibles en logs
- OBLIGATORIO para: API keys privadas, tokens, passwords

### Stripe: TEST vs LIVE

Actualmente tienes **keys de TEST** (`pk_test_*`, `sk_test_*`).

**Para aceptar pagos reales:**
1. Ve a Stripe Dashboard
2. Cambia de "Test mode" a "Live mode"
3. Obtén tus keys LIVE (`pk_live_*`, `sk_live_*)
4. Actualiza los secrets:
   ```bash
   firebase apphosting:secrets:set STRIPE_SECRET_KEY
   # Pega tu sk_live_* key
   ```
5. Actualiza `.env.production` con `pk_live_*`
6. Redespliega

## 🆘 Soporte

Si tienes problemas:
1. Revisa logs: `firebase apphosting:logs`
2. Verifica secrets: `firebase apphosting:secrets:list`
3. Chequea Cloud Run backend: https://scrap.sumtrading.us
4. Revisa Firebase Console > App Hosting > Metrics

---

**Última actualización:** 2025-11-15
