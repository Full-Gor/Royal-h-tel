// /api/verify-payment.js
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-08-16'
  });

  if (req.method === 'POST') {
    try {
      const { session_id, booking_id } = req.body;

      // Validation stricte des paramètres
      if (!session_id || typeof session_id !== 'string' || session_id.length > 200) {
        return res.status(400).json({
          success: false,
          error: 'Session ID invalide'
        });
      }

      if (booking_id && (typeof booking_id !== 'string' || booking_id.length > 100)) {
        return res.status(400).json({
          success: false,
          error: 'Booking ID invalide'
        });
      }

      // Récupérer les informations de la session Stripe
      const session = await stripe.checkout.sessions.retrieve(session_id);

      if (session.payment_status === 'paid') {
        // Mettre à jour la réservation dans Supabase
        if (booking_id) {
          const { error: updateError } = await supabase
            .from('bookings')
            .update({
              payment_status: 'paid',
              status: 'confirmed',
              stripe_payment_id: session.payment_intent,
              updated_at: new Date().toISOString(),
            })
            .eq('id', booking_id);

          if (updateError) {
            console.error('Erreur lors de la mise à jour de la réservation:', updateError);
            return res.status(500).json({
              success: false,
              error: 'Erreur lors de la mise à jour de la réservation'
            });
          }
        }

        res.json({
          success: true,
          payment_status: session.payment_status,
          customer_email: session.customer_details?.email,
        });
      } else {
        res.json({
          success: false,
          payment_status: session.payment_status
        });
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du paiement:', error.message);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la vérification du paiement'
      });
    }
  } else {
    res.status(405).end('Method Not Allowed');
  }
}
