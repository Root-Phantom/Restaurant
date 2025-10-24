import React, {useEffect, useState} from 'react';
import {OrdersApi} from '../../api/order.js';
import {useNavigate, useParams} from 'react-router-dom';

export default function OrderForm() {
    const {id} = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();

    const [orderNumber, setOrderNumber] = useState('ORD-20251024-0001');
    const [customerId, setCustomerId] = useState(3);
    const [paymentMethod, setPaymentMethod] = useState('Card');
    const [items, setItems] = useState([{foodItemId: 1, quantity: 2}]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEdit) {
            setLoading(true);
            OrdersApi.get(Number(id))
                .then(r => {
                    const o = r.data;
                    setOrderNumber(o.orderNumber);
                    setCustomerId(o.customerId);
                    setPaymentMethod(o.paymentMethod);
                    setItems(o.items.map(x => ({foodItemId: x.foodItemId, quantity: x.quantity})));
                })
                .finally(() => setLoading(false));
        }
    }, [isEdit, id]);

    const addItem = () => setItems(prev => [...prev, {foodItemId: 10, quantity: 1}]);
    const removeItem = (idx) => setItems(prev => prev.filter((_, i) => i !== idx));
    const updateItem = (idx, field, value) => {
        setItems(prev => prev.map((it, i) => i === idx ? {...it, [field]: value} : it));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!paymentMethod) return alert('Payment method is required');
        if (!items.length) return alert('At least one item is required');
        if (items.some(it => !it.foodItemId || it.quantity <= 0)) return alert('Invalid item');

        const dtoCreate = {orderNumber, customerId, paymentMethod, items};
        const dtoUpdate = {paymentMethod, items};

        setLoading(true);
        try {
            if (isEdit) {
                await OrdersApi.update(Number(id), dtoUpdate);
            } else {
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
            {!isEdit && (
                <>
                    <div>
                        <label>Order Number</label><br/>
                        <input value={orderNumber} onChange={e => setOrderNumber(e.target.value)}/>
                    </div>
                    <div>
                        <label>Customer ID</label><br/>
                        <input type="number" value={customerId}
                               onChange={e => setCustomerId(Number(e.target.value))}/>
                    </div>
                </>
            )}

            <div>
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
                {items.map((it, idx) => (
                    <div key={idx} style={{display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6}}>
                        <input type="number" placeholder="FoodItemId"
                               value={it.foodItemId}
                               onChange={e => updateItem(idx, 'foodItemId', Number(e.target.value))}/>
                        <input type="number" placeholder="Quantity"
                               value={it.quantity}
                               onChange={e => updateItem(idx, 'quantity', Number(e.target.value))}/>
                        <button type="button" onClick={() => removeItem(idx)}>Remove</button>
                    </div>
                ))}
                <button type="button" onClick={addItem}>Add Item</button>
            </div>

            <div style={{marginTop: 12}}>
                <button type="submit" disabled={loading}>{isEdit ? 'Update' : 'Create'}</button>
            </div>
        </form>
    );
}
