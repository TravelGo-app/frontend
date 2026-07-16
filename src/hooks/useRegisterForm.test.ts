import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useRegisterForm } from "./useRegisterForm";
import { authService } from "../services/api";
import { checkEmailRegistered } from "../services/checkEmail";

const mockLogin = vi.fn();

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ login: mockLogin }),
}));

vi.mock("../services/api", () => ({
  authService: {
    register: vi.fn(),
  },
}));

vi.mock("../services/checkEmail", () => ({
  checkEmailRegistered: vi.fn(),
}));

type HookResult = ReturnType<typeof useRegisterForm>;

function completeValidForm(
  result: { current: HookResult },
  options: { acceptTerms?: boolean } = {},
) {
  const { acceptTerms = true } = options;

  act(() => {
    result.current.handleNameChange("Nadia");
  });

  act(() => {
    result.current.handleEmailChange("nadia@travelgo.com");
  });

  act(() => {
    result.current.handlePasswordChange("password123");
  });

  act(() => {
    result.current.handleConfirmChange("password123");
  });

  act(() => {
    result.current.handleBirthDateChange("1995-05-15");
  });

  if (acceptTerms) {
    act(() => {
      result.current.handleTermsChange(true);
    });
  }
}

beforeEach(() => {
  vi.clearAllMocks();
  (checkEmailRegistered as any).mockResolvedValue({ status: "available" });
});

describe("useRegisterForm", () => {
  it("no permite enviar si no se aceptaron los términos", async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useRegisterForm({ onSuccess }));

    completeValidForm(result, { acceptTerms: false });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any);
    });

    expect(result.current.registerErrors.terms).toBe(
      "Debés aceptar los términos y condiciones",
    );
    expect(authService.register).not.toHaveBeenCalled();
  });

  it("revalida la confirmación cuando cambia la contraseña después", () => {
    const { result } = renderHook(() =>
      useRegisterForm({ onSuccess: vi.fn() }),
    );

    act(() => {
      result.current.handlePasswordChange("abc123");
    });

    act(() => {
      result.current.handleConfirmChange("abc123");
    });

    act(() => {
      result.current.handlePasswordChange("otraPassword");
    });

    expect(result.current.registerErrors.confirmPassword).toBe(
      "Las contraseñas no coinciden",
    );
  });

  it("llama a onSuccess con el nombre cuando el registro es exitoso", async () => {
    (authService.register as any).mockResolvedValue({
      user: { id: 2, name: "Nadia", email: "nadia@travelgo.com" },
      token: "fake-token",
    });

    const onSuccess = vi.fn();
    const { result } = renderHook(() => useRegisterForm({ onSuccess }));

    completeValidForm(result);

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any);
    });

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith(
        "Nadia",
        "nadia@travelgo.com",
        "password123",
        "1995-05-15",
      );
      expect(mockLogin).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalledWith("Nadia");
    });
  });

  it("muestra el error del servidor cuando falla el registro", async () => {
    (authService.register as any).mockRejectedValue({
      response: { data: { message: "El email ya está en uso" } },
    });

    const { result } = renderHook(() =>
      useRegisterForm({ onSuccess: vi.fn() }),
    );

    completeValidForm(result);

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any);
    });

    await waitFor(() => {
      expect(result.current.serverError).toBe("El email ya está en uso");
    });
  });

  it("valida la nueva contraseña en vivo mientras se escribe", () => {
    const { result } = renderHook(() =>
      useRegisterForm({ onSuccess: vi.fn() }),
    );

    act(() => {
      result.current.handlePasswordChange("123");
    });

    expect(result.current.registerErrors.password).toBe("Mínimo 6 caracteres");

    act(() => {
      result.current.handlePasswordChange("password123");
    });

    expect(result.current.registerErrors.password).toBeUndefined();
  });

  it("resetErrors limpia el error del servidor y los errores de campos", async () => {
    (authService.register as any).mockRejectedValue({
      response: { data: { message: "El email ya está en uso" } },
    });

    const { result } = renderHook(() =>
      useRegisterForm({ onSuccess: vi.fn() }),
    );

    completeValidForm(result);

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any);
    });

    await waitFor(() => {
      expect(result.current.serverError).toBe("El email ya está en uso");
    });

    act(() => {
      result.current.handleNameChange("");
    });

    expect(result.current.registerErrors.name).toBe("El nombre es obligatorio");

    act(() => {
      result.current.resetErrors();
    });

    expect(result.current.serverError).toBe("");
    expect(result.current.registerErrors).toEqual({});
  });
});
