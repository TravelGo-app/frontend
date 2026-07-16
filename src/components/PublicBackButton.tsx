import { useNavigate } from "react-router-dom";

type PublicBackButtonProps = {
  fallback?: string;
};

export default function PublicBackButton({
  fallback = "/",
}: PublicBackButtonProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    const historyIndex = window.history.state?.idx;

    if (typeof historyIndex === "number" && historyIndex > 0) {
      navigate(-1);
      return;
    }

    navigate(fallback);
  };

  return (
    <button
      type="button"
      className="public-back-button"
      onClick={handleBack}
      aria-label="Volver a la página anterior"
    >
      <svg
        aria-hidden="true"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M15 18L9 12L15 6"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>Volver</span>
    </button>
  );
}
