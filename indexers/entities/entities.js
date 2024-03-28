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

    const entityWrites = getSocialOperations(block, "entities");
    await entityWrites.map(async ({ accountId, data }) => {
        try {
            const namespaces = Object.keys(data);
            namespaces.map(async (namespace) => {
                const namespaceData = data[namespace];
                const entityTypes = Object.keys(namespaceData);
                entityTypes.map(async (entityType) => {
                    const entityTypeData = namespaceData[entityType];
                    const entities = Object.keys(entityTypeData);
                    entities.map(async (name) => {
                        const entityProps = entityTypeData[name];
                        const { displayName, logoUrl, ...entityAttributes } = entityProps;
                        const entity = {
                            namespace: namespace,
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
                            ["display_name", "logo_url", "attributes"]
                        );

                        console.log(
                            `${entityType} from ${accountId} has been added to the database`
                        );
                    });
                });
            });
        } catch (e) {
            console.log(
                `Failed to store entity from ${accountId} to the database`,
                e
            );
        }
    });

    const indexOps = getSocialOperations(block, "index");
    await indexOps
        .filter(({ accountId, data }) => {
            const type = "star";
            return data[type];
        })
        .map(async ({ accountId, data }) => {
            try {
            const type = "star";
            const starData = data[type];
            if (!starData) {
                console.log("No star data found");
                return;
            }
            const star = JSON.parse(starData);
            // "{\"key\":{\"type\":\"social\",\"path\":\"flatirons.near/examples/favoriteCar/delorean\"},\"value\":{\"type\":\"star\"}}"
            const starArray = typeof star === "object" ? [star] : star;
            starArray.map(async ({ key, value }) => {
                if (!key || !value || !key.path || !value.type) {
                    console.log("Required fields not found for star", key, value);
                    return;
                }
                const { path } = key;
                const { type } = value;
                const [targetAccountId, entitiesConstant, namespace, entityType, name] = path.split("/");
                const incDecQuery = `
                mutation ChangeStars {
                  update_dataplatform_near_entities_entities(
                    where: {namespace: {_eq: "${namespace}"}, entity_type: {_eq: "${entityType}"}, 
                    account_id: {_eq: "${targetAccountId}"}, name: {_eq: "${name}"}},
                    _inc: {stars: ${type === "star" ? 1 : -1}}
                  ) {
                    affected_rows
                    returning { account_id namespace entity_type name stars }
                  }
                }
                `;
                console.log("mutation is", incDecQuery);
                await context.graphql(incDecQuery, {});
            });
            } catch (e) {
                console.log(
                    `Failed to process star of entity from ${accountId} to the database`,
                    e
                );
            }

        });
}
