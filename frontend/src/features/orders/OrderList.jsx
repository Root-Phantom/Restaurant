import React, { useEffect, useState } from 'react';
import { OrdersApi } from '../../api/order.js';
import { Link } from 'react-router-dom';

export default function OrderList() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        OrdersApi.list()
            .then(r => setData(r.data))
            .finally(() => setLoading(false));
    }, []);

    const onDelete = async (id) => {
        if (window.confirm('Delete this order?')) {
            await OrdersApi.remove(id);
            setData(prev => prev.filter(o => o.orderMasterId !== id));
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Orders</h2>
            <Link to="/orders/new">New Order</Link>
            <table border="1" cellPadding="6" cellSpacing="0">
                <thead>
                <tr>
                    <th>#</th><th>Order No</th><th>Customer</th><th>Method</th><th>Total</th><th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {data.map(o => (
                    <tr key={o.orderMasterId}>
                        <td>{o.orderMasterId}</td>
                        <td>{o.orderNumber}</td>
                        <td>{o.customerName}</td>
                        <td>{o.paymentMethod}</td>
                        <td>{Number(o.totalPrice).toFixed(2)}</td>
                        <td>
                            <Link to={`/orders/${o.orderMasterId}`}>View</Link>{' | '}
                            <Link to={`/orders/${o.orderMasterId}/edit`}>Edit</Link>{' | '}
                            <button onClick={() => onDelete(o.orderMasterId)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
