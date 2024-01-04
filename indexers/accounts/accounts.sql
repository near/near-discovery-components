CREATE TABLE
  "accounts" (
    "account_id" text NOT NULL,
    "block_height" INT NOT NULL,
    "block_timestamp_ms" BIGINT NOT NULL,
    "name" text,
    "description" text,
    "image" text,
    "background_image" text,
    "horizon_tnc" boolean,
    "linktree" text,
    PRIMARY KEY ("account_id")
  )
