// ============================================
// components/StarryBackground.jsx
// ============================================
// Generates an animated starry background with
// twinkling stars and occasional shooting stars.
// Uses CSS animations defined in index.css.
// ============================================

import { useMemo } from 'react';

function StarryBackground() {
    // Generate random stars once (useMemo prevents re-generation)
    const stars = useMemo(() => {
        const starArray = [];

        // Create 150 twinkling stars with random positions and sizes
        for (let i = 0; i < 150; i++) {
            const size = Math.random() * 3 + 1; // 1px to 4px
            starArray.push({
                id: i,
                style: {
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    '--duration': `${Math.random() * 4 + 2}s`,     // 2s to 6s
                    '--max-opacity': Math.random() * 0.5 + 0.3,     // 0.3 to 0.8
                    animationDelay: `${Math.random() * 5}s`
                }
            });
        }

        return starArray;
    }, []);

    // Generate a few shooting stars
    const shootingStars = useMemo(() => {
        return Array.from({ length: 3 }, (_, i) => ({
            id: `shoot-${i}`,
            style: {
                left: `${Math.random() * 70}%`,
                top: `${Math.random() * 50}%`,
                animationDelay: `${i * 5 + Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 2}s`
            }
        }));
    }, []);

    return (
        <div className="starry-background" aria-hidden="true">
            {/* Twinkling stars */}
            {stars.map(star => (
                <div key={star.id} className="star" style={star.style} />
            ))}

            {/* Shooting stars */}
            {shootingStars.map(star => (
                <div key={star.id} className="shooting-star" style={star.style} />
            ))}
        </div>
    );
}

export default StarryBackground;
