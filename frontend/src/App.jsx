import React, { useState, useEffect } from 'react'
import ClientApp from './CLIENT/ClientApp'
import AdminAPP from './ADMIN/AdminAPP (1)'
import { backend_server } from './main'
import axios from 'axios'
import { Toaster } from 'react-hot-toast'

// conditionally rendering home page based on user Role/Type
const App = () => {
  const UPDATE_BOOK_FINE = `${backend_server}/api/v1/checkbookreturn`

  const [userType, setUserType] = useState('')

  const updateBookCharges = async () => {
    // hits api endpoints that runs book fine charge if not returned
    const response = await axios.get(UPDATE_BOOK_FINE)
    // console.log(response.data.message)
  }

  useEffect(() => {
    updateBookCharges()
    const storedUserType = localStorage.getItem('userType')
    setUserType(storedUserType)
  }, [])

  return (
    <React.Fragment>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#4caf50", // Green background for success
            color: "#fff", // White text
            padding: "12px 24px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
          error: {
            style: {
              background: "#ff4444", // Red background for errors
            },
          },
        }}
      />
      {userType === 'admin_user' ? <AdminAPP /> : <ClientApp />}
    </React.Fragment>
  )
}

export default App
