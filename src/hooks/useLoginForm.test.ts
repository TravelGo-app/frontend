import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLoginForm } from './useLoginForm'
import { authService } from '../services/api'

const mockNavigate = vi.fn()
const mockLogin = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}))

vi.mock('../services/api', () => ({
  authService: {
    login: vi.fn(),
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useLoginForm', () => {
  it('actualiza el email y valida en vivo mientras se escribe', () => {
    const { result } = renderHook(() => useLoginForm())

    act(() => {
      result.current.handleEmailChange('correo-invalido')
    })

    expect(result.current.loginData.email).toBe('correo-invalido')
    expect(result.current.loginErrors.email).toBe('Email inválido')
  })

  it('no llama al backend si el formulario tiene errores al enviar', async () => {
    const { result } = renderHook(() => useLoginForm())

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    expect(authService.login).not.toHaveBeenCalled()
    expect(result.current.loginErrors.email).toBeDefined()
  })

  it('hace login y navega a /dashboard cuando las credenciales son correctas', async () => {
    ;(authService.login as any).mockResolvedValue({
      user: { id: 1, name: 'Nadia', email: 'nadia@travelgo.com' },
      token: 'fake-token',
    })

    const { result } = renderHook(() => useLoginForm())

    act(() => {
      result.current.handleEmailChange('nadia@travelgo.com')
      result.current.handlePasswordChange('password123')
    })

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    expect(mockLogin).toHaveBeenCalledWith(
      { id: 1, name: 'Nadia', email: 'nadia@travelgo.com' },
      'fake-token',
      true
    )
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
  })

  it('muestra el fallback de Google cuando el backend responde 409', async () => {
    ;(authService.login as any).mockRejectedValue({ response: { status: 409 } })

    const { result } = renderHook(() => useLoginForm())

    act(() => {
      result.current.handleEmailChange('nadia@travelgo.com')
      result.current.handlePasswordChange('password123')
    })

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    expect(result.current.showGoogleFallback).toBe(true)
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('cambia entre localStorage y sessionStorage según el checkbox de recordarme', async () => {
    ;(authService.login as any).mockResolvedValue({
      user: { id: 1, name: 'Nadia', email: 'nadia@travelgo.com' },
      token: 'fake-token',
    })

    const { result } = renderHook(() => useLoginForm())

    act(() => {
      result.current.handleEmailChange('nadia@travelgo.com')
      result.current.handlePasswordChange('password123')
    })

    expect(result.current.rememberMe).toBe(true)

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    expect(mockLogin).toHaveBeenCalledWith(
      { id: 1, name: 'Nadia', email: 'nadia@travelgo.com' },
      'fake-token',
      true
    )
  })

  it('resetErrors limpia el error del servidor y el fallback de Google', async () => {
    ;(authService.login as any).mockRejectedValue({ response: { status: 409 } })

    const { result } = renderHook(() => useLoginForm())

    act(() => {
      result.current.handleEmailChange('nadia@travelgo.com')
      result.current.handlePasswordChange('password123')
    })

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    expect(result.current.showGoogleFallback).toBe(true)

    act(() => {
      result.current.resetErrors()
    })

    expect(result.current.showGoogleFallback).toBe(false)
    expect(result.current.serverError).toBe('')
  })

  it('redirige a /configurar-password cuando Google indica requiresPasswordSetup', () => {
    const { result } = renderHook(() => useLoginForm())

    act(() => {
      result.current.handleGoogleAuth({
        user: { id: 3, name: 'Usuario Google', email: 'g@travelgo.com' },
        token: 'google-token',
        requiresPasswordSetup: true,
      })
    })

    expect(mockNavigate).toHaveBeenCalledWith('/configurar-password')
  })
})