import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import OrderList from './features/orders/OrderList';
import OrderForm from './features/orders/OrderForm';
import OrderDetails from './features/orders/OrderDetails';

export default function App() {
    return (
        <AppShell>
            <Routes>
                <Route path="/" element={<Navigate to="/orders" replace />} />
                <Route path="/orders" element={<OrderList />} />
                <Route path="/orders/new" element={<OrderForm />} />
                <Route path="/orders/:id" element={<OrderDetails />} />
                <Route path="/orders/:id/edit" element={<OrderForm />} />
                <Route path="*" element={<div>Not Found</div>} />
            </Routes>
        </AppShell>
    );
}