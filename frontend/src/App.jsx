import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Manager from './components/Manager'
import Footer from './components/Footer'
import Auth from './components/Auth'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [username, setUsername] = useState(localStorage.getItem('username') || '')

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      localStorage.setItem('username', username)
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
    }
  }, [token, username])

  const handleLogout = () => {
    setToken('')
    setUsername('')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar username={username} onLogout={handleLogout} />
      <div className="flex-grow bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        {token ? (
          <Manager token={token} onLogout={handleLogout} />
        ) : (
          <Auth setToken={setToken} setUsername={setUsername} />
        )}
      </div>
      <Footer />
    </div>
  )
}

export default App
