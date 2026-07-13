import { describe, it, expect } from 'vitest'
import {
  validateEmailField,
  validatePasswordField,
  validateNewPasswordField,
  validateNameField,
  validateConfirmField,
} from './authValidators'

describe('authValidators', () => {
  it('valida el email: vacío, formato inválido y formato correcto', () => {
    expect(validateEmailField('')).toBe('El email es obligatorio')
    expect(validateEmailField('sin-arroba')).toBe('Email inválido')
    expect(validateEmailField('nadia@travelgo.com')).toBeUndefined()
  })

  it('valida la contraseña: vacía, corta y válida', () => {
    expect(validatePasswordField('')).toBe('La contraseña es obligatoria')
    expect(validatePasswordField('123')).toBe('Mínimo 6 caracteres')
    expect(validatePasswordField('miPassword')).toBeUndefined()
  })

  it('valida el límite de 72 caracteres en la nueva contraseña', () => {
    expect(validateNewPasswordField('a'.repeat(73))).toBe('Máximo 72 caracteres')
    expect(validateNewPasswordField('nuevaPassword123')).toBeUndefined()
  })

  it('valida el nombre: vacío, corto y válido', () => {
    expect(validateNameField('')).toBe('El nombre es obligatorio')
    expect(validateNameField('lu')).toBe('Mínimo 3 caracteres')
    expect(validateNameField('Nadia')).toBeUndefined()
  })

  it('valida que las contraseñas coincidan al confirmar', () => {
    expect(validateConfirmField('', 'password123')).toBe('Confirmá tu contraseña')
    expect(validateConfirmField('otra', 'password123')).toBe('Las contraseñas no coinciden')
    expect(validateConfirmField('password123', 'password123')).toBeUndefined()
  })
})