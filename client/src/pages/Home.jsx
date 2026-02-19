// ============================================
// pages/Home.jsx - Confession Wall Page
// ============================================
// Displays all confessions on the wall.
// The confession form is now on a separate page.
// ============================================

import { useState, useEffect } from 'react';
import ConfessionWall from '../components/ConfessionWall';

function Home({ user, apiUrl }) {
    const [confessions, setConfessions] = useState([]);
    const [loading, setLoading] = useState(true);

    // ---- Fetch all confessions on page load ----
    useEffect(() => {
        fetchConfessions();
    }, []);

    const fetchConfessions = async () => {
        try {
            const res = await fetch(`${apiUrl}/api/confessions`, {
                credentials: 'include'
            });
            const data = await res.json();

            if (data.success) {
                setConfessions(data.confessions);
            }
        } catch (error) {
            console.error('Error fetching confessions:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="main-content">
            {/* Confession Wall */}
            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p className="loading-text">Loading confessions...</p>
                </div>
            ) : (
                <ConfessionWall
                    confessions={confessions}
                    setConfessions={setConfessions}
                    apiUrl={apiUrl}
                />
            )}
        </main>
    );
}

export default Home;
