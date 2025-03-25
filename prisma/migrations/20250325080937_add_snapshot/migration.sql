-- CreateTable
CREATE TABLE "snapshots" (
    "id" TEXT NOT NULL,
    "aggregate_id" TEXT NOT NULL,
    "revision" INTEGER NOT NULL,
    "state" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "snapshots_aggregate_id_idx" ON "snapshots"("aggregate_id");
