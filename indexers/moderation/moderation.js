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
  function base64decode(encodedValue) {
    let buff = Buffer.from(encodedValue, "base64");
    return JSON.parse(buff.toString("utf-8"));
  }

  function parseIndexAction(actionName, userData) {
    const returnValues = [];
    const actionData =
      userData.index && userData.index[actionName]
        ? userData.index[actionName]
        : null;
    if (actionData) {
      const actionDataParsed = JSON.parse(actionData);
      const actionsArray = Array.isArray(actionDataParsed)
        ? actionDataParsed
        : [actionDataParsed];
      for (let a of actionsArray) {
        const value = a.value;
        if (value && value.path) {
          const fullPath = value.path.split("/");
          const account = fullPath[0];
          const path =
            fullPath.length > 1 ? "/" + fullPath.slice(1).join("/") : null;
          const { blockHeight, operation } = value;
          const label = value.label ?? "report";
          returnValues.push({ account, path, blockHeight, label, operation });
        }
      }
    }
    return returnValues;
  }

  const calls = block.actions().flatMap((action) =>
    action.operations
      .map((operation) => operation["FunctionCall"])
      .filter((operation) => operation?.methodName === "set")
      .map((functionCallOperation) => ({
        ...functionCallOperation,
        args: base64decode(functionCallOperation.args),
      }))
      .filter((functionCall) => {
        const accountId = Object.keys(functionCall.args.data)[0];
        return (
          functionCall.args.data[accountId].moderate ||
          (functionCall.args.data[accountId].index &&
            functionCall.args.data[accountId].index.moderate) ||
          // ignore index.moderation because it duplicates the non-index moderate key
          (functionCall.args.data[accountId].index &&
            functionCall.args.data[accountId].index.flag) // backwards compatibility
        );
      }),
  );

  for (let index in calls) {
    let call = calls[index];
    console.log("call", call);
    try {
      const accountId = Object.keys(call.args.data)[0];
      const userData = call.args.data[accountId];

      // user self-moderation data and reported feed
      const reportedObjects = []; // build up an array of reported objects
      const userModeration = userData.moderate;
      if(userModeration) {
        const moderatedAccounts = Object.keys(userModeration);
        for (let account of moderatedAccounts) {
          let value = userModeration[account];
          if (typeof value === "string") {
            const label = value;
            reportedObjects.push({ account, label });
          } else {
            for (let path of Object.keys(value)) {
              value = value[path];
              if (typeof value === "string") {
                const label = value;
                reportedObjects.push({ account, path, label });
              } else {
                for (let blockHeight of Object.keys(value)) {
                  value = value[blockHeight];
                  if (typeof value === "string") {
                    const label = value;
                    reportedObjects.push({ account, path, blockHeight, label });
                  } else {
                    const label = value.label;
                    const expiration = value.expiration;
                    reportedObjects.push({
                      account,
                      path,
                      blockHeight,
                      label,
                      expiration,
                    });
                  }
                }
              }
            }
          }
        }
      }

      const userFlags = parseIndexAction("flag", userData); // backwards compatibility
      if (userFlags && userFlags.length > 0) {
        reportedObjects.push(userFlags);
      }

      console.log("Reported objects", reportedObjects);

      const group = "near.org";
      for (let report of reportedObjects) {
        const label = report.label;
        const moderated_account_id = report.account;
        const moderated_path = report.path?.replace(/\./g, "/");
        const moderated_blockheight = parseInt(report.blockHeight);
        const mutationData = {
          report: {
            group,
            account_id: accountId,
            moderated_account_id,
            moderated_path,
            moderated_blockheight,
            label,
          },
        };
        await context.graphql(
          `mutation insertReport($report: dataplatform_near_moderation_moderation_reporting_insert_input!) {
                        insert_dataplatform_near_moderation_moderation_reporting_one( object: $report
                        ) { group account_id moderated_account_id moderated_path moderated_blockheight label }
                    }`,
          mutationData,
        );
        // pending upgrade to Postgres 15 for NULLS NOT DISTINCT
        // on_conflict: {constraint: moderation_reporting_pkey, update_columns: [label, expiration]}

        // requires QueryApi V2
        // context V2 ONLY .db.ModerationReporting.insert({
        //   group,
        //   account_id: accountId,
        //   moderated_account_id,
        //   moderated_path,
        //   moderated_blockheight,
        //   label,
        // });
      }

      // moderator decisions
      const moderatorsForGroup = ["bosmod.near", "flatirons.near"]; // moderator, testing. future query placeholder
      if (moderatorsForGroup.includes(accountId)) {
        const decisions = parseIndexAction("moderate", userData);
        if (decisions) {
          for (let decision of decisions) {
            console.log("decision", decision);
            const operation = decision.operation;
            const label = decision.label;
            const moderated_account_id = decision.account;
            const moderated_path = decision.path;
            const moderated_blockheight = decision.blockHeight;

            if (operation) {
              switch (operation) {
                case "delete":
                  const pathDescriminator = moderated_path
                    ? `{_eq: "${moderated_path}"}`
                    : `{_is_null: true}`;
                  const blockHeightDescriminator = moderated_blockheight
                    ? `{_eq: ${moderated_blockheight}}`
                    : `{_is_null: true}`;
                  const mutation = `mutation {
                    delete_dataplatform_near_moderation_moderation_decisions(
                      where: {moderated_account_id: {_eq: "${moderated_account_id}"}, moderated_path: ${pathDescriminator}, moderated_blockheight: ${blockHeightDescriminator}}
                    ) {
                      returning {
                        moderated_account_id
                        moderated_path
                        moderated_blockheight
                      }
                    }
                  }`;
                  console.log("mutation", mutation);
                  context.graphql(mutation, {});
                  break;
                case "update":
                  // todo
                  console.log(
                    "Update operation is not yet implemented",
                    decision,
                  );
                  break;
                default:
                  console.log(
                    "Invalid moderation operation",
                    operation,
                    decision,
                  );
              }
            } else {
              const mutationData = {
                decision: {
                  group,
                  moderator_account_id: accountId,
                  moderated_account_id,
                  moderated_path,
                  moderated_blockheight,
                  label,
                },
              };
              context.graphql(
                `mutation insertDecision($decision: dataplatform_near_moderation_moderation_decisions_insert_input!) {
                                    insert_dataplatform_near_moderation_moderation_decisions_one( object: $decision
                                    ) { group moderator_account_id moderated_account_id moderated_path moderated_blockheight label }
                                }`,
                mutationData,
              );
              // pending upgrade to Postgres 15 for NULLS NOT DISTINCT
              // on_conflict: {constraint: moderation_decisions_pkey, update_columns: [label, expiration, notes]}

              // requires QueryApi V2
              // context. V2 ONLY db.ModerationDecisions.insert({
              //   group,
              //   moderator_account_id: accountId,
              //   moderated_account_id,
              //   moderated_path,
              //   moderated_blockheight,
              //   label,
              // });
            }
          }
        }
      }
    } catch (error) {
      console.log("Caught error", error);
    }
  }
}
