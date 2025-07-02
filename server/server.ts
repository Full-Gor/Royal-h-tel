// server/server.ts
import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

app.use(cors());
app.use(express.json());

// Route pour créer une session de paiement
app.post('/api/checkout', async (req, res) => {
  try {
    const { productName, price, bookingId, userId } = req.body;

    // URL de base pour les redirections
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://votre-domaine.com' 
      : 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: productName,
              description: 'Réservation au Château Royal',
            },
            unit_amount: Math.round(price * 100), // Stripe attend des centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // URLs de redirection corrigées
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
      cancel_url: `${baseUrl}/cancel?booking_id=${bookingId}`,
      metadata: {
        bookingId: bookingId,
        userId: userId,
      },
      // Informations client
      customer_email: req.body.customerEmail,
      // Expiration de la session (30 minutes)
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60),
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Erreur lors de la création de la session Stripe:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la création de la session de paiement',
      details: error.message 
    });
  }
});

// Route pour vérifier le paiement
app.post('/api/verify-payment', async (req, res) => {
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
});

// Webhook Stripe pour traiter les événements de paiement
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Erreur de signature webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Traiter les événements
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;

      if (bookingId && session.payment_status === 'paid') {
        try {
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
        } catch (error) {
          console.error('Erreur lors du traitement du webhook:', error);
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
});

// Route de santé
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Serveur Stripe en cours d'exécution sur le port ${PORT}`);
});