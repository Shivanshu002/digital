import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const PRICES = {
  monthly: 2000, // £20.00 in pence
  yearly: 20000, // £200.00 in pence
}

export async function POST(req: NextRequest) {
  const { plan, userId } = await req.json()

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [{
      price_data: {
        currency: 'gbp',
        unit_amount: PRICES[plan as keyof typeof PRICES],
        product_data: {
          name: `GolfGives ${plan === 'monthly' ? 'Monthly' : 'Yearly'} Subscription`,
        },
      },
      quantity: 1,
    }],
    metadata: { userId, plan },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/signup`,
  })

  return NextResponse.json({ url: session.url })
}
