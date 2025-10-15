import { useState } from 'react';

export default function useModal() {
    const [isModalOpen, setModalOpen] = useState(false);

    const closeModal = () => {
        setModalOpen(false);
    };
    
    const openModal = () => {
        setModalOpen(true);
    };

    return {
        isModalOpen,
        closeModal,
        openModal
    }
}