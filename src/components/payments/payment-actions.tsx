"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { refundPayment } from "@/actions/payments";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function PaymentActions({ paymentId, amount, canRefund }: { paymentId: string; amount: string; canRefund: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const removePayment = () => {
    startTransition(async () => {
      setError("");
      const result = await refundPayment({ paymentId, amount, reason });
      if (!result.success) {
        setError(result.message);
        return;
      }
      setOpen(false);
      setReason("");
      router.refresh();
    });
  };

  if (!canRefund) return null;
  return <>
    <Button variant="outline" size="sm" onClick={() => setOpen(true)}>Remove</Button>
    <Dialog open={open} onOpenChange={(value) => !value && !isPending && setOpen(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove payment?</DialogTitle>
          <DialogDescription>This records a full refund for ₹{amount}. The original financial record is preserved for audit history.</DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-3">
          <Input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Reason for removing this payment" aria-label="Reason for removing payment" />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-3">
            <Button variant="outline" disabled={isPending} onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="destructive" disabled={isPending || !reason.trim()} onClick={removePayment}>{isPending ? "Removing..." : "Remove payment"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </>;
}
