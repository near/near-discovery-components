CREATE TABLE
  "notifications" (
    "id" SERIAL,
    "blockHeight" DECIMAL(58, 0) NOT NULL,
    "initiatedBy" TEXT NOT NULL,
    "receiver" TEXT NOT NULL,
    "valueType" TEXT NOT NULL,
    "message" TEXT NULL,
    "itemType" TEXT NULL,
    "path" TEXT NULL,
    "devhubPostId" INT NULL,
    "actionAtBlockHeight" INT NULL,
    "receiptId" VARCHAR NULL,
    PRIMARY KEY ("id")
  )
