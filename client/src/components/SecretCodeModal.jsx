// ============================================
// components/SecretCodeModal.jsx
// ============================================
// Modal popup that asks for the secret code
// before allowing edit or delete operations.
//
// For EDIT mode: shows a textarea to update text
// For DELETE mode: just confirms deletion
//
// If the wrong secret code is entered, the
// backend returns an error and we show it here.
// ============================================

import { useState, useEffect } from 'react';

function SecretCodeModal({ confession, mode, onClose, onSuccess, apiUrl }) {
    const [secretCode, setSecretCode] = useState('');
    const [newText, setNewText] = useState(confession?.text || '');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Pre-fill text when editing
    useEffect(() => {
        if (mode === 'edit' && confession) {
            setNewText(confession.text);
        }
    }, [confession, mode]);

    // Close modal on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!secretCode) {
            setError('Please enter your secret code');
            return;
        }

        if (mode === 'edit' && !newText.trim()) {
            setError('Confession text cannot be empty');
            return;
        }

        setLoading(true);

        try {
            const url = `${apiUrl}/api/confessions/${confession._id}`;
            const options = {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            };

            let res;
            if (mode === 'edit') {
                // ---- UPDATE REQUEST ----
                res = await fetch(url, {
                    ...options,
                    method: 'PUT',
                    body: JSON.stringify({ text: newText.trim(), secretCode })
                });
            } else {
                // ---- DELETE REQUEST ----
                res = await fetch(url, {
                    ...options,
                    method: 'DELETE',
                    body: JSON.stringify({ secretCode })
                });
            }

            const data = await res.json();

            if (data.success) {
                // Operation successful → close modal and notify parent
                onSuccess(mode, confession._id, data.confession);
            } else {
                // Wrong secret code or other error
                setError(data.message || 'Operation failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('Modal submit error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>
                    {mode === 'edit' ? '✏️ Edit Confession' : '🗑️ Delete Confession'}
                </h3>
                <p>
                    {mode === 'edit'
                        ? 'Enter your secret code to edit this confession.'
                        : 'Enter your secret code to permanently delete this confession.'}
                </p>

                <form onSubmit={handleSubmit}>
                    {/* Error message with shake animation */}
                    {error && <div className="modal-error">{error}</div>}

                    {/* New text input (only for edit mode) */}
                    {mode === 'edit' && (
                        <div className="form-group">
                            <label htmlFor="modal-text">Updated Confession</label>
                            <textarea
                                id="modal-text"
                                className="form-textarea"
                                value={newText}
                                onChange={(e) => setNewText(e.target.value.slice(0, 1000))}
                                maxLength={1000}
                                disabled={loading}
                                rows={4}
                            />
                        </div>
                    )}

                    {/* Secret code input */}
                    <div className="form-group">
                        <label htmlFor="modal-secret">🔑 Secret Code</label>
                        <input
                            id="modal-secret"
                            type="password"
                            className="form-input"
                            placeholder="Enter your secret code"
                            value={secretCode}
                            onChange={(e) => setSecretCode(e.target.value)}
                            autoFocus
                            disabled={loading}
                        />
                    </div>

                    {/* Action buttons */}
                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`btn ${mode === 'delete' ? 'btn-danger' : 'btn-primary'}`}
                            disabled={loading || !secretCode}
                        >
                            {loading
                                ? '⏳ Verifying...'
                                : mode === 'edit'
                                    ? '✅ Update'
                                    : '🗑️ Delete'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SecretCodeModal;
