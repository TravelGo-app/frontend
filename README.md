# 🌍 TravelGo

> **TravelGo** es una billetera digital multimoneda diseñada para viajeros argentinos, que permite administrar saldos en distintas divisas, consultar tasas de cambio en tiempo real y realizar operaciones financieras simuladas desde una interfaz moderna, intuitiva y responsive.

La aplicación fue desarrollada como proyecto académico del **Bootcamp de Desarrollo Full Stack de Henry**, implementando una arquitectura Frontend + Backend con autenticación segura, consumo de APIs REST y una experiencia de usuario enfocada en simplicidad y rendimiento.

---

## 🚀 Demo

| Aplicación | Enlace |
|------------|---------|
| 🌐 Frontend | https://travelgo-pink.vercel.app |
| ⚙️ Backend API | https://travelgo-njke.up.railway.app |

---

# ✨ Características

## 💳 Billetera Multimoneda

- Administración de balances en:
  - 🇦🇷 ARS
  - 🇺🇸 USD
  - 🇪🇺 EUR
  - 🇧🇷 BRL
  - 🇨🇱 CLP
- Balance total convertido automáticamente a ARS.
- Visualización de saldos individuales.
- Distribución por moneda.
- Actualización dinámica de datos.

---

## 💱 Conversión de monedas

- Tasas de cambio en tiempo real.
- Conversión entre monedas disponibles.
- Vista previa antes de confirmar la operación.
- Validaciones de saldo suficiente.

---

## 💸 Transferencias

- Envío de dinero entre usuarios mediante correo electrónico.
- Prevención de operaciones duplicadas mediante **Idempotency Keys**.
- Confirmación visual de la operación.

---

## 💰 Depósitos

- Simulación de depósitos en cualquiera de las monedas disponibles.
- Actualización automática del balance.

---

## 📈 Dashboard Analítico

El panel principal muestra información financiera de forma clara mediante gráficos interactivos:

- Evolución del balance durante los últimos 7 días.
- Distribución de operaciones.
- Actividad reciente.
- Resumen estadístico.
- Tasas de cambio actualizadas.

---

## 📜 Historial

Registro completo de movimientos realizados:

- Depósitos
- Transferencias
- Intercambios
- Eventos relacionados con la cuenta

Incluye filtros para facilitar la búsqueda de operaciones.

---

## 👤 Perfil

El usuario puede administrar su información personal:

- Nombre
- Teléfono
- Fecha de nacimiento
- Moneda preferida
- Alias
- CVU virtual
- Estado de verificación del correo

---

## 🔐 Autenticación

Sistema completo de autenticación mediante:

- Registro con email y contraseña.
- Inicio de sesión.
- Inicio de sesión con Google OAuth.
- Recuperación de contraseña.
- Cambio de contraseña.
- Persistencia de sesión mediante JWT.
- Protección de rutas privadas.

---

## 🤖 Asistente Virtual

TravelGo incorpora un chatbot integrado que permite asistir al usuario durante la navegación y resolver dudas relacionadas con la aplicación.

---

## 📱 Diseño Responsive

La aplicación fue desarrollada bajo un enfoque **Mobile First**, adaptándose correctamente a:

- Teléfonos
- Tablets
- Laptops
- Monitores de escritorio

---

# 🛠 Tecnologías

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS v4
- React Router DOM
- Axios

### Backend

- Node.js
- Express
- PostgreSQL
- Railway

### Autenticación

- JWT
- Google Identity Services

### Testing

- Vitest
- React Testing Library

### Librerías adicionales

- Recharts
- Flag Icons

---

# 📂 Estructura del proyecto

```text
src/
│
├── assets/
│
├── components/
│   ├── auth/
│   ├── AnalyticsSection.tsx
│   ├── ChatbotWidget.tsx
│   ├── GoogleLoginButton.tsx
│   ├── LoadingOverlay.tsx
│   ├── Navbar.tsx
│   ├── ProtectedRoute.tsx
│   └── StepIndicator.tsx
│
├── context/
│   ├── AuthContext.tsx
│   └── ChatVisibilityContext.tsx
│
├── hooks/
│
├── pages/
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Transactions.tsx
│   ├── Exchange.tsx
│   ├── Deposit.tsx
│   ├── Transfer.tsx
│   ├── History.tsx
│   ├── Profile.tsx
│   ├── AboutUs.tsx
│   ├── Terms.tsx
│   ├── Privacy.tsx
│   ├── Security.tsx
│   ├── Contact.tsx
│   ├── Faq.tsx
│   ├── SetPassword.tsx
│   ├── ResetPassword.tsx
│   ├── ConfirmEmailChange.tsx
│   └── NotFound.tsx
│
├── services/
│
├── utils/
│
└── types/
```

---

# ⚙️ Instalación

## 1. Clonar el repositorio

```bash
git clone https://github.com/TravelGo-app/frontend.git
```

Entrar al proyecto:

```bash
cd frontend
```

---

## 2. Instalar dependencias

```bash
npm install
```

---

## 3. Variables de entorno

Crear un archivo `.env` en la raíz del proyecto.

```env
VITE_API_URL=https://travelgo-njke.up.railway.app/api
VITE_GOOGLE_CLIENT_ID=tu_google_client_id
```

---

## 4. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en:

```
http://localhost:5173
```

---

## 5. Ejecutar pruebas

```bash
npm run test
```

---

# 🧪 Testing

El proyecto incluye pruebas unitarias desarrolladas con **Vitest** y **React Testing Library**, cubriendo tanto lógica de negocio como componentes.

Actualmente se encuentran testeados:

- Validaciones de autenticación.
- Hooks personalizados.
- Componentes de formularios.
- Utilidades de la billetera.
- Cálculos de balances.
- Formateo de montos.
- Generación de datos para gráficos.
- Iconografía de actividades.

---

# 🔒 Seguridad

La aplicación implementa diversas prácticas para garantizar una experiencia segura:

- Autenticación mediante JWT.
- Protección de rutas privadas.
- Recuperación segura de contraseña.
- Integración con Google OAuth.
- Prevención de operaciones duplicadas mediante Idempotency Keys.
- Validación de formularios en cliente.
- Persistencia controlada de sesión.

---

# 🌐 Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `VITE_API_URL` | URL base del backend |
| `VITE_GOOGLE_CLIENT_ID` | Client ID de Google OAuth |

---

# 👥 Equipo de desarrollo

Proyecto desarrollado colaborativamente durante el **Bootcamp de Desarrollo Full Stack de Henry (FT73)**.

| Integrante |
|------------|
| Nadia Starna |
| Katy Tejada |
| Emanuel Florez |
| Joaquín Gonzalez |

---

# 📄 Licencia

Proyecto desarrollado con fines educativos como parte del **Bootcamp Henry**.

No está destinado para uso comercial.