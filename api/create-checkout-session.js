import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { productName, price, bookingId, userId, roomName, amount } = req.body;

    // URL de base pour les redirections
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? `https://${req.headers.host}` 
      : 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: productName || roomName || 'Réservation Château Royal',
              description: 'Réservation au Château Royal',
            },
            unit_amount: Math.round((price || amount) * 100), // Stripe attend des centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
      cancel_url: `${baseUrl}/cancel?booking_id=${bookingId}`,
      metadata: {
        bookingId: bookingId,
        userId: userId,
      },
      customer_email: req.body.customerEmail,
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Erreur lors de la création de la session Stripe:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la création de la session de paiement',
      details: error.message 
    });
  }
}
