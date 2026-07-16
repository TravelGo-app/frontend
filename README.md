# TravelGo — Frontend

Billetera digital que ayuda al turista argentino a comprender, organizar y practicar el uso de diferentes monedas antes y durante un viaje al exterior.

**Producción:** https://travelgo-pink.vercel.app
**Backend:** https://travelgo-njke.up.railway.app/api

---

## Stack

- **React 18** + **TypeScript**
- **Vite** (bundler)
- **Tailwind CSS v4**
- **React Router** (enrutamiento)
- **Axios** (cliente HTTP)
- **Recharts** (gráficos de Analytics)
- Deploy: **Vercel** (frontend, autodeploy en `main`) + **Railway** (backend, PostgreSQL)

---

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
git clone https://github.com/TravelGo-app/frontend.git
cd frontend
npm install
```

## Variables de entorno

Crear un archivo `.env.local` en la raíz con:

```
VITE_API_URL=https://travelgo-njke.up.railway.app/api
VITE_GOOGLE_CLIENT_ID=<client_id de Google OAuth>
```

Para desarrollo local contra un backend local, ajustar `VITE_API_URL` a `http://localhost:3000/api`.

## Correr en desarrollo

```bash
npm run dev
```

Levanta en `http://localhost:5173`.

## Build de producción

```bash
npm run build
```

Compila con `tsc -b && vite build`. La salida queda en `dist/`.

---

## Estructura del proyecto

```
src/
├── assets/              # Imágenes, videos, logo
├── components/
│   ├── auth/            # LoginFormFields, RegisterFormFields, GoogleAuthButton, TermsModal, ForgotPasswordModal, AuthIcons
│   ├── AnalyticsSection.tsx
│   ├── ChatbotWidget.tsx
│   ├── GoogleLoginButton.tsx
│   ├── LoadingOverlay.tsx
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
│   ├── Login.tsx              # Login + Register combinados
│   ├── Dashboard.tsx          # "Billetera"
│   ├── Transactions.tsx
│   ├── Deposit.tsx
│   ├── Exchange.tsx
│   ├── Transfer.tsx
│   ├── Profile.tsx            # Ruta /home y /perfil
│   ├── History.tsx            # Ruta /history
│   ├── AboutUs.tsx            # Ruta /about-us
│   ├── SetPassword.tsx
│   ├── ResetPassword.tsx
│   ├── ConfirmEmailChange.tsx
│   └── NotFound.tsx
├── services/
│   ├── api.ts                 # Instancia de Axios + authService
│   ├── auth.service.ts        # Google OAuth
│   ├── chatService.ts         # Asistente virtual
│   └── emailPreferences.service.ts
├── utils/
│   └── authValidators.ts
├── App.tsx
└── main.tsx
```

---

## Rutas principales

| Ruta | Página | Protegida |
|---|---|---|
| `/` | Landing | No |
| `/login`, `/register` | Login / Registro | No |
| `/home`, `/perfil` | Perfil (datos, CVU, alias) | Sí |
| `/dashboard` | Billetera | Sí |
| `/transactions` | Menú de transacciones | Sí |
| `/deposit` | Depósito simulado | Sí |
| `/exchange` | Intercambio de divisas | Sí |
| `/transfer` | Transferencias | Sí |
| `/history` | Historial de actividad | Sí |
| `/about-us` | Nosotros | No |
| `/reset-password` | Reseteo de contraseña | No |
| `/confirm-email-change` | Confirmación de cambio de email | No |

---

## Funcionalidades principales

### Autenticación
- Login con email/contraseña
- Login con Google (Google Identity Services)
- Registro con validación de fecha de nacimiento (edad mínima 17 años)
- Recuperación de contraseña
- "Recordarme" (localStorage vs sessionStorage)

### Billetera (Dashboard)
- Balance total consolidado en ARS
- Balances por moneda (ARS, USD, EUR, BRL, CLP)
- Gráfico de evolución de balance (últimos 7 días)
- Tasas de cambio en vivo
- Actividad reciente
- Analytics con pestañas (Resumen / Evolución / Distribución / Detalle)

### Transacciones
- Depósito simulado
- Intercambio entre monedas
- Transferencias (por email, alias o CVU)
- Wizard de 4 pasos en cada operación (Ingresar datos → Confirmar → Procesando → Listo)

### Perfil
- Datos personales editables (nombre, teléfono, fecha de nacimiento, moneda preferida)
- CVU y alias de TravelGo (simulados, para transferencias internas)
- Cambio de email con confirmación por link
- Avatar (foto de Google o iniciales)

### Historial
- Actividad completa del usuario
- Filtros por tipo (Depósitos, Transferencias, Intercambios, Cuenta)
- Paginación con scroll infinito
- Estados visuales (Exitoso / Error / Pendiente / Info)

### Asistente virtual (chat)
- Widget flotante y arrastrable, disponible en toda la app
- Persiste mensajes entre navegaciones
- Oculto durante pantallas de carga

---

## Paleta de colores

| Nombre | Hex | Uso |
|---|---|---|
| Coral | `#ff4242` | Acentos, alertas, franja tricolor |
| Océano | `#2391ae` | Acentos secundarios, texto sobre blanco |
| Terracota | `#ff7d60` | Acentos, franja tricolor |
| Grafito | `#233446` | Fondos oscuros, texto principal |
| Arena | `#e4c2a2` | Fondos cálidos, degradés |

La franja tricolor (coral → océano → terracota) es un recurso visual presente en headers de Billetera, Transacciones, Login, Historial y en el botón del Asistente.

---

## Flujo de ramas Git

```
feature/xxx → develop → main
```

- `main`: producción, autodeploy en Vercel
- `develop`: integración del equipo
- `feature/*`: trabajo individual por persona/funcionalidad

---

## Scripts disponibles

```bash
npm run dev       # servidor de desarrollo
npm run build     # build de producción (tsc -b && vite build)
npm run preview   # previsualizar el build localmente
```

---

## Tests

El proyecto usa **Vitest** + **React Testing Library** para tests unitarios de hooks y componentes.

```bash
npm run test
```

Cobertura actual:

| Archivo | Tests |
|---|---|
| `src/utils/authValidators.test.ts` | 5 |
| `src/hooks/useLoginForm.test.ts` | 7 |
| `src/hooks/useRegisterForm.test.ts` | 6 |
| `src/components/auth/LoginFormFields.test.tsx` | 2 |

**Total: 20 tests, 4 archivos.**

---

## Equipo

| Integrante | Área |
|---|---|
| Nadia | Autenticación, Perfil, Billetera, Historial |
| Katy | Billetera, Transacciones |
| Ema | Navbar, Landing, Nosotros |

---

## Licencia

Proyecto académico — Henry Bootcamp, cohorte FT73.