import React, {useEffect, useState} from 'react';
import {OrdersApi} from '../../api/order.js';
import {useParams, Link} from 'react-router-dom';

export default function OrderDetails() {
    const {id} = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        OrdersApi.get(Number(id)).then(r => setOrder(r.data));
    }, [id]);

    if (!order) return <div>Loading...</div>;

    return (<div>
        <h3>Order {order.orderNumber}</h3>
        <p>Customer: {order.customerName}</p>
        <p>Payment: {order.paymentMethod}</p>
        <table border="1" cellPadding="6" cellSpacing="0">
            <thead>
            <tr>
                <th>Food</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Line Total</th>
            </tr>
            </thead>
            <tbody>
            {order.items.map(it => (<tr key={it.orderDetailId}>
                <td>{it.foodItemName}</td>
                <td>{Number(it.foodItemPrice).toFixed(2)}</td>
                <td>{it.quantity}</td>
                <td>{Number(it.lineTotal).toFixed(2)}</td>
            </tr>))}
            </tbody>
        </table>
        <h4>Total: {Number(order.totalPrice).toFixed(2)}</h4>
        <p><Link to={`/orders/${order.orderMasterId}/edit`}>Edit</Link></p>
    </div>);
}
