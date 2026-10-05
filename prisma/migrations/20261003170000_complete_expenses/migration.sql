ALTER TABLE "expenses"
  ALTER COLUMN "category" TYPE "ExpenseCategory"
  USING (
    CASE "category"
      WHEN 'RENT' THEN 'RENT'::"ExpenseCategory"
      WHEN 'ELECTRICITY' THEN 'ELECTRICITY'::"ExpenseCategory"
      WHEN 'WATER' THEN 'WATER'::"ExpenseCategory"
      WHEN 'INTERNET' THEN 'INTERNET'::"ExpenseCategory"
      WHEN 'EQUIPMENT' THEN 'EQUIPMENT'::"ExpenseCategory"
      WHEN 'EQUIPMENT_REPAIR' THEN 'EQUIPMENT_REPAIR'::"ExpenseCategory"
      WHEN 'MAINTENANCE' THEN 'MAINTENANCE'::"ExpenseCategory"
      WHEN 'CLEANING' THEN 'CLEANING'::"ExpenseCategory"
      WHEN 'STAFF' THEN 'STAFF'::"ExpenseCategory"
      WHEN 'MARKETING' THEN 'MARKETING'::"ExpenseCategory"
      WHEN 'SUPPLIES' THEN 'SUPPLIES'::"ExpenseCategory"
      WHEN 'SOFTWARE' THEN 'SOFTWARE'::"ExpenseCategory"
      WHEN 'INSURANCE' THEN 'INSURANCE'::"ExpenseCategory"
      WHEN 'TAX' THEN 'TAX'::"ExpenseCategory"
      WHEN 'MISCELLANEOUS' THEN 'MISCELLANEOUS'::"ExpenseCategory"
      ELSE 'OTHER'::"ExpenseCategory"
    END
  );

CREATE INDEX "expenses_paymentMethod_idx" ON "expenses"("paymentMethod");
