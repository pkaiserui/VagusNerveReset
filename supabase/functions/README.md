# Supabase Edge Functions

This directory contains Deno-based Edge Functions for the Vagus Nerve Reset app.

## Functions

### `verify-purchase`

**Purpose**: Verify in-app purchases from iOS (StoreKit) or web (Stripe) and create/update entitlements in the database.

**Endpoint**: `POST /functions/v1/verify-purchase`

**Authentication**: Required (JWT token in Authorization header)

**Request Body**:
```json
{
  "platform": "ios" | "web",
  "transactionId": "1000000123456789",
  "receipt": "base64-encoded-receipt",  // Required for iOS
  "paymentIntentId": "pi_xxxxx"  // Required for web
}
```

**Response (Success - 200/201)**:
```json
{
  "success": true,
  "message": "Entitlement created successfully",
  "entitlement": {
    "product_id": "com.vagusnervereset.premium.lifetime",
    "status": "active"
  }
}
```

**Response (Error - 400)**:
```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

**Environment Variables Required**:
- `SUPABASE_URL` - Supabase project URL (auto-injected)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (auto-injected)
- `APPLE_SHARED_SECRET` - App Store Connect shared secret for receipt verification
- `APPLE_ENV` - 'sandbox' or 'production' (default: 'sandbox')
- `STRIPE_SECRET_KEY` - Stripe secret key for payment verification

---

## Deployment

### Prerequisites
1. Install Supabase CLI: `npm install -g supabase`
2. Login: `supabase login`
3. Link project: `supabase link --project-ref <your-project-ref>`

### Deploy Functions
```bash
# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy verify-purchase

# Deploy with environment secrets
supabase secrets set APPLE_SHARED_SECRET=your_secret_here
supabase secrets set APPLE_ENV=production
supabase secrets set STRIPE_SECRET_KEY=sk_live_xxxxx
```

### Test Locally
```bash
# Start local Supabase (includes Edge Functions)
supabase start

# Serve function locally
supabase functions serve verify-purchase --env-file ./supabase/.env.local

# Test with curl
curl -i --location --request POST 'http://localhost:54321/functions/v1/verify-purchase' \
  --header 'Authorization: Bearer YOUR_JWT_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{"platform":"ios","transactionId":"1000000123","receipt":"base64..."}'
```

---

## Security Considerations

1. **Service Role Key**: The function uses the service role key to bypass RLS and write to the `entitlements` table. This is necessary because users cannot directly insert entitlements.

2. **Receipt Verification**: Always verify receipts/payments with Apple/Stripe before creating entitlements. Never trust client-provided data.

3. **Idempotency**: The function is idempotent—calling it multiple times with the same transaction ID will update the existing entitlement, not create duplicates.

4. **Rate Limiting**: Consider adding rate limiting to prevent abuse (e.g., using Supabase Edge Function rate limits or a Redis cache).

5. **Logging**: All errors are logged to console. In production, consider using a logging service like Sentry or LogRocket.

---

## Error Handling

The function handles the following error cases:
- Missing or invalid JWT token
- Missing required fields in request body
- Apple receipt verification failures (various status codes)
- Stripe payment verification failures
- Database insert/update errors

All errors return a 400 status with a JSON error message.

---

## Future Enhancements

1. **Webhook Support**: Add a separate function to handle webhooks from Apple (App Store Server Notifications) and Stripe (Payment Intent updates) for automatic entitlement updates (e.g., refunds, cancellations).

2. **Subscription Support**: Extend to handle subscriptions (not just one-time purchases) by checking `expires_at` and handling renewals.

3. **Family Sharing**: Support Apple Family Sharing by checking the `in_app_ownership_type` field in receipts.

4. **Analytics**: Track purchase events for analytics (e.g., conversion rate, revenue).

---

## Debugging

### View Function Logs
```bash
supabase functions logs verify-purchase --tail
```

### Common Issues

**Issue**: "APPLE_SHARED_SECRET not configured"
- **Solution**: Set the secret in Supabase dashboard or via CLI: `supabase secrets set APPLE_SHARED_SECRET=your_secret`

**Issue**: "This receipt is from the test environment, but it was sent to the production environment"
- **Solution**: Set `APPLE_ENV=sandbox` for testing, `APPLE_ENV=production` for production builds

**Issue**: "Failed to verify Stripe payment"
- **Solution**: Ensure `STRIPE_SECRET_KEY` is set and the payment intent ID is correct

---

## Related Documentation
- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Apple Receipt Validation](https://developer.apple.com/documentation/appstorereceipts/verifyreceipt)
- [Stripe Payment Intents API](https://stripe.com/docs/api/payment_intents)
