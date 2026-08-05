-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deactivatedAt" TIMESTAMP(3),
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "preferences" JSONB,
ADD COLUMN     "tokenVersion" INTEGER NOT NULL DEFAULT 0;
