import React, { useState } from "react";
import { Check, Trash2, Plus, RefreshCw, Zap, ShieldCheck, Database, Server } from "lucide-react";
import { useRealtimeTodos } from "../hooks/useRealtimeTodos";
import { useSupabaseAuth } from "../hooks/useSupabaseAuth";
import { useApp } from "../context/AppContext";

export const TodoRealtimeWidget: React.FC = () => {
  const { user: appUser } = useApp();
  const { session, user: supabaseUser } = useSupabaseAuth();
  const { todos, loading, syncStatus, addTodo, toggleTodo, deleteTodo, refreshTodos } = useRealtimeTodos(
    appUser?.uid || supabaseUser?.id
  );

  const [inputTitle, setInputTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTitle.trim() || isSubmitting) return;

    setIsSubmitting(true);
    await addTodo(inputTitle);
    setInputTitle("");
    setIsSubmitting(false);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      {/* Header & Status Indicators */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
            <h3 className="text-lg font-bold text-white tracking-wide">
              Dual-Database Real-Time Todos
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Synchronized live across <span className="text-emerald-400 font-semibold">Supabase Channel</span> & <span className="text-amber-400 font-semibold">Firebase Channel</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sync status pill */}
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
            syncStatus === "syncing" 
              ? "bg-amber-500/10 border-amber-500/30 text-amber-400" 
              : syncStatus === "error"
              ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              syncStatus === "syncing" ? "bg-amber-400 animate-ping" : syncStatus === "error" ? "bg-rose-400" : "bg-emerald-400"
            }`} />
            {syncStatus === "syncing" ? "Syncing DBs..." : syncStatus === "error" ? "Sync Warning" : "Live Realtime Active"}
          </span>

          <button
            onClick={() => refreshTodos()}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            title="Manual Sync Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-amber-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Database Storage Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs">
          <Database className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="overflow-hidden">
            <div className="font-semibold text-emerald-300">Supabase Channel</div>
            <div className="text-slate-400 truncate">
              {supabaseUser?.email || session?.user?.email ? `Session: ${supabaseUser?.email || session?.user?.email}` : "Public Realtime Enabled"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-950/30 border border-amber-500/20 text-xs">
          <Server className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="overflow-hidden">
            <div className="font-semibold text-amber-300">Firebase Channel</div>
            <div className="text-slate-400 truncate">
              {appUser?.email ? `Auth: ${appUser.email}` : "Firestore onSnapshot Active"}
            </div>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
          placeholder="Add a new task or workout todo..."
          className="flex-1 bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!inputTitle.trim() || isSubmitting}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/10 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </form>

      {/* Todos List */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
        {loading && todos.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs flex flex-col items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
            Connecting to real-time database streams...
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
            No tasks found. Create a task above to test real-time dual database storage!
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`group flex items-center justify-between p-3 rounded-xl border transition-all ${
                todo.completed
                  ? "bg-slate-950/40 border-slate-900 text-slate-500"
                  : "bg-slate-950/80 border-slate-800/80 text-slate-200 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <button
                  type="button"
                  onClick={() => toggleTodo(todo.id, todo.completed)}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                    todo.completed
                      ? "bg-emerald-500 border-emerald-500 text-slate-950"
                      : "border-slate-700 hover:border-amber-400"
                  }`}
                >
                  {todo.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
                <span className={`text-sm truncate ${todo.completed ? "line-through text-slate-500" : "font-medium text-slate-200"}`}>
                  {todo.title}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  Synced
                </span>
                <button
                  type="button"
                  onClick={() => deleteTodo(todo.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 opacity-80 group-hover:opacity-100 transition-all rounded-lg hover:bg-rose-500/10 cursor-pointer"
                  title="Delete Todo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Permanent Database Protection
        </span>
        <span>{todos.length} {todos.length === 1 ? "task" : "tasks"} total</span>
      </div>
    </div>
  );
};

export default TodoRealtimeWidget;
