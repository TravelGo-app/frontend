export const validateEmailField = (value: string): string | undefined => {
  if (!value) return 'El email es obligatorio'
  if (!/\S+@\S+\.\S+/.test(value)) return 'Email inválido'
  return undefined
}

export const validatePasswordField = (value: string): string | undefined => {
  if (!value) return 'La contraseña es obligatoria'
  if (value.length < 6) return 'Mínimo 6 caracteres'
  return undefined
}

export const validateNewPasswordField = (value: string): string | undefined => {
  if (!value) return 'La contraseña es obligatoria'
  if (value.length < 6) return 'Mínimo 6 caracteres'
  if (value.length > 72) return 'Máximo 72 caracteres'
  return undefined
}

export const validateNameField = (value: string): string | undefined => {
  if (!value) return 'El nombre es obligatorio'
  if (value.length < 3) return 'Mínimo 3 caracteres'
  return undefined
}

export const validateConfirmField = (value: string, password: string): string | undefined => {
  if (!value) return 'Confirmá tu contraseña'
  if (value !== password) return 'Las contraseñas no coinciden'
  return undefined
}