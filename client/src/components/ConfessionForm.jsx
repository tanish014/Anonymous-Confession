// ============================================
// components/ConfessionForm.jsx
// ============================================
// Form for submitting a new anonymous confession.
// Includes:
// - Textarea for confession text (max 1000 chars)
// - Masked input for secret code (min 4 chars)
// - Character counter
// - Submit button
// ============================================

import { useState } from 'react';

function ConfessionForm({ apiUrl, onConfessionAdded }) {
    const [text, setText] = useState('');
    const [secretCode, setSecretCode] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // ---- Validation ----
        if (!text.trim()) {
            setError('Please write your confession');
            return;
        }
        if (secretCode.length < 4) {
            setError('Secret code must be at least 4 characters');
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch(`${apiUrl}/api/confessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Send session cookie
                body: JSON.stringify({ text: text.trim(), secretCode })
            });

            const data = await res.json();

            if (data.success) {
                // Clear form and notify parent
                setText('');
                setSecretCode('');
                onConfessionAdded(data.confession);
            } else {
                setError(data.message || 'Failed to post confession');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('Submit error:', err);
        } finally {
            setSubmitting(false);
        }
    };

    // Character count styling
    const charClass = text.length > 900 ? 'danger' : text.length > 750 ? 'warning' : '';

    return (
        <form className="confession-form" onSubmit={handleSubmit}>
            <h2>💌 Share Your Confession</h2>

            {/* Error message */}
            {error && (
                <div className="modal-error">{error}</div>
            )}

            {/* Confession text */}
            <div className="form-group">
                <label htmlFor="confession-text">Your Anonymous Confession</label>
                <textarea
                    id="confession-text"
                    className="form-textarea"
                    placeholder="What's on your mind? Your identity stays hidden..."
                    value={text}
                    onChange={(e) => setText(e.target.value.slice(0, 1000))}
                    maxLength={1000}
                    disabled={submitting}
                />
                <div className={`char-count ${charClass}`}>
                    {text.length}/1000
                </div>
            </div>

            {/* Secret code */}
            <div className="form-group">
                <label htmlFor="secret-code">🔑 Secret Code</label>
                <input
                    id="secret-code"
                    type="password"
                    className="form-input"
                    placeholder="Enter a secret code (min 4 characters)"
                    value={secretCode}
                    onChange={(e) => setSecretCode(e.target.value)}
                    minLength={4}
                    disabled={submitting}
                />
                <p className="form-hint">
                    Remember this code! You'll need it to edit or delete this confession later.
                </p>
            </div>

            {/* Submit button */}
            <div className="form-actions">
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting || !text.trim() || secretCode.length < 4}
                >
                    {submitting ? '⏳ Posting...' : '💛 Post Anonymously'}
                </button>
            </div>
        </form>
    );
}

export default ConfessionForm;
