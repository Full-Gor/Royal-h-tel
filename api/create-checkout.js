// /api/create-checkout.js
import Stripe from 'stripe';

export default async function handler(req, res) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-08-16'
  });

  if (req.method === 'POST') {
    try {
      const { bookingId, amount, roomName, customerEmail } = req.body;

      // Validation stricte des paramètres
      if (!bookingId || typeof bookingId !== 'string' || bookingId.length > 100) {
        return res.status(400).json({ error: 'BookingId invalide' });
      }

      if (!amount || typeof amount !== 'number' || amount <= 0 || amount > 50000) {
        return res.status(400).json({ error: 'Montant invalide (0-50000€)' });
      }

      if (!roomName || typeof roomName !== 'string' || roomName.length > 200) {
        return res.status(400).json({ error: 'Nom de chambre invalide' });
      }

      if (customerEmail && (typeof customerEmail !== 'string' || !customerEmail.includes('@') || customerEmail.length > 254)) {
        return res.status(400).json({ error: 'Email invalide' });
      }

      // Sanitisation des chaînes
      const sanitizedRoomName = roomName.replace(/<[^>]*>/g, '').trim();
      const sanitizedBookingId = bookingId.replace(/[^a-zA-Z0-9-_]/g, '');

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: sanitizedRoomName,
                description: `Réservation au Château Royal - ${sanitizedRoomName}`,
              },
              unit_amount: Math.round(amount * 100), // Prix en centimes
            },
            quantity: 1,
          }
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${sanitizedBookingId}`,
        cancel_url: `${req.headers.origin}/chambres`,
        customer_email: customerEmail,
        metadata: {
          bookingId: sanitizedBookingId,
        },
        expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // Expire dans 30 minutes
      });

      res.status(200).json({ id: session.id });
    } catch (error) {
      console.error('Erreur Stripe:', error.message);
      res.status(500).json({ error: 'Erreur de traitement du paiement' });
    }
  } else {
    res.status(405).end('Method Not Allowed');
  }
}
