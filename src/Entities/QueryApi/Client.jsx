const GRAPHQL_ENDPOINT = props.GRAPHQL_ENDPOINT ?? "https://near-queryapi.api.pagoda.co";
const LIMIT = props.LIMIT ?? 25;
const HASURA_ROLE = props.HASURA_ROLE ?? "dataplatform_near";

function fetchGraphQL(operationsDoc, operationName, variables, hasuraRole) {
  return asyncFetch(`${GRAPHQL_ENDPOINT}/v1/graphql`, {
    method: "POST",
    headers: { "x-hasura-role": hasuraRole ?? HASURA_ROLE },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });
}

function loadItems(queries, queryName, offset, collection, onLoad, limit) {
  const l = limit ?? LIMIT;
  return fetchGraphQL(queries, queryName, {
    offset: offset,
    limit: l,
  }).then((result) => {
    if (result.status === 200 && result.body) {
      if (result.body.errors) {
        console.log("error:", result.body.errors);
        return;
      }
      let data = result.body.data;
      if (data) {
        const newItems = data[collection];
        const totalItems = data[collection + "_aggregate"].aggregate.count;
        if (newItems) {
          onLoad(newItems, totalItems);
        }
      }
    }
  });
}

function loadItem(queries, queryName, collection, onLoad) {
  return fetchGraphQL(queries, queryName, {}).then((result) => {
    if (result.status === 200 && result.body) {
      if (result.body.errors) {
        console.log("error:", result.body.errors);
        return;
      }
      let data = result.body.data;
      if (data) {
        const newItem = data[collection];
        if (newItem) {
          onLoad(newItem);
        }
      }
    }
  });
}

function convertObjectKeysSnakeToPascal(item) {
  const newItem = {};
  Object.keys(item).forEach((key) => {
    const pascalKey = key.replace(/(_\w)/g, (m) => m[1].toUpperCase());
    newItem[pascalKey] = item[key];
  });
  return newItem;
}
function convertObjectKeysPascalToSnake(item) {
  const newItem = {};
  Object.keys(item).forEach((key) => {
    const snakeKey = key.replace(/([A-Z])/g, (m) => "_" + m.toLowerCase());
    newItem[snakeKey] = item[key];
  });
  return newItem;
}
const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

return {
  fetchGraphQL,
  loadItems,
  loadItem,
  convertObjectKeysSnakeToPascal,
  convertObjectKeysPascalToSnake,
  capitalize,
  LIMIT,
  GRAPHQL_ENDPOINT,
  HASURA_ROLE,
};
