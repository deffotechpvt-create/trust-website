The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS


## Backend Integration — Payments

This frontend is ready to connect to a backend payment integration (example: Razorpay). Set `VITE_API_BASE` in your Vite env (for example `.env`) to the backend base URL if your API is hosted separately. By default the frontend calls relative `/api/razorpay/*` endpoints.

Required endpoints (example names and payloads):

- `POST /api/razorpay/order`
	- Request JSON: `{ amount: number, currency: string, donationType?: string, paymentMethod?: string }` (amount in smallest currency unit — paise for INR)
	- Response JSON: `{ orderId: string, amount: number, currency: string, keyId: string }`

- `POST /api/razorpay/verify`
	- Request JSON: the handler response from the Razorpay SDK `{ razorpay_payment_id, razorpay_order_id, razorpay_signature }`
	- Response: 200 OK on successful verification

Minimal Node/Express example (server-side) — replace with your secure implementation:

```js
// server/index.js (concept)
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const app = express();
app.use(express.json());

const razor = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });

app.post('/api/razorpay/order', async (req, res) => {
	const { amount } = req.body;
	const order = await razor.orders.create({ amount, currency: 'INR' });
	res.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID });
});

app.post('/api/razorpay/verify', (req, res) => {
	const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
	const body = razorpay_order_id + '|' + razorpay_payment_id;
	const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');
	if (expectedSignature === razorpay_signature) return res.status(200).send('ok');
	return res.status(400).send('invalid signature');
});

app.listen(3000);
```

Notes:
- Ensure server-side credentials (key id & secret) are kept private and never exposed in the frontend.
- For recurring (monthly) donations, implement server-side subscription management with your payment provider.
- Send tax-exemption certificates/email receipts from backend after successful payment verification.

Environment variables used by the frontend:

- `VITE_API_BASE` — optional base URL for API calls (e.g. `https://api.example.org`)

Legal pages (privacy, terms, cancellation & refunds) are already present under `src/pages/` and linked in the footer. During checkout the frontend requires users to accept terms; ensure backend records consent if needed for compliance.


