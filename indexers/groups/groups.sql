CREATE TABLE
 "posts" (
   "id" SERIAL NOT NULL,
   "account_id" VARCHAR NOT NULL,
   "group_id" VARCHAR NOT NULL,
   "block_height" DECIMAL(58, 0) NOT NULL,
   "receipt_id" VARCHAR NOT NULL,
   "content" TEXT NOT NULL,
   "block_timestamp" DECIMAL(20, 0) NOT NULL,
   "accounts_liked" JSONB NOT NULL,
   "last_comment_timestamp" DECIMAL(20, 0),
   CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
 );


CREATE TABLE
 "comments" (
   "id" SERIAL NOT NULL,
   "post_id" SERIAL NOT NULL,
   "account_id" VARCHAR NOT NULL,
   "block_height" DECIMAL(58, 0) NOT NULL,
   "content" TEXT NOT NULL,
   "block_timestamp" DECIMAL(20, 0) NOT NULL,
   "receipt_id" VARCHAR NOT NULL,
   CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
 );


CREATE TABLE
 "post_likes" (
   "post_id" SERIAL NOT NULL,
   "account_id" VARCHAR NOT NULL,
   "block_height" DECIMAL(58, 0),
   "block_timestamp" DECIMAL(20, 0) NOT NULL,
   "receipt_id" VARCHAR NOT NULL,
   CONSTRAINT "post_likes_pkey" PRIMARY KEY ("post_id", "account_id")
 );


CREATE UNIQUE INDEX "posts_account_id_block_height_key" ON "posts" ("account_id" ASC, "block_height" ASC);


CREATE UNIQUE INDEX "comments_post_id_account_id_block_height_key" ON "comments" (
 "post_id" ASC,
 "account_id" ASC,
 "block_height" ASC
);


CREATE INDEX
 "posts_last_comment_timestamp_idx" ON "posts" ("last_comment_timestamp" DESC);


CREATE INDEX
 "posts_group_id_idx" ON "posts" ("group_id" ASC);


ALTER TABLE
 "comments"
ADD
 CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;


ALTER TABLE
 "post_likes"
ADD
 CONSTRAINT "post_likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;


CREATE TABLE
 "members" (
   "id" SERIAL NOT NULL,
   "contract_id" TEXT NOT NULL,
   "block_height" BIGINT NOT NULL,
   "block_timestamp" BIGINT NOT NULL,
   "receipt_id" TEXT NOT NULL,
   "member_id" TEXT NOT NULL,
   "nft_data" TEXT NOT NULL,
   "is_burnt" BOOLEAN NOT NULL,
   "is_transferred" BOOLEAN NOT NULL,
   PRIMARY KEY ("id")
 );