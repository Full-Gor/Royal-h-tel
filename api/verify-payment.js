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
    const { session_id, booking_id } = req.body;

    if (!session_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Session ID manquant' 
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
    console.error('Erreur lors de la vérification du paiement:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la vérification du paiement',
      details: error.message 
    });
  }
}
