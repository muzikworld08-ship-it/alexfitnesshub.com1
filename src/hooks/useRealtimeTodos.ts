import { useState, useEffect, useCallback } from "react";
import { supabase } from "../utils/supabase/client";
import { collection, onSnapshot, setDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  created_at?: string;
  user_id?: string;
}

export function useRealtimeTodos(userId?: string) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "error">("synced");

  // Helper to merge and deduplicate todos from Supabase and Firebase
  const mergeAndSetTodos = useCallback((incomingTodos: Todo[]) => {
    setTodos((prevTodos) => {
      const todoMap = new Map<string, Todo>();
      
      // Load existing
      prevTodos.forEach((t) => todoMap.set(t.id, t));
      
      // Overlay incoming
      incomingTodos.forEach((t) => {
        const existing = todoMap.get(t.id);
        if (!existing) {
          todoMap.set(t.id, t);
        } else {
          todoMap.set(t.id, { ...existing, ...t });
        }
      });

      const merged = Array.from(todoMap.values());
      // Sort by creation date descending
      merged.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
      return merged;
    });
  }, []);

  // Fetch initial todos from Supabase
  const fetchSupabaseTodos = useCallback(async () => {
    try {
      let query = supabase.from("todos").select("*");
      if (userId) {
        query = query.eq("user_id", userId);
      }
      const { data, error } = await query;
      if (error) {
        console.warn("[Supabase Todos Fetch Notice]:", error.message);
      } else if (data) {
        mergeAndSetTodos(data as Todo[]);
      }
    } catch (e) {
      console.warn("[Supabase Todos Fetch Exception]:", e);
    }
  }, [userId, mergeAndSetTodos]);

  useEffect(() => {
    setLoading(true);
    fetchSupabaseTodos().then(() => setLoading(false));

    // 1. SUPABASE REALTIME CHANNEL SUBSCRIPTION
    const supabaseChannel = supabase
      .channel("public:todos")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "todos" },
        (payload) => {
          console.log("[Supabase Channel] Realtime change detected:", payload.eventType);
          if (payload.eventType === "INSERT" && payload.new) {
            mergeAndSetTodos([payload.new as Todo]);
          } else if (payload.eventType === "UPDATE" && payload.new) {
            mergeAndSetTodos([payload.new as Todo]);
          } else if (payload.eventType === "DELETE" && payload.old) {
            setTodos((prev) => prev.filter((t) => t.id !== payload.old.id));
          } else {
            fetchSupabaseTodos();
          }
        }
      )
      .subscribe((status) => {
        console.log(`[Supabase Channel Status]: ${status}`);
      });

    // 2. FIREBASE FIRESTORE REALTIME CHANNEL SUBSCRIPTION
    const todosCollection = collection(db, "todos");
    const unsubscribeFirebase = onSnapshot(
      todosCollection,
      (snapshot) => {
        const fbTodos: Todo[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: data.title || "",
            completed: Boolean(data.completed),
            created_at: data.created_at || new Date().toISOString(),
            user_id: data.user_id || undefined,
          };
        });
        console.log(`[Firebase Channel] Received ${fbTodos.length} todos via onSnapshot.`);
        mergeAndSetTodos(fbTodos);
      },
      (error) => {
        console.warn("[Firebase Channel Error]:", error);
      }
    );

    return () => {
      supabase.removeChannel(supabaseChannel);
      unsubscribeFirebase();
    };
  }, [userId, fetchSupabaseTodos, mergeAndSetTodos]);

  // Dual-Write Actions (Permanent sync on both Supabase & Firebase)
  const addTodo = async (title: string) => {
    if (!title.trim()) return;
    setSyncStatus("syncing");

    const newId = `todo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newTodo: Todo = {
      id: newId,
      title: title.trim(),
      completed: false,
      created_at: new Date().toISOString(),
      user_id: userId || undefined,
    };

    // Optimistic UI update
    mergeAndSetTodos([newTodo]);

    try {
      // Permanent Storage 1: Supabase
      const { error: sbError } = await supabase.from("todos").insert([{
        id: newTodo.id,
        title: newTodo.title,
        completed: newTodo.completed,
        created_at: newTodo.created_at,
        user_id: newTodo.user_id || null,
      }]);
      if (sbError) console.warn("[Supabase Insert Notice]:", sbError.message);

      // Permanent Storage 2: Firebase
      await setDoc(doc(db, "todos", newId), {
        id: newTodo.id,
        title: newTodo.title,
        completed: newTodo.completed,
        created_at: newTodo.created_at,
        user_id: newTodo.user_id || null,
      });

      setSyncStatus("synced");
    } catch (err) {
      console.error("[Add Todo Sync Error]:", err);
      setSyncStatus("error");
    }
  };

  const toggleTodo = async (id: string, currentCompleted: boolean) => {
    const nextCompleted = !currentCompleted;
    setSyncStatus("syncing");

    // Optimistic update
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: nextCompleted } : t))
    );

    try {
      // Update Supabase
      await supabase.from("todos").update({ completed: nextCompleted }).eq("id", id);

      // Update Firebase
      await updateDoc(doc(db, "todos", id), { completed: nextCompleted }).catch(() => {
        return setDoc(doc(db, "todos", id), { completed: nextCompleted }, { merge: true });
      });

      setSyncStatus("synced");
    } catch (err) {
      console.error("[Toggle Todo Sync Error]:", err);
      setSyncStatus("error");
    }
  };

  const deleteTodo = async (id: string) => {
    setSyncStatus("syncing");

    // Optimistic remove
    setTodos((prev) => prev.filter((t) => t.id !== id));

    try {
      // Delete from Supabase
      await supabase.from("todos").delete().eq("id", id);

      // Delete from Firebase
      await deleteDoc(doc(db, "todos", id));

      setSyncStatus("synced");
    } catch (err) {
      console.error("[Delete Todo Sync Error]:", err);
      setSyncStatus("error");
    }
  };

  return {
    todos,
    loading,
    syncStatus,
    addTodo,
    toggleTodo,
    deleteTodo,
    refreshTodos: fetchSupabaseTodos,
  };
}

export default useRealtimeTodos;
