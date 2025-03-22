/*
  Warnings:

  - A unique constraint covering the columns `[authToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `faction` on the `Character` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "rejected" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "faction",
ADD COLUMN     "faction" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authToken" TEXT,
ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "verificationToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_authToken_key" ON "User"("authToken");
