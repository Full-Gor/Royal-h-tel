import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}

// Désactiver le body parser par défaut pour les webhooks
export const bodyParser = false;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  let body = '';

  // Lire le body raw
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', async () => {
    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      console.error('Erreur de signature webhook:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Traiter les événements
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object;
          const bookingId = session.metadata?.bookingId;

          if (bookingId && session.payment_status === 'paid') {
            // Mettre à jour la réservation
            const { error } = await supabase
              .from('bookings')
              .update({
                payment_status: 'paid',
                status: 'confirmed',
                stripe_payment_id: session.payment_intent,
                updated_at: new Date().toISOString(),
              })
              .eq('id', bookingId);

            if (error) {
              console.error('Erreur lors de la mise à jour via webhook:', error);
            } else {
              console.log(`Réservation ${bookingId} confirmée via webhook`);
            }
          }
          break;

        case 'payment_intent.payment_failed':
          const paymentIntent = event.data.object;
          console.log('Paiement échoué:', paymentIntent.id);
          break;

        default:
          console.log(`Événement non traité: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Erreur lors du traitement du webhook:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });
}
