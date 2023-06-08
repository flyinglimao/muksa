/*
  Warnings:

  - You are about to alter the column `votes` on the `Option` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to drop the column `endAt` on the `Proposal` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Option" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "content" TEXT NOT NULL,
    "votes" BIGINT NOT NULL,
    "proposalId" INTEGER NOT NULL,
    CONSTRAINT "Option_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Option" ("content", "createdAt", "id", "proposalId", "updatedAt", "votes") SELECT "content", "createdAt", "id", "proposalId", "updatedAt", "votes" FROM "Option";
DROP TABLE "Option";
ALTER TABLE "new_Option" RENAME TO "Option";
CREATE TABLE "new_Proposal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "serial" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creatorAddress" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "daoId" INTEGER NOT NULL,
    CONSTRAINT "Proposal_daoId_fkey" FOREIGN KEY ("daoId") REFERENCES "Dao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Proposal" ("content", "createdAt", "creatorAddress", "daoId", "id", "serial", "title", "updatedAt") SELECT "content", "createdAt", "creatorAddress", "daoId", "id", "serial", "title", "updatedAt" FROM "Proposal";
DROP TABLE "Proposal";
ALTER TABLE "new_Proposal" RENAME TO "Proposal";
CREATE UNIQUE INDEX "Proposal_daoId_serial_key" ON "Proposal"("daoId", "serial");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
