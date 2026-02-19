// ============================================
// components/ConfessionCard.jsx
// ============================================
// Displays a single confession with:
// - Confession text and date
// - Reaction buttons (❤️ 💖 😂) with counts
// - Toggle behavior: click to react, click again to unreact
// - Floating emoji burst animation on react
// - Edit/Delete buttons (trigger secret code modal)
// - Random float duration for anti-gravity effect
// ============================================

import { useState, useRef } from 'react';

function ConfessionCard({ confession, onEdit, onDelete, apiUrl }) {
    const [reactions, setReactions] = useState(confession.reactions);
    const [userReactions, setUserReactions] = useState(confession.userReactions || []);
    const [bursts, setBursts] = useState([]); // Active emoji burst animations
    const cardRef = useRef(null);

    // Random float duration for anti-gravity (each card floats differently)
    const floatDuration = `${4 + Math.random() * 5}s`; // 4s to 9s
    const floatDelay = `${Math.random() * 3}s`;         // 0s to 3s stagger

    // ---- Handle Reaction Click (Toggle) ----
    const handleReaction = async (type) => {
        const isActive = userReactions.includes(type);

        // Trigger emoji burst animation only when adding (not removing)
        if (!isActive) {
            const emojiMap = { like: '👍', love: '💖', laugh: '😂' };
            const burstId = Date.now() + Math.random();
            setBursts(prev => [...prev, { id: burstId, emoji: emojiMap[type] }]);

            // Remove burst after animation completes
            setTimeout(() => {
                setBursts(prev => prev.filter(b => b.id !== burstId));
            }, 1000);
        }

        // Send reaction to backend
        try {
            const res = await fetch(`${apiUrl}/api/confessions/${confession._id}/react`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ type })
            });

            const data = await res.json();
            if (data.success) {
                setReactions(data.reactions);
                setUserReactions(data.userReactions || []);
            }
        } catch (err) {
            console.error('Reaction error:', err);
        }
    };

    // ---- Format Date ----
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    return (
        <div
            ref={cardRef}
            className="confession-card"
            style={{
                '--float-duration': floatDuration,
                '--float-delay': floatDelay
            }}
        >
            {/* Confession Text */}
            <p className="confession-text">{confession.text}</p>

            {/* Meta info + Reactions */}
            <div className="confession-meta">
                <span className="confession-date">
                    🕐 {formatDate(confession.createdAt)}
                </span>

                <div className="reactions-container">
                    {/* Like Button */}
                    <button
                        className={`reaction-btn ${userReactions.includes('like') ? 'active' : ''}`}
                        onClick={() => handleReaction('like')}
                        title="Like"
                    >
                        <span className="emoji">👍</span>
                        <span className="count">{reactions.like}</span>
                    </button>

                    {/* Love Button */}
                    <button
                        className={`reaction-btn ${userReactions.includes('love') ? 'active' : ''}`}
                        onClick={() => handleReaction('love')}
                        title="Love"
                    >
                        <span className="emoji">💖</span>
                        <span className="count">{reactions.love}</span>
                    </button>

                    {/* Laugh Button */}
                    <button
                        className={`reaction-btn ${userReactions.includes('laugh') ? 'active' : ''}`}
                        onClick={() => handleReaction('laugh')}
                        title="Laugh"
                    >
                        <span className="emoji">😂</span>
                        <span className="count">{reactions.laugh}</span>
                    </button>
                </div>
            </div>

            {/* Edit / Delete Actions */}
            <div className="card-actions">
                <button
                    className="action-btn edit"
                    onClick={() => onEdit(confession)}
                    title="Edit confession"
                >
                    ✏️ Edit
                </button>
                <button
                    className="action-btn delete"
                    onClick={() => onDelete(confession)}
                    title="Delete confession"
                >
                    🗑️ Delete
                </button>
            </div>

            {/* Floating Emoji Burst Animations */}
            {bursts.map(burst => (
                <span
                    key={burst.id}
                    className="emoji-burst"
                    style={{
                        left: `${30 + Math.random() * 40}%`,
                        top: '50%'
                    }}
                >
                    {burst.emoji}
                </span>
            ))}
        </div>
    );
}

export default ConfessionCard;

