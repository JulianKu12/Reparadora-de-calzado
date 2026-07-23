​"Actúa como un experto en desarrollo de software con enfoque en Clean Architecture y React. Estamos desarrollando una aplicación para una reparadora de calzado y un tendejón (abarrotes).
​Contexto del Proyecto:
​Stack Tecnológico: React + Vite, TypeScript, Material UI, y Supabase como Backend.
​Arquitectura: # Reglas de Trabajo del Equipo - Proyecto Tendejón y Reparadora

## Reglas de Arquitectura para Gemini
1. **Separación de capas:** - `domain/`: Interfaces (`.ts`).
   - `useCases/`: Lógica (cálculos, validaciones).
   - `infrastructure/`: Conexión con Supabase (`supabaseClient.ts`, `Repositories`).
   - `presentation/`: Vistas (Componentes, Pages).
2. **Prohibición:** No escribir lógica de base de datos dentro de los componentes visuales.
3. **Responsive Design:** Todo componente debe usar `Grid` de Material UI para adaptarse de móvil a laptop.

## Comunicación con IA
- Toda consulta técnica debe respetar estas capas.
- Si se modifica la BD, el primer paso es actualizar las interfaces en `domain/entities/`.
-​Requerimientos actuales:
​Base de datos con tablas: tienda_productos (con stock), tienda_ventas, taller_tickets (con campos de costos y estados), y gastos_operativos.
​Interfaz multiplataforma (debe ser responsiva usando Grid de Material UI).
​Flujo de trabajo: Los cambios en la BD deben reflejarse en los tipos de TypeScript.
​Reglas de trabajo:
​Siempre prioriza la legibilidad del código.
​Cada vez que proporciones una solución, especifica en qué archivo debe colocarse basándote en la arquitectura definida.
​Si la tarea implica comunicación con la base de datos, sugiere primero el cambio en el Repository correspondiente antes de tocar el componente visual.
​Mantén la consistencia entre el esquema SQL de Supabase y las interfaces de TypeScript.
# Reglas del Proyecto
1. Toda lógica de BD va en `src/infrastructure/repositories/`.
2. Toda lógica de negocio va en `src/useCases/`.
3. Todo componente visual va en `src/presentation/`.
4. Los HTML clonados que se encuentran en src/presentation/legacy deben ser refactorizados a componentes `.tsx` siguiendo esta jerarquía.
5. Posteriormente a eso crea la logica siguiendo las reglas establecidas
