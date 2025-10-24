import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {OrdersApi} from '../../api/orders';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';
import {Pencil} from 'lucide-react';

export default function OrderDetails() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        OrdersApi.get(Number(id)).then(r => setOrder(r.data));
    }, [id]);

    if (!order) return <div>Loading...</div>;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <BackButton>Back</BackButton>

                <Button
                    variant="primary"
                    className="gap-2 bg-primary-600 hover:bg-primary-500 shadow-lg shadow-primary-900/30"
                    onClick={() => navigate(`/orders/${order.orderMasterId}/edit`)}
                >
                    <Pencil size={16}/>
                    Edit
                </Button>
            </div>

            <Card title={`Order ${order.orderNumber}`}>
                <div className="text-sm text-[var(--muted)]">Customer</div>
                <div className="mb-3">{order.customerName}</div>
                <div className="text-sm text-[var(--muted)]">Payment</div>
                <div>{order.paymentMethod}</div>
            </Card>

            <Card title="Items">
                <div className="overflow-auto">
                    <table className="w-full text-sm">
                        <thead className="text-left text-[var(--muted)]">
                        <tr>
                            <th className="py-2 pr-3">Food</th>
                            <th className="py-2 pr-3">Price</th>
                            <th className="py-2 pr-3">Qty</th>
                            <th className="py-2 pr-3">Line Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        {order.items.map(it => (
                            <tr key={it.orderDetailId} className="border-t border-white/5">
                                <td className="py-2 pr-3">{it.foodItemName}</td>
                                <td className="py-2 pr-3">${Number(it.foodItemPrice).toFixed(2)} USD</td>
                                <td className="py-2 pr-3">{it.quantity}</td>
                                <td className="py-2 pr-3">${Number(it.lineTotal).toFixed(2)} USD</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <div className="flex justify-end">
                <div className="text-lg font-semibold">
                    Total: ${Number(order.totalPrice).toFixed(2)} USD
                </div>
            </div>
        </div>
    );
}