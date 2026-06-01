import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCustomerSchema, type CreateCustomerDTO } from "@john-doe/shared";
import { registerCustomer, ApiError } from "../lib/api";
import { maskCPF } from "../lib/masks";
import { useColors } from "../hooks/useColors";

type FormState = "idle" | "success" | "error";

const COLOR_HEX: Record<string, string> = {
  RED: "#ef4444",
  ORANGE: "#f97316",
  YELLOW: "#eab308",
  GREEN: "#22c55e",
  BLUE: "#3b82f6",
  INDIGO: "#6366f1",
  VIOLET: "#8b5cf6",
};

export function CustomerForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [serverError, setServerError] = useState<string>("");
  const { colors, loading: colorsLoading } = useColors();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateCustomerDTO>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: { observations: "" },
  });

  const selectedColor = watch("favoriteColor");

  const handleReset = () => {
    setServerError("");
    reset();
    setFormState("idle");
  };

  const onSubmit = async (data: CreateCustomerDTO) => {
    setServerError("");
    try {
      await registerCustomer(data);
      setFormState("success");
      reset();
    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(err.message);
      } else {
        setServerError("Erro inesperado. Tente novamente.");
      }
      setFormState("error");
    }
  };

  if (formState === "success") {
    return (
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h2>Cadastro realizado!</h2>
        <p>Suas informações foram salvas com sucesso.</p>
        <button type="button" className="success-back-btn" onClick={handleReset}>
          ← Novo cadastro
        </button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {serverError && (
        <div className="form-error-banner" role="alert">
          {serverError}
        </div>
      )}

      <div className="form-field">
        <label htmlFor="fullName">Nome completo</label>
        <input
          id="fullName"
          type="text"
          placeholder="João da Silva"
          aria-invalid={!!errors.fullName}
          {...register("fullName")}
        />
        {errors.fullName && (
          <span className="field-error">{errors.fullName.message}</span>
        )}
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="cpf">CPF</label>
          <input
            id="cpf"
            type="text"
            placeholder="000.000.000-00"
            maxLength={14}
            aria-invalid={!!errors.cpf}
            {...register("cpf")}
            onChange={(e) => {
              const masked = maskCPF(e.target.value);
              setValue("cpf", masked, { shouldValidate: true });
            }}
          />
          {errors.cpf && (
            <span className="field-error">{errors.cpf.message}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="joao@exemplo.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <span className="field-error">{errors.email.message}</span>
          )}
        </div>
      </div>

      <div className="form-field">
        <label>Cor preferida</label>
        {colorsLoading ? (
          <p className="loading-text">Carregando cores...</p>
        ) : (
          <div className="color-grid" role="group" aria-label="Cor preferida">
            {colors.map((color) => (
              <button
                key={color.value}
                type="button"
                className={`color-btn ${selectedColor === color.value ? "selected" : ""}`}
                style={
                  {
                    "--color": COLOR_HEX[color.value] || "#888",
                  } as React.CSSProperties
                }
                onClick={() =>
                  setValue("favoriteColor", color.value as CreateCustomerDTO["favoriteColor"], {
                    shouldValidate: true,
                  })
                }
                aria-pressed={selectedColor === color.value}
                title={color.label}
              >
                <span className="color-swatch" />
                <span className="color-label">{color.label}</span>
              </button>
            ))}
          </div>
        )}
        {errors.favoriteColor && (
          <span className="field-error">{errors.favoriteColor.message}</span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="observations">
          Observações <span className="optional">(opcional)</span>
        </label>
        <textarea
          id="observations"
          rows={3}
          placeholder="Alguma informação adicional..."
          maxLength={500}
          aria-invalid={!!errors.observations}
          {...register("observations")}
        />
        {errors.observations && (
          <span className="field-error">{errors.observations.message}</span>
        )}
      </div>

      <button
        type="submit"
        className="submit-btn"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? "Enviando..." : "Enviar cadastro"}
      </button>
    </form>
  );
}
