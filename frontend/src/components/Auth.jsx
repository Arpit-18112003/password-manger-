import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Auth = ({ setToken, setUsername }) => {
    const [isLogin, setIsLogin] = useState(true)
    const [form, setForm] = useState({ username: '', password: '' })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (form.username.length < 3 || form.password.length < 3) {
            toast.error('Username and password must be at least 3 characters long')
            return
        }

        setLoading(true)
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
        
        const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');
        try {
            const res = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            })
            const data = await res.json()

            if (res.ok && data.success) {
                if (isLogin) {
                    toast.success('Login successful!')
                    // Wait a moment for the toast before updating state
                    setTimeout(() => {
                        setToken(data.token)
                        setUsername(data.username)
                    }, 800)
                } else {
                    toast.success('Registration successful! Please log in.')
                    setIsLogin(true)
                    setForm({ username: form.username, password: '' })
                }
            } else {
                toast.error(data.message || 'Something went wrong. Please try again.')
            }
        } catch (err) {
            console.error(err)
            toast.error('Could not connect to the authentication server.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4">
            <ToastContainer theme="dark" />
            <div className="w-full max-w-md bg-white border border-green-200 rounded-3xl shadow-xl p-8 relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
                
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                        <span className="text-green-500">&lt;</span>
                        <span>Pass</span>
                        <span className="text-green-500">OP/&gt;</span>
                    </h2>
                    <p className="text-slate-500 mt-2 text-sm">
                        {isLogin ? 'Sign in to access your passwords securely' : 'Create an account to start saving passwords'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Enter username"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition duration-200 text-slate-800"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition duration-200 text-slate-800"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-green-200 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            isLogin ? 'Login' : 'Register'
                        )}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm text-green-600 hover:text-green-700 font-semibold focus:outline-none transition duration-200"
                    >
                        {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Auth
