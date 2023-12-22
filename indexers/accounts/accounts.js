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

  function base64decode(encodedValue) {
    let buff = Buffer.from(encodedValue, "base64");
    return JSON.parse(buff.toString("utf-8"));
  }

  async function handleAccountProfileData(
    accountId,
    blockHeight,
    blockTimestamp,
    profileAction
  ) {
    const profileData = profileAction.args.data[accountId].profile;

    if (!profileData) {
      return;
    }

    try {
      console.log(
        `Attemp to store account data for account and fields:  ${Object.keys(
          profileAction
        ).join(", ")}`
      );
      const fields = Object.keys(profileData);
      const valuesToStrings = {};

      fields.forEach((field) => {
        switch (field) {
          case "image":
          case "linktree":
          case "tags":
            valuesToStrings[field] = JSON.stringify(profileData[field]);
            break;
          case "backgroundImage":
            valuesToStrings.background_image = JSON.stringify(
              profileData.backgroundImage
            );
            break;
          case "horizon_tnc":
            valuesToStrings.horizon_tnc = JSON.parse(profileData.horizon_tnc);
            break;
          default:
            valuesToStrings[field] = profileData[field];
            break;
        }
      });

      await context.db.Accounts.upsert(
        {
          account_id: accountId,
          block_height: blockHeight,
          block_timestamp_ms: blockTimestamp,
          ...valuesToStrings,
        },
        ["account_id"],
        Object.keys(valuesToStrings)
      );
    } catch (error) {
      console.log(`Failed to store data for ${accountId}. Error ${error}`);
    }
  }

  let accountProfileActions = [];
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
    accountProfileActions = contractActions.flatMap((action) =>
      action.operations
        .map((operation) => operation["FunctionCall"])
        .filter((operation) => operation?.methodName === "set")
        .map((functionCallOperation) => {
          try {
            return {
              ...functionCallOperation,
              args: base64decode(functionCallOperation.args),
              receiptId: action.receiptId, // providing receiptId as we need it
            };
          } catch (e) {
            console.log("Error parsing function call", e);
          }
        })
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
                `Set operation did not have data for account ${accountId}`
              );
              return;
            }
            return Object.keys(functionCall.args.data[accountId]).includes(
              "profile"
            );
          } catch (e) {
            console.log("Error parsing social args", functionCall);
          }
        })
    );
  } catch (error) {
    console.log("Error parsing social operations", block.actions());
  }

  if (accountProfileActions.length > 0) {
    const blockHeight = block.blockHeight;
    const blockTimestamp = block.header().timestampNanosec;
    await Promise.all(
      accountProfileActions.map(async (profileAction) => {
        const accountId = Object.keys(profileAction.args.data)[0];
        console.log(`ACCOUNT_ID: ${accountId}`);
        await handleAccountProfileData(
          accountId,
          blockHeight,
          blockTimestamp,
          profileAction
        );
      })
    );
  }
}
