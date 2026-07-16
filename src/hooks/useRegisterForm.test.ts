import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRegisterForm } from './useRegisterForm'
import { authService } from '../services/api'

const mockLogin = vi.fn()

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}))

vi.mock('../services/api', () => ({
  authService: {
    register: vi.fn(),
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useRegisterForm', () => {
  it('no permite enviar si no se aceptaron los términos', async () => {
    const onSuccess = vi.fn()
    const { result } = renderHook(() => useRegisterForm({ onSuccess }))

    act(() => {
      result.current.handleNameChange('Nadia')
      result.current.handleEmailChange('nadia@travelgo.com')
      result.current.handlePasswordChange('password123')
      result.current.handleConfirmChange('password123')
      result.current.handleBirthDateChange('2000-05-14')
    })

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    expect(result.current.registerErrors.terms).toBe('Debés aceptar los términos y condiciones')
    expect(authService.register).not.toHaveBeenCalled()
  })

  it('revalida la confirmación cuando cambia la contraseña después', () => {
    const { result } = renderHook(() => useRegisterForm({ onSuccess: vi.fn() }))

    act(() => {
      result.current.handleConfirmChange('abc123')
      result.current.handlePasswordChange('otraPassword')
    })

    expect(result.current.registerErrors.confirmPassword).toBe('Las contraseñas no coinciden')
  })

  it('llama a onSuccess con el nombre cuando el registro es exitoso', async () => {
    ;(authService.register as any).mockResolvedValue({
      user: { id: 2, name: 'Nadia', email: 'nadia@travelgo.com' },
      token: 'fake-token',
    })

    const onSuccess = vi.fn()
    const { result } = renderHook(() => useRegisterForm({ onSuccess }))

    act(() => {
      result.current.handleNameChange('Nadia')
      result.current.handleEmailChange('nadia@travelgo.com')
      result.current.handlePasswordChange('password123')
      result.current.handleConfirmChange('password123')
      result.current.handleBirthDateChange('2000-05-14')
      result.current.handleTermsChange(true)
    })

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    expect(onSuccess).toHaveBeenCalledWith('Nadia')
  })

  it('muestra el error del servidor cuando falla el registro', async () => {
    ;(authService.register as any).mockRejectedValue({
      response: { data: { message: 'El email ya está en uso' } },
    })

    const { result } = renderHook(() => useRegisterForm({ onSuccess: vi.fn() }))

    act(() => {
      result.current.handleNameChange('Nadia')
      result.current.handleEmailChange('nadia@travelgo.com')
      result.current.handlePasswordChange('password123')
      result.current.handleConfirmChange('password123')
      result.current.handleBirthDateChange('2000-05-14')
      result.current.handleTermsChange(true)
    })

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    expect(result.current.serverError).toBe('El email ya está en uso')
  })

  it('valida la nueva contraseña en vivo mientras se escribe', () => {
    const { result } = renderHook(() => useRegisterForm({ onSuccess: vi.fn() }))

    act(() => {
      result.current.handlePasswordChange('123')
    })

    expect(result.current.registerErrors.password).toBe('Mínimo 6 caracteres')

    act(() => {
      result.current.handlePasswordChange('password123')
    })

    expect(result.current.registerErrors.password).toBeUndefined()
  })

  it('resetErrors limpia el error del servidor y los errores de campos', async () => {
    ;(authService.register as any).mockRejectedValue({
      response: { data: { message: 'El email ya está en uso' } },
    })

    const { result } = renderHook(() => useRegisterForm({ onSuccess: vi.fn() }))

    act(() => {
      result.current.handleNameChange('Nadia')
      result.current.handleEmailChange('nadia@travelgo.com')
      result.current.handlePasswordChange('password123')
      result.current.handleConfirmChange('password123')
      result.current.handleBirthDateChange('2000-05-14')
      result.current.handleTermsChange(true)
    })

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    expect(result.current.serverError).toBe('El email ya está en uso')

    act(() => {
      result.current.resetErrors()
    })

    expect(result.current.serverError).toBe('')
  })
})