// deprecated, delete once agiguild nexus is live
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
        try {
            const buff = Buffer.from(encodedValue, "base64");
            const str = buff.toString("utf-8").replace(/\\xa0/g, " ");
            return JSON.parse(str);
        } catch (error) {
            console.log(
                'Error parsing JSON - skipping data for "functionCallOperation.args"',
                error
            );
        }
    }

    const getFunctionCallsFunction = (block, contract, method) => {
        return block
            .actions()
            .filter((action) => action.receiverId === contract)
            .flatMap((action) =>
                action.operations
                    .map((operation) => operation["FunctionCall"])
                    .filter((operation) => operation?.methodName === method)
                    .map((functionCallOperation) => ({
                        ...functionCallOperation,
                        args: base64decode(functionCallOperation.args),
                        receiptId: action.receiptId,
                    }))
                    .filter((a) =>
                        block
                            .receipts()
                            .find((r) => r.receiptId === a.receiptId)
                            .status.hasOwnProperty("SuccessValue")
                    )
            );
    };

    const getSocialOperations = (block, operation) => {
        const contract = "social.near";
        const method = "set";
        return getFunctionCallsFunction(block, contract, method)
            .filter((functionCall) => {
                if (
                    !functionCall ||
                    !functionCall.args ||
                    !functionCall.args.data ||
                    !Object.keys(functionCall.args.data) ||
                    !Object.keys(functionCall.args.data)[0]
                ) {
                    console.log("Set operation did not have arg data in expected format");
                    return;
                }
                const accountId = Object.keys(functionCall.args.data)[0];
                const accountData = functionCall.args.data[accountId];
                if (!accountData) {
                    console.log(
                        "Set operation did not have arg data for accountId in expected format"
                    );
                    return;
                }
                return accountData[operation];
            })
            .map((functionCall) => {
                const accountId = Object.keys(functionCall.args.data)[0];
                return {
                    accountId,
                    data: functionCall.args.data[accountId][operation],
                };
            });
    };

// Agi Guild
    const agiWrites = getSocialOperations(block, "agiguild");

    agiWrites.map(async ({ accountId, data }) => {
        try {
            const entityTypes = Object.keys(data);
            entityTypes.map(async (entityType)=> {
                const entities = Object.keys(data[entityType]);
                entities.map(async (name) => {
                    const entityProps = data[entityType][name];
                    const {displayName, logoUrl, ...entityAttributes} = entityProps;
                    const entity = {
                        entity_type: entityType,
                        account_id: accountId,
                        name: name,
                        display_name: displayName,
                        logo_url: logoUrl,
                        attributes: entityAttributes,
                    };
                    await context.db.Entities.upsert(
                        entity,
                        ["entity_type", "account_id", "name"],
                        [
                            "display_name",
                            "logo_url",
                            "attributes",
                        ]
                    );

                    console.log(`${entityType} from ${accountId} has been added to the database`);
                });
            });
        } catch (e) {
            console.log(`Failed to store agent from ${accountId} to the database`, e);
        }
    });

// Legacy
    const agentWrites = getSocialOperations(block, "agent");
    agentWrites.map(async ({ accountId, data }) => {
        try {
            const names = Object.keys(data);
            names.map( async (name) => {
                const agentProps = data[name];
                const agent = {
                    name: name,
                    account_id: accountId,
                    display_name: agentProps.displayName,
                    preferred_provider: agentProps.preferredProvider,
                    preferred_model: agentProps.preferredModel,
                    prompt: agentProps.prompt,
                    variables: agentProps.variables,
                    component: agentProps.component,
                    logo_url: agentProps.logoUrl,
                    tools: agentProps.tools,
                    properties: agentProps.properties,
                };
                await context.db.Agents.upsert(
                    agent,
                    ["account_id", "name"],
                    [
                        "display_name",
                        "preferred_provider",
                        "preferred_model",
                        "prompt",
                        "variables",
                        "component",
                        "logo_url",
                        "tools",
                        "properties",
                    ]
                );

                console.log(`Agent from ${accountId} has been added to the database`);
            });
        } catch (e) {
            console.log(`Failed to store agent from ${accountId} to the database`, e);
        }
    });
}
