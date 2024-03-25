CREATE TABLE
  "promote" (
    "id" SERIAL NOT NULL,
    "account_id" VARCHAR NOT NULL,
    "receipt_id" VARCHAR NOT NULL,
    "block_height" DECIMAL(58, 0) NOT NULL,
    "block_timestamp" DECIMAL(20, 0) NOT NULL,
    "promotion_type" TEXT NOT NULL,
    "raw_promotion" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "post_id" SERIAL NOT NULL
  );