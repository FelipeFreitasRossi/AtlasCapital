// frontend/src/pages/Auth/LoginPage.tsx

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, LogIn } from "lucide-react";
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const state = location.state as { successMessage?: string } | null;
    if (state?.successMessage) {
      setSuccessMessage(state.successMessage);
      window.history.replaceState({}, document.title);
    }
    // Verifica se já está autenticado e redireciona
    const token = localStorage.getItem('atlascapital:token');
    const session = localStorage.getItem('atlascapital:session');
    console.log('[LoginPage] Token:', token, 'Sessão:', session);
  }, [location]);

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
    setSuccessMessage(null);
    console.log('[LoginPage] Tentando login com:', values.email);
    try {
      await login(values);
      console.log('[LoginPage] Login bem-sucedido, redirecionando para /');
      const from = (location.state as { from?: string } | null)?.from ?? "/";
      navigate(from, { replace: true });
    } catch (error) {
      console.error('[LoginPage] Erro no login:', error);
      setFormError(error instanceof AuthError ? error.message : "Não foi possível entrar. Tente novamente.");
    }
  }

  return (
    <AuthLayout
      title="Acesse sua conta"
      subtitle="Entre para gerenciar sua carteira de investimentos com segurança."
      footer={
        <span>
          Ainda não tem uma conta?{" "}
          <Link className={formStyles.link} to="/register">
            Cadastre-se
          </Link>
        </span>
      }
    >
      <form className={formStyles.form} onSubmit={handleSubmit(onValid)} noValidate>
        {successMessage && <div className={formStyles.successMessage}>{successMessage}</div>}
        {formError && <div className={formStyles.formError}>{formError}</div>}

        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="email">
            E-mail
          </label>
          <div className={formStyles.inputWrapper}>
            <span className={formStyles.inputIcon}>
              <Mail size={18} />
            </span>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`${formStyles.input} ${errors.email ? formStyles.inputError : ""}`}
              placeholder="voce@email.com"
              {...register("email")}
            />
          </div>
          {errors.email && <span className={formStyles.errorMessage}>{errors.email.message}</span>}
        </div>

        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="password">
            Senha
          </label>
          <div className={formStyles.inputWrapper}>
            <span className={formStyles.inputIcon}>
              <Lock size={18} />
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className={`${formStyles.input} ${errors.password ? formStyles.inputError : ""}`}
              placeholder="Sua senha"
              {...register("password")}
            />
            <button
              type="button"
              className={formStyles.toggleVisibility}
              onClick={() => setShowPassword((show) => !show)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <span className={formStyles.errorMessage}>{errors.password.message}</span>}
        </div>

        <button type="submit" className={formStyles.submitButton} disabled={isSubmitting}>
          <LogIn size={18} />
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </AuthLayout>
  );
}