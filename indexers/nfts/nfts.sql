CREATE TABLE
 "nfts" (
   "id" SERIAL NOT NULL,
   "contract_id" TEXT NOT NULL,
   "block_height" BIGINT NOT NULL,
   "block_timestamp" BIGINT NOT NULL,
   "receipt_id" TEXT NOT NULL,
   "owner_id" TEXT NOT NULL,
   "token_id" TEXT NOT NULL,
   "nft_data" TEXT NOT NULL,
   "is_burnt" BOOLEAN NOT NULL,
   "is_transferred" BOOLEAN NOT NULL,
   PRIMARY KEY ("id")
 );