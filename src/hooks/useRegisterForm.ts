import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/api";
import { checkEmailRegistered } from "../services/checkEmail";
import {
  validateNameField,
  validateEmailField,
  validatePasswordField,
  validateConfirmField,
  validateBirthDateField,
} from "../utils/authValidators";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
}

export interface RegisterErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  birthDate?: string;
  terms?: string;
}

export type EmailCheckStatus =
  | "idle"
  | "checking"
  | "available"
  | "taken"
  | "error";

interface UseRegisterFormOptions {
  onSuccess: (name: string) => void;
}

export function useRegisterForm({ onSuccess }: UseRegisterFormOptions) {
  const { login } = useAuth();

  const [registerData, setRegisterData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
  });
  const [registerErrors, setRegisterErrors] = useState<RegisterErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [emailCheckStatus, setEmailCheckStatus] =
    useState<EmailCheckStatus>("idle");

  const debounceRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const validateRegister = (): RegisterErrors => {
    const errors: RegisterErrors = {};
    const name = validateNameField(registerData.name);
    const email = validateEmailField(registerData.email);
    const password = validatePasswordField(registerData.password);
    const confirmPassword = validateConfirmField(
      registerData.confirmPassword,
      registerData.password,
    );
    const birthDate = validateBirthDateField(registerData.birthDate);
    if (name) errors.name = name;
    if (email) errors.email = email;
    if (password) errors.password = password;
    if (confirmPassword) errors.confirmPassword = confirmPassword;
    if (birthDate) errors.birthDate = birthDate;
    if (!acceptedTerms)
      errors.terms = "Debés aceptar los términos y condiciones";
    return errors;
  };

  const handleNameChange = (value: string) => {
    setRegisterData((prev) => ({ ...prev, name: value }));
    setRegisterErrors((prev) => ({ ...prev, name: validateNameField(value) }));
  };

  const handleEmailChange = (value: string) => {
    setRegisterData((prev) => ({ ...prev, email: value }));
    setRegisterErrors((prev) => ({
      ...prev,
      email: validateEmailField(value),
    }));
  };

  useEffect(() => {
    const email = registerData.email.trim();

    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();

    if (!email || validateEmailField(email)) {
      setEmailCheckStatus("idle");
      return;
    }

    setEmailCheckStatus("checking");

    debounceRef.current = window.setTimeout(() => {
      const controller = new AbortController();
      abortRef.current = controller;

      checkEmailRegistered(email, controller.signal)
        .then((result) => {
          if (email !== registerData.email.trim()) return;
          if (result.status === "registered") {
            setEmailCheckStatus("taken");
            setRegisterErrors((prev) => ({
              ...prev,
              email: "Este correo ya está registrado",
            }));
          } else if (result.status === "available") {
            setEmailCheckStatus("available");
          } else {
            setEmailCheckStatus("error");
          }
        })
        .catch((err) => {
          if (err.name === "AbortError") return;
          setEmailCheckStatus("error");
        });
    }, 500);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [registerData.email]);

  const handlePasswordChange = (value: string) => {
    setRegisterData((prev) => ({ ...prev, password: value }));
    setRegisterErrors((prev) => ({
      ...prev,
      password: validatePasswordField(value),
      confirmPassword: registerData.confirmPassword
        ? validateConfirmField(registerData.confirmPassword, value)
        : prev.confirmPassword,
    }));
  };

  const handleConfirmChange = (value: string) => {
    setRegisterData((prev) => ({ ...prev, confirmPassword: value }));
    setRegisterErrors((prev) => ({
      ...prev,
      confirmPassword: validateConfirmField(value, registerData.password),
    }));
  };

  const handleBirthDateChange = (value: string) => {
    setRegisterData((prev) => ({ ...prev, birthDate: value }));
    setRegisterErrors((prev) => ({
      ...prev,
      birthDate: validateBirthDateField(value),
    }));
  };

  const handleTermsChange = (checked: boolean) => {
    setAcceptedTerms(checked);
    setRegisterErrors((prev) => ({
      ...prev,
      terms: checked ? undefined : "Debés aceptar los términos y condiciones",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateRegister();
    if (Object.keys(errors).length > 0) {
      setRegisterErrors(errors);
      return;
    }
    setRegisterErrors({});
    setServerError("");
    setLoading(true);
    try {
      const data = await authService.register(
        registerData.name,
        registerData.email,
        registerData.password,
        registerData.birthDate,
      );
      login(data.user, data.token);
      onSuccess(data.user.name);
    } catch (err: any) {
      setServerError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Error al registrarse",
      );
    } finally {
      setLoading(false);
    }
  };

  const resetErrors = () => {
    setServerError("");
    setRegisterErrors({});
  };

  const isSubmitDisabled =
    loading || emailCheckStatus === "taken" || emailCheckStatus === "checking";

  return {
    registerData,
    registerErrors,
    serverError,
    loading,
    acceptedTerms,
    emailCheckStatus,
    isSubmitDisabled,
    handleNameChange,
    handleEmailChange,
    handlePasswordChange,
    handleConfirmChange,
    handleBirthDateChange,
    handleTermsChange,
    handleSubmit,
    resetErrors,
  };
}
