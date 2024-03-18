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
  const SOCIAL_DB = "social.near";

  let nearDBIndexUpdates = [];

  try {
    const actions = block.actions();

    if (!actions) {
      console.log("Block has no actions");
      return;
    }
    const contractActions = actions.filter(
      (action) => action.receiverId === SOCIAL_DB
    );
    if (!contractActions) {
      console.log("Block has no actions");
      return;
    }
    nearDBIndexUpdates = contractActions
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
            try {
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
            } catch (error) {
              console.log("Error parsing social args", functionCall);
            }
          })
      );
  } catch (error) {
    console.log("Error parsing social operations", block.actions());
  }

  if (nearDBIndexUpdates.length > 0) {
    const blockHeight = block.blockHeight;
    await Promise.all(
      nearDBIndexUpdates.map(async (writeAction) => {
        const accountId = Object.keys(writeAction.args.data)[0];

        if (Object.keys(writeAction.args.data[accountId]).includes("index")) {
          if (!writeAction.args.data[accountId].index) {
            console.log(`Wrong notify format for receiver: ${accountId}, index is null`);
            return;
          }
          if (
            Object.keys(writeAction.args.data[accountId].index).includes(
              "notify"
            )
          ) {
            console.log(`ACCOUNT_ID: ${accountId}`);
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

      await context.graphql(
        `mutation MyMutation($objects: [dataplatform_near_notifications_notifications_insert_input!]!) {
        insert_dataplatform_near_notifications_notifications(
          objects: $objects
on_conflict: {
      constraint: notifications_receiptId_key,
      update_columns: [
          initiatedBy,
          receiver,
          message,
          valueType,
          itemType,
          path,
          blockHeight,
          devhubPostId,
          actionAtBlockHeight
      ]
    }
        ) {
          returning {
            initiatedBy
            receiver
            message
            valueType
            itemType
            path
            blockHeight
            devhubPostId
            actionAtBlockHeight
            receiptId
          }
        }
      }`,
        { objects: mutationPayload }
      );
      console.log(`Successfully stored Notify record for ${accountId}`);
    } catch (e) {
      console.log(`Failed to store Notify record for ${accountId}. Error: ${e}`);
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
