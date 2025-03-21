-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "revision" INTEGER NOT NULL,
    "agent" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "time_observed" TIMESTAMP(3) NOT NULL,
    "time_occurred" TIMESTAMP(3) NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);
