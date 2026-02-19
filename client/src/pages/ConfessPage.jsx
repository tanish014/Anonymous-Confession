// ============================================
// pages/ConfessPage.jsx - Share Your Confession
// ============================================
// Dedicated page for submitting a new confession.
// After successful submission, redirects to the
// Confession Wall so the user sees their post.
// ============================================

import { useNavigate } from 'react-router-dom';
import ConfessionForm from '../components/ConfessionForm';

function ConfessPage({ apiUrl }) {
    const navigate = useNavigate();

    // After posting, redirect to the wall
    const handleConfessionAdded = () => {
        navigate('/');
    };

    return (
        <main className="main-content">
            <ConfessionForm
                apiUrl={apiUrl}
                onConfessionAdded={handleConfessionAdded}
            />
        </main>
    );
}

export default ConfessPage;
