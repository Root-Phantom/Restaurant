import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OrdersApi } from '../../api/orders';
import { CustomersApi } from '../../api/customers';
import { FoodApi } from '../../api/foods';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';
import { DarkOption, DarkSelect } from '../../components/ui/Select';

export default function OrderForm() {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();

    const [customers, setCustomers] = useState([]);
    const [foods, setFoods] = useState([]);
    const [customerId, setCustomerId] = useState(''); // string برای Radix
    const [paymentMethod, setPaymentMethod] = useState('Card');
    const [items, setItems] = useState([{ foodItemId: '', quantity: 1 }]);

    useEffect(() => {
        CustomersApi.list().then(r => setCustomers(r.data || []));
        FoodApi.list().then(r => setFoods(r.data || []));
    }, []);

    useEffect(() => {
        if (isEdit) {
            OrdersApi.get(Number(id)).then(r => {
                const o = r.data;
                setCustomerId(String(o.customerId));
                setPaymentMethod(o.paymentMethod);
                setItems(o.items.map(x => ({ foodItemId: String(x.foodItemId), quantity: x.quantity })));
            });
        }
    }, [isEdit, id]);

    const getPrice = (foodId) => foods.find(f => f.foodItemId === Number(foodId))?.price ?? 0;
    const lineTotal = (foodId, qty) => getPrice(foodId) * (qty || 0);
    const total = useMemo(
        () => items.reduce((s, it) => s + lineTotal(it.foodItemId, it.quantity), 0),
        [items, foods]
    );

    const addItem = () => setItems(prev => [...prev, { foodItemId: '', quantity: 1 }]);
    const removeItem = (i) => setItems(prev => prev.filter((_, idx) => idx !== i));
    const updateItem = (i, key, val) =>
        setItems(prev => prev.map((x, idx) => (idx === i ? { ...x, [key]: val } : x)));

    const submit = async (e) => {
        e.preventDefault();
        if (!isEdit && !customerId) return alert('Select a customer');
        if (!paymentMethod) return alert('Select payment method');
        if (!items.length || items.some(it => !it.foodItemId || Number(it.quantity) <= 0))
            return alert('Select foods and quantity >= 1');

        const dto = isEdit
            ? {
                paymentMethod,
                items: items.map(it => ({
                    foodItemId: Number(it.foodItemId),
                    quantity: Number(it.quantity)
                }))
            }
            : {
                customerId: Number(customerId),
                paymentMethod,
                items: items.map(it => ({
                    foodItemId: Number(it.foodItemId),
                    quantity: Number(it.quantity)
                }))
            };

        if (isEdit) await OrdersApi.update(Number(id), dto);
        else await OrdersApi.create(dto);

        navigate('/orders');
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="flex items-center justify-between">
                <BackButton>Back</BackButton>
                <h2 className="text-base font-semibold">{isEdit ? 'Edit Order' : 'New Order'}</h2>
            </div>

            <Card title="Restaurants (Customers)">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-sm text-[var(--muted)]">Customer</label>
                        {isEdit ? (
                            <input
                                value={customerId}
                                readOnly
                                className="bg-white/5 border border-white/10 rounded-md h-10 px-3 w-full"
                            />
                        ) : (
                            <div className="overflow-visible">
                                <DarkSelect
                                    value={customerId || ''}
                                    onValueChange={(val) => setCustomerId(val)}
                                    placeholder="Select customer"
                                >
                                    {customers.map(c => (
                                        <DarkOption key={c.customerId} value={String(c.customerId)}>
                                            {c.customerName}
                                        </DarkOption>
                                    ))}
                                </DarkSelect>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-sm text-[var(--muted)]">Payment Method</label>
                        <div className="overflow-visible">
                            <DarkSelect
                                value={paymentMethod}
                                onValueChange={(val) => setPaymentMethod(val)}
                                placeholder="Select method"
                            >
                                <DarkOption value="Cash">Cash</DarkOption>
                                <DarkOption value="Card">Card</DarkOption>
                                <DarkOption value="Online">Online</DarkOption>
                                <DarkOption value="Wallet">Wallet</DarkOption>
                            </DarkSelect>
                        </div>
                    </div>
                </div>
            </Card>

            <Card title="Items" subtitle="Choose food, set quantity, see live totals">
                <div className="overflow-auto rounded-lg border border-white/5">
                    <table className="w-full text-sm">
                        <thead className="text-left text-[var(--muted)] bg-white/5">
                        <tr>
                            <th className="py-2 px-3">Food</th>
                            <th className="py-2 px-3">Price</th>
                            <th className="py-2 px-3">Quantity</th>
                            <th className="py-2 px-3">Line Total</th>
                            <th className="py-2 px-3"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map((it, idx) => {
                            const price = getPrice(it.foodItemId);
                            const qty = Number(it.quantity) || 0;
                            const lt = price * qty;
                            return (
                                <tr key={idx} className="border-t border-white/5">
                                    <td className="py-2 px-3">
                                        <div className="overflow-visible">
                                            <DarkSelect
                                                value={it.foodItemId || ''}
                                                onValueChange={(val) => updateItem(idx, 'foodItemId', val)}
                                                placeholder="Select food"
                                            >
                                                {foods.map(f => (
                                                    <DarkOption key={f.foodItemId} value={String(f.foodItemId)}>
                                                        {f.foodItemName}
                                                    </DarkOption>
                                                ))}
                                            </DarkSelect>
                                        </div>
                                    </td>
                                    <td className="py-2 px-3">${price ? price.toFixed(2) : '0'} USD</td>
                                    <td className="py-2 px-3">
                                        <input
                                            type="number"
                                            min="1"
                                            value={qty}
                                            onChange={e => updateItem(idx, 'quantity', Number(e.target.value))}
                                            className="bg-white/5 border border-white/10 rounded-md h-10 px-3 w-24"
                                        />
                                    </td>
                                    <td className="py-2 px-3">
                                        {qty && price ? `${qty} x ${price.toFixed(2)} = ${lt.toFixed(2)}` : '0'}
                                    </td>
                                    <td className="py-2 px-3 text-right">
                                        <button
                                            type="button"
                                            onClick={() => removeItem(idx)}
                                            className="text-red-300 hover:text-red-200"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                        <tfoot>
                        <tr className="border-t border-white/5">
                            <td colSpan="3" className="py-3 px-3 text-right font-semibold">Total:</td>
                            <td className="py-3 px-3">${total.toFixed(2)} USD</td>
                            <td className="py-3 px-3"></td>
                        </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="mt-3">
                    <Button type="button" variant="ghost" onClick={addItem}>Add Item</Button>
                </div>
            </Card>

            <div className="flex justify-end">
                <Button type="submit">{isEdit ? 'Update' : 'Create'}</Button>
            </div>
        </form>
    );
}