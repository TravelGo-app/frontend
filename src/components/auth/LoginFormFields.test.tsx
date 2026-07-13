import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginFormFields from './LoginFormFields'

const noop = () => {}

describe('LoginFormFields', () => {
  it('muestra el error de un campo cuando existe', () => {
    render(
      <LoginFormFields
        data={{ email: '', password: '' }}
        errors={{ email: 'El email es obligatorio' }}
        serverError=""
        loading={false}
        showGoogleFallback={false}
        rememberMe={true}
        onEmailChange={noop}
        onPasswordChange={noop}
        onRememberMeChange={noop}
        onSubmit={noop}
        onGoogleAuth={noop}
      />
    )

    expect(screen.getByText('El email es obligatorio')).toBeInTheDocument()
  })

  it('llama a onEmailChange cuando el usuario escribe en el campo de email', async () => {
    const user = userEvent.setup()
    const handleEmailChange = vi.fn()

    render(
      <LoginFormFields
        data={{ email: '', password: '' }}
        errors={{}}
        serverError=""
        loading={false}
        showGoogleFallback={false}
        rememberMe={true}
        onEmailChange={handleEmailChange}
        onPasswordChange={noop}
        onRememberMeChange={noop}
        onSubmit={noop}
        onGoogleAuth={noop}
      />
    )

    const emailInput = screen.getByPlaceholderText('Email')
    await user.type(emailInput, 'n')

    expect(handleEmailChange).toHaveBeenCalledWith('n')
  })
})