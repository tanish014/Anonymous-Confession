// ============================================
// pages/Login.jsx - Login Landing Page
// ============================================
// Shown to users who are not logged in.
// Features a warm, inviting login card
// with Google Sign-In button.
// ============================================

function Login({ apiUrl }) {
    return (
        <div className="login-page">
            <div className="login-card">
                {/* Logo */}
                <span className="logo-emoji">💌</span>

                {/* Title */}
                <h1>Confession Wall</h1>
                <p className="subtitle">
                    A quiet corner to share your thoughts anonymously.
                    Let it out — your secrets are safe here. 🤍
                </p>

                {/* Features */}
                <div className="login-features">
                    <div className="feature">
                        <span className="feature-emoji">🕊️</span>
                        <span>Share confessions completely anonymously</span>
                    </div>
                    <div className="feature">
                        <span className="feature-emoji">🔑</span>
                        <span>Protect edits with a secret code</span>
                    </div>
                    <div className="feature">
                        <span className="feature-emoji">💗</span>
                        <span>React to confessions with love</span>
                    </div>
                    <div className="feature">
                        <span className="feature-emoji">☁️</span>
                        <span>A warm, safe space just for you</span>
                    </div>
                </div>

                <div className="login-divider" />

                {/* Google Login Button */}
                <a
                    href={`${apiUrl}/auth/google`}
                    className="btn btn-google btn-google-large"
                >
                    🔐 Sign in with Google to Continue
                </a>
            </div>
        </div>
    );
}

export default Login;
