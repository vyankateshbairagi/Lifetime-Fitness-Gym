import { Prisma } from "@prisma/client";
import { businessDateKey } from "@/lib/attendance-time";
import { previousBusinessDayEnd } from "@/lib/attendance-time";

export async function closeStaleAttendance(tx: Pick<Prisma.TransactionClient, "attendance">, organizationId: string, timeZone: string, now = new Date()) {
  const today = businessDateKey(now, timeZone);
  const [year, month, day] = today.split("-").map(Number);
  const todayStart = new Date(Date.UTC(year, month - 1, day));
  return tx.attendance.updateMany({
    where: { organizationId, checkOutTime: null, date: { lt: todayStart } },
    data: { checkOutTime: previousBusinessDayEnd(now, timeZone) },
  });
}
