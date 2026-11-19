import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import { AuthLayout } from '../components/AuthLayout';
import { Button } from '../../../components/ui/Button';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isSubmitting, clearError } = useAuth();

  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    companyName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = (): boolean => {
    const errors: {
      companyName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!companyName.trim()) {
      errors.companyName = 'Company name is required';
    }

    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;

    const success = await register({
      companyName,
      email,
      password,
    });

    if (success) {
      toast.success('Account created successfully! Welcome to QuoteWise.');
      navigate('/rfqs');
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start managing RFQs and supplier quotes efficiently"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Company Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Building2 className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="e.g. Apex Industrial Solutions"
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
                if (validationErrors.companyName) {
                  setValidationErrors((prev) => ({ ...prev, companyName: undefined }));
                }
              }}
              className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors ${
                validationErrors.companyName
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-300'
                  : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'
              }`}
            />
          </div>
          {validationErrors.companyName && (
            <p className="mt-1 text-xs text-red-600">{validationErrors.companyName}</p>
          )}
        </div>

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
                if (validationErrors.email) {
                  setValidationErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors ${
                validationErrors.email
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-300'
                  : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'
              }`}
            />
          </div>
          {validationErrors.email && (
            <p className="mt-1 text-xs text-red-600">{validationErrors.email}</p>
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
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (validationErrors.password) {
                  setValidationErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              className={`w-full pl-9 pr-10 py-2 rounded-lg border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors ${
                validationErrors.password
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-300'
                  : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {validationErrors.password && (
            <p className="mt-1 text-xs text-red-600">{validationErrors.password}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (validationErrors.confirmPassword) {
                  setValidationErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }
              }}
              className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors ${
                validationErrors.confirmPassword
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-300'
                  : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'
              }`}
            />
          </div>
          {validationErrors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600">{validationErrors.confirmPassword}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-2.5 font-semibold text-sm mt-4"
        >
          Create account <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
