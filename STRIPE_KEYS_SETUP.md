# How to Set Up Stripe Payment Integration

## Getting Stripe Keys

### Step 1: Create a Stripe Account
1. Go to https://stripe.com
2. Click "Sign Up" to create an account
3. Fill in your business details
4. Complete email verification

### Step 2: Get Your Test Keys
1. Log in to your Stripe Dashboard at https://dashboard.stripe.com
2. Make sure you're in **Test Mode** (toggle on top left)
3. Go to **Developers** → **API Keys**
4. You'll see two keys:
   - **Publishable Key** (starts with `pk_test_`)
   - **Secret Key** (starts with `sk_test_`)

### Step 3: Add Keys to Your Project

#### Frontend Setup (.env.local)
```bash
# Frontend - c:/Users/DELL/Desktop/Bewakoof-clone-mern/frontend/.env.local
VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY_HERE
VITE_API_URL=http://localhost:5000/api
```

Replace `pk_test_YOUR_KEY_HERE` with your actual Publishable Key from Stripe Dashboard.

#### Backend Setup (.env)
```bash
# Backend - c:/Users/DELL/Desktop/Bewakoof-clone-mern/.env
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
```

Replace `sk_test_YOUR_KEY_HERE` with your actual Secret Key from Stripe Dashboard.

### Step 4: Restart Your Applications
```bash
# Terminal 1: Backend
cd c:\Users\DELL\Desktop\Bewakoof-clone-mern
npm start

# Terminal 2: Frontend
cd c:\Users\DELL\Desktop\Bewakoof-clone-mern\frontend
npm run dev
```

## Testing Payment Flow

### Using Test Cards

Stripe provides test cards for development:

| Card Number | Exp Date | CVC | Result |
|-------------|----------|-----|--------|
| `4242 4242 4242 4242` | Any future date (MM/YY) | Any 3 digits | ✅ Succeeds |
| `4000 0000 0000 9995` | Any future date (MM/YY) | Any 3 digits | ❌ Fails |
| `4000 0025 0000 3155` | Any future date (MM/YY) | Any 3 digits | ⚠️ Requires Auth |

### Example Test Flow

1. **Add items to cart** from the shop
2. **Click cart icon** → Items show immediately
3. **Click Checkout**
4. **Select delivery address** (must have saved address)
5. **Choose payment method**: "Credit/Debit Card"
6. **Card details**:
   - Card Number: `4242 4242 4242 4242`
   - Expiry: `12/25`
   - CVC: `123`
   - Name: Any name
7. **Click Place Order**
8. Payment processes and order is created

### Using Cash on Delivery (No Stripe Required)

If you don't have Stripe keys yet, you can still test:
1. Add items to cart
2. Go to checkout
3. Select payment method: **Cash on Delivery (COD)**
4. Click Place Order
5. Order is created with "Pending" status

## Troubleshooting

### "Payment system not ready" Error
**Solution:**
- Check if VITE_STRIPE_PUBLIC_KEY is set in `.env.local`
- Restart the frontend dev server
- Check browser console for errors

### Card element not showing
**Solution:**
- Ensure Stripe public key is valid (starts with `pk_test_`)
- Refresh the page
- Check if you're using test mode keys (not production keys)

### Payment fails even with test card
**Solution:**
- Use the correct test card: `4242 4242 4242 4242`
- Ensure expiry date is in the future
- Check backend logs for errors
- Verify STRIPE_SECRET_KEY is set correctly in backend

### "Invalid API Key" Error
**Solution:**
- Double-check keys are copied completely (they're long strings!)
- Ensure you're using test keys (pk_test_ and sk_test_)
- Go to Stripe Dashboard to get fresh keys

## Current Status

✅ Cart functionality working
✅ Address management working
✅ Profile page implemented
✅ Checkout page built
⏳ Stripe integration ready (awaiting keys)

Once you add your Stripe keys, card payments will work automatically!

## Alternative: Use Cash on Delivery
You can test the entire flow without Stripe by:
1. Selecting "Cash on Delivery" payment method
2. Placing orders successfully
3. Managing orders and returns

This is perfect for testing the UI/UX without actual payment processing.
