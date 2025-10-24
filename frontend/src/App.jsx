import React from 'react';
import {Routes, Route, Navigate, Link} from 'react-router-dom';
import OrderList from './features/orders/OrderList.jsx';
import OrderForm from './features/orders/OrderForm.jsx';
import OrderDetails from './features/orders/OrderDetails.jsx';

export default function App() {
    return (
        <div style={{padding: 16}}>
            <nav style={{marginBottom: 12}}>
                <Link to="/orders">Orders</Link> {' | '}
                <Link to="/orders/new">New Order</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Navigate to="/orders" replace/>}/>
                <Route path="/orders" element={<OrderList/>}/>
                <Route path="/orders/new" element={<OrderForm/>}/>
                <Route path="/orders/:id" element={<OrderDetails/>}/>
                <Route path="/orders/:id/edit" element={<OrderForm/>}/>
                <Route path="*" element={<div>Not Found</div>}/>
            </Routes>
        </div>
    );
}
