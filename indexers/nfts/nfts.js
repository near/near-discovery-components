import { Block } from "@near-lake/primitives";
/**
 * Note: We only support javascript at the moment. We will support Rust, Typescript in a further release.
 */

/**
 * getBlock(block, context) applies your custom logic to a Block on Near and commits the data to a database.
 * context is a global variable that contains helper methods.
 * context.db is a subfield which contains helper methods to interact with your database.
 *
 * Learn more about indexers here:  https://docs.near.org/concepts/advanced/indexers
 *
 * @param {block} Block - A Near Protocol Block
 */
async function getBlock(block: Block) {
  async function burnNft(tokenId, ownerId) {
    try {
      await context.db.Nfts.update(
        { token_id: tokenId, owner_id: ownerId },
        { is_burnt: true }
      );
    } catch (e) {
      console.error("Error saving nft_burn event in the database", e);
    }
  }

  async function transferNft(tokenId, oldOwnerId, newOwnerId) {
    try {
      const nfts = await context.db.Nfts.select(
        { token_id: tokenId, owner_id: oldOwnerId },
        1
      );
      if (nfts.length === 0) {
        console.log(`Nft ${tokenId} with the owner ${oldOwnerId} not found.`);
        return;
      }
      const nftWithId = nfts[0];
      const { id, ...nft } = { ...nftWithId };

      nft.owner_id = newOwnerId;
      await context.db.Nfts.insert(nft);

      await context.db.Nfts.update(
        { token_id: tokenId, owner_id: oldOwnerId },
        { is_transferred: true }
      );
    } catch (e) {
      console.error("Error saving nft_transfer event in the database", e);
    }
  }

  function base64decode(encodedValue) {
    let buff = Buffer.from(encodedValue, "base64");
    return JSON.parse(buff.toString("utf-8"));
  }

  const height = block.header().height;
  const calls = block.actions().flatMap((action) =>
    action.operations
      .map((operation) => operation["FunctionCall"])
      .filter(
        (operation) =>
          operation?.methodName === "nft_transfer" ||
          operation?.methodName === "nft_mint" ||
          operation?.methodName === "nft_burn"
      )
      .map((functionCallOperation) => ({
        ...functionCallOperation,
        args: base64decode(functionCallOperation.args),
      }))
  );
  // TODO instead of going through events, the calls should be iterated over
  for (let ev of block.events()) {
    const r = block.actionByReceiptId(ev.relatedReceiptId);
    const createdOn = block.streamerMessage.block.header.timestamp;

    try {
      let event = JSON.parse(ev.rawEvent.standard);

      if (event.standard === "nep171") {
        console.log("NEP");

        if (event.event === "nft_mint") {
          console.log(
            `Processing nft_mint for event ${JSON.stringify(
              event
            )}, block height: ${height}, receiptId: ${r.receiptId}`
          );
          for (let elem of event.data) {
            for (let tokenId of elem.token_ids) {
              const mintNftData = {
                contract_id: r.receiverId,
                block_height: height,
                block_timestamp: createdOn,
                receipt_id: r.receiptId,
                owner_id: elem.owner_id,
                token_id: tokenId,
                nft_data: JSON.stringify(elem),
                is_burnt: false,
                is_transferred: false,
              };

              await context.db.Nfts.insert(mintNftData);

              console.log(
                `Owner ${elem.owner_id} minted an NFT from collection ${r.receiverId}, block height: ${height}, receiptId: ${r.receiptId}.`
              );
            }
          }
        } else if (event.event === "nft_transfer") {
          console.log(
            `Processing nft_transfer for event ${JSON.stringify(
              event
            )}, block height: ${height}, receiptId: ${r.receiptId}`
          );
          for (let elem of event.data) {
            for (let tokenId of elem.token_ids) {
              await transferNft(tokenId, elem.old_owner_id, elem.new_owner_id);
            }
          }
          console.log(
            `nft_transfer event processed successfully, block height: ${height}, receiptId: ${r.receiptId}`
          );
        } else if (event.event === "nft_burn") {
          console.log(
            `Processing nft_burn for event ${JSON.stringify(
              event
            )}, block height: ${height}, receiptId: ${r.receiptId}`
          );
          for (let elem of event.data) {
            for (let tokenId of elem.token_ids) {
              await burnNft(tokenId, elem.old_owner_id);
            }
          }
          console.log(
            `nft_burn event processed successfully, block height: ${height}, receiptId: ${r.receiptId}`
          );
        }
      }
    } catch (e) {
      console.error(`Error while processing event ${ev}`, e);
    }
  }
}
