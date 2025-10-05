# CuidaMed

## Tarea 1 - Retos y oportunidades

[Kickoff](https://docs.google.com/document/d/17hRGcP4Clw5gyoXT9QIOB-3G5GFOSBJHY-RMWJdsVAs/edit?usp=sharing)

## ⚠️ Requisitos de Node.js

### Instalación de Node.js 22.19 con NVM

Si no tienes la versión requerida, puedes instalarla fácilmente usando [NVM](https://github.com/nvm-sh/nvm):

```bash
nvm install 22.19
nvm use 22.19
```

Verifica la versión activa con:

```bash
node -v
```

## 🏁 Lanzar el proyecto

Para iniciar el entorno de desarrollo de cualquiera de las aplicaciones (frontend o backend), utiliza el siguiente comando desde la raíz del monorepo:

```bash
npm run dev -w front
```

o para el backend:

```bash
npm run dev -w back
```

> **Nota:** Asegúrate de haber ejecutado previamente `npm install` y `npm run build` para que todo funcione

## 🚀 Flujo de desarrollo CuidaMed

### 1. Instalación y build inicial

Para empezar a desarrollar en cualquier parte del monorepo:

```bash
npm install
npm run build
```

Esto instalará todas las dependencias y construirá el paquete de la API necesario para el resto de proyectos.

---

### 2. Añadir un nuevo endpoint a la API o modificar los existentes

1. **Edita el archivo OpenAPI:**  
   Modifica [`api/openapi.yaml`](api/openapi.yaml) siguiendo el estándar [OpenAPI](https://spec.openapis.org/oas/v3.1.1.html) para definir tu nuevo endpoint, parámetros, respuestas y esquemas.

2. **Reconstruye el paquete de la API:**  
   Después de guardar los cambios en el YAML, ejecuta:

   ```bash
   npm run build
   ```

   Esto generará los tipos, clientes y handlers actualizados para el nuevo endpoint.

3. **Implementa la lógica del endpoint:**  
   Añade la implementación correspondiente en los handlers del backend `/back/src/handlers.ts`

---

### 3. Notas

- **Siempre ejecuta `npm run build` tras modificar el OpenAPI** para mantener los tipos y clientes sincronizados.
- **Sigue el estándar OpenAPI 3.1.1** al modificar el archivo YAML.

## 📚 Documentación de la API

La documentación de la API se genera automáticamente al hacer `npm run build` desde la raíz del monorepo.

Para consultarla se recomienda tener el back lanzado (`npm run dev -w back` desde la raíz) y navegar a `localhost:3000/documentation`, aunque también se puede abrir el fichero situado en `/docs/api.html`
