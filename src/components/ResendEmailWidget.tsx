import React, { useState } from "react";
import { Mail, Send, CheckCircle2, AlertCircle, Sparkles, Loader2 } from "lucide-react";
import { useApp } from "../context/AppContext";

interface ResendEmailWidgetProps {
  programName?: string;
  dayNumber?: number;
  recipientEmail?: string;
  defaultSubject?: string;
  compact?: boolean;
  onSent?: (data: any) => void;
  className?: string;
}

export default function ResendEmailWidget({
  programName = "AlexFitnessHub Workout Challenge",
  dayNumber = 1,
  recipientEmail,
  defaultSubject,
  compact = false,
  onSent,
  className = ""
}: ResendEmailWidgetProps) {
  const { user } = useApp();
  const [email, setEmail] = useState<string>(() => {
    return recipientEmail || user?.email || "";
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [resendId, setResendId] = useState<string>("");

  const handleSendEmail = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetEmail = (email || user?.email || "").trim();

    if (!targetEmail || !targetEmail.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid recipient email address.");
      return;
    }

    setLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      const response = await fetch("/api/resend/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: targetEmail,
          programName,
          dayNumber,
          subject: defaultSubject || `🎉 Day ${dayNumber} Completed - ${programName} Protocol`
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        setMessage(`Workout & nutrition protocol dispatched via Resend to ${targetEmail}!`);
        if (data.id) setResendId(data.id);
        if (onSent) onSent(data);
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to dispatch email via Resend.");
      }
    } catch (err: any) {
      console.error("[Resend Widget Error]", err);
      setStatus("error");
      setMessage(err.message || "Network error while calling Resend API.");
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <div className={`bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 text-white ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-red-400">
            <Mail className="w-4 h-4" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              Resend Email Protocol
            </span>
          </div>
          <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
            onboarding@resend.dev
          </span>
        </div>

        {status === "success" ? (
          <div className="bg-emerald-950/50 border border-emerald-500/40 rounded-xl p-3 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Delivered via Resend!</span>
            </div>
            <p className="text-[11px] text-neutral-300">{message}</p>
            {resendId && (
              <p className="text-[9px] font-mono text-emerald-500/80 truncate">ID: {resendId}</p>
            )}
          </div>
        ) : (
          <form onSubmit={handleSendEmail} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email for daily report..."
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 font-mono"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-1 cursor-pointer shrink-0"
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </>
                )}
              </button>
            </div>
            {status === "error" && (
              <p className="text-[11px] text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{message}</span>
              </p>
            )}
          </form>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-5 text-white shadow-xl ${className}`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 text-red-400 mb-1">
            <Mail className="w-4 h-4" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              Resend Athlete Notification
            </span>
          </div>
          <h4 className="text-sm font-bold text-white">
            Send Day {dayNumber} Completion &amp; Nutrition Rules to Your Inbox
          </h4>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
            Resend API v2
          </span>
        </div>
      </div>

      <div className="text-xs text-neutral-300 leading-relaxed mb-4 space-y-1 bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/80">
        <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px] uppercase tracking-wide">
          <Sparkles className="w-3 h-3" />
          <span>Included in your email summary:</span>
        </div>
        <p>&bull; Day {dayNumber} training completion receipt &amp; streak count</p>
        <p>&bull; Coach Alex's strict instructions: <strong className="text-white">Cut out added sugar</strong> &amp; <strong className="text-white">no late-night eating</strong></p>
        <p>&bull; Next workout unlock confirmation (ready tomorrow after 5 hours)</p>
      </div>

      {status === "success" ? (
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 text-center space-y-2">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-emerald-400">{message}</p>
          {resendId && (
            <p className="text-[10px] font-mono text-neutral-400">Resend Message ID: {resendId}</p>
          )}
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="text-[11px] text-neutral-400 hover:text-white underline font-mono cursor-pointer"
          >
            Send to another email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSendEmail} className="space-y-3">
          <div>
            <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1.5">
              Recipient Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 font-mono transition"
            />
          </div>

          {status === "error" && (
            <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-3 flex items-start gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Dispatching via Resend...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Workout Protocol to My Email (via Resend)</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
