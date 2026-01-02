export const API_BASE = (import.meta.env.VITE_API_BASE as string) || '';

export async function createOrder(amountPaise: number, donationType = 'one-time', paymentMethod = 'card') {
  const resp = await fetch(`${API_BASE}/api/razorpay/order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: amountPaise, currency: 'INR', donationType, paymentMethod })
  });
  if (!resp.ok) throw new Error(await resp.text());
  return resp.json();
}

export async function verifyPayment(payload: any) {
  const resp = await fetch(`${API_BASE}/api/razorpay/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!resp.ok) throw new Error(await resp.text());
  return resp.json();
}

export default { createOrder, verifyPayment };
