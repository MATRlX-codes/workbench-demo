"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { tenants } from "@/lib/db/schema";
import { getCurrentOrg } from "@/lib/auth/org";

export async function updateSettingsAction(formData: FormData): Promise<void> {
  const { tenantId } = await getCurrentOrg();

  const businessName = formData.get("businessName");
  const country = formData.get("country");
  const currency = formData.get("currency");
  const toneOfVoice = formData.get("toneOfVoice");
  const signOff = formData.get("signOff");

  if (typeof businessName !== "string" || businessName.trim() === "") {
    throw new Error("Business name is required");
  }

  await db
    .update(tenants)
    .set({
      businessName: businessName.trim(),
      country: (country as "IE" | "GB-NIR") ?? "IE",
      currency: (currency as "EUR" | "GBP") ?? "EUR",
      toneOfVoice: typeof toneOfVoice === "string" && toneOfVoice.trim() ? toneOfVoice.trim() : null,
      signOff: typeof signOff === "string" && signOff.trim() ? signOff.trim() : null,
    })
    .where(eq(tenants.id, tenantId));

  revalidatePath("/settings");
}
