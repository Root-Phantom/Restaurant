import React, { useEffect, useState } from 'react';
import { OrdersApi } from '../../api/orders';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function OrderList() {
    const [data, setData] = useState([]);
    const [q, setQ] = useState('');

    useEffect(() => {
        OrdersApi.list().then(r => setData(Array.isArray(r.data) ? r.data : [])).catch(() => setData([]));
    }, []);

    const filtered = data.filter(o => {
        const hay = [o.orderNumber, o.customerName, o.paymentMethod].join(' ').toLowerCase();
        return hay.includes(q.toLowerCase());
    });

    return (
        <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
                <Card title="Orders" subtitle="Total number of orders today">
                    <div className="text-3xl font-bold">{data.length}</div>
                </Card>
                <Card title="Revenue" subtitle="Sum of totals">
                    <div className="text-3xl font-bold">
                        {data.reduce((s, x) => s + Number(x.totalPrice || 0), 0).toFixed(2)}
                    </div>
                </Card>
                <Card title="Avg Ticket" subtitle="Revenue / Orders">
                    <div className="text-3xl font-bold">
                        {data.length ? (data.reduce((s, x) => s + Number(x.totalPrice || 0), 0) / data.length).toFixed(2) : '0.00'}
                    </div>
                </Card>
            </div>

            <Card
                title="Orders"
                right={<Link to="/orders/new"><Button>New Order</Button></Link>}
            >
                <div className="flex items-center gap-3 mb-3">
                    <input
                        value={q}
                        onChange={e => setQ(e.target.value)}
                        placeholder="Search by order no, customer, method"
                        className="bg-white/5 border border-white/10 rounded-md h-10 px-3 w-full outline-none focus:border-primary-500"
                    />
                </div>

                <div className="overflow-auto">
                    <table className="w-full text-sm">
                        <thead className="text-left text-[var(--muted)]">
                        <tr>
                            <th className="py-2 pr-3">#</th>
                            <th className="py-2 pr-3">Order No</th>
                            <th className="py-2 pr-3">Customer</th>
                            <th className="py-2 pr-3">Method</th>
                            <th className="py-2 pr-3">Total</th>
                            <th className="py-2 pr-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map(o => (
                            <tr key={o.orderMasterId} className="border-t border-white/5">
                                <td className="py-3 pr-3">{o.orderMasterId}</td>
                                <td className="py-3 pr-3">{o.orderNumber}</td>
                                <td className="py-3 pr-3">{o.customerName}</td>
                                <td className="py-3 pr-3">
                                    {o.paymentMethod === 'Cash' && <Badge color="warning">Cash</Badge>}
                                    {o.paymentMethod === 'Card' && <Badge color="info">Card</Badge>}
                                    {o.paymentMethod === 'Online' && <Badge color="success">Online</Badge>}
                                    {!['Cash','Card','Online'].includes(o.paymentMethod) && <Badge>{o.paymentMethod}</Badge>}
                                </td>
                                <td className="py-3 pr-3">${Number(o.totalPrice || 0).toFixed(2)} USD</td>
                                <td className="py-3 pr-3">
                                    <Link to={`/orders/${o.orderMasterId}`} className="mr-2 text-[var(--muted)] hover:text-white">View</Link>
                                    <Link to={`/orders/${o.orderMasterId}/edit`} className="mr-2 text-[var(--muted)] hover:text-white">Edit</Link>
                                    <button
                                        onClick={async () => {
                                            if (!window.confirm('Delete this order?')) return;
                                            await OrdersApi.remove(o.orderMasterId);
                                            setData(prev => prev.filter(x => x.orderMasterId !== o.orderMasterId));
                                        }}
                                        className="text-red-300 hover:text-red-200"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {!filtered.length && (
                            <tr><td colSpan="6" className="text-center py-6 text-[var(--muted)]">No data</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}