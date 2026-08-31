import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as crypto from "crypto";

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Paystack Webhook Cloud Function (HTTP Endpoint)
 * Verifies Paystack HMAC SHA-512 signature and promotes user to Premium upon successful payment.
 */
export const paystackWebhook = functions.https.onRequest(async (req, res) => {
  // Only allow POST requests for webhooks
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const secret = process.env.PAYSTACK_WEBHOOK_SECRET || process.env.PAYSTACK_SECRET_KEY || "";
  const signature = (req.headers["x-paystack-signature"] || req.headers["x-paystack-signature-512"]) as string;

  // 1. Verify HMAC SHA-512 Signature
  if (secret) {
    if (!signature) {
      console.error("[Paystack Webhook] Missing x-paystack-signature header.");
      res.status(400).json({ error: "Missing x-paystack-signature header." });
      return;
    }

    try {
      const hash = crypto
        .createHmac("sha512", secret)
        .update((req as any).rawBody || JSON.stringify(req.body))
        .digest("hex");

      if (hash.toLowerCase() !== signature.toLowerCase()) {
        console.error("[Paystack Webhook] Invalid signature verification.");
        res.status(400).json({ error: "Invalid signature." });
        return;
      }
    } catch (err: any) {
      console.error("[Paystack Webhook] Signature verification error:", err?.message || err);
      res.status(400).json({ error: "Signature verification failed." });
      return;
    }
  }

  const payload = req.body || {};
  const event = payload.event;
  const data = payload.data || {};

  console.log(`[Paystack Webhook] Event received: ${event}`);

  // Handle Paystack test pings
  if (!event || event === "test") {
    res.status(200).json({ status: "success", message: "Paystack webhook ping received." });
    return;
  }

  // 2. Process Successful Payment Events
  if (
    event === "charge.success" ||
    event === "subscription.create" ||
    event === "subscription.enable" ||
    event === "paymentrequest.success"
  ) {
    const reference = data.reference || data.trxref || data.id;
    const metadata = data.metadata || {};
    const customer = data.customer || {};

    // Extract User ID: metadata.uid, metadata.userId, or custom_fields
    let uid: string | undefined = metadata.uid || metadata.userId;

    if (!uid && Array.isArray(metadata.custom_fields)) {
      const userField = metadata.custom_fields.find(
        (f: any) => f.variable_name === "user_id" || f.variable_name === "uid" || f.variable_name === "userId"
      );
      if (userField?.value) {
        uid = userField.value;
      }
    }

    const email = customer.email || metadata.email || "";

    // Fallback: lookup user by email in Firestore if UID is not in metadata
    if (!uid && email) {
      try {
        const userQuery = await db
          .collection("users")
          .where("email", "==", email.toLowerCase().trim())
          .limit(1)
          .get();

        if (!userQuery.empty) {
          uid = userQuery.docs[0].id;
        }
      } catch (lookupErr: any) {
        console.warn("[Paystack Webhook] User lookup by email fallback error:", lookupErr?.message || lookupErr);
      }
    }

    if (!uid) {
      console.error(`[Paystack Webhook] Cannot identify user for reference ${reference}. Email: ${email}`);
      res.status(200).json({
        status: "skipped",
        message: "No user UID or matching email found in transaction."
      });
      return;
    }

    const plan = metadata.plan || (data.amount >= 20000000 ? "yearly" : "monthly");
    const durationDays = plan === "yearly" ? 365 : 30;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + durationDays);

    try {
      const userRef = db.collection("users").doc(uid);

      // Upgrade the athlete's document in Firestore
      await userRef.set(
        {
          isPremium: true,
          premiumAccess: true,
          subscription: "premium",
          subscriptionStatus: "premium",
          subscriptionPlan: plan,
          subscriptionTier: plan,
          accountType: "Premium Athlete",
          badge: "Premium Athlete",
          subscriptionDate: new Date().toISOString(),
          subscriptionExpiry: expiryDate.toISOString(),
          lastPaymentReference: reference,
          lastPaymentAmount: data.amount ? data.amount / 100 : undefined,
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );

      // Record transaction history in Firestore
      if (reference) {
        await db
          .collection("transactions")
          .doc(String(reference))
          .set(
            {
              userId: uid,
              userEmail: email,
              reference: String(reference),
              amount: data.amount ? data.amount / 100 : 0,
              currency: data.currency || "NGN",
              channel: data.channel || "card",
              status: "success",
              plan: plan,
              paidAt: data.paid_at || new Date().toISOString(),
              createdAt: admin.firestore.FieldValue.serverTimestamp()
            },
            { merge: true }
          );
      }

      console.log(`[Paystack Webhook] Successfully upgraded user ${uid} to Premium! Reference: ${reference}`);
      res.status(200).json({ status: "success", uid, reference });
      return;
    } catch (dbErr: any) {
      console.error(`[Paystack Webhook] Database update error for user ${uid}:`, dbErr?.message || dbErr);
      res.status(500).json({ error: "Failed to update user record." });
      return;
    }
  }

  // Acknowledge other event types (e.g. invoice.create)
  res.status(200).json({ status: "ignored", event });
});
