# Stripe Integration Setup Guide

## Issues Fixed

### 1. Cart Page Not Showing Immediately
**Problem**: When clicking the cart icon, the cart page didn't show until after a refresh.

**Solution**: 
- Modified `CartContext.jsx` to use `useCallback` hook for `fetchCart`
- This ensures cart data is refetched immediately when navigating to the cart page
- Added explicit cart refresh in `Cart.jsx` component's `useEffect`

### 2. Stripe Checkout Implementation
Complete Stripe payment integration has been implemented with:
- Credit/Debit card payment processing
- Cash on Delivery (COD) option
- Coupon code application
- Order summary with GST and delivery charges calculation
- Address selection from saved addresses

## Setup Instructions

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Configuration**
   - Copy `.env.example` to `.env.local`
   - Add your Stripe public key:
   ```
   VITE_STRIPE_PUBLIC_KEY=pk_test_your_key_here
   ```

3. **Get Stripe Keys**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com)
   - Navigate to Developers > API Keys
   - Copy your Publishable Key and Secret Key

### Backend Setup

1. **Install Dependencies**
   ```bash
   npm install stripe
   ```

2. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Add your Stripe secret key:
   ```
   STRIPE_SECRET_KEY=sk_test_your_key_here
   ```

3. **Verify Routes**
   - POST `/api/orders/checkout` - Create order with Stripe payment
   - POST `/api/orders/apply-coupon` - Apply coupon codes
   - GET `/api/orders/user` - Get user's orders
   - etc.

## Features Implemented

### 1. Checkout Page (`frontend/src/pages/Checkout.jsx`)
- Full checkout flow with order summary
- Multiple payment methods (Card, COD)
- Coupon application
- Address selection
- Real-time calculation of GST and delivery charges

### 2. Cart Context Enhancement
- Improved state management with useCallback
- Proper refetch on component mount
- Better error handling

### 3. Payment Processing
- Stripe payment intent creation
- Secure card tokenization
- Support for multiple payment methods
- Order creation after successful payment

## Stripe Test Cards

For testing in development:

| Card Number | Exp Date | CVC | Result |
|-------------|----------|-----|--------|
| 4242 4242 4242 4242 | 12/25 | 123 | Success |
| 4000 0000 0000 9995 | 12/25 | 123 | Declined |
| 4000 0025 0000 3155 | 12/25 | 123 | Requires Auth |

## How It Works

1. **User clicks Checkout**
   - Navigated to `/checkout` page
   - Cart items are displayed with summary

2. **Selects Delivery Address**
   - Fetches user's saved addresses
   - User selects preferred address

3. **Selects Payment Method**
   - Card: Requires card details
   - COD: No additional details needed

4. **Applies Coupon (Optional)**
   - System validates coupon
   - Displays discount amount
   - Updates total calculation

5. **Places Order**
   - For Card: Stripe processes payment
   - For COD: Order marked as pending
   - Order saved to database
   - Cart cleared
   - User redirected to orders page

## API Endpoints

### Create Order
```
POST /api/orders/checkout
Content-Type: application/json
Authorization: Bearer {token}

{
  "items": [
    {
      "product": "product_id",
      "quantity": 2,
      "size": "M"
    }
  ],
  "address": "address_id",
  "paymentMethod": "Card",
  "paymentMethodId": "pm_stripe_id",
  "couponCode": "DISCOUNT20"
}
```

### Apply Coupon
```
POST /api/orders/apply-coupon
Content-Type: application/json
Authorization: Bearer {token}

{
  "code": "DISCOUNT20",
  "orderAmount": 5000
}
```

Response:
```json
{
  "valid": true,
  "discount": 1000,
  "code": "DISCOUNT20",
  "description": "20% off on all items"
}
```

## Troubleshooting

### Issue: "Stripe is not defined"
- Ensure `VITE_STRIPE_PUBLIC_KEY` is set in `.env.local`
- Restart development server after adding env variables

### Issue: Payment fails
- Check if Stripe keys are valid (test keys start with `pk_test_` and `sk_test_`)
- Verify card number is one of the test cards
- Check browser console for specific error messages

### Issue: Cart data not updating
- Ensure you're using test stripe keys, not production keys
- Check that `MONGODB_URI` is correct in backend `.env`
- Verify cart API endpoint is working: `GET /api/cart`

## Notes
- All amounts are in INR (Indian Rupees)
- GST is fixed at 18%
- Free delivery on orders above ₹999
- Delivery charges: ₹99
- Return window: 7 days from delivery
