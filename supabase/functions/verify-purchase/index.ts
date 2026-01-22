// Supabase Edge Function: verify-purchase
// Verifies StoreKit (iOS) or Stripe (Web) purchases and creates entitlements
// Deno runtime

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VerifyPurchaseRequest {
  platform: 'ios' | 'web'
  transactionId: string
  receipt?: string  // Base64 receipt (iOS)
  paymentIntentId?: string  // Stripe payment intent (Web)
}

interface AppleVerifyResponse {
  status: number
  receipt: {
    in_app: Array<{
      product_id: string
      transaction_id: string
      purchase_date_ms: string
      cancellation_date_ms?: string
    }>
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role (bypasses RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

    // Verify JWT token from request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      throw new Error('Invalid or expired token')
    }

    // Parse request body
    const body: VerifyPurchaseRequest = await req.json()
    const { platform, transactionId, receipt, paymentIntentId } = body

    if (!platform || !transactionId) {
      throw new Error('Missing required fields: platform, transactionId')
    }

    let entitlementData: {
      user_id: string
      product_id: string
      status: 'active' | 'expired' | 'refunded' | 'cancelled'
      acquired_at: string
      expires_at: string | null
      platform: 'ios' | 'web'
      source_txn_id: string
      receipt_data: string | null
    }

    // Platform-specific verification
    if (platform === 'ios') {
      if (!receipt) {
        throw new Error('Missing receipt for iOS purchase')
      }

      // Verify with Apple
      const appleEnv = Deno.env.get('APPLE_ENV') || 'sandbox'  // 'sandbox' or 'production'
      const verifyUrl = appleEnv === 'production'
        ? 'https://buy.itunes.apple.com/verifyReceipt'
        : 'https://sandbox.itunes.apple.com/verifyReceipt'

      const appleSharedSecret = Deno.env.get('APPLE_SHARED_SECRET')
      if (!appleSharedSecret) {
        throw new Error('APPLE_SHARED_SECRET not configured')
      }

      const appleResponse = await fetch(verifyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'receipt-data': receipt,
          'password': appleSharedSecret,
          'exclude-old-transactions': true,
        }),
      })

      const appleData: AppleVerifyResponse = await appleResponse.json()

      // Check verification status
      if (appleData.status !== 0) {
        // Status codes: https://developer.apple.com/documentation/appstorereceipts/status
        const statusMessages: Record<number, string> = {
          21000: 'The App Store could not read the JSON object you provided.',
          21002: 'The data in the receipt-data property was malformed or missing.',
          21003: 'The receipt could not be authenticated.',
          21004: 'The shared secret you provided does not match the shared secret on file for your account.',
          21005: 'The receipt server is not currently available.',
          21006: 'This receipt is valid but the subscription has expired.',
          21007: 'This receipt is from the test environment, but it was sent to the production environment for verification.',
          21008: 'This receipt is from the production environment, but it was sent to the test environment for verification.',
          21010: 'This receipt could not be authorized.',
        }

        throw new Error(
          `Apple receipt verification failed: ${statusMessages[appleData.status] || `Status ${appleData.status}`}`
        )
      }

      // Find the transaction in the receipt
      const transaction = appleData.receipt.in_app.find(
        (txn) => txn.transaction_id === transactionId
      )

      if (!transaction) {
        throw new Error('Transaction not found in receipt')
      }

      // Check if transaction was refunded/cancelled
      const isCancelled = !!transaction.cancellation_date_ms
      const status: 'active' | 'cancelled' = isCancelled ? 'cancelled' : 'active'

      // Prepare entitlement data
      entitlementData = {
        user_id: user.id,
        product_id: transaction.product_id,
        status,
        acquired_at: new Date(parseInt(transaction.purchase_date_ms)).toISOString(),
        expires_at: null,  // Lifetime purchase (non-consumable)
        platform: 'ios',
        source_txn_id: transactionId,
        receipt_data: receipt,
      }
    } else if (platform === 'web') {
      if (!paymentIntentId) {
        throw new Error('Missing paymentIntentId for web purchase')
      }

      // Verify with Stripe
      const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
      if (!stripeSecretKey) {
        throw new Error('STRIPE_SECRET_KEY not configured')
      }

      const stripeResponse = await fetch(
        `https://api.stripe.com/v1/payment_intents/${paymentIntentId}`,
        {
          headers: {
            'Authorization': `Bearer ${stripeSecretKey}`,
          },
        }
      )

      if (!stripeResponse.ok) {
        throw new Error('Failed to verify Stripe payment')
      }

      const stripeData = await stripeResponse.json()

      // Check payment status
      if (stripeData.status !== 'succeeded') {
        throw new Error(`Payment not successful: ${stripeData.status}`)
      }

      // Extract product ID from metadata
      const productId = stripeData.metadata?.product_id || 'com.vagusnervereset.premium.lifetime'

      // Prepare entitlement data
      entitlementData = {
        user_id: user.id,
        product_id: productId,
        status: 'active',
        acquired_at: new Date(stripeData.created * 1000).toISOString(),
        expires_at: null,  // Lifetime purchase
        platform: 'web',
        source_txn_id: paymentIntentId,
        receipt_data: JSON.stringify(stripeData),
      }
    } else {
      throw new Error('Unsupported platform')
    }

    // Insert or update entitlement in database
    const { data: existingEntitlement } = await supabase
      .from('entitlements')
      .select('*')
      .eq('user_id', entitlementData.user_id)
      .eq('product_id', entitlementData.product_id)
      .single()

    if (existingEntitlement) {
      // Update existing entitlement
      const { error: updateError } = await supabase
        .from('entitlements')
        .update({
          status: entitlementData.status,
          source_txn_id: entitlementData.source_txn_id,
          receipt_data: entitlementData.receipt_data,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', entitlementData.user_id)
        .eq('product_id', entitlementData.product_id)

      if (updateError) {
        throw new Error(`Failed to update entitlement: ${updateError.message}`)
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Entitlement updated successfully',
          entitlement: {
            product_id: entitlementData.product_id,
            status: entitlementData.status,
          },
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    } else {
      // Insert new entitlement
      const { error: insertError } = await supabase
        .from('entitlements')
        .insert(entitlementData)

      if (insertError) {
        throw new Error(`Failed to insert entitlement: ${insertError.message}`)
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Entitlement created successfully',
          entitlement: {
            product_id: entitlementData.product_id,
            status: entitlementData.status,
          },
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201,
        }
      )
    }
  } catch (error) {
    console.error('Error in verify-purchase:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'An unexpected error occurred',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
