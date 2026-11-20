import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import { AuthLayout } from "../components/AuthLayout";
import { Button } from "../../../components/ui/Button";
import { loginSchema, LoginFormValues } from "../validators/auth.validator";
import { validateSyncWithYup } from "../../../utils/validation.utils";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isSubmitting, clearError } = useAuth();

  const redirectPath =
    (location.state as { from?: { pathname: string } } | null)?.from
      ?.pathname || "/rfqs";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof LoginFormValues, string>>
  >({});

  const validate = (): boolean => {
    const result = validateSyncWithYup(loginSchema, { email, password });
    setValidationErrors(result.errors);
    return result.isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;

    const success = await login({ email, password });
    if (success) {
      toast.success("Signed in successfully!");
      navigate(redirectPath, { replace: true });
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your QuoteWise procurement portal"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (validationErrors.email)
                  setValidationErrors((prev) => ({
                    ...prev,
                    email: undefined,
                  }));
              }}
              className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors ${
                validationErrors.email
                  ? "border-red-400 focus:border-red-500 focus:ring-red-300"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
            />
          </div>
          {validationErrors.email && (
            <p className="mt-1 text-xs text-red-600">
              {validationErrors.email}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (validationErrors.password)
                  setValidationErrors((prev) => ({
                    ...prev,
                    password: undefined,
                  }));
              }}
              className={`w-full pl-9 pr-10 py-2 rounded-lg border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors ${
                validationErrors.password
                  ? "border-red-400 focus:border-red-500 focus:ring-red-300"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {validationErrors.password && (
            <p className="mt-1 text-xs text-red-600">
              {validationErrors.password}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-2.5 font-semibold text-sm"
        >
          Sign in <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Sign up
        </Link>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
