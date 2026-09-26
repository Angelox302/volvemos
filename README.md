# VOLVEMOS ❤️

> Aplicación móvil privada y humorística que representa el "porcentaje para volver" entre Angelo y Keyla.

---

## ¿Qué hace la app?

Muestra un porcentaje (0% – 100%) que representa las probabilidades de que Angelo y Keyla vuelvan.

Ese porcentaje sube o baja según **acciones** que Keyla registra en la app.

**Ejemplos:**
| Acción                | Tipo      | Cambio |
|-----------------------|-----------|--------|
| Hablamos las cosas    | positivo  | +15%   |
| Tuvimos una cita      | positivo  | +10%   |
| Me dejó en visto      | negativo  | -5%    |
| Tuvimos una pelea     | negativo  | -10%   |

El porcentaje **siempre se mantiene entre 0% y 100%**.  
El porcentaje **inicial es 50%** (hay una posibilidad real).

---

## ¿Quién puede hacer qué?

| Acción                          | Angelo (usuario) | Keyla (admin) |
|---------------------------------|:----------------:|:-------------:|
| Iniciar sesión                  | ✅               | ✅            |
| Ver el porcentaje actual        | ✅               | ✅            |
| Ver el historial de acciones    | ✅               | ✅            |
| Crear acciones                  | ❌               | ✅            |
| Editar acciones                 | ❌               | ✅            |
| Eliminar acciones               | ❌               | ✅            |

---

## ¿Cómo funciona el porcentaje?

```
porcentaje = 50 (base)
           + suma de todas las acciones positivas
           - suma de todas las acciones negativas
```

**Ejemplo:**
```
50 (base)
+15  Hablamos las cosas
+10  Tuvimos una cita
 -5  Me dejó en visto
-10  Tuvimos una pelea
────
60%
```

Si el resultado supera 100, se queda en 100.  
Si el resultado baja de 0, se queda en 0.

---

## Estados del porcentaje

| Rango   | Estado                  |
|---------|-------------------------|
| 0–20%   | 💀 Ni de vaina          |
| 21–40%  | 🥶 Complicado           |
| 41–60%  | 😐 Hay esperanza        |
| 61–80%  | 👀 Se está cocinando    |
| 81–99%  | ❤️ Ya casi              |
| 100%    | 💍 MARICO, VOLVIERON   |

---

## ¿Qué información guardamos?

### Tabla: `usuarios`
| Campo    | Tipo         | Descripción                    |
|----------|--------------|--------------------------------|
| id       | INT PK AUTO  | Identificador único            |
| nombre   | VARCHAR      | Nombre real (Keyla / Angelo)   |
| username | VARCHAR      | Nombre de usuario para login   |
| password | VARCHAR      | Hash bcrypt (nunca texto plano)|
| rol      | ENUM         | `admin` o `usuario`            |

### Tabla: `acciones`
| Campo      | Tipo         | Descripción                              |
|------------|--------------|------------------------------------------|
| id         | INT PK AUTO  | Identificador único                      |
| titulo     | VARCHAR      | Nombre de la acción                      |
| descripcion| TEXT         | Descripción opcional                     |
| porcentaje | INT          | Valor positivo (ej: 15)                  |
| tipo       | ENUM         | `positivo` o `negativo`                  |
| fecha      | DATETIME     | Cuándo ocurrió                           |
| creado_por | INT FK       | ID del usuario que la creó              |

> El campo `porcentaje` **siempre se guarda como número positivo**.  
> El backend decide si suma o resta según el campo `tipo`.

---

## Arquitectura

```
📱 React Native + Expo
        │
        │  Axios / HTTP
        ▼
⚙️  Node.js + Express (API REST)
        │
        │  mysql2
        ▼
🗄️  MySQL
```

**La app móvil NUNCA se conecta directamente a MySQL.**

---

## Stack tecnológico

### Mobile
- React Native
- Expo + Expo Router
- Axios
- Expo Secure Store

### Backend
- Node.js + Express
- mysql2
- cors
- dotenv
- bcryptjs
- jsonwebtoken
- nodemon (desarrollo)

### Base de datos
- MySQL

---

## Estructura del proyecto

```
volvemos/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── accionesController.js
│   │   │   └── progresoController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── accionesRoutes.js
│   │   │   └── progresoRoutes.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
├── mobile/
│   ├── app/
│   │   ├── _layout.jsx
│   │   ├── index.jsx
│   │   ├── login.jsx
│   │   ├── home.jsx
│   │   ├── historial.jsx
│   │   └── admin/
│   │       ├── index.jsx
│   │       └── nuevaAccion.jsx
│   ├── components/
│   │   ├── BarraProgreso.jsx
│   │   ├── AccionCard.jsx
│   │   └── Boton.jsx
│   ├── services/
│   │   └── api.js
│   ├── assets/
│   ├── app.json
│   └── package.json
│
├── database/
│   └── volvemos.sql
│
└── README.md
```

---

## Plan de desarrollo (Fases)

| Fase | Descripción                                      | Estado |
|------|--------------------------------------------------|--------|
| 0    | Diseño y documento del proyecto                  | ✅     |
| 1    | Preparar entorno (Node, MySQL, Expo, Git)        | ⏳     |
| 2    | Crear base de datos MySQL                        | ⏳     |
| 3    | Backend básico + conexión MySQL                  | ⏳     |
| 4    | CRUD de acciones                                 | ⏳     |
| 5    | Cálculo del porcentaje (GET /api/progreso)       | ⏳     |
| 6    | Login con bcrypt + JWT                           | ⏳     |
| 7    | Middleware de autenticación y roles              | ⏳     |
| 8    | App móvil con Expo                               | ⏳     |
| 9    | Pantalla de login móvil                          | ⏳     |
| 10   | Pantalla principal con barra de progreso         | ⏳     |
| 11   | Historial de acciones                            | ⏳     |
| 12   | Panel admin de Keyla                             | ⏳     |
| 13   | Animaciones, diseño y detalles visuales          | ⏳     |
| 14   | Deploy (backend + MySQL en internet)             | ⏳     |

---

## Reglas del proyecto

1. Código sencillo — nada de arquitectura empresarial innecesaria.
2. Entendible para un estudiante — sin abstracciones innecesarias.
3. Estilos separados cuando tenga sentido.
4. Comentarios solo donde realmente ayuden.
5. Nada de copiar código sin entender qué hace.
6. Probar cada parte antes de avanzar.
7. No introducir dependencias innecesarias.
8. Si hay una forma sencilla y una complicada, empezamos por la sencilla.
9. Seguridad razonable desde el comienzo.
10. Primero funcionalidad, después estética.

---

## Seguridad mínima

- Las contraseñas se guardan con **bcrypt** — nunca en texto plano.
- Las credenciales de la base de datos van en `.env` — nunca en el código.
- `.env` está en `.gitignore` — nunca se sube a GitHub.
- La API usa **JWT** para autenticar peticiones.
- Las rutas de admin verifican que el rol sea `admin`.
