// /api/create-checkout.js
const Stripe = require('stripe');

module.exports = async function handler(req, res) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-08-16'
  });

  if (req.method === 'POST') {
    try {
      const { bookingId, amount, roomName, customerEmail } = req.body;

      // Validation des paramètres
      if (!bookingId || !amount || !roomName) {
        return res.status(400).json({
          error: 'Paramètres manquants: bookingId, amount, roomName requis'
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: roomName,
                description: `Réservation au Château Royal - ${roomName}`,
              },
              unit_amount: Math.round(amount * 100), // Prix en centimes
            },
            quantity: 1,
          }
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
        cancel_url: `${req.headers.origin}/chambres`,
        customer_email: customerEmail,
        metadata: {
          bookingId: bookingId,
        },
        expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // Expire dans 30 minutes
      });

      res.status(200).json({ id: session.id });
    } catch (error) {
      console.error('Erreur Stripe:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end('Method Not Allowed');
  }
}
