-- AlterTable
ALTER TABLE "sessions" ADD COLUMN "impersonatedBy" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN "banExpires" DATETIME;
ALTER TABLE "users" ADD COLUMN "banReason" TEXT;
ALTER TABLE "users" ADD COLUMN "banned" BOOLEAN;
