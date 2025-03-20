/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- First add the column as nullable
ALTER TABLE "User" ADD COLUMN "username" TEXT;

-- Update existing records with a value based on email
UPDATE "User" SET "username" = SUBSTRING(email FROM 1 FOR POSITION('@' IN email) - 1);

-- Now make it required and unique
ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;
ALTER TABLE "User" ADD CONSTRAINT "User_username_key" UNIQUE ("username");
