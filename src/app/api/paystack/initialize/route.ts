import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new Response(
        JSON.stringify({ error: "Non authentifié" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      )
    }

    const userId = (session.user as any).id
    const { plan } = await req.json()

    if (plan !== "PREMIUM") {
      return new Response(
        JSON.stringify({ error: "Plan invalide" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    // Get user email
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    })

    if (!user?.email) {
      return new Response(
        JSON.stringify({ error: "Email utilisateur non trouvé" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    // Initialize Paystack transaction
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY
    if (!paystackSecretKey) {
      throw new Error("PAYSTACK_SECRET_KEY not configured")
    }

    const amount = 5000 * 100 // 5000 XOF in kobo (Paystack uses smallest currency unit)
    const callbackUrl = `${process.env.NEXTAUTH_URL}/api/paystack/callback`

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        amount: amount,
        currency: "XOF",
        callback_url: callbackUrl,
        metadata: {
          userId: userId,
          plan: "PREMIUM",
          custom_fields: [
            {
              display_name: "Plan",
              variable_name: "plan",
              value: "Premium Monthly",
            },
          ],
        },
        channels: ["card", "mobile_money"], // Enable card and mobile money
      }),
    })

    const data = await response.json()

    if (!data.status) {
      throw new Error(data.message || "Paystack initialization failed")
    }

    return new Response(
      JSON.stringify({
        authorization_url: data.data.authorization_url,
        access_code: data.data.access_code,
        reference: data.data.reference,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error: any) {
    console.error("Paystack initialization error:", error)
    return new Response(
      JSON.stringify({
        error: "Erreur lors de l'initialisation du paiement",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
