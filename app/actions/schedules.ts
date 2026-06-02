"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { workflowConfigs } from "@/lib/db/schema";
import { getCurrentOrg } from "@/lib/auth/org";
import { buildCron } from "@/lib/utils/cron";

export async function saveScheduleAction(
  workflowName: string,
  formData: FormData
): Promise<void> {
  const { tenantId } = await getCurrentOrg();

  const time = formData.get("time");
  const rawDays = formData.getAll("days");

  if (typeof time !== "string" || !/^\d{2}:\d{2}$/.test(time)) {
    throw new Error("Invalid time format");
  }

  const days = rawDays.map((d) => Number(d)).filter((d) => d >= 0 && d <= 6);
  const cron = buildCron({ time, days });

  const [existing] = await db
    .select({ id: workflowConfigs.id })
    .from(workflowConfigs)
    .where(
      and(
        eq(workflowConfigs.tenantId, tenantId),
        eq(workflowConfigs.workflowName, workflowName)
      )
    );

  if (existing) {
    await db
      .update(workflowConfigs)
      .set({ scheduleCron: cron, enabled: "yes" })
      .where(eq(workflowConfigs.id, existing.id));
  } else {
    await db.insert(workflowConfigs).values({
      tenantId,
      workflowName,
      scheduleCron: cron,
      enabled: "yes",
    });
  }

  revalidatePath("/schedules");
}
