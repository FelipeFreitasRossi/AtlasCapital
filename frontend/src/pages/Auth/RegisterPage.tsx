// Tela de cadastro. Ao criar a conta com sucesso, o usuário já entra
// autenticado (o authService já grava a sessão) e é levado direto
// para o app — que, por sua vez, vai mostrar o Onboarding, já que é a
// primeira vez desse usuário.

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  async function onValid(values: RegisterFormValues) {
    setFormError(null);
    try {
      await registerUser(values);
      navigate("/", { replace: true });
    } catch (error) {
      setFormError(
        error instanceof AuthError ? error.message : "Não foi possível criar a conta. Tente novamente.",
      );
    }
  }

  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Leva menos de um minuto para começar a organizar sua carteira."
      footer={
        <span>
          Já tem conta?{" "}
          <Link className={formStyles.link} to="/login">
            Entrar
          </Link>
        </span>
      }
    >
      <form className={formStyles.form} onSubmit={handleSubmit(onValid)} noValidate>
        {formError && <div className={formStyles.formError}>{formError}</div>}

        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="name">
            Nome
          </label>
          <div className={formStyles.inputWrapper}>
            <span className={formStyles.inputIcon}>
              <User size={16} />
            </span>
            <input
              id="name"
              autoComplete="name"
              className={`${formStyles.input} ${errors.name ? formStyles.inputError : ""}`}
              placeholder="Seu nome completo"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              {...register("name")}
            />
          </div>
          {errors.name && (
            <span id="name-error" className={formStyles.errorMessage}>
              {errors.name.message}
            </span>
          )}
        </div>

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
              autoComplete="new-password"
              className={`${formStyles.input} ${errors.password ? formStyles.inputError : ""}`}
              placeholder="Mínimo de 6 caracteres"
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

        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="confirmPassword">
            Confirmar senha
          </label>
          <div className={formStyles.inputWrapper}>
            <span className={formStyles.inputIcon}>
              <Lock size={16} />
            </span>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              className={`${formStyles.input} ${errors.confirmPassword ? formStyles.inputError : ""}`}
              placeholder="Repita a senha"
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
              {...register("confirmPassword")}
            />
          </div>
          {errors.confirmPassword && (
            <span id="confirmPassword-error" className={formStyles.errorMessage}>
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <button type="submit" className={formStyles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? "Criando conta..." : "Criar conta"}
        </button>
      </form>
    </AuthLayout>
  );
}
