// ============================================
// components/ConfessionWall.jsx
// ============================================
// Displays all confessions in a scrollable wall.
// Handles fetching, loading states, and
// coordinates with SecretCodeModal for edit/delete.
// ============================================

import { useState } from 'react';
import ConfessionCard from './ConfessionCard';
import SecretCodeModal from './SecretCodeModal';

function ConfessionWall({ confessions, setConfessions, apiUrl }) {
    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('edit'); // 'edit' or 'delete'
    const [selectedConfession, setSelectedConfession] = useState(null);
    const [toast, setToast] = useState(null);

    // ---- Open Edit Modal ----
    const handleEdit = (confession) => {
        setSelectedConfession(confession);
        setModalMode('edit');
        setModalOpen(true);
    };

    // ---- Open Delete Modal ----
    const handleDelete = (confession) => {
        setSelectedConfession(confession);
        setModalMode('delete');
        setModalOpen(true);
    };

    // ---- Close Modal ----
    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedConfession(null);
    };

    // ---- Handle Successful Edit/Delete ----
    const handleSuccess = (mode, confessionId, updatedConfession) => {
        if (mode === 'edit' && updatedConfession) {
            // Update the confession in the list
            setConfessions(prev =>
                prev.map(c => c._id === confessionId ? { ...c, text: updatedConfession.text } : c)
            );
            showToast('Confession updated successfully! ✅', 'success');
        } else if (mode === 'delete') {
            // Remove the confession from the list
            setConfessions(prev => prev.filter(c => c._id !== confessionId));
            showToast('Confession deleted successfully! 🗑️', 'success');
        }

        handleCloseModal();
    };

    // ---- Toast Notification ----
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <div className="confession-wall">
            {/* Header */}
            <div className="wall-header">
                <h2>📖 The Confession Wall</h2>
                <span className="confession-count">
                    {confessions.length} confession{confessions.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Empty State */}
            {confessions.length === 0 ? (
                <div className="wall-empty">
                    <span className="empty-emoji">🕊️</span>
                    <p>No confessions yet. Be the first to share your heart. 💛</p>
                </div>
            ) : (
                /* Confession Cards */
                <div className="confessions-grid">
                    {confessions.map(confession => (
                        <ConfessionCard
                            key={confession._id}
                            confession={confession}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            apiUrl={apiUrl}
                        />
                    ))}
                </div>
            )}

            {/* Secret Code Modal */}
            {modalOpen && selectedConfession && (
                <SecretCodeModal
                    confession={selectedConfession}
                    mode={modalMode}
                    onClose={handleCloseModal}
                    onSuccess={handleSuccess}
                    apiUrl={apiUrl}
                />
            )}

            {/* Toast Notification */}
            {toast && (
                <div className={`toast ${toast.type}`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
}

export default ConfessionWall;
