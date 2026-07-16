# TravelGo — Frontend

Billetera digital multi-moneda para viajeros argentinos. Permite gestionar saldos en ARS, USD, EUR, BRL y CLP, ver tasas de cambio en tiempo real y realizar transacciones simuladas.

## 🚀 Deploy

Frontend: [https://travelgo-pink.vercel.app](https://travelgo-pink.vercel.app)  
Backend: [https://travelgo-njke.up.railway.app](https://travelgo-njke.up.railway.app)

## 🛠 Stack tecnológico

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- React Router DOM 7
- Axios
- Google Identity Services (OAuth)
- Recharts (gráficos de analytics)

## 📁 Estructura del proyecto

```
src/
├── assets/              # Imágenes, videos, logos
├── components/          
│   ├── Navbar.tsx              # Menú sidebar responsive
│   ├── ProtectedRoute.tsx       # Guard para rutas autenticadas
│   ├── GoogleLoginButton.tsx    # Integración OAuth con Google
│   ├── ChatbotWidget.tsx        # Widget de chat
│   ├── LoadingOverlay.tsx       # Pantalla de carga (950ms)
│   ├── AnalyticsSection.tsx     # Sección de analytics con gráficos
│   └── auth/
│       ├── LoginFormFields.tsx
│       ├── RegisterFormFields.tsx
│       ├── GoogleAuthButton.tsx
│       ├── ForgotPasswordModal.tsx
│       ├── TermsModal.tsx
│       └── AuthIcons.tsx
├── context/             
│   ├── AuthContext.tsx          # Gestión global de autenticación
│   └── ChatVisibilityContext.tsx # Control de visibilidad del chat
├── hooks/               
│   ├── useLoginForm.ts          # Lógica de login con validación
│   └── useRegisterForm.ts       # Lógica de registro con validación
├── pages/               
│   ├── Landing.tsx              # Página de inicio (hero + features + footer)
│   ├── Login.tsx                # Página de login/register
│   ├── Dashboard.tsx            # Dashboard con balances y analytics
│   ├── Profile.tsx              # Perfil del usuario
│   ├── Exchange.tsx             # Intercambio de monedas
│   ├── Transfer.tsx             # Transferencias
│   ├── Deposit.tsx              # Depósitos
│   ├── Transactions.tsx         # Historial de transacciones
│   ├── SetPassword.tsx          # Configurar contraseña (post-Google)
│   ├── ResetPassword.tsx        # Resetear contraseña
│   ├── ConfirmEmailChange.tsx   # Confirmar cambio de email
│   ├── AboutUs.tsx              # Página sobre nosotros
│   ├── Contact.tsx              # Contacto
│   ├── Faq.tsx                  # Preguntas frecuentes
│   ├── Privacy.tsx              # Política de privacidad
│   ├── Security.tsx             # Seguridad
│   ├── Terms.tsx                # Términos y condiciones
│   ├── Placeholder.tsx          # Placeholder para rutas pendientes
│   └── NotFound.tsx             # Página 404
├── services/            
│   ├── api.ts                   # Cliente Axios con interceptor de token
│   ├── auth.service.ts          # Servicios de autenticación
│   ├── chatService.ts           # Servicios del chatbot
│   └── emailPreferences.service.ts # Preferencias de email y resumen
├── types/               
│   └── index.ts                 # Definiciones de tipos globales
└── utils/               
    ├── authValidators.ts        # Validadores para email, password, name
    └── authValidators.test.ts   # Tests de validadores
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

### 5. Scripts disponibles

```bash
npm run dev        # Servidor desarrollo con hot reload
npm run build      # Build para producción
npm run lint       # Verificar linting
npm run preview    # Previsualizar build
npm run test       # Correr tests unitarios
npm run test:watch # Tests en modo watch
```

## 🎨 Páginas Implementadas

### 📍 Landing Page (`/`)

Página de bienvenida con:

- **Hero Section**: Logo, headline "Tu dinero, dondequiera que vayas", CTA principal
- **Feature Cards**: 4 tarjetas destacando:
  - 💳 Billetera Multimoneda (ARS, USD, EUR, BRL, CLP)
  - 📈 Tasas en Tiempo Real
  - 🛡️ Seguridad Avanzada
  - 🤝 Soporte 24/7
- **Multicurrency Section**: Showcase de soportar múltiples monedas
- **Secure Section**: Énfasis en seguridad JWT y rutas protegidas
- **Travel Tips Section**: Consejos rotatorios para viajeros
- **Footer**: Links a términos, privacidad, FAQ, seguridad, contacto, "Sobre nosotros"

**Características especiales:**
- Scroll hint animado (↓ Scroll)
- Crossfade smooth entre videos de fondo
- 3D rotation effects en elementos (parallax)
- Fully responsive: mobile, tablet, desktop
- Redirección automática a `/dashboard` si ya está autenticado

### 🔐 Login/Register (`/login`, `/register`)

Página unificada con dos modos:

- **Login**: Email + Password + Remember Me checkbox
- **Register**: Name + Email + Password + Términos y condiciones
- Toggle entre modos
- Validación real-time de campos
- Error handling: email duplicado, credenciales inválidas
- Google OAuth integration con fallback: si la cuenta fue creada con Google, muestra mensaje "Iniciá sesión con Google"
- Pantalla de carga mientras se procesa Google Auth
- Background de playa responsive
- TriStripe (barra de colores rojo, azul, naranja)

### 📊 Dashboard (`/dashboard`)

Panel principal post-login con:

- **Balances Widget**:
  - Saldo principal en ARS (con equivalente en monedas seleccionadas)
  - Tarjetas para USD, EUR, BRL, CLP (con flags 🇦🇷🇺🇸🇪🇺)
  - Equivalente a ARS en cada moneda

- **Exchange Rates Section**: Tasas actuales de cambio

- **Recent Transactions**: Últimas transacciones con:
  - Tipo de transacción (deposit, transfer, exchange)
  - Monto y dirección (in/out)
  - Estado (completed, pending, failed)
  - Timestamp

- **Analytics Section** (Recharts):
  - Gráfico de cierre de balance por fecha
  - Datos de últimos 30 días
  - Polling cada 20s para actualización

- **Travel Tips**: Consejos rotatorios

- **Email Summary Button**: Envía resumen de dashboard por email
  - POST `/profile/dashboard-summary-email` con `days: 30`
  - Rate limiting: 429 si ya solicitó recientemente
  - Toast notifications (éxito/error)

- **Logout Button**: Con delay de 500ms

- **Last Updated**: Timestamp de la última actualización

### 📱 Responsive Design

Implementado con **Tailwind CSS breakpoints**:

```css
Mobile First:
- sm: 640px   (tablets)
- md: 768px   (tablets grandes)
- lg: 1024px  (laptops)
- xl: 1280px  (desktops)
```

Ejemplos en componentes:
- **Landing Hero**: `grid md:grid-cols-2 lg:grid-cols-3`
- **Navbar**: Hamburguesa en mobile, sidebar que aparece con transición
- **Feature Cards**: 1 col mobile → 2 cols tablet → 4 cols desktop
- **Dashboard**: Stack vertical mobile → flex horizontal desktop
- **Footer**: 1 col mobile → 4 cols desktop

Todos los textos usan `text-sm sm:text-base md:text-lg` para escalabilidad.

## 🔐 Autenticación

- Registro y login con email y contraseña
- Login con Google OAuth (redirect flow)
- Persistencia de sesión con JWT en localStorage (Remember Me) o sessionStorage (sesión actual)
- Rutas protegidas con `<ProtectedRoute>` — redirige a "/" si no hay sesión activa
- Token enviado automáticamente en header `Authorization: Bearer {token}`
- Validación de token en cada carga: GET `/auth/me`

## 📧 Email & Preferencias

### Servicio de Email: `emailPreferences.service.ts`

```typescript
// Obtener preferencias
getEmailPreferences(): Promise<EmailPreferences>

// Actualizar preferencias
updateEmailPreferences(changes: Partial<EmailPreferences>): Promise<EmailPreferences>

// Enviar resumen de dashboard (30 o 7 días)
sendDashboardSummaryEmail(days: 7 | 30 = 30): Promise<any>
```

**Preferencias disponibles:**
- `notifyDeposits` - Notificaciones de depósitos
- `notifyTransfersSent` - Notificaciones de transferencias enviadas
- `notifyTransfersReceived` - Notificaciones de transferencias recibidas
- `notifyExchanges` - Notificaciones de intercambios
- `notifyLoginDashboardReminder` - Recordatorio diario del dashboard

**Email Summary:**
- POST `/profile/dashboard-summary-email` con `{ days: 30 }`
- Respuesta exitosa: toast "Resumen programado. Revisá tu correo en los próximos minutos."
- Error 429: "Ya solicitaste un resumen recientemente. Esperá unos minutos."
- Error 401: "Tu sesión venció. Iniciá sesión nuevamente."

## 📄 Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base del backend | `https://travelgo-njke.up.railway.app/api` |
| `VITE_GOOGLE_CLIENT_ID` | Client ID de Google OAuth | `xxx.apps.googleusercontent.com` |

## 👥 Equipo

- **Nadia Starna** — Frontend (Login, Register, AuthContext, rutas)
- **Emanuel Florez** — Frontend (Navbar, carga)
- **Katy Tejada** — Frontend (Dashboard, balances, tasas)
- **Joaquín Gonzalez** — Backend (Express, PostgreSQL, Railway)