import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    // Redirect them to the home page if not logged in
    return <Navigate to="/" replace />
  }

  return children
}
