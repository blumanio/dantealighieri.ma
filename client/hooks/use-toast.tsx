"use client"

import * as React from "react"
import type { ToastProps } from "@/components/ui/toast"

const TOAST_LIMIT = 3 // Can show up to 3 toasts at once
const TOAST_REMOVE_DELAY = 5000 // 5 seconds

// The shape of a toast object managed by the hook
export type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactElement
}

// All possible actions that can be dispatched to the toast state
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

type ActionType = typeof actionTypes
type Action =
  | { type: ActionType["ADD_TOAST"]; toast: ToasterToast }
  | { type: ActionType["DISMISS_TOAST"]; toastId: string }
  | { type: ActionType["REMOVE_TOAST"]; toastId: string }

// State interface
interface State {
  toasts: ToasterToast[]
}

// Reducer function to manage toast state transitions
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        // Add new toast, and respect the toast limit
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }
    case "DISMISS_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toastId ? { ...t, open: false } : t
        ),
      }
    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
    default:
      return state
  }
}

// --- React Context for Toasts ---
type ToastContextValue = {
  toasts: ToasterToast[]
  toast: (props: Omit<ToasterToast, "id">) => void
  dismiss: (toastId: string) => void
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined)

// --- Custom Hook to Access Toast Functions ---
export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

// --- Provider Component ---
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, { toasts: [] })

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(() => {
    const toast = (props: Omit<ToasterToast, "id">) => {
      const id = (Math.random() * 1000000).toString() // Simple unique ID
      const newToast: ToasterToast = { id, ...props, open: true }

      dispatch({ type: "ADD_TOAST", toast: newToast });

      // Set a timeout to automatically dismiss and then remove the toast
      setTimeout(() => {
        dispatch({ type: "DISMISS_TOAST", toastId: id });
        // Wait for the dismiss animation to finish before removing from state
        setTimeout(() => {
          dispatch({ type: "REMOVE_TOAST", toastId: id });
        }, 500) // Assumes 500ms dismiss animation
      }, TOAST_REMOVE_DELAY);
    }

    const dismiss = (toastId: string) => {
      dispatch({ type: "DISMISS_TOAST", toastId });
      setTimeout(() => {
        dispatch({ type: "REMOVE_TOAST", toastId });
      }, 500);
    }

    return {
      toasts: state.toasts,
      toast,
      dismiss
    }
  }, [state])

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  )
}
