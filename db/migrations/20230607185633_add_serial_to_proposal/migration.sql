/*
  Warnings:

  - Added the required column `serial` to the `Proposal` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
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
INSERT INTO "new_Proposal" ("content", "createdAt", "creatorAddress", "daoId", "id", "title", "updatedAt") SELECT "content", "createdAt", "creatorAddress", "daoId", "id", "title", "updatedAt" FROM "Proposal";
DROP TABLE "Proposal";
ALTER TABLE "new_Proposal" RENAME TO "Proposal";
CREATE UNIQUE INDEX "Proposal_daoId_serial_key" ON "Proposal"("daoId", "serial");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
