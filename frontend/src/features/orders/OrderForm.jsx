import React, {useEffect, useMemo, useState} from 'react';
import {OrdersApi} from '../../api/orders.js';
import {CustomersApi} from '../../api/customers.js';
import {FoodApi} from '../../api/food.js';
import {useNavigate, useParams} from 'react-router-dom';

export default function OrderForm() {
    const {id} = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();

    const [customerId, setCustomerId] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Card');
    const [items, setItems] = useState([{foodItemId: '', quantity: 1}]);

    const [customers, setCustomers] = useState([]);
    const [foods, setFoods] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        CustomersApi.list().then(r => setCustomers(r.data || []));
        FoodApi.list().then(r => setFoods(r.data || []));
    }, []);

    useEffect(() => {
        if (isEdit) {
            setLoading(true);
            OrdersApi.get(Number(id))
                .then(r => {
                    const o = r.data;
                    setCustomerId(o.customerId);
                    setPaymentMethod(o.paymentMethod);
                    setItems(o.items.map(x => ({foodItemId: x.foodItemId, quantity: x.quantity})));
                })
                .finally(() => setLoading(false));
        }
    }, [isEdit, id]);

    const getPrice = (foodId) => {
        const f = foods.find(x => x.foodItemId === Number(foodId));
        return f?.price ?? 0;
    };

    const lineTotal = (foodId, qty) => {
        const price = getPrice(foodId);
        return (price * (qty || 0));
    };

    const grandTotal = useMemo(() => {
        return items.reduce((sum, it) => sum + lineTotal(it.foodItemId, it.quantity), 0);
    }, [items, foods]);

    const addItem = () => setItems(prev => [...prev, {foodItemId: '', quantity: 1}]);

    const removeItem = (idx) => setItems(prev => prev.filter((_, i) => i !== idx));

    const updateItem = (idx, field, value) => {
        setItems(prev => prev.map((it, i) => i === idx ? {...it, [field]: value} : it));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!isEdit && !customerId) return alert('Select a customer.');
        if (!paymentMethod) return alert('Payment method is required.');
        if (!items.length) return alert('At least one item is required.');
        if (items.some(it => !it.foodItemId || Number(it.quantity) <= 0)) {
            return alert('Each item must have a food and quantity >= 1.');
        }

        setLoading(true);
        try {
            if (isEdit) {
                const dtoUpdate = {
                    paymentMethod, items: items.map(it => ({
                        foodItemId: Number(it.foodItemId), quantity: Number(it.quantity)
                    }))
                };
                await OrdersApi.update(Number(id), dtoUpdate);
            } else {
                const dtoCreate = {
                    customerId: Number(customerId), paymentMethod,
                    items: items.map(it => ({foodItemId: Number(it.foodItemId), quantity: Number(it.quantity)}))
                };
                await OrdersApi.create(dtoCreate);
            }
            navigate('/orders');
        } catch (err) {
            alert(err?.response?.data?.title || err?.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <div style={{marginBottom: 10}}>
                <label>Restaurants (Customers)</label><br/>
                {isEdit ? (
                    <input value={customerId} readOnly/>
                ) : (
                    <select value={customerId} onChange={e => setCustomerId(e.target.value)}>
                        <option value="">Select customer</option>
                        {customers.map(c => (
                            <option key={c.customerId} value={c.customerId}>{c.customerName}</option>
                        ))}
                    </select>
                )}
            </div>

            <div style={{marginBottom: 10}}>
                <label>Payment Method</label><br/>
                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Online">Online</option>
                    <option value="Wallet">Wallet</option>
                </select>
            </div>

            <div style={{marginTop: 12}}>
                <h4>Items</h4>
                <table border="1" cellPadding="6" cellSpacing="0" width="100%">
                    <thead>
                    <tr>
                        <th>Food</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Line Total</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((it, idx) => {
                        const price = getPrice(it.foodItemId);
                        const qty = Number(it.quantity) || 0;
                        const lt = price * qty;
                        return (
                            <tr key={idx}>
                                <td>
                                    <select
                                        value={it.foodItemId}
                                        onChange={e => updateItem(idx, 'foodItemId', e.target.value)}
                                    >
                                        <option value="">Select food</option>
                                        {foods.map(f => (
                                            <option key={f.foodItemId} value={f.foodItemId}>
                                                {f.foodItemName}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>{price ? price.toFixed(2) : '-'}</td>
                                <td>
                                    <input
                                        type="number"
                                        min="1"
                                        value={qty}
                                        onChange={e => updateItem(idx, 'quantity', Number(e.target.value))}
                                        style={{width: 80}}
                                    />
                                </td>
                                <td>{qty && price ? `${qty} x ${price.toFixed(2)} = ${lt.toFixed(2)}` : '-'}</td>
                                <td>
                                    <button type="button" onClick={() => removeItem(idx)}>Remove</button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colSpan="3" style={{textAlign: 'right'}}>Total:</td>
                        <td>{grandTotal.toFixed(2)}</td>
                        <td></td>
                    </tr>
                    </tfoot>
                </table>

                <button type="button" onClick={addItem} style={{marginTop: 8}}>
                    Add Item
                </button>
            </div>

            <div style={{marginTop: 12}}>
                <button type="submit" disabled={loading}>
                    {isEdit ? 'Update' : 'Create'}
                </button>
            </div>
        </form>
    );
}
