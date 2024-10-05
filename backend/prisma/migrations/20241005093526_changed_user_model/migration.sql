/*
  Warnings:

  - You are about to drop the `Follow` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_followedId_fkey";

-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_followerId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "followers" INTEGER[],
ADD COLUMN     "following" INTEGER[];

-- DropTable
DROP TABLE "Follow";
