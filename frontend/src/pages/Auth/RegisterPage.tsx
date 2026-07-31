// frontend/src/pages/Auth/RegisterPage.tsx

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User, UserPlus } from "lucide-react";
import { AuthLayout } from "./AuthLayout";
import formStyles from "./AuthForm.module.css";
import { registerSchema } from "./authSchemas";
import type { RegisterFormValues } from "./authSchemas";
import { useAuth } from "../../context/AuthContext";
import { AuthError } from "../../types/auth";

export function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  async function onValid(values: RegisterFormValues) {
    setFormError(null);
    setIsSubmitting(true);
    console.log('[RegisterPage] Tentando registrar:', values.email);
    
    try {
      const user = await registerUser(values);
      console.log('[RegisterPage] Registro bem-sucedido:', user);
      
      // O token já foi salvo no authService.register
      // Redireciona para o Dashboard
      navigate("/", { replace: true });
    } catch (error) {
      console.error('[RegisterPage] Erro no registro:', error);
      setFormError(
        error instanceof AuthError ? error.message : "Não foi possível criar a conta. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Preencha os dados abaixo e comece a organizar sua carteira."
      footer={
        <span>
          Já tem uma conta?{" "}
          <Link className={formStyles.link} to="/login">
            Faça login
          </Link>
        </span>
      }
    >
      <form className={formStyles.form} onSubmit={handleSubmit(onValid)} noValidate>
        {formError && <div className={formStyles.formError}>{formError}</div>}

        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="name">
            Nome completo
          </label>
          <div className={formStyles.inputWrapper}>
            <span className={formStyles.inputIcon}>
              <User size={18} />
            </span>
            <input
              id="name"
              autoComplete="name"
              className={`${formStyles.input} ${errors.name ? formStyles.inputError : ""}`}
              placeholder="Seu nome completo"
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
          </div>
          {errors.name && (
            <span className={formStyles.errorMessage}>{errors.name.message}</span>
          )}
        </div>

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
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <span className={formStyles.errorMessage}>{errors.email.message}</span>
          )}
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
              autoComplete="new-password"
              className={`${formStyles.input} ${errors.password ? formStyles.inputError : ""}`}
              placeholder="Mínimo 6 caracteres"
              aria-invalid={Boolean(errors.password)}
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
          {errors.password && (
            <span className={formStyles.errorMessage}>{errors.password.message}</span>
          )}
        </div>

        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="confirmPassword">
            Confirmar senha
          </label>
          <div className={formStyles.inputWrapper}>
            <span className={formStyles.inputIcon}>
              <Lock size={18} />
            </span>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              className={`${formStyles.input} ${errors.confirmPassword ? formStyles.inputError : ""}`}
              placeholder="Repita a senha"
              aria-invalid={Boolean(errors.confirmPassword)}
              {...register("confirmPassword")}
            />
          </div>
          {errors.confirmPassword && (
            <span className={formStyles.errorMessage}>{errors.confirmPassword.message}</span>
          )}
        </div>

        <button type="submit" className={formStyles.submitButton} disabled={isSubmitting}>
          <UserPlus size={18} />
          {isSubmitting ? "Criando conta..." : "Criar conta"}
        </button>
      </form>
    </AuthLayout>
  );
}