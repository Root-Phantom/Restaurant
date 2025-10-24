import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { ChevronLeft } from 'lucide-react';

export default function BackButton({ fallback = '/orders', children = 'Back' }) {
    const navigate = useNavigate();
    return (
        <Button
            type="button"
            variant="primary"
            className="gap-2 bg-primary-600 hover:bg-primary-500 shadow-lg shadow-primary-900/30"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (window.history.length > 1) navigate(-1);
                else navigate(fallback);
            }}
        >
            <ChevronLeft size={18} />
            {children}
        </Button>
    );
}