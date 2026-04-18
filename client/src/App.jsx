// ============================================
// App.jsx - Root Application Component
// ============================================
// This is the main component that wraps everything.
// It handles:
// - Fetching the logged-in user on page load
// - Routing between Login, Home, and Confess pages
// - Providing user context to child components
// ============================================

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import FloatingEmojis from './components/FloatingEmojis';
import Home from './pages/Home';
import ConfessPage from './pages/ConfessPage';
import Login from './pages/Login';

// Backend API base URL
// In production, we use relative paths after the server serves the frontend
const API_URL = import.meta.env.MODE === 'production' ? '' : 'http://localhost:5000';

function App() {
    // ---- State ----
    const [user, setUser] = useState(null);           // Logged-in user info
    const [loading, setLoading] = useState(true);      // Loading auth status

    // ---- Check if user is logged in on page load ----
    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const res = await fetch(`${API_URL}/auth/current_user`, {
                credentials: 'include' // Send cookies for session
            });
            const data = await res.json();

            if (data.success && data.user) {
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // ---- Show loading while checking auth ----
    if (loading) {
        return (
            <div>
                <FloatingEmojis />
                <div className="loading-container" style={{ minHeight: '100vh' }}>
                    <div className="spinner"></div>
                    <p className="loading-text">Loading your confessions...</p>
                </div>
            </div>
        );
    }

    return (
        <Router>
            <div>
                {/* Floating hearts & emoji background */}
                <FloatingEmojis />

                {/* Navigation bar */}
                <Navbar
                    user={user}
                    apiUrl={API_URL}
                />

                {/* Page routes */}
                <Routes>
                    {/* Home page - only accessible when logged in */}
                    <Route
                        path="/"
                        element={
                            user ? (
                                <Home user={user} apiUrl={API_URL} />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />

                    {/* Confess page - only accessible when logged in */}
                    <Route
                        path="/confess"
                        element={
                            user ? (
                                <ConfessPage apiUrl={API_URL} />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />

                    {/* Login page - redirect to home if already logged in */}
                    <Route
                        path="/login"
                        element={
                            user ? (
                                <Navigate to="/" replace />
                            ) : (
                                <Login apiUrl={API_URL} />
                            )
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
