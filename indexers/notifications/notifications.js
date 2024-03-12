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
  const nearDBIndexUpdates = block
    .actions()
    .filter((action) => action.receiverId === "social.near")
    .flatMap((action) =>
      action.operations
        .map((operation) => operation["FunctionCall"])
        .filter((operation) => operation?.methodName === "set")
        .map((functionCallOperation) => ({
          ...functionCallOperation,
          args: base64decode(functionCallOperation.args),
          receiptId: action.receiptId,
        }))
        .filter((functionCall) => {
          if (
            !functionCall ||
            !functionCall.args ||
            !functionCall.args.data ||
            !Object.keys(functionCall.args.data) ||
            !Object.keys(functionCall.args.data)[0]
          ) {
            console.log(
              "Set operation did not have arg data in expected format"
            );
            return;
          }
          const accountId = Object.keys(functionCall.args.data)[0];
          if (!functionCall.args.data[accountId]) {
            console.log(
              "Set operation did not have arg data in expected format"
            );
            return;
          }
          return Object.keys(functionCall.args.data[accountId]).includes(
            "index"
          );
        })
    );

  if (nearDBIndexUpdates.length > 0) {
    console.log("Found Index keys in Block...");
    const blockHeight = block.blockHeight + "";
    await Promise.all(
      nearDBIndexUpdates.map(async (writeAction) => {
        const accountId = Object.keys(writeAction.args.data)[0];
        console.log(`ACCOUNT_ID: ${accountId}`);

        if (Object.keys(writeAction.args.data[accountId]).includes("index")) {
          if (!writeAction.args.data[accountId].index) {
            console.log("Wrong notify format, index is null");
            return;
          }
          if (
            Object.keys(writeAction.args.data[accountId].index).includes(
              "notify"
            )
          ) {
            console.log("handling notify");
            await handleNotify(
              accountId,
              blockHeight,
              writeAction.args.data[accountId].index.notify,
              writeAction.receiptId
            );
          }
        }
      })
    );
  }

  async function handleNotify(
    accountId,
    blockHeight,
    notifyPayload,
    receiptId
  ) {
    try {
      let data = JSON.parse(notifyPayload);
      data = Array.isArray(data) ? data : [data];
      console.log(data);
      const mutationPayload = data.map((notification) => {
        const { key, value } = notification;
        const {
          message,
          item = {},
          type: valueType,
          post: devhubPostId,
        } = value;
        const { path, type: itemType, blockHeight: actionAtBlockHeight } = item;
        // actionAtBlockHeight related to "like" itemType

        return {
          initiatedBy: accountId,
          receiver: key,
          message,
          valueType,
          itemType,
          path,
          blockHeight,
          devhubPostId,
          actionAtBlockHeight,
          receiptId,
        };
      });

      console.log(`handling notification triggered by ${accountId}`);

      //send graphql mutation
      await context.db.Notifications.upsert(
        mutationPayload,
        ["receiptId"],
        [
          "initiatedBy",
          "receiver",
          "message",
          "valueType",
          "itemType",
          "path",
          "devhubPostId",
          "actionAtBlockHeight",
        ]
      );
      console.log("Successfully stored Notify record");
    } catch (e) {
      console.log("Failed to store Notify record");
    }
  }

  function base64decode(encodedValue) {
    try {
      const buff = Buffer.from(encodedValue, "base64");
      const str = buff.toString("utf-8").replace(/\\xa0/g, " ");
      return JSON.parse(str);
    } catch (e) {
      console.log("Error while decoding value", e);
      return null;
    }
  }
}
