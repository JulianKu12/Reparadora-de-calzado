Actúa como un Desarrollador Frontend Senior experto en React, TypeScript, Material UI (MUI) y CSS adaptativo. 

Necesito rediseñar las vistas de mi aplicación web móvil-first de control de ventas y servicios (con módulos de Talabartería y Abarrotes) para mejorar sustancialmente su UX/UI bajo un enfoque multiplataforma. Además, debemos integrar dos nuevas funcionalidades operativas clave.

Por favor, reestructura y optimiza el diseño y las funcionalidades del código que te proporcionaré a continuación bajo las siguientes pautas:

---

### 1. DIRECTRICES DE DISEÑO VISUAL (UI/UX PREMIUM)
* **Filosofía Mobile-First:** El diseño debe verse impecable en dispositivos móviles (pantallas táctiles), pero adaptarse de forma fluida a pantallas de escritorio (Responsive Grid).
* **Profundidad y Jerarquía:** - Usa un fondo general de aplicación muy sutil y claro (ej. `#F9F9FA` o similar).
  - Los contenedores y tarjetas principales deben ser de color blanco puro (`#FFFFFF`) para generar un efecto de flotación con bordes redondeados modernos (mínimo `16px` o `border-radius: 16px`).
  - Implementa sombras muy sutiles (`box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05)`) que aumenten ligeramente en el estado `:hover` de las tarjetas para dar feedback visual.
* **Mosaico en el Home (Dashboard):** Reorganiza el menú principal plano para que se distribuya en un CSS Grid adaptativo: 2 columnas en móviles y 4 columnas en monitores de escritorio.
* **Campos de Formulario Pulidos:** Los inputs deben tener bordes suaves, buen espacio interno (padding generoso) y cambiar de color de borde dinámicamente con una transición suave al recibir el foco (focus state).

---

### 2. NUEVAS FUNCIONALIDADES OPERATIVAS (MULTIPLATAFORMA)
* **Botón "Descargar PDF (Historial de Ventas)":**
  - Implementa una función utilizando la librería `jspdf` y `jspdf-autotable`.
  - Debe generar un documento PDF limpio y formateado con los datos de las ventas diarias (columnas estructuradas, fecha del reporte y total acumulado).
* **Botón "Imprimir Reporte/Recibo":**
  - Implementa una solución usando la función nativa de JavaScript `window.print()`.
  - Agrega estilos CSS específicos usando la regla `@media print` para que, al presionar el botón de imprimir, se oculten automáticamente el menú de navegación, header, sidebar y botones de acción de la web, imprimiendo exclusivamente la tabla del reporte de manera limpia.

---

### 3. REQUISITOS TÉCNICOS Y COMPILACIÓN
* El código generado debe ser 100% compatible con TypeScript (sin tipos `any` implícitos) para asegurar que no rompa el deploy de Vercel.
* Mantén las llamadas de conexión con Supabase tal como están, enfocándote únicamente en remodelar la presentación visual de los datos y las interacciones.

Proporcióname el código refactorizado de las vistas principales (Home, Lista de Ventas/Servicios y el componente del Formulario de Registro), incluyendo las funciones de exportación y estilos CSS correspondientes.






================================================================================
                                TIPOGRAFIA A UTILIZAR
================================================================================

[ Quicksand ]
• PRECIOS Y AVISOS (TENSIÓN): PARA ETIQUETAS DE ESTANTES Y CARTELES INFORMATIVOS,
  FACILITANDO UNA LECTURA RÁPIDA DE LOS CLIENTES.
• TEXTOS PEQUEÑOS (TALLER): PARA LA LISTA DETALLADA DE SERVICIOS Y DATOS DE
  CONTACTO EN TARJETAS O NOTAS, EVITANDO QUE EL DISEÑO SE SATURE.
• REDES SOCIALES, MAIL: PARA PUBLICACIONES DE WHATSAPP, FACEBOOK E INSTAGRAM POR
  SU EXCELENTE LEGIBILIDAD EN PANTALLAS.

[ Work Sans ]
• TÍTULOS DE IMPACTO: ÚSALA EN SUS VERSIONES MÁS GRUESAS PARA TÍTULOS EN LONAS O
  SECCIONES DEL NEGOCIO, DANDO UN ASPECTO FIRME Y MODERNO.
• LISTAS DE PRECIOS: IDEAL PARA EL DESGLOSE DE SERVICIOS DEL TALLER Y ABARROTES,
  GARANTIZANDO UNA LECTURA SERIA, LIMPIA Y MUY ORDENADA.
