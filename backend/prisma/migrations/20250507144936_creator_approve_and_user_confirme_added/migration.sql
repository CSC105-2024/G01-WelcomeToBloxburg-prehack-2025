-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TripParticipant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'PARTICIPANT',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "creatorApproved" BOOLEAN NOT NULL DEFAULT false,
    "userConfirmed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "TripParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TripParticipant_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TripParticipant" ("id", "role", "status", "tripId", "userId") SELECT "id", "role", "status", "tripId", "userId" FROM "TripParticipant";
DROP TABLE "TripParticipant";
ALTER TABLE "new_TripParticipant" RENAME TO "TripParticipant";
CREATE UNIQUE INDEX "TripParticipant_userId_tripId_key" ON "TripParticipant"("userId", "tripId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
