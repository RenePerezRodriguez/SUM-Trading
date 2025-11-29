# Estrategia de Diseño y Objetivos - SUM Trading

Este documento define la hoja de ruta para el diseño y la experiencia de usuario (UX) de SUM Trading. Todo desarrollo visual debe alinearse con estos objetivos para garantizar que la web sea una herramienta de conversión y servicio efectiva.

---

## 1. Objetivos de la Web

### Objetivo General
Convertirse en la plataforma líder y más confiable para la importación de vehículos de subastas estadounidenses (Copart, IAA, Manheim) hacia el mercado internacional, eliminando las barreras de idioma, logística y confianza.

### Objetivos Específicos
1.  **Generar Confianza Inmediata:** El usuario debe sentir seguridad al depositar dinero y contratar servicios para un bien que no ve físicamente.
2.  **Simplificar el Acceso a Subastas:** Transformar la complejidad de las subastas (lotes, pujas, términos) en una interfaz clara y comprensible.
3.  **Facilitar la Conversión (Registro y Depósito):** El camino desde "Visitante" a "Usuario con Poder de Compra" debe ser fluido y sin fricción.
4.  **Gestión Transparente:** Proveer a los usuarios herramientas claras para rastrear sus compras, pagos y envíos (Garage, Purchases).
5.  **Eficiencia Operativa (Admin):** Proveer a los administradores un control total sobre usuarios, márgenes y logística.

---

## 2. Estrategia de Diseño

### Identidad Visual
*   **Estilo:** "Industrial Premium". Debe sentirse robusto (como la maquinaria) pero limpio y tecnológico.
*   **Paleta de Colores:**
    *   **Primario (Rojo #ED231D):** Usar para **Acción** (Botones de "Pujar", "Registrarse", "Comprar"). Transmite energía y urgencia.
    *   **Acento (Azul Acero #3F88C5):** Usar para **Información y Confianza** (Enlaces, iconos de seguridad, datos logísticos). Transmite profesionalismo.
    *   **Fondo (Mint Cream #EFF6EE / Blanco):** Mantener la limpieza. Evitar fondos oscuros pesados excepto en secciones de alto impacto (Hero).
*   **Tipografía:** *Inter*. Legibilidad máxima. Números (precios, años) deben ser grandes y claros.

### Principios UX
1.  **Claridad ante todo:** Nunca ocultar costos. Las calculadoras de envío y tarifas deben ser visibles.
2.  **Feedback Constante:** El usuario siempre debe saber el estado de su trámite (ej. "Puja recibida", "Documentos pendientes").
3.  **Mobile First:** La mayoría de los usuarios buscarán autos desde su móvil. Los botones de acción deben ser accesibles con el pulgar.

---

## 3. Implementación de Diseño por Página

A continuación, se detalla el propósito y el diseño requerido para cada sección de la web.

### A. Páginas Públicas (Captación)

#### 1. Home (/)
*   **Meta:** Capturar la atención y dirigir al buscador.
*   **Diseño:**
    *   **Hero:** Imagen aspiracional (éxito/logística) + Título de Valor ("Tu acceso a Copart") + **Buscador Prominente**.
    *   **Social Proof:** Testimonios reales y estadísticas (Autos importados, Clientes felices) visibles inmediatamente después del Hero.
    *   **CTA Flotante:** Acceso rápido a WhatsApp/Chatbot para dudas inmediatas.

#### 2. Búsqueda y Listados (/search, /cars, /copart)
*   **Meta:** Encontrar el vehículo deseado rápidamente.
*   **Diseño:**
    *   **Filtros:** Barra lateral (desktop) o Modal (móvil) con filtros potentes (Marca, Modelo, Año, Daño, Ubicación).
    *   **Tarjetas de Auto:** Foto grande, Precio estimado, Tiempo restante de subasta (cuenta regresiva en rojo si es < 24h).
    *   **Etiquetas:** "Run & Drive", "Clean Title" destacadas en verde/azul.

#### 3. Detalle de Vehículo (/cars/[id])
*   **Meta:** Convencer al usuario de pujar.
*   **Diseño:**
    *   **Galería:** Fotos de alta resolución, fácil de navegar.
    *   **Calculadora:** Widget integrado que sume: Precio Subasta + Fees Subasta + Fee SUM Trading + Envío Estimado = **Costo Total**.
    *   **Botón de Acción:** "Hacer Oferta" o "Comprar Ahora" grande y fijo en móvil.

#### 4. Servicios e Info (/services, /how-it-works, /faq)
*   **Meta:** Educar y eliminar miedos.
*   **Diseño:**
    *   **Infografías:** Pasos visuales (1. Busca -> 2. Paga -> 3. Recibe). Menos texto, más iconos.
    *   **Acordeones:** Para FAQs, manteniendo la página limpia.

### B. Panel de Usuario (Retención y Operación)

#### 1. Dashboard / Perfil (/profile, /garage)
*   **Meta:** Control central del usuario.
*   **Diseño:**
    *   **Resumen:** Tarjetas con "Pujas Activas", "Autos Ganados", "Saldo en Billetera".
    *   **Garage:** Lista de favoritos con notas personales.

#### 2. Compras y Pagos (/purchases, /checkout, /payment)
*   **Meta:** Transparencia financiera.
*   **Diseño:**
    *   **Estado de Orden:** Línea de tiempo visual (Pagado -> En grúa -> En puerto -> Entregado).
    *   **Desglose:** Facturas claras y descargables (PDF).
    *   **Métodos de Pago:** Logos de bancos/tarjetas visibles para seguridad.

#### 3. Autenticación (/auth, /register)
*   **Meta:** Registro sin fricción.
*   **Diseño:**
    *   **Formulario Simple:** Pasos progresivos si se requieren muchos datos.
    *   **Beneficios:** Recordar por qué registrarse ("Accede a precios de subasta") al lado del formulario.

### C. Panel de Administración (/admin)

#### 1. Gestión (/admin/users, /admin/cars)
*   **Meta:** Control total y rápido.
*   **Diseño:**
    *   **Tablas de Datos:** Densas pero legibles, con filtros rápidos y acciones en lote.
    *   **KPIs:** Gráficos de ingresos y actividad de usuarios en el dashboard principal.

---

## Próximos Pasos de Implementación
1.  **Refinar Hero:** Cambiar imagen de fondo y copy principal.
2.  **Unificar Componentes:** Asegurar que los botones y tarjetas usen las clases de globals.css (Primary Red, Rounded corners).
3.  **Revisar Mobile:** Auditar /search y /profile en vista móvil para asegurar usabilidad.