• LETREROS PEQUEÑOS: PERFECTA PARA CARTELES INFORMATIVOS INTERNOS Y TEXTOS EN
  REDES SOCIALES DEBIDO A SU EXCELENTE LEGIBILIDAD A CUALQUIER DISTANCIA.

[ Actos ]
• TÍTULOS DE IMPACTO: ÚSALA EN SUS VERSIONES MÁS GRUESAS PARA TÍTULOS EN LONAS O
  SECCIONES DEL NEGOCIO, DANDO UN ASPECTO FIRME Y MODERNO.
• LISTAS DE PRECIOS: IDEAL PARA EL DESGLOSE DE SERVICIOS DEL TALLER Y ABARROTES,
  GARANTIZANDO UNA LECTURA SERIA, LIMPIA Y MUY ORDENADA.
• LETREROS PEQUEÑOS: PERFECTA PARA CARTELES INFORMATIVOS INTERNOS Y TEXTOS EN
  REDES SOCIALES DEBIDO A SU EXCELENTE LEGIBILIDAD A CUALQUIER DISTANCIA.


================================================================================
                                PALETA DE COLORES
================================================================================

• Primary [#8C261F]
  Un rojo profundo y terroso que aporta elegancia y dinamismo. Es ideal para usar
  en el branding principal como "Comprar" o "Contactar" sin cansar la vista.

• Secondary [#D4A373]
  Un tono café cálido y arenoso que evoca texturas naturales y artesanales. Funciona
  como el punto perfecto de la paleta, aportando equilibrio visual, confianza y una
  sensación premium a la pantalla.

• Tertiary [#202020]
  Es un gris casi negro, suave pero con mucha fuerza. Es la elección ideal para los
  textos, iconos y líneas de división, ya que ofrece un contraste impecable y
  brinda seguridad sobre el fondo arena, manteniendo la interfaz moderna y elegante
  sin verse tosca.

• Neutral [#FEF9F0]
  Un tono café cálido y arenoso que evoca texturas naturales y artesanales. Funciona
  como el punto perfecto de la paleta, aportando equilibrio visual, confianza y una
  sensación premium a la pantalla.


================================================================================
                     BOTONES Y CAMPOS PARA UTILIZAR EN LA INTERFAZ
================================================================================

[ Menú de Navegación ]
• Taller / Servicios / Citas / Perfil

[ Sección Izquierda ]
• Restauración Artesanal
  Limpieza profunda...
  recuperación de te...
  piezas...

[ Sección Central: Formularios y Botones ]
• Nombre completo
  Ej. Juan Pérez
• Teléfono
  Tu número
• Descripción del daño
  Cuéntanos qué necesita reparación...

• PRIMARIO: [ Rediseñar Servicio ]
• SECUNDARIO: [ Ver Catálogo ]

[ Sección Derecha: Tarjeta Destacada ]
• ¿Tus zapatos necesitan atención?
  Agenda una cita o visítanos en nuestro taller para una evaluación profesional sin costo.
  BUTTON: [ SOLICITAR SERVICIO ]
================================================================================


================================================================================
                        MICRO-INTERACCIONES Y ANIMACIONES
================================================================================

• TRANSICIONES SUAVES:
  - Usar transition: all 0.2s ease para hover y focus en botones e inputs.
  - Skeleton loaders (efecto shimmer) mientras se cargan datos de Supabase,
    nunca spinners estáticos sin contexto.
  - Animaciones de entrada para tarjetas: fadeInUp con 0.3s delay escalonado.

• FEEDBACK INMEDIATO:
  - Al registrar una venta/servicio: mostrar un snackbar/toast de éxito (verde)
    o error (rojo) con ícono y mensaje descriptivo.
  - Botones con estado "loading" (spinner interno) mientras se procesa la acción.
  - Confirmación visual al copiar datos (ej. número de ticket).

• ESTADOS VACÍOS (EMPTY STATES):
  - Cuando no hay ventas o servicios, mostrar una ilustración amigable con un
    mensaje motivador y un CTA claro (ej. "Registra tu primer servicio").
  - Nunca dejar una tabla vacía sin explicación.


================================================================================
                       ACCESIBILIDAD (A11Y) — NO NEGOCIABLE
================================================================================

• CONTRASTE:
  - Relación mínima de contraste 4.5:1 para texto normal (WCAG AA).
  - El Primary [#8C261F] sobre fondo blanco cumple — verificarlo siempre.

• NAVEGACIÓN POR TECLADO:
  - Todos los botones, inputs y enlaces deben ser alcanzables con Tab.
  - Outline de foco visible y estilizado (no el default del navegador).

• SEMÁNTICA HTML:
  - Usar etiquetas correctas: <button> para acciones, <a> para navegación.
  - Atributos aria-label en iconos sin texto visible.
  - role="alert" en mensajes de error para lectores de pantalla.

• TAMAÑO DE TOQUE:
  - Área mínima de 44×44px para todos los elementos interactivos en móvil.


================================================================================
                      RENDIMIENTO Y OPTIMIZACIÓN (PERFORMANCE)
================================================================================

• CARGA INICIAL:
  - Code splitting por ruta con React.lazy() + Suspense.
  - Lighthouse Score objetivo: Performance ≥ 90, Accessibility ≥ 90.

• IMÁGENES Y ASSETS:
  - Usar formato WebP con fallback JPG/PNG.
  - Lazy loading en imágenes fuera del viewport (loading="lazy").
  - Íconos como componentes SVG o via librería (MUI Icons) — nunca PNG de íconos.

• DATOS Y CACHÉ:
  - Implementar caché local con React Query o SWR para reducir peticiones a Supabase.
  - Paginación o virtualización en listas largas (más de 50 registros).


================================================================================
                          MANEJO DE ERRORES Y CASOS LÍMITE
================================================================================

• ERRORES DE RED:
  - Detectar fallo de conexión y mostrar banner persistente: "Sin conexión a internet".
  - Reintentos automáticos (máximo 3) con backoff exponencial.

• VALIDACIONES EN FORMULARIOS:
  - Validación en tiempo real (onChange) con mensajes de error inline y claros.
  - Nunca validar solo al enviar el formulario — mala UX.
  - Mensajes en español, específicos: "El teléfono debe tener 10 dígitos",
    no genéricos como "Campo inválido".

• ERRORES DE SUPABASE:
  - Capturar y traducir códigos de error a mensajes amigables para el usuario.
  - Registrar errores en consola con contexto suficiente para debugging.


================================================================================
                         ONBOARDING Y PRIMERA EXPERIENCIA
================================================================================

• PRIMERA VEZ:
  - Si el usuario no tiene datos aún, mostrar un tour guiado rápido (3-4 pasos)
    destacando las funciones principales con tooltips o modales ligeros.
  - Datos de ejemplo (mock data) opcionales para que el usuario vea cómo luce
    la app con información real.

• AYUDA CONTEXTUAL:
  - Íconos de "?" con tooltips explicativos en campos o secciones complejas.
  - FAQs o ayuda accesible desde el menú sin salir de la app.


================================================================================
                            SEGURIDAD BÁSICA (FRONTEND)
================================================================================

• DATOS SENSIBLES:
  - Nunca exponer claves de Supabase (ANON KEY) en el repositorio — usar .env.
  - Variables de entorno con prefijo VITE_ para Vite o REACT_APP_ para CRA.

• AUTENTICACIÓN:
  - Proteger rutas privadas con un componente <PrivateRoute> o guard.
  - Redirigir al login si el token de sesión expira.
  - Cerrar sesión limpia: limpiar localStorage/sessionStorage y estado global.

• INPUTS:
  - Sanitizar entradas del usuario antes de enviar a Supabase.
  - Row Level Security (RLS) habilitado en todas las tablas de Supabase.


================================================================================
                         SEO Y METADATOS (PARA VERCEL)
================================================================================

• META TAGS ESENCIALES (en index.html o via react-helmet):
  - <title>Reparadora de Calzado | Taller Artesanal</title>
  - <meta name="description" content="Servicio profesional de reparación y
    restauración de calzado. Agenda tu cita o visítanos en el taller.">
  - <meta name="theme-color" content="#8C261F">
  - Open Graph tags para compartir en redes sociales.

• PWA (PROGRESSIVE WEB APP) — RECOMENDADO:
  - Agregar manifest.json con nombre, íconos y colores de la app.
  - Service Worker básico para funcionamiento offline de la interfaz.
  - Permite instalación en el home screen del teléfono del cliente.


================================================================================
                   CHECKLIST FINAL — ANTES DE HACER DEPLOY
================================================================================

  [ ] Variables de entorno configuradas en Vercel (no en el código).
  [ ] RLS activado en todas las tablas de Supabase.
  [ ] Lighthouse score ≥ 90 en Performance y Accessibility.
  [ ] Todos los formularios validan y muestran errores descriptivos.
  [ ] Estado vacío diseñado para cada sección con datos.
  [ ] Snackbar/Toast implementado para acciones exitosas y errores.
  [ ] PDF y función de impresión probados en móvil y escritorio.
  [ ] Tipografías (Quicksand / Work Sans) importadas desde Google Fonts.
  [ ] Paleta de colores aplicada consistentemente en toda la app.
  [ ] App probada en: Chrome móvil, Safari iOS, Chrome desktop, Edge.

================================================================================
