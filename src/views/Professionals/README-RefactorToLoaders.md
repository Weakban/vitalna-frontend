# Refactorización a React Router Loaders y Actions

## Resumen de Cambios

Se ha refactorizado `ProfessionalScheduleView.tsx` para usar el patrón moderno de **loaders** y **actions** de React Router DOM en lugar del manejo tradicional de datos con `useState` + `useEffect`.

## Beneficios del Nuevo Patrón

### 1. **Carga de Datos Declarativa**

- **Antes**: Los datos se cargaban en `useEffect`, creando spinners de carga y estado complejo
- **Ahora**: Los datos se cargan automáticamente antes del renderizado del componente

### 2. **Mejor UX**

- **Antes**: Pantalla en blanco → spinner → contenido
- **Ahora**: Transición directa al contenido (React Router maneja la carga)

### 3. **Manejo de Errores Centralizado**

- **Antes**: `try/catch` disperso en múltiples funciones
- **Ahora**: Manejo de errores centralizado en loader y action

### 4. **Estado Más Simple**

- **Antes**: Múltiples estados de carga (`isLoading`, `isSubmitting`, etc.)
- **Ahora**: React Router maneja automáticamente los estados de transición

### 5. **Formularios Web Estándar**

- **Antes**: Manejo manual de submit con JavaScript
- **Ahora**: Formularios HTML nativos que funcionan sin JavaScript

## Arquitectura Nueva

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│     Loader      │───▶│    Component     │───▶│     Action      │
│                 │    │                  │    │                 │
│ - Carga inicial │    │ - Renderizado    │    │ - Mutaciones    │
│ - Auth check    │    │ - Formularios    │    │ - Validación    │
│ - Transform     │    │ - Estado local   │    │ - Side effects  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Componentes Clave

### Loader Function

```typescript
export async function loader({ request }: LoaderFunctionArgs) {
  // 1. Autenticación
  // 2. Carga de datos desde API
  // 3. Transformación para UI
  // 4. Error handling
}
```

### Action Function

```typescript
export async function action({ request }: ActionFunctionArgs) {
  // 1. Parsing de FormData
  // 2. Validación
  // 3. Llamadas a API
  // 4. Respuesta estructurada
}
```

### Componente

```typescript
export default function Component() {
  const data = useLoaderData(); // Datos del loader
  const actionData = useActionData(); // Respuesta de la action

  // Solo lógica de UI y estado local
}
```

## Operaciones Soportadas

### 1. Horario Semanal

- **Carga**: Automática via loader
- **Guardado**: Form POST con `actionType: 'saveWeeklySchedule'`

### 2. Excepciones

- **Carga**: Automática via loader
- **Crear**: Form POST con `actionType: 'addException'`
- **Eliminar**: Form POST con `actionType: 'deleteException'`

## Configuración de Rutas

```typescript
// src/router/index.tsx
const router = createBrowserRouter([
  {
    path: '/app/professionals/schedule',
    element: <ProfessionalScheduleView />,
    loader,
    action,
  }
]);
```

## Migración desde useEffect

### Patrón Anterior

```typescript
// ❌ Patrón anterior
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function loadData() {
    setLoading(true);
    try {
      const result = await api.getData();
      setData(result);
    } catch (error) {
      // manejo de error
    } finally {
      setLoading(false);
    }
  }
  loadData();
}, []);
```

### Patrón Nuevo

```typescript
// ✅ Patrón nuevo
export async function loader() {
  try {
    return await api.getData();
  } catch (error) {
    throw new Response("Error", { status: 500 });
  }
}

function Component() {
  const data = useLoaderData();
  // No más loading states!
}
```

## Beneficios Técnicos Adicionales

1. **SSR Ready**: Los loaders funcionan en server-side rendering
2. **Prefetching**: React Router puede precargar rutas
3. **Caching**: Datos automáticamente cacheados por ruta
4. **Race Conditions**: Eliminadas automáticamente
5. **Progressive Enhancement**: Formularios funcionan sin JS
6. **Better DevX**: Menos boilerplate, más declarativo

## Próximos Pasos

1. **Optimistic UI**: Implementar updates optimistas
2. **Revalidation**: Configurar revalidación automática
3. **Error Boundaries**: Mejorar manejo de errores
4. **Loading States**: Añadir estados de carga granulares si necesario
5. **Caching**: Implementar estrategias de cache avanzadas

## Testing

Los loaders y actions se pueden testear de forma independiente:

```typescript
// Test del loader
test("loader returns schedule data", async () => {
  const request = new Request("/test");
  const result = await loader({ request, params: {} });
  expect(result).toHaveProperty("weeklySchedule");
});

// Test de la action
test("action saves schedule", async () => {
  const formData = new FormData();
  formData.append("actionType", "saveWeeklySchedule");

  const request = new Request("/test", {
    method: "POST",
    body: formData,
  });

  const result = await action({ request, params: {} });
  expect(result.success).toBe(true);
});
```
