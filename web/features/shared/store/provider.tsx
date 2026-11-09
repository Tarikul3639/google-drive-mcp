"use client"

import { Provider } from "react-redux"

import { store } from "./store"

type StoreProviderProps = {
  children: React.ReactNode
}

// Provide the singleton Redux store to the client-side application.
export function StoreProvider({ children }: StoreProviderProps) {
  return <Provider store={store}>{children}</Provider>
}
