import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { 
  Mail, Lock, User, CheckCircle, AlertCircle, Eye, EyeOff, 
  ArrowRight, ShieldCheck, Dumbbell, Sparkles, KeyRound, HelpCircle, Check, X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AuthViewProps {
  initialMode?: "signin" | "signup" | "forgot";
  onSuccess?: () => void;
}

export default function AuthView({ initialMode = "signin", onSuccess }: AuthViewProps) {
  const { 
    user, 
    loginEmail, 
    signUpEmail, 
    loginWithGoogle, 
    loginWithApple, 
    sendPasswordReset, 
    setView,
    currentView 
  } = useApp();

  const [isSignUp, setIsSignUp] = useState<boolean>(
    initialMode === "signup" || currentView === "signup" || currentView === "register"
  );
  const [isForgot, setIsForgot] = useState<boolean>(initialMode === "forgot");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Field-specific touched state for natural progressive validation
  const [touched, setTouched] = useState<{
    email?: boolean;
    password?: boolean;
    name?: boolean;
  }>({});

  // Sync mode if currentView changes externally
  useEffect(() => {
    if (currentView === "signup" || currentView === "register") {
      setIsSignUp(true);
      setIsForgot(false);
    } else if (currentView === "login" || currentView === "signin") {
      setIsSignUp(false);
      setIsForgot(false);
    }
  }, [currentView]);

  // If user is already authenticated, redirect to dashboard or attempted destination
  useEffect(() => {
    if (user) {
      const attempted = localStorage.getItem("fit_attempted_view");
      if (attempted && attempted !== "home" && attempted !== "login" && attempted !== "signin" && attempted !== "signup" && attempted !== "register") {
        localStorage.removeItem("fit_attempted_view");
        setView(attempted);
      } else {
        setView("dashboard");
      }
    }
  }, [user, setView]);

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
      return "Email must include an '@' sign (e.g. athlete@example.com).";
    }
    const parts = clean.split("@");
    if (!parts[0] || parts[0].length === 0) {
      return "Please enter a username before the '@' sign.";
    }
    if (!parts[1] || !parts[1].includes(".")) {
      return "Please enter a valid domain with an extension (e.g. gmail.com).";
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

  // Live password requirements evaluation for sign-up guidance
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

  const handleSuccessfulAuth = () => {
    if (onSuccess) {
      onSuccess();
    }
    const attempted = localStorage.getItem("fit_attempted_view");
    if (attempted && attempted !== "home" && attempted !== "login" && attempted !== "signin" && attempted !== "signup" && attempted !== "register") {
      localStorage.removeItem("fit_attempted_view");
      setView(attempted);
    } else {
      setView("dashboard");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrorCode(null);
    setMessage("");

    setTouched({ email: true, password: true, name: true });

    const cleanEmail = email.trim();
    const cleanPass = password;
    const cleanName = name.trim();

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
        setMessage(`A password reset link has been dispatched to ${cleanEmail}. Please check your inbox and spam folder.`);
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
        setError("No athlete account was found with this email address. Please double-check your spelling or create a new account.");
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
      } else {
        await loginWithApple();
      }
      handleSuccessfulAuth();
    } catch (err: any) {
      setError(err?.message || `${provider === "google" ? "Google" : "Apple"} sign in was cancelled or encountered an error.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="w-full max-w-md">
        
        {/* Card Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* Top Brand Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 text-white text-center relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
              <Dumbbell className="w-36 h-36" />
            </div>
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-mono font-bold tracking-wider uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              AlexFitnessHub
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-white uppercase">
              {isForgot 
                ? "Reset Password" 
                : isSignUp 
                ? "Create Account" 
                : "Sign In"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
              {isForgot 
                ? "Enter your email to receive recovery instructions" 
                : isSignUp 
                ? "Join the elite training ecosystem today" 
                : "Welcome back! Enter your credentials to continue"}
            </p>

            {/* Toggle Tabs between Sign In and Create Account */}
            {!isForgot && (
              <div className="mt-6 grid grid-cols-2 p-1 bg-slate-950/60 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setError("");
                    setErrorCode(null);
                    setMessage("");
                    setValidation({});
                  }}
                  className={`py-2 text-xs font-bold font-sans uppercase rounded-lg transition-all cursor-pointer ${
                    !isSignUp 
                      ? "bg-[#C0392B] text-white shadow-md" 
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setError("");
                    setErrorCode(null);
                    setMessage("");
                    setValidation({});
                  }}
                  className={`py-2 text-xs font-bold font-sans uppercase rounded-lg transition-all cursor-pointer ${
                    isSignUp 
                      ? "bg-[#C0392B] text-white shadow-md" 
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Notification Messages with Contextual Help */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-xs text-rose-900 space-y-3 font-semibold shadow-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold text-rose-950">Authentication Notice</p>
                      <p className="leading-relaxed text-rose-800">{error}</p>
                    </div>
                  </div>

                  {/* Contextual Action: Email already exists -> Quick switch to Sign In */}
                  {(errorCode === "auth/email-already-in-use" || error.toLowerCase().includes("already in use") || error.toLowerCase().includes("already registered")) && (
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

                  {/* Contextual Action: Wrong Password / Credential -> Direct Forgot Password / Create Account CTA */}
                  {(errorCode === "auth/wrong-password" || errorCode === "auth/invalid-credential" || error.toLowerCase().includes("incorrect credentials") || error.toLowerCase().includes("incorrect password")) && !isSignUp && (
                    <div className="pt-1 pl-6 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgot(true);
                          setError("");
                          setErrorCode(null);
                          setValidation({});
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-rose-300 text-rose-700 hover:bg-rose-100 text-[11px] font-bold uppercase tracking-wider transition cursor-pointer"
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
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#C0392B] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#A93226] transition cursor-pointer border-0"
                      >
                        <span>Create Account</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Contextual Action: User not found -> Direct Create Account CTA */}
                  {(errorCode === "auth/user-not-found" || error.toLowerCase().includes("no athlete account") || error.toLowerCase().includes("no account found")) && !isSignUp && (
                    <div className="pt-1 pl-6">
                      <button
                        type="button"
                        onClick={() => {
                          setIsSignUp(true);
                          setError("");
                          setErrorCode(null);
                          setValidation({});
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C0392B] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#A93226] transition shadow-xs cursor-pointer border-0"
                      >
                        <span>Create Account with {email || "this email"}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {message && (
                <motion.div 
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5 font-semibold shadow-xs"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-emerald-950">Email Dispatched</p>
                    <p className="leading-relaxed text-emerald-800">{message}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Social OAuth Providers */}
            {!isForgot && (
              <div className="space-y-3">
                {/* Google Button */}
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleOAuth("google")}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-sans font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow cursor-pointer disabled:opacity-60"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Apple Button */}
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleOAuth("apple")}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-black hover:bg-slate-900 text-white font-sans font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow cursor-pointer disabled:opacity-60"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.65-.8 1.1-1.92.98-3.04-1 .04-2.16.67-2.84 1.47-.58.67-1.1 1.77-.96 2.87 1.11.08 2.19-.57 2.82-1.3" />
                  </svg>
                  <span>Continue with Apple</span>
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-3 text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                    OR USE EMAIL
                  </span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>
              </div>
            )}

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              
              {/* Full Name (Sign Up only) */}
              {isSignUp && !isForgot && (
                <div>
                  <label htmlFor="auth-view-name" className="block text-[10px] font-mono font-black text-slate-600 mb-1 uppercase">
                    ATHLETE FULL NAME <span className="text-[#C0392B]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      id="auth-view-name"
                      type="text"
                      required
                      placeholder="e.g. Alex Mercer"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      onBlur={() => {
                        setTouched(prev => ({ ...prev, name: true }));
                        setValidation(prev => ({ ...prev, name: validateName(name) }));
                      }}
                      className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-white border text-slate-900 placeholder:text-slate-400 focus:outline-none font-semibold transition ${
                        touched.name && !validation.name && name.trim().length >= 2
                          ? "border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-emerald-50/20"
                          : touched.name && validation.name
                          ? "border-rose-500 focus:ring-2 focus:ring-rose-200 bg-rose-50/20"
                          : "border-slate-200 focus:border-[#C0392B] focus:ring-2 focus:ring-rose-100"
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
                    <p className="mt-1.5 text-[11px] text-rose-600 font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                      <span>{validation.name}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Email Address */}
              <div>
                <label htmlFor="auth-view-email" className="block text-[10px] font-mono font-black text-slate-600 mb-1 uppercase">
                  EMAIL ADDRESS <span className="text-[#C0392B]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    id="auth-view-email"
                    type="email"
                    required
                    placeholder="athlete@domain.com"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    onBlur={() => {
                      setTouched(prev => ({ ...prev, email: true }));
                      setValidation(prev => ({ ...prev, email: validateEmail(email) }));
                    }}
                    className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-white border text-slate-900 placeholder:text-slate-400 focus:outline-none font-semibold transition ${
                      touched.email && !validation.email && email.trim()
                        ? "border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-emerald-50/20"
                        : (touched.email && validation.email) || (errorCode === "auth/invalid-email" || errorCode === "auth/user-not-found")
                        ? "border-rose-500 focus:ring-2 focus:ring-rose-200 bg-rose-50/20"
                        : "border-slate-200 focus:border-[#C0392B] focus:ring-2 focus:ring-rose-100"
                    }`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {touched.email && !validation.email && email.trim() && (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    )}
                    {((touched.email && validation.email) || errorCode === "auth/invalid-email") && (
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                    )}
                  </div>
                </div>
                {touched.email && validation.email && (
                  <p className="mt-1.5 text-[11px] text-rose-600 font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                    <span>{validation.email}</span>
                  </p>
                )}
              </div>

              {/* Password */}
              {!isForgot && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="auth-view-password" className="block text-[10px] font-mono font-black text-slate-600 uppercase">
                      PASSWORD <span className="text-[#C0392B]">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgot(true);
                        setError("");
                        setErrorCode(null);
                        setMessage("");
                        setValidation({});
                      }}
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
                      id="auth-view-password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      onBlur={() => {
                        setTouched(prev => ({ ...prev, password: true }));
                        setValidation(prev => ({ ...prev, password: validatePassword(password) }));
                      }}
                      className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-white border text-slate-900 placeholder:text-slate-400 focus:outline-none font-semibold transition ${
                        touched.password && !validation.password && password.length >= 6
                          ? "border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-emerald-50/20"
                          : (touched.password && validation.password) || (errorCode === "auth/wrong-password" || errorCode === "auth/invalid-credential")
                          ? "border-rose-500 focus:ring-2 focus:ring-rose-200 bg-rose-50/20"
                          : "border-slate-200 focus:border-[#C0392B] focus:ring-2 focus:ring-rose-100"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer bg-transparent border-0"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Inline Error Message for Password */}
                  {touched.password && validation.password && (
                    <p className="mt-1.5 text-[11px] text-rose-600 font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                      <span>{validation.password}</span>
                    </p>
                  )}

                  {/* Live Password Requirement Checklist & Strength (On Sign Up) */}
                  {isSignUp && password.length > 0 && (
                    <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-600">
                        <span>PASSWORD STRENGTH</span>
                        <span className={strength.textColor}>{strength.label}</span>
                      </div>
                      
                      {/* Strength Progress Bar */}
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${strength.color}`} 
                          style={{ width: `${strength.percent}%` }}
                        />
                      </div>

                      {/* Requirement Indicators */}
                      <div className="pt-1 grid grid-cols-1 gap-1 text-[11px]">
                        <div className={`flex items-center gap-1.5 ${passHasMinLength ? "text-emerald-700 font-bold" : "text-slate-500"}`}>
                          {passHasMinLength ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          )}
                          <span>At least 6 characters (current: {password.length})</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${passHasLetter ? "text-emerald-700 font-bold" : "text-slate-500"}`}>
                          {passHasLetter ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <span>Contains at least one letter</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${passHasNumberOrSpecial ? "text-emerald-700 font-bold" : "text-slate-500"}`}>
                          {passHasNumberOrSpecial ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <span>Contains a number or special character (recommended)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sign In Minimum Length Helper */}
                  {!isSignUp && password.length > 0 && password.length < 6 && (
                    <p className="mt-1 text-[10px] text-amber-600 font-medium flex items-center gap-1">
                      <HelpCircle className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>Passwords are at least 6 characters long</span>
                    </p>
                  )}
                </div>
              )}

              {/* Remember Me Checkbox */}
              {!isForgot && (
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-[#C0392B] border-slate-300 rounded focus:ring-[#C0392B] accent-[#C0392B] cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 font-medium">Keep me signed in</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Encrypted
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 py-3.5 px-4 bg-[#C0392B] hover:bg-[#A93226] text-white font-sans font-black text-xs uppercase tracking-widest rounded-xl transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 border-0"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>VERIFYING CREDENTIALS...</span>
                  </span>
                ) : (
                  <>
                    <span>{isForgot ? "SEND RECOVERY LINK" : isSignUp ? "CREATE ATHLETE ACCOUNT" : "SIGN IN TO DASHBOARD"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Navigation Links */}
            <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500 font-medium space-y-2">
              {isForgot ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsForgot(false);
                    setError("");
                    setErrorCode(null);
                    setMessage("");
                    setValidation({});
                  }}
                  className="text-xs text-[#C0392B] hover:underline font-bold bg-transparent border-0 cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              ) : (
                <p>
                  {isSignUp ? "Already have an athlete account?" : "New to AlexFitnessHub?"}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError("");
                      setErrorCode(null);
                      setMessage("");
                      setValidation({});
                    }}
                    className="font-bold text-[#C0392B] hover:underline cursor-pointer bg-transparent border-0 ml-1"
                  >
                    {isSignUp ? "Sign In Instead" : "Create Account Now"}
                  </button>
                </p>
              )}

              <div>
                <button
                  type="button"
                  onClick={() => setView("home")}
                  className="text-[11px] text-slate-400 hover:text-slate-600 underline cursor-pointer bg-transparent border-0"
                >
                  Return to Home
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
