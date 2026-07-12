# TravelGo — Frontend

Billetera digital multi-moneda para viajeros argentinos. Permite gestionar saldos en ARS, USD, EUR, BRL y CLP, ver tasas de cambio en tiempo real y realizar transacciones simuladas.

## 🚀 Deploy

Frontend: [https://travelgo-pink.vercel.app](https://travelgo-pink.vercel.app)  
Backend: [https://travelgo-njke.up.railway.app](https://travelgo-njke.up.railway.app)

## 🛠 Stack tecnológico

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Google Identity Services (OAuth)

## 📁 Estructura del proyecto
src/
├── assets/        
├── components/     
│   ├── GoogleLoginButton.tsx
│   ├── Navbar.tsx
│   └── ProtectedRoute.tsx
├── context/       
│   └── AuthContext.tsx
├── hooks/          
├── pages/           
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Placeholder.tsx
│   └── NotFound.tsx
├── services/      
│   ├── api.ts
│   └── auth.service.ts
└── types/          

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
VITE_API_URL=https://travelgo-njke.up.railway.app/api
VITE_GOOGLE_CLIENT_ID=tu_google_client_id

### 4. Correr en modo desarrollo

```bash
npm run dev
```

La app corre en `http://localhost:5173`

## 🔐 Autenticación

- Registro y login con email y contraseña
- Login con Google OAuth
- Persistencia de sesión con JWT en localStorage
- Rutas protegidas — redirige al login si no hay sesión activa

## 📄 Variables de entorno

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base del backend |
| `VITE_GOOGLE_CLIENT_ID` | Client ID de Google OAuth |

## 👥 Equipo

- **Nadia Starna** — Frontend (Login, Register, AuthContext, rutas)
- **Emanuel Florez** — Frontend (Navbar, carga)
- **Katy Tejada** — Frontend (Dashboard, balances, tasas)
- **Joaquín Gonzalez** — Backend (Express, PostgreSQL, Railway)