/**
 * WhatsApp message helpers for gym management operations.
 * Formats phone numbers and prefilled messages for LifeTime Fitness Gym owner/staff.
 */

function formatWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.startsWith("91") && digits.length === 12) return digits;
  if (digits.startsWith("0") && digits.length === 11) return `91${digits.slice(1)}`;
  return digits;
}

export function getRenewalReminderUrl(params: {
  phone: string;
  memberName: string;
  planName: string;
  daysRemaining: number | string;
  endDate?: string;
}): string {
  const cleanPhone = formatWhatsAppNumber(params.phone);
  const message = [
    `*LifeTime Fitness Gym — Membership Renewal Notice* 🏋️`,
    `Hello ${params.memberName.trim()},`,
    `Your gym membership (*${params.planName}*) is expiring ${typeof params.daysRemaining === "number" && params.daysRemaining <= 0 ? "today" : `in ${params.daysRemaining} days`}${params.endDate ? ` on ${params.endDate}` : ""}.`,
    `Renew your plan today to keep up your workout consistency without any pause in training!`,
    `Feel free to reply here or visit the desk to renew.`,
    `— LifeTime Fitness Gym, Guruwar Peth, Pune`,
  ].join("\n\n");

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function getFeeReminderUrl(params: {
  phone: string;
  memberName: string;
  planName: string;
  pendingAmount: string | number;
}): string {
  const cleanPhone = formatWhatsAppNumber(params.phone);
  const formattedAmount = Number(params.pendingAmount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const message = [
    `*LifeTime Fitness Gym — Membership Fee Reminder* 📋`,
    `Hello ${params.memberName.trim()},`,
    `This is a gentle reminder regarding your pending membership dues for *${params.planName}*:`,
    `💰 *Outstanding Amount: ₹${formattedAmount}*`,
    `Kindly clear the pending balance at the gym desk via Cash, UPI (8446648527), or Card at your earliest convenience.`,
    `Thank you for training with us!`,
    `— LifeTime Fitness Gym, Pune`,
  ].join("\n\n");

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function getPaymentReceiptUrl(params: {
  phone: string;
  memberName: string;
  amount: string | number;
  receiptNumber: string;
  paymentMethod: string;
  planName?: string;
  date?: string;
}): string {
  const cleanPhone = formatWhatsAppNumber(params.phone);
  const formattedAmount = Number(params.amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const message = [
    `*LifeTime Fitness Gym — Payment Receipt* 🧾`,
    `Hello ${params.memberName.trim()},`,
    `We have successfully received your membership payment!`,
    `• *Receipt No:* ${params.receiptNumber}`,
    `• *Amount Paid:* ₹${formattedAmount}`,
    `• *Payment Mode:* ${params.paymentMethod.replace(/_/g, " ")}`,
    params.planName ? `• *Plan:* ${params.planName}` : "",
    params.date ? `• *Date:* ${params.date}` : "",
    `Keep training hard and stay consistent! 💪`,
    `— LifeTime Fitness Gym, Guruwar Peth, Pune (8446648527)`,
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
