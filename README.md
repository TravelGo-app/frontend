# TravelGo — Frontend

Billetera digital multi-moneda para viajeros argentinos. Permite gestionar saldos en ARS, USD, EUR, BRL y CLP, ver tasas de cambio en tiempo real, hacer transferencias, depósitos e intercambios simulados, y llevar un historial completo de la actividad.

## 🚀 Deploy

Frontend: https://travelgo-pink.vercel.app
Backend: https://travelgo-njke.up.railway.app

## 🛠 Stack tecnológico

- React 18 + TypeScript
- Vite
- Tailwind CSS v4
- React Router DOM
- Axios
- Vitest + React Testing Library (testing)
- Google Identity Services (OAuth)
- `flag-icons` (banderas de monedas)
- `recharts` (gráficos de analíticas)

## 📁 Estructura del proyecto

```
src/
├── assets/
├── components/
│   ├── auth/                    # Campos de login/registro
│   ├── AnalyticsSection.tsx      # Gráficos y estadísticas del Dashboard
│   ├── ChatbotWidget.tsx         # Asistente virtual
│   ├── GoogleLoginButton.tsx
│   ├── LoadingOverlay.tsx        # Pantalla de carga entre rutas
│   ├── Navbar.tsx
│   ├── ProtectedRoute.tsx
│   └── StepIndicator.tsx
├── context/
│   ├── AuthContext.tsx
│   └── ChatVisibilityContext.tsx
├── hooks/
│   ├── useLoginForm.ts
│   ├── useRegisterForm.ts
│   └── useIsDesktop.ts
├── pages/
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Dashboard.tsx             # Billetera: balances, tasas, actividad, gráficos
│   ├── Transactions.tsx          # Hub: Intercambio / Depositar / Transferir
│   ├── Exchange.tsx
│   ├── Deposit.tsx
│   ├── Transfer.tsx
│   ├── History.tsx               # Historial completo de movimientos
│   ├── Profile.tsx                # Datos personales, CVU/Alias
│   ├── AboutUs.tsx
│   ├── Terms.tsx / Privacy.tsx / Faq.tsx / Security.tsx / Contact.tsx
│   ├── SetPassword.tsx / ResetPassword.tsx / ConfirmEmailChange.tsx
│   └── NotFound.tsx
├── services/
│   ├── api.ts                     # Instancia de axios + authService
│   ├── auth.service.ts
│   ├── checkEmail.ts               # Chequeo de email disponible en tiempo real
│   ├── chatService.ts
│   └── emailPreferences.service.ts
├── utils/
│   ├── authValidators.ts          # Validaciones de formularios de auth
│   └── walletHelpers.ts           # Cálculos de balances, formateo de montos, gráficos
└── types/
```

## ⚙️ Instalación y setup local

### 1. Clonar el repositorio

```bash
git clone https://github.com/TravelGo-app/frontend.git
cd frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```
VITE_API_URL=https://travelgo-njke.up.railway.app/api
VITE_GOOGLE_CLIENT_ID=tu_google_client_id
```

### 4. Correr en modo desarrollo

```bash
npm run dev
```

La app corre en `http://localhost:5173`

### 5. Correr los tests

```bash
npm run test
```

## 🔐 Autenticación

- Registro y login con email y contraseña (con chequeo de email disponible en tiempo real mientras se escribe)
- Login con Google OAuth
- Persistencia de sesión con JWT en `localStorage`
- Recuperación y cambio de contraseña
- Rutas protegidas — redirige al login si no hay sesión activa

## 💰 Funcionalidades principales

### Billetera (Dashboard)

- Balance total convertido a ARS, con gráfico de evolución de los últimos 7 días
- Saldos por moneda (ARS, USD, EUR, BRL, CLP) con banderas y detalle al tocar cada una
- Tasas de cambio actualizadas en tiempo real
- Actividad reciente (depósitos, transferencias enviadas/recibidas, intercambios)
- Sección de Análisis y Gráficos: resumen de operaciones, evolución de saldo, distribución por tipo de movimiento y detalle diario
- Tip de viaje rotativo animado

### Transacciones

Hub central con acceso directo a:

- **Intercambio**: conversión entre monedas con vista previa de la tasa en vivo
- **Depósito**: agregar saldo simulado a una moneda
- **Transferencia**: enviar saldo a otro usuario por email, con idempotencia para evitar duplicados en reintentos

### Historial

Listado completo y filtrable de toda la actividad de la cuenta (operaciones y eventos de email).

### Perfil

- Edición de datos personales (nombre, teléfono, fecha de nacimiento, moneda preferida)
- Visualización de email y estado de verificación
- CVU y alias simulados de TravelGo, con opción de copiar y editar el alias

### Sobre Nosotros

Página institucional con la historia, misión, visión, valores y diferenciales de TravelGo.

## 🧪 Testing

El proyecto usa **Vitest** + **React Testing Library**. Cobertura actual:

- `authValidators.test.ts` — validaciones de formularios de auth
- `walletHelpers.test.ts` — cálculo de balance total, formateo de montos, íconos de actividad, generación de puntos del gráfico (22 tests)
- `useLoginForm.test.ts` / `useRegisterForm.test.ts` — lógica de los formularios de login y registro
- `LoginFormFields.test.tsx` — componente de campos de login

## 📄 Variables de entorno

| Variable                | Descripción                |
| ----------------------- | --------------------------- |
| `VITE_API_URL`          | URL base del backend        |
| `VITE_GOOGLE_CLIENT_ID` | Client ID de Google OAuth   |

## 👥 Equipo

- **Nadia Starna** — Frontend (Login, Register, AuthContext, rutas, rediseño de Dashboard, Historial)
- **Emanuel Florez** — Frontend (Navbar, pantalla de carga)
- **Katy Tejada** — Frontend (Billetera/Dashboard, Transacciones, Intercambio, Depósito, Transferencia, Historial, Perfil, Sobre Nosotros, testing de lógica de wallet)
- **Joaquín Gonzalez** — Backend (Express, PostgreSQL, Railway)

### Detalle del aporte de Katy Tejada

- Diseño e implementación completa del **Dashboard/Billetera**: balances, tasas de cambio, actividad reciente, gráfico de evolución, diseño responsive con estilo "vidrio esmerilado" sobre foto de fondo
- Página **Transacciones** como hub central, y las 3 páginas de operación: **Exchange**, **Deposit**, **Transfer**, todas conectadas a los endpoints reales del backend con manejo de `idempotencyKey` (se reutiliza en reintentos, se regenera tras un éxito)
- Página **Sobre Nosotros**, con contenido institucional y diseño a medida
- Ajustes de **Perfil** (simplificación de la tarjeta de correo electrónico)
- Corrección de bugs de integración frontend-backend (formato de errores, endpoints, CORS, rutas)
- Resolución de conflictos de merge y mantenimiento de la rama `feature/dashboard`
- **22 tests unitarios** para la lógica de cálculo de balances y formateo (`walletHelpers.ts`), y corrección de tests desactualizados de registro