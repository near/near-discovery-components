const GRAPHQL_ENDPOINT = "https://near-queryapi.api.pagoda.co";

function fetchGraphQL(operationsDoc, operationName, variables, graphqlEndpoint, methodName, headersConfig) {
  const endpoint = graphqlEndpoint || GRAPHQL_ENDPOINT;
  const method = methodName || "POST";
  const headers = headersConfig || { "x-hasura-role": "dataplatform_near" };
  return asyncFetch(`${endpoint}/v1/graphql`, {
    method,
    headers,
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });
}

return {
  fetchGraphQL,
};
