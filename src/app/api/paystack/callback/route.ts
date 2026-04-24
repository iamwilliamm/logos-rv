import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const reference = searchParams.get("reference")

    if (!reference) {
      return redirect("/pricing?error=no_reference")
    }

    // Verify transaction with Paystack
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY
    if (!paystackSecretKey) {
      throw new Error("PAYSTACK_SECRET_KEY not configured")
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
        },
      }
    )

    const data = await response.json()

    if (!data.status || data.data.status !== "success") {
      return redirect("/pricing?error=payment_failed")
    }

    // Extract user ID from metadata
    const userId = data.data.metadata?.userId

    if (!userId) {
      return redirect("/pricing?error=invalid_metadata")
    }

    // Update user to PREMIUM
    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: "PREMIUM",
      },
    })

    // Redirect to success page
    return redirect("/dashboard?payment=success")
  } catch (error: any) {
    console.error("Paystack callback error:", error)
    return redirect("/pricing?error=callback_failed")
  }
}
