# Intern Project: Frontend — Backend Integration for ArulEducation Website

Overview
- This project completes the frontend-to-backend integration for the ArulEducation site, focusing on the donation/payment flow, data capture, and minimal server endpoints to accept and verify payments. The intern will implement and test the backend endpoints, wire them into the existing frontend, and provide documentation and deployment notes.

Goals
- Implement secure server endpoints that the frontend expects (/api/razorpay/order and /api/razorpay/verify).
- Ensure the donation flow completes end-to-end: frontend creates an order, opens payment SDK (Razorpay), backend verifies the signature, and receipts/tax certificates are issued.
- Preserve user experience fallbacks already added in the frontend (redirect to `/payment` if SDK/backend not available).

Required Work Items
1. Project setup
   - Clone the repo and install dependencies (`npm install`).
   - Create a `.env` file with the following variables:
     - `RAZORPAY_KEY_ID`
     - `RAZORPAY_KEY_SECRET`
     - `PORT` (optional, default 3000)
   - Provide brief README steps for running the server locally.

2. Implement server endpoints (Node + Express recommended)
   - `POST /api/razorpay/order`
     - Input: `{ amount: number, currency?: string, donationType?: string, paymentMethod?: string }` (amount in smallest unit: paise)
     - Action: create order using Razorpay SDK (server-side) and return `{ orderId, amount, currency, keyId }` where `keyId` is `RAZORPAY_KEY_ID`.
     - Security: validate request payload and rate-limit to prevent abuse.

   - `POST /api/razorpay/verify`
     - Input: `{ razorpay_payment_id, razorpay_order_id, razorpay_signature }` (from client handler)
     - Action: compute expected signature using `HMAC_SHA256(order_id + '|' + payment_id, RAZORPAY_KEY_SECRET)` and compare. On success, store transaction record and return 200 OK.
     - Additional: send email receipt (optional) and mark donation for tax certificate issuance.

3. (Optional) Webhooks
   - Configure Razorpay webhooks to verify payment events server-side as a backup verification. Provide endpoint `POST /api/razorpay/webhook` and verify webhook secret.

4. Persistence & receipts
   - Minimal DB: use SQLite/Postgres to store transactions with fields (id, orderId, paymentId, amount, currency, donorName, email, phone, status, createdAt).
   - Generate a simple tax-exemption certificate template (PDF or HTML) and provide an endpoint or scheduled job to email certificates.

5. Testing & QA
   - Manual test plan: create orders with sandbox/test keys, complete payment, verify signature and data persistence.
   - Add unit tests for signature verification logic.

Security & Compliance Notes
- Do not expose `RAZORPAY_KEY_SECRET` in frontend or source control. Use environment variables.
- Log payment failures for reconciliation but avoid logging full PII. Store only necessary donor info and handle deletes/retention according to policy.

Deliverables
- Working server code under `server/` with `start` script in `server/package.json`.
- Updated `README.md` with server run steps and environment variables.
- Test results and a short demo script (how to exercise the donation flow locally).
- (Optional) SQL migration or seed data if using a DB.

Acceptance Criteria
- Frontend `Donate` and `DonationSection` open Razorpay checkout when backend endpoints exist and payment flow finishes on `/payment-success`.
- Backend verifies signatures for payments and returns 200 on valid verification.
- Redirects and fallbacks function when backend/SDK are unavailable.

Mentorship / Handoff
- Expected time: 1–2 weeks depending on prior experience.
- Pair with mentor for first endpoint implementation and test.
- Submit pull request with changes and include sample `.env.example` (without secrets).

Notes for the intern
- The frontend already contains a central client `src/lib/paymentClient.ts` and README instructions. Use that client or call the same endpoints so the integration is seamless.
- If you prefer another payment provider, keep endpoints consistent (order + verify) and update frontend `VITE_API_BASE` if the API is hosted separately.
