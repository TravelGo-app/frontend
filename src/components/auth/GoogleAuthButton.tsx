import { GoogleLoginButton } from '../GoogleLoginButton'

interface GoogleAuthButtonProps {
  onAuthenticated: (result: any) => void
  onLoadingChange?: (loading: boolean) => void
}

export const GoogleAuthButton = ({ onAuthenticated, onLoadingChange }: GoogleAuthButtonProps) => (
  <div className="flex flex-col items-center gap-2 mt-2 w-full">
    <span className="text-gray-400 text-xs">o continuá con</span>
    <div className="w-full max-w-[320px]" style={{ height: '44px', overflow: 'hidden' }}>
      <GoogleLoginButton onAuthenticated={onAuthenticated} onLoadingChange={onLoadingChange} />
    </div>
  </div>
)