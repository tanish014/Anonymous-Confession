// ============================================
// components/Navbar.jsx
// ============================================
// Top navigation bar with:
// - App branding (warm journal style)
// - Navigation links (Confession Wall, Confess Here)
// - User info (avatar + name) when logged in
// - Login/Logout button
// ============================================

import { Link } from 'react-router-dom';

function Navbar({ user, apiUrl }) {
    return (
        <nav className="navbar">
            {/* ---- Brand ---- */}
            <a href="/" className="navbar-brand">
                <span className="logo-emoji">💌</span>
                <h1>Confession Wall</h1>
            </a>

            {/* ---- Actions ---- */}
            <div className="navbar-actions">
                {/* Nav Links (only when logged in) */}
                {user && (
                    <div className="navbar-links">
                        <Link to="/" className="nav-link">📖 Confession Wall</Link>
                        <Link to="/confess" className="nav-link">✍️ Confess Here</Link>
                    </div>
                )}

                {/* User section */}
                {user ? (
                    <>
                        <div className="user-info">
                            <img
                                src={user.avatar}
                                alt={user.displayName}
                                className="user-avatar"
                                referrerPolicy="no-referrer"
                            />
                            <span className="user-name">{user.displayName}</span>
                        </div>
                        <a href={`${apiUrl}/auth/logout`} className="btn btn-logout">
                            Logout
                        </a>
                    </>
                ) : (
                    <a href={`${apiUrl}/auth/google`} className="btn btn-google">
                        🔐 Login with Google
                    </a>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
