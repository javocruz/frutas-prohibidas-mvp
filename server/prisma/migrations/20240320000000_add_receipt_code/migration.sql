-- Add receipt_code field
ALTER TABLE "receipts" ADD COLUMN "receipt_code" CHAR(8);
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_receipt_code_key" UNIQUE ("receipt_code");

-- Remove image_url field
ALTER TABLE "receipts" DROP COLUMN "image_url";

-- Create index on receipt_code
CREATE INDEX "idx_receipts_code" ON "receipts"("receipt_code"); 