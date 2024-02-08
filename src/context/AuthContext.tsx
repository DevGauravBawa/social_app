/* eslint-disable react-refresh/only-export-components */
import React from "react"
import { useNavigate } from "react-router-dom"

import { IContextType, IUser } from "@/types"
import { getCurrentUser } from "@/lib/appwrite/api"

const INITIAL_USER = {
  id: "",
  email: "",
  username: "",
  name: "",
  imageUrl: "",
  bio: "",
}

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
}

const AuthContext = React.createContext<IContextType>(INITIAL_STATE)

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<IUser>(INITIAL_USER)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)

  const navigate = useNavigate()

  const checkAuthUser = async () => {
    try {
      const currentAccount = await getCurrentUser()

      if (currentAccount) {
        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
        })

        setIsAuthenticated(true)

        return true
      }

      return false
    } catch (error) {
      console.error(error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    if (localStorage.getItem("cookieFallback") === "[]" || localStorage.getItem("cookieFallback") === null)
      navigate("/sign-in")

    checkAuthUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = { user, setUser, isLoading, isAuthenticated, setIsAuthenticated, checkAuthUser }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useUserContext = () => React.useContext(AuthContext)
