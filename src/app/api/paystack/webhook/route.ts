import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get("x-paystack-signature")

    // Verify webhook signature
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY
    if (!paystackSecretKey) {
      throw new Error("PAYSTACK_SECRET_KEY not configured")
    }

    const hash = crypto
      .createHmac("sha512", paystackSecretKey)
      .update(body)
      .digest("hex")

    if (hash !== signature) {
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      )
    }

    const event = JSON.parse(body)

    // Handle different event types
    switch (event.event) {
      case "charge.success":
        // Payment successful
        const userId = event.data.metadata?.userId
        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: { plan: "PREMIUM" },
          })
        }
        break

      case "subscription.create":
        // Subscription created
        console.log("Subscription created:", event.data)
        break

      case "subscription.disable":
        // Subscription cancelled
        const cancelUserId = event.data.metadata?.userId
        if (cancelUserId) {
          await prisma.user.update({
            where: { id: cancelUserId },
            data: { plan: "FREE" },
          })
        }
        break

      default:
        console.log("Unhandled event:", event.event)
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error: any) {
    console.error("Webhook error:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
