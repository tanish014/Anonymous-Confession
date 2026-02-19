// ============================================
// components/FloatingEmojis.jsx
// ============================================
// Floating hearts and quiet emojis that gently
// drift upward in the background. Replaces the
// old StarryBackground with a warm, cozy feel.
// ============================================

import { useMemo } from 'react';

function FloatingEmojis() {
    const emojis = ['💛', '🤍', '🩷', '🤎', '💌', '🕊️', '🌸', '☁️', '✨', '💫', '🧡', '💗'];

    const floaters = useMemo(() => {
        return Array.from({ length: 20 }, (_, i) => ({
            id: i,
            emoji: emojis[i % emojis.length],
            style: {
                left: `${Math.random() * 95}%`,
                '--duration': `${14 + Math.random() * 16}s`,
                '--delay': `${Math.random() * 15}s`,
                '--emoji-size': `${1 + Math.random() * 1.2}rem`,
            }
        }));
    }, []);

    return (
        <div className="floating-emojis-bg" aria-hidden="true">
            {floaters.map(f => (
                <span key={f.id} className="floating-emoji" style={f.style}>
                    {f.emoji}
                </span>
            ))}
        </div>
    );
}

export default FloatingEmojis;
