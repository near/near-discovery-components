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

    const agentWrites = getSocialOperations(block, "agent");
    agentWrites.map(async ({ accountId, data }) => {
        try {
            const agent = {
                name: data.name,
                account_id: accountId,
                display_name: data.displayName,
                preferred_provider: data.preferredProvider,
                preferred_model: data.preferredModel,
                prompt: data.prompt,
                variables: data.variables,
                component: data.component,
                logo_url: data.logoUrl,
                tools: data.tools,
                properties: data.properties,
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
        } catch (e) {
            console.log(`Failed to store agent from ${accountId} to the database`, e);
        }
    });
}
