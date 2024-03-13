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
  );

ALTER TABLE notifications
ADD CONSTRAINT notifications_receiptId_key UNIQUE (receiptId);

CREATE UNIQUE INDEX notifications_pkey ON notifications USING BTREE (id);

CREATE UNIQUE INDEX notifications_receiptId_key ON notifications USING BTREE (receiptId);
