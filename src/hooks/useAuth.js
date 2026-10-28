import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

/**
 * Custom hook to use authentication context
 * Must be called within AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
