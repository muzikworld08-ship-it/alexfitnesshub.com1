import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  X, Mail, Lock, User, CheckCircle, AlertCircle, Eye, EyeOff, 
  ArrowRight, ShieldCheck, Dumbbell, Sparkles, KeyRound, HelpCircle, Check
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { loginEmail, signUpEmail, loginWithGoogle, loginWithApple, sendPasswordReset, setView } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [touched, setTouched] = useState<{
    email?: boolean;
    password?: boolean;
    name?: boolean;
  }>({});

  const handleSuccessfulAuth = () => {
    const attempted = localStorage.getItem("fit_attempted_view");
    if (attempted && attempted !== "home" && attempted !== "login" && attempted !== "signin" && attempted !== "signup" && attempted !== "register") {
      localStorage.removeItem("fit_attempted_view");
      setView(attempted);
    } else {
      setView("dashboard");
    }
    onClose();
  };

  // Real-time validation states
  const [validation, setValidation] = useState<{
    email?: string;
    password?: string;
    name?: string;
  }>({});

  const validateEmail = (val: string): string => {
    const clean = (val || "").trim();
    if (!clean) {
      return "Email address is required.";
    }
    if (!clean.includes("@")) {
      return "Email must include an '@' symbol (e.g. athlete@example.com).";
    }
    const parts = clean.split("@");
    if (!parts[0] || parts[0].length === 0) {
      return "Please enter a username before the '@' symbol.";
    }
    if (!parts[1] || !parts[1].includes(".")) {
      return "Please enter a valid domain extension (e.g. gmail.com).";
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(clean)) {
      return "Please enter a valid email address (e.g. athlete@example.com).";
    }
    return "";
  };

  const validatePassword = (val: string): string => {
    if (!val) {
      return "Password is required.";
    }
    if (val.length < 6) {
      return `Password does not meet requirements: must be at least 6 characters (${val.length}/6 entered).`;
    }
    return "";
  };

  const validateName = (val: string): string => {
    const clean = (val || "").trim();
    if (!clean) {
      return "Athlete name is required.";
    }
    if (clean.length < 2) {
      return "Athlete name must be at least 2 characters.";
    }
    return "";
  };

  const passHasMinLength = password.length >= 6;
  const passHasLetter = /[a-zA-Z]/.test(password);
  const passHasNumberOrSpecial = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  const getPasswordStrength = () => {
    if (!password) return { label: "None", color: "bg-slate-200", percent: 0, textColor: "text-slate-400" };
    let score = 0;
    if (passHasMinLength) score += 1;
    if (passHasLetter) score += 1;
    if (passHasNumberOrSpecial) score += 1;
    if (password.length >= 10) score += 1;

    if (score <= 1) return { label: "Weak (6+ chars required)", color: "bg-rose-500", percent: 30, textColor: "text-rose-600" };
    if (score === 2 || score === 3) return { label: "Good", color: "bg-amber-500", percent: 70, textColor: "text-amber-600" };
    return { label: "Strong", color: "bg-emerald-500", percent: 100, textColor: "text-emerald-600" };
  };

  const strength = getPasswordStrength();

  const handleEmailChange = (val: string) => {
    setEmail(val);
    setError("");
    setErrorCode(null);
    if (touched.email || val.length > 3) {
      setValidation(prev => ({ ...prev, email: validateEmail(val) }));
    }
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    setError("");
    setErrorCode(null);
    if (touched.password || val.length > 0) {
      setValidation(prev => ({ ...prev, password: validatePassword(val) }));
    }
  };

  const handleNameChange = (val: string) => {
    setName(val);
    setError("");
    setErrorCode(null);
    if (touched.name || val.length > 1) {
      setValidation(prev => ({ ...prev, name: validateName(val) }));
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      const originalStyle = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrorCode(null);
    setMessage("");

    setTouched({ email: true, password: true, name: true });

    const cleanEmail = email.trim();
    const cleanPass = password;
    const cleanName = name.trim();

    // Run final validations
    const emailErr = validateEmail(cleanEmail);
    const passwordErr = !isForgot ? validatePassword(cleanPass) : "";
    const nameErr = (isSignUp && !isForgot) ? validateName(cleanName) : "";

    setValidation({
      email: emailErr,
      password: passwordErr,
      name: nameErr
    });

    if (emailErr || passwordErr || nameErr) {
      setError(emailErr || passwordErr || nameErr || "Please verify your input before submitting.");
      return;
    }

    setSubmitting(true);

    try {
      if (isForgot) {
        await sendPasswordReset(cleanEmail);
        setMessage(`A password reset link has been dispatched to ${cleanEmail}. Please check your email.`);
      } else if (isSignUp) {
        await signUpEmail(cleanEmail, cleanPass, cleanName, rememberMe);
        handleSuccessfulAuth();
      } else {
        await loginEmail(cleanEmail, cleanPass, rememberMe);
        handleSuccessfulAuth();
      }
    } catch (err: any) {
      const code = err?.code || "";
      setErrorCode(code);
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setError("Incorrect credentials. The password you entered is incorrect, or no account exists with this email address.");
      } else if (code === "auth/user-not-found") {
        setError("No athlete account was found with this email address. Please check your spelling or register a new account.");
      } else if (code === "auth/invalid-email") {
        setError("The email address you entered is invalid. Please check your spelling.");
      } else if (code === "auth/email-already-in-use") {
        setError("An account with this email address is already registered. Please sign in with your password instead.");
      } else if (code === "auth/weak-password") {
        setError("Password does not meet security requirements. It must be at least 6 characters long.");
      } else {
        setError(err?.message || "An authentication error occurred. Please verify your credentials and try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    setError("");
    setErrorCode(null);
    setSubmitting(true);
    try {
      if (provider === "google") {
        await loginWithGoogle();
        handleSuccessfulAuth();
      } else {
        await loginWithApple();
        handleSuccessfulAuth();
      }
    } catch (err: any) {
      setError(err?.message || `${provider === "google" ? "Google" : "Apple"} Authentication failed.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm animate-fade-in"
      style={{ backgroundColor: "rgba(9, 13, 22, 0.6)" }}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-2xl flex flex-col min-h-[500px] max-h-[90vh]">
        
        {/* ATHLETE PORTAL SIGN-IN/REGISTRATION */}
        <div className="w-full p-6 sm:p-8 bg-white text-slate-900 flex flex-col justify-between overflow-y-auto max-h-[90vh] relative">
          
          {/* Close Button top-right */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition z-10 cursor-pointer border-0 bg-transparent"
            aria-label="Close portal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-[10px] font-mono uppercase tracking-wider text-slate-600 font-bold mb-2">
                <Sparkles className="w-3 h-3 text-[#C0392B]" />
                AlexFitnessHub
              </div>
              <h3 className="text-xl font-bold font-sans text-slate-900 mt-1 uppercase tracking-tight">
                {isForgot ? "Reset Password" : isSignUp ? "Create Account" : "Sign In"}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {isForgot 
                  ? "Enter your email to receive recovery instructions" 
                  : isSignUp ? "Build your personalized athlete profile" : "Enter your credentials to access your workouts"}
              </p>
            </div>

            {/* Error Notification Banner */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-xs text-red-700 space-y-2.5 font-bold shadow-xs"
                >
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-extrabold text-red-700 uppercase text-[11px] tracking-wide">Authentication Error</p>
                      <p className="leading-relaxed text-red-600 font-bold text-xs mt-0.5">{error}</p>
                    </div>
                  </div>

                  {(errorCode === "auth/email-already-in-use" || error.toLowerCase().includes("already registered") || error.toLowerCase().includes("already in use")) && (
                    <div className="pt-1 pl-6">
                      <button
                        type="button"
                        onClick={() => {
                          setIsSignUp(false);
                          setError("");
                          setErrorCode(null);
                          setValidation({});
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C0392B] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#A93226] transition shadow-xs cursor-pointer border-0"
                      >
                        <span>Sign In with this Email</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {(errorCode === "auth/wrong-password" || errorCode === "auth/invalid-credential" || error.toLowerCase().includes("incorrect credentials")) && !isSignUp && (
                    <div className="pt-1 pl-6 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgot(true);
                          setError("");
                          setErrorCode(null);
                          setValidation({});
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-rose-300 text-rose-700 hover:bg-rose-100 text-[10px] font-bold uppercase tracking-wider transition cursor-pointer"
                      >
                        <KeyRound className="w-3 h-3 text-[#C0392B]" />
                        <span>Forgot Password?</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSignUp(true);
                          setError("");
                          setErrorCode(null);
                          setValidation({});
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#C0392B] text-white text-[10px] font-bold uppercase tracking-wider hover:bg-[#A93226] transition cursor-pointer border-0"
                      >
                        <span>Create Account</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {message && (
                <motion.div 
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Primary Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {isSignUp && !isForgot && (
                <div>
                  <label htmlFor="auth-name-input" className="block text-[10px] font-mono font-black text-slate-600 mb-1 uppercase">
                    YOUR ATHLETE NAME <span className="text-[#C0392B]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      id="auth-name-input"
                      type="text"
                      required
                      placeholder="Alex Mercer"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      onBlur={() => {
                        setTouched(prev => ({ ...prev, name: true }));
                        setValidation(prev => ({ ...prev, name: validateName(name) }));
                      }}
                      className={`w-full pl-10 pr-10 py-2 text-sm rounded-lg bg-white border text-slate-950 placeholder:text-slate-400 focus:outline-none font-semibold transition ${
                        touched.name && !validation.name && name.trim().length >= 2
                          ? "border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-emerald-50/20"
                          : touched.name && validation.name
                          ? "border-rose-500 focus:ring-2 focus:ring-rose-200 bg-rose-50/20"
                          : "border-slate-200 focus:ring-2 focus:ring-rose-100 focus:border-[#C0392B]"
                      }`}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      {touched.name && !validation.name && name.trim().length >= 2 && (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      )}
                      {touched.name && validation.name && (
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                      )}
                    </div>
                  </div>
                  {touched.name && validation.name && (
                    <p id="name-error" className="mt-1 text-xs text-red-600 font-bold flex items-center gap-1 animate-fade-in" aria-live="polite">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-600" />
                      {validation.name}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="auth-email-input" className="block text-[10px] font-mono font-black text-slate-600 mb-1 uppercase">
                  EMAIL ADDRESS <span className="text-[#C0392B]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    id="auth-email-input"
                    type="email"
                    required
                    placeholder="athlete@domain.com"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    onBlur={() => {
                      setTouched(prev => ({ ...prev, email: true }));
                      setValidation(prev => ({ ...prev, email: validateEmail(email) }));
                    }}
                    className={`w-full pl-10 pr-10 py-2 text-sm rounded-lg bg-white border text-slate-950 placeholder:text-slate-400 focus:outline-none font-semibold transition ${
                      touched.email && !validation.email && email.trim()
                        ? "border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-emerald-50/20"
                        : (touched.email && validation.email) || (errorCode === "auth/invalid-email" || errorCode === "auth/user-not-found")
                        ? "border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/20"
                        : "border-slate-200 focus:ring-2 focus:ring-rose-100 focus:border-[#C0392B]"
                    }`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {touched.email && !validation.email && email.trim() && (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    )}
                    {((touched.email && validation.email) || errorCode === "auth/invalid-email") && (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                </div>
                {touched.email && validation.email && (
                  <p id="email-error" className="mt-1 text-xs text-red-600 font-bold flex items-center gap-1 animate-fade-in" aria-live="polite">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-600" />
                    {validation.email}
                  </p>
                )}
              </div>

              {!isForgot && (
                <div>
                  <div className="flex justify-between mb-1">
                    <label htmlFor="auth-password-input" className="block text-[10px] font-mono font-black text-slate-600 uppercase">
                      PASSWORD <span className="text-[#C0392B]">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => { setIsForgot(true); setError(""); setErrorCode(null); setMessage(""); setValidation({}); }}
                      className="text-[10px] text-[#C0392B] hover:underline font-bold bg-transparent border-0 cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      id="auth-password-input"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      onBlur={() => {
                        setTouched(prev => ({ ...prev, password: true }));
                        setValidation(prev => ({ ...prev, password: validatePassword(password) }));
                      }}
                      className={`w-full pl-10 pr-10 py-2 text-sm rounded-lg bg-white border text-slate-950 placeholder:text-slate-400 focus:outline-none font-semibold transition ${
                        touched.password && !validation.password && password.length >= 6
                          ? "border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-emerald-50/20"
                          : (touched.password && validation.password) || (errorCode === "auth/wrong-password" || errorCode === "auth/invalid-credential")
                          ? "border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/20"
                          : "border-slate-200 focus:ring-2 focus:ring-rose-100 focus:border-[#C0392B]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer bg-transparent border-0"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {touched.password && validation.password && (
                    <p id="password-error" className="mt-1 text-xs text-red-600 font-bold flex items-center gap-1 animate-fade-in" aria-live="polite">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-600" />
                      {validation.password}
                    </p>
                  )}

                  {/* Real-time Checklist for Sign Up */}
                  {isSignUp && password.length > 0 && (
                    <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                      <div className="flex items-center justify-between text-[9px] font-mono font-bold text-slate-600">
                        <span>STRENGTH</span>
                        <span className={strength.textColor}>{strength.label}</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${strength.color}`} 
                          style={{ width: `${strength.percent}%` }}
                        />
                      </div>
                      <div className="pt-0.5 space-y-0.5 text-[10px]">
                        <div className={`flex items-center gap-1 ${passHasMinLength ? "text-emerald-700 font-bold" : "text-slate-500"}`}>
                          <Check className={`w-3 h-3 ${passHasMinLength ? "text-emerald-600" : "text-slate-300"}`} />
                          <span>6+ characters ({password.length}/6)</span>
                        </div>
                        <div className={`flex items-center gap-1 ${passHasLetter ? "text-emerald-700 font-bold" : "text-slate-500"}`}>
                          <Check className={`w-3 h-3 ${passHasLetter ? "text-emerald-600" : "text-slate-300"}`} />
                          <span>Contains letter</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {!isSignUp && password.length > 0 && password.length < 6 && (
                    <p className="mt-1 text-[10px] text-amber-600 font-medium flex items-center gap-1">
                      <HelpCircle className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>Passwords are at least 6 characters</span>
                    </p>
                  )}
                </div>
              )}
              
              {!isForgot && (
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#C0392B] border-slate-300 rounded focus:ring-[#C0392B] accent-[#C0392B] cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 text-[10px] font-mono font-bold text-slate-600 cursor-pointer uppercase select-none">
                    Remember Me
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-lg text-xs font-black text-white uppercase tracking-wider bg-[#C0392B] hover:bg-[#A82E22] transition-colors duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer border-0 disabled:opacity-60"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Processing...</span>
                  </span>
                ) : isForgot ? "Recover Account" : isSignUp ? "Build My Profile" : "Accredited Sign In"}
              </button>
            </form>

            {/* Social Authentication */}
            {!isForgot && (
              <div className="space-y-2.5">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-full border-t border-slate-200" />
                  <span className="relative px-3 bg-white text-[9px] text-slate-400 font-mono tracking-wider uppercase font-bold">OR ACCELERATE WITH</span>
                </div>

                <button
                  id="auth-google-signin-btn"
                  onClick={() => handleOAuth("google")}
                  type="button"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-bold transition cursor-pointer shadow-xs disabled:opacity-50"
                  aria-label="Continue with Google"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  id="auth-apple-signin-btn"
                  onClick={() => handleOAuth("apple")}
                  type="button"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 border border-slate-900 bg-black hover:bg-slate-900 rounded-lg text-xs font-bold text-white transition cursor-pointer shadow-xs disabled:opacity-50"
                  aria-label="Continue with Apple"
                >
                  <svg className="w-4 h-4 shrink-0 fill-current text-white mb-0.5" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.81 1.44-.61.71-1.15 1.86-.99 2.97 1.08.08 2.16-.57 2.81-1.37z" />
                  </svg>
                  <span>Continue with Apple</span>
                </button>
              </div>
            )}
          </div>

          {/* Toggle button */}
          <div className="mt-6 text-center border-t border-slate-100 pt-4">
            {isForgot ? (
              <button
                type="button"
                onClick={() => { setIsForgot(false); setError(""); setErrorCode(null); setMessage(""); setValidation({}); }}
                className="text-xs text-[#C0392B] hover:underline font-bold bg-transparent border-0 cursor-pointer"
              >
                Back to Sign In
              </button>
            ) : (
              <p className="text-xs text-slate-500">
                {isSignUp ? "Already have a profile?" : "New to AlexFitnessHub?"}{" "}
                <button
                  type="button"
                  onClick={() => { setIsSignUp(!isSignUp); setError(""); setErrorCode(null); setMessage(""); setValidation({}); }}
                  className="font-bold text-[#C0392B] hover:underline cursor-pointer bg-transparent border-0"
                >
                  {isSignUp ? "Sign In Instead" : "Create Account Now"}
                </button>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
