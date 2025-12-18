# Gestión de Tarifas de Arrastre 🚗

Sistema completo para la gestión y cálculo de tarifas de arrastre.

## Arquitectura Actual (Firestore)

El sistema ha migrado de archivos estáticos a una arquitectura dinámica en **Firestore**.

### Flujo de Datos
1. **Administración (`/admin/towing-rates`)**:
   - **CRUD Manual**: Crear/Editar/Eliminar destinos, estados y ciudades directamente.
   - **Carga Masiva (Excel)**: El sistema parsea archivos Excel y permite previsualizar cambios.
   - **Historial**: Cada cambio guarda una copia automática en `towing-rates-history` para rollback.

2. **Almacenamiento (Firestore)**:
   - Colección: `towing-rates`
   - Documento: `current` (Contiene SIEMPRE la versión activa de todas las tarifas)

3. **Consumo Público**:
   - **API Pública**: `/api/towing-rates` (Acceso libre, lectura optimizada).
   - **Calculadora**: Consume esta API. Cambios en admin son instantáneos.

## Características del Admin Panel

- **Gestión Total**: No se requiere Excel. Se pueden agregar destinos (ej. Guatemala) desde cero.
- **Excel Inteligente**: 
  - Busca headers automáticamente en las primeras 15 filas.
  - Detecta columnas "Estado/Ciudad/Monto" en cualquier orden.
  - Soporta múltiples grupos de columnas (ej. Estado | Ciudad | Monto | vacio | Estado...).
- **Seguridad**: Rollback inmediato a versiones anteriores.

## Formato del Excel Recomendado
Aunque el parser es flexible, se recomienda:
- Una hoja por destino (el nombre de la hoja será el destino).
- Headers claros: `Estado`, `Ciudad`, `Monto`.
