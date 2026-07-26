import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { AuthLayout } from "./AuthLayout";
import formStyles from "./AuthForm.module.css";
import { loginSchema } from "./authSchemas";
import type { LoginFormValues } from "./authSchemas";
import { useAuth } from "../../context/AuthContext";
import { AuthError } from "../../types/auth";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onValid(values: LoginFormValues) {
    setFormError(null);
    try {
      await login(values);
      const from = (location.state as { from?: string } | null)?.from ?? "/";
      navigate(from, { replace: true });
    } catch (error) {
      setFormError(error instanceof AuthError ? error.message : "Não foi possível entrar. Tente novamente.");
    }
  }

  return (
    <AuthLayout
      title="Bem-vindo de volta"
      subtitle="Entre com sua conta para acessar sua carteira de investimentos."
      footer={
        <span>
          Ainda não tem conta?{" "}
          <Link className={formStyles.link} to="/register">
            Criar conta
          </Link>
        </span>
      }
    >
      <form className={formStyles.form} onSubmit={handleSubmit(onValid)} noValidate>
        {formError && <div className={formStyles.formError}>{formError}</div>}

        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="email">
            E-mail
          </label>
          <div className={formStyles.inputWrapper}>
            <span className={formStyles.inputIcon}>
              <Mail size={16} />
            </span>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`${formStyles.input} ${errors.email ? formStyles.inputError : ""}`}
              placeholder="voce@email.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <span id="email-error" className={formStyles.errorMessage}>
              {errors.email.message}
            </span>
          )}
        </div>

        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="password">
            Senha
          </label>
          <div className={formStyles.inputWrapper}>
            <span className={formStyles.inputIcon}>
              <Lock size={16} />
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className={`${formStyles.input} ${errors.password ? formStyles.inputError : ""}`}
              placeholder="Sua senha"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
            />
            <button
              type="button"
              className={formStyles.toggleVisibility}
              onClick={() => setShowPassword((show) => !show)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <span id="password-error" className={formStyles.errorMessage}>
              {errors.password.message}
            </span>
          )}
        </div>

        <button type="submit" className={formStyles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </AuthLayout>
  );
}
