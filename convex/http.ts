import { httpRouter } from "convex/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET");
    }

    // Read raw body
    let bodyText: string;
    try {
      bodyText = await request.text();
    } catch (err) {
      console.error("❌ Failed to read raw body", err);
      return new Response("Invalid body", { status: 400 });
    }

    // Get Svix headers
    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");

    if (!svix_id || !svix_signature || !svix_timestamp) {
      console.error("❌ Missing svix headers");
      return new Response("Missing headers", { status: 400 });
    }

    let evt: WebhookEvent;
    try {
      const wh = new Webhook(webhookSecret);
      evt = wh.verify(bodyText, {
        "svix-id": svix_id,
        "svix-signature": svix_signature,
        "svix-timestamp": svix_timestamp,
      }) as WebhookEvent;
    } catch (err) {
      console.error("❌ Verification failed", err);
      return new Response("Invalid signature", { status: 400 });
    }

    console.log("✅ Webhook verified:", evt.type);

    // Handle user.created
    if (evt.type === "user.created") {
      const { id, first_name, last_name, image_url, email_addresses } = evt.data;
      const email = email_addresses[0]?.email_address;
      const name = `${first_name || ""} ${last_name || ""}`.trim();

      try {
        await ctx.runMutation(api.users.syncUser, {
          email,
          name,
          image: image_url,
          clerkId: id,
        });
        console.log("✅ User synced to DB");
      } catch (error) {
        console.error("❌ Error syncing user:", error);
        return new Response("Failed to sync user", { status: 500 });
      }
    }

    return new Response("Webhook processed", { status: 200 });
  }),
});

export default http;
