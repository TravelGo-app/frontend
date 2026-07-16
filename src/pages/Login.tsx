import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import playaImg from '../assets/PlayaPrincipal.png'
import { useLoginForm } from '../hooks/useLoginForm'
import { useRegisterForm } from '../hooks/useRegisterForm'
import { useIsDesktop } from '../hooks/useIsDesktop'
import LoginFormFields from '../components/auth/LoginFormFields'
import RegisterFormFields from '../components/auth/RegisterFormFields'
import { useChatVisibility } from '../context/ChatVisibilityContext'

function TriStripe() {
  return (
    <div className="flex h-1 w-full flex-shrink-0">
      <div className="flex-1 bg-[#ff4242]" />
      <div className="flex-1 bg-[#2391ae]" />
      <div className="flex-1 bg-[#ff7d60]" />
    </div>
  )
}

export default function Login() {
  const location = useLocation()
  const navigate = useNavigate()
  const initialRegisterMode = location.pathname === '/register'
  const [isRegister, setIsRegister] = useState(initialRegisterMode)
  const [showWelcome, setShowWelcome] = useState(false)
  const [welcomeName, setWelcomeName] = useState('')
  const { setHideChat } = useChatVisibility()
  const isDesktop = useIsDesktop()

  const loginForm = useLoginForm()
  const registerForm = useRegisterForm({
    onSuccess: (name) => {
      setWelcomeName(name)
      setShowWelcome(true)
      setTimeout(() => navigate('/dashboard'), 2500)
    },
  })

  useEffect(() => {
    if (location.pathname === '/register') {
      setIsRegister(true)
    } else if (location.pathname === '/login' || location.pathname === '/') {
      setIsRegister(false)
    }
  }, [location.pathname])

  // Oculta el chat mientras se muestra la pantalla de carga de Google
  useEffect(() => {
    setHideChat(loginForm.googleAuthLoading)
    return () => setHideChat(false)
  }, [loginForm.googleAuthLoading, setHideChat])

  const switchToRegister = () => {
    setIsRegister(true)
    loginForm.resetErrors()
  }

  const switchToLogin = () => {
    setIsRegister(false)
    registerForm.resetErrors()
  }

  return (
    <div className="min-h-screen relative z-0">
      {/* Fondo fijo, cubre siempre el viewport completo, nunca se remonta ni reescala */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${playaImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {loginForm.googleAuthLoading ? (
        // ===== Pantalla de carga mientras se procesa el login con Google =====
        <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white font-medium text-lg">Cargando...</p>
          </div>
        </div>
      ) : showWelcome ? (
        // ===== Pantalla de bienvenida tras registro exitoso =====
        <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden max-w-md w-full">
            <TriStripe />
            <div className="p-8 sm:p-12 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#233446] mb-2">¡Bienvenido a TravelGo, {welcomeName}!</h2>
              <p className="text-gray-400 mb-6">Tu cuenta fue creada exitosamente.</p>
              <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                <div className="w-4 h-4 border-2 border-[#F26A2E] border-t-transparent rounded-full animate-spin"></div>
                Redirigiendo...
              </div>
            </div>
          </div>
        </div>
      ) : isDesktop ? (
        // ===== DESKTOP/TABLET: panel deslizante horizontal =====
        <div className="min-h-screen flex items-center justify-center py-8 px-4 relative z-10">
          <div className="relative z-[1000] w-[800px] max-w-full h-[660px] bg-[#faf9f7] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <TriStripe />
            <div className="relative flex-1">
              <button
                onClick={() => navigate('/')}
                aria-label="Volver a página principal"
                className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full flex items-center justify-center transition hover:shadow-lg hover:scale-110"
                style={{ backgroundColor: isRegister ? '#2A9BB5' : '#ffffff' }}
                title="Volver a página principal"
              >
                <span
                  className="text-2xl font-bold leading-none"
                  style={{ color: isRegister ? '#ffffff' : '#F26A2E', transform: 'translateY(-3px)' }}
                >
                  ×
                </span>
              </button>

              <div className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center px-10 transition-all duration-500 ${isRegister ? 'opacity-0 pointer-events-none translate-x-[-100%]' : 'opacity-100 translate-x-0'}`}>
                <LoginFormFields
                  data={loginForm.loginData}
                  errors={loginForm.loginErrors}
                  serverError={loginForm.serverError}
                  loading={loginForm.loading}
                  showGoogleFallback={loginForm.showGoogleFallback}
                  rememberMe={loginForm.rememberMe}
                  onEmailChange={loginForm.handleEmailChange}
                  onPasswordChange={loginForm.handlePasswordChange}
                  onRememberMeChange={loginForm.handleRememberMeChange}
                  onSubmit={loginForm.handleSubmit}
                  onGoogleAuth={loginForm.handleGoogleAuth}
                  onGoogleLoadingChange={loginForm.handleGoogleLoadingChange}
                />
              </div>

              <div className={`absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center px-10 transition-all duration-500 ${isRegister ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none translate-x-[100%]'}`}>
                <RegisterFormFields
                  data={registerForm.registerData}
                  errors={registerForm.registerErrors}
                  serverError={registerForm.serverError}
                  loading={registerForm.loading}
                  acceptedTerms={registerForm.acceptedTerms}
                  emailCheckStatus={registerForm.emailCheckStatus}
                  isSubmitDisabled={registerForm.isSubmitDisabled}
                  onNameChange={registerForm.handleNameChange}
                  onEmailChange={registerForm.handleEmailChange}
                  onPasswordChange={registerForm.handlePasswordChange}
                  onConfirmChange={registerForm.handleConfirmChange}
                  onBirthDateChange={registerForm.handleBirthDateChange}
                  onTermsChange={registerForm.handleTermsChange}
                  onSubmit={registerForm.handleSubmit}
                />
              </div>

              <div className={`absolute top-0 w-1/2 h-full flex flex-col items-center justify-center text-white px-10 transition-all duration-500 ${isRegister ? 'left-0 bg-[#2A9BB5]' : 'left-1/2 bg-[#F26A2E]'}`}>
                {!isRegister ? (
                  <>
                    <h2 className="text-4xl font-bold italic mb-2" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>¡Hola!</h2>
                    <p className="text-center mb-8 text-white font-semibold" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>¿Primera vez en TravelGo?</p>
                    <button onClick={switchToRegister} className="border-2 border-white text-white px-8 py-2 rounded-full font-bold hover:bg-white hover:text-[#F26A2E] transition">
                      REGISTRARSE
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-4xl font-bold italic mb-2" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>¡Bienvenido!</h2>
                    <p className="text-center mb-8 text-white font-semibold" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>¿Ya tenés cuenta?</p>
                    <button onClick={switchToLogin} className="border-2 border-white text-white px-8 py-2 rounded-full font-bold hover:bg-white hover:text-[#2A9BB5] transition">
                      INICIAR SESIÓN
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // ===== MOBILE: tarjeta apilada con transición vertical =====
        <div className="min-h-screen flex items-center justify-center py-8 px-4 relative z-10">
          <div className="relative z-[1000] w-full max-w-[420px] bg-[#faf9f7] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <TriStripe />
            <button
              onClick={() => navigate('/')}
              aria-label="Volver a página principal"
              className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-white/90 hover:shadow-lg transition"
            >
              <span className="text-xl font-bold leading-none text-[#F26A2E]" style={{ transform: 'translateY(-2px)' }}>×</span>
            </button>

            <div
              className="px-6 pt-8 pb-6 text-center transition-colors duration-500"
              style={{ backgroundColor: isRegister ? '#2A9BB5' : '#F26A2E' }}
            >
              <h2 className="text-2xl font-bold italic text-white" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>
                {isRegister ? '¡Bienvenido!' : '¡Hola!'}
              </h2>
            </div>

            <div className="relative w-full overflow-hidden" style={{ height: '580px' }}>
              <div
                className={`absolute inset-0 w-full flex flex-col items-center px-6 py-6 overflow-y-auto transition-all duration-500 ease-in-out ${
                  isRegister ? 'opacity-0 pointer-events-none -translate-y-full' : 'opacity-100 translate-y-0'
                }`}
              >
                <LoginFormFields
                  data={loginForm.loginData}
                  errors={loginForm.loginErrors}
                  serverError={loginForm.serverError}
                  loading={loginForm.loading}
                  showGoogleFallback={loginForm.showGoogleFallback}
                  rememberMe={loginForm.rememberMe}
                  onEmailChange={loginForm.handleEmailChange}
                  onPasswordChange={loginForm.handlePasswordChange}
                  onRememberMeChange={loginForm.handleRememberMeChange}
                  onSubmit={loginForm.handleSubmit}
                  onGoogleAuth={loginForm.handleGoogleAuth}
                  onGoogleLoadingChange={loginForm.handleGoogleLoadingChange}
                />
                <p className="text-sm text-gray-500 mt-4 text-center">
                  ¿Primera vez en TravelGo?{' '}
                  <button type="button" onClick={switchToRegister} className="font-bold underline text-[#F26A2E]">
                    Registrarse
                  </button>
                </p>
              </div>

              <div
                className={`absolute inset-0 w-full flex flex-col items-center px-6 py-6 overflow-y-auto transition-all duration-500 ease-in-out ${
                  isRegister ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-full'
                }`}
              >
                <RegisterFormFields
                  data={registerForm.registerData}
                  errors={registerForm.registerErrors}
                  serverError={registerForm.serverError}
                  loading={registerForm.loading}
                  acceptedTerms={registerForm.acceptedTerms}
                  emailCheckStatus={registerForm.emailCheckStatus}
                  isSubmitDisabled={registerForm.isSubmitDisabled}
                  onNameChange={registerForm.handleNameChange}
                  onEmailChange={registerForm.handleEmailChange}
                  onPasswordChange={registerForm.handlePasswordChange}
                  onConfirmChange={registerForm.handleConfirmChange}
                  onBirthDateChange={registerForm.handleBirthDateChange}
                  onTermsChange={registerForm.handleTermsChange}
                  onSubmit={registerForm.handleSubmit}
                />
                <p className="text-sm text-gray-500 mt-4 text-center">
                  ¿Ya tenés cuenta?{' '}
                  <button type="button" onClick={switchToLogin} className="font-bold underline text-[#2A9BB5]">
                    Iniciar sesión
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}