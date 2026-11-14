import { useState, useEffect, useCallback } from "react";
import { collection, onSnapshot, doc, query, where, getDocsFromServer } from "firebase/firestore";
import {
  auth,
  db,
  OperationType,
  handleFirestoreError,
  safeFirestoreSetDoc,
  safeFirestoreUpdateDoc,
  safeFirestoreDeleteDoc
} from "../lib/firebase";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
  userId?: string;
  user_id?: string;
}

export function useRealtimeTodos(userId?: string) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "error">("synced");

  const effectiveUid = auth?.currentUser?.uid || userId || "";

  const sortTodos = (list: Todo[]) =>
    [...list].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

  const refreshTodos = useCallback(async () => {
    if (!db || !auth?.currentUser) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const q = query(collection(db, "todos"), where("userId", "==", auth.currentUser.uid));
      const snap = await getDocsFromServer(q);
      const fbTodos: Todo[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: data.title || "",
          completed: Boolean(data.completed),
          created_at: data.created_at || data.createdAt || new Date().toISOString(),
          updated_at: data.updated_at || data.updatedAt,
          userId: data.userId || data.user_id,
          user_id: data.userId || data.user_id
        };
      });
      setTodos(sortTodos(fbTodos));
      setSyncStatus("synced");
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, "todos");
      setSyncStatus("error");
    } finally {
      setLoading(false);
    }
  }, [effectiveUid]);

  useEffect(() => {
    if (!db || !auth?.currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const uid = auth.currentUser.uid;
    const todosQuery = query(collection(db, "todos"), where("userId", "==", uid));
    const unsubscribeFirebase = onSnapshot(
      todosQuery,
      (snapshot) => {
        const fbTodos: Todo[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: data.title || "",
            completed: Boolean(data.completed),
            created_at: data.created_at || data.createdAt || new Date().toISOString(),
            updated_at: data.updated_at || data.updatedAt,
            userId: data.userId || data.user_id,
            user_id: data.userId || data.user_id
          };
        });
        setTodos(sortTodos(fbTodos));
        setSyncStatus("synced");
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, "todos");
        setSyncStatus("error");
        setLoading(false);
      }
    );

    return () => {
      unsubscribeFirebase();
    };
  }, [effectiveUid]);

  const addTodo = async (title: string) => {
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    if (!db || !auth?.currentUser) {
      setSyncStatus("error");
      return;
    }

    setSyncStatus("syncing");
    const uid = auth.currentUser.uid;
    const now = new Date().toISOString();
    const newId = `todo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newTodo: Todo = {
      id: newId,
      title: cleanTitle,
      completed: false,
      created_at: now,
      updated_at: now,
      userId: uid,
      user_id: uid
    };

    try {
      const ok = await safeFirestoreSetDoc(
        doc(db, "todos", newId),
        {
          id: newTodo.id,
          title: newTodo.title,
          completed: newTodo.completed,
          created_at: now,
          updated_at: now,
          userId: uid
        },
        { merge: false },
        true
      );
      if (!ok) {
        setSyncStatus("error");
        return;
      }
      setSyncStatus("synced");
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `todos/${newId}`);
      setSyncStatus("error");
    }
  };

  const toggleTodo = async (id: string, currentCompleted: boolean) => {
    if (!db || !auth?.currentUser) {
      setSyncStatus("error");
      return;
    }
    const nextCompleted = !currentCompleted;
    setSyncStatus("syncing");
    try {
      const ok = await safeFirestoreUpdateDoc(doc(db, "todos", id), {
        completed: nextCompleted,
        updated_at: new Date().toISOString()
      });
      setSyncStatus(ok ? "synced" : "error");
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `todos/${id}`);
      setSyncStatus("error");
    }
  };

  const deleteTodo = async (id: string) => {
    if (!db || !auth?.currentUser) {
      setSyncStatus("error");
      return;
    }
    setSyncStatus("syncing");
    try {
      const ok = await safeFirestoreDeleteDoc(doc(db, "todos", id));
      setSyncStatus(ok ? "synced" : "error");
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `todos/${id}`);
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
    refreshTodos
  };
}

export default useRealtimeTodos;
