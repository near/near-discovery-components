const entityType = "Agent";
const entityIndexer = "agents";
const entityTable = "agents";

const user = "dataplatform_near";
const collection = `${user}_${entityIndexer}_${entityTable}`;

const schema = {
  id: { type: "integer" },
  account_id: { type: "text" },
  name: { type: "text" },
  display_name: { type: "text" },
  preferred_provider: { type: "text" },
  preferred_model: { type: "text" },
  prompt: { type: "text" },
  variables: { type: "text" },
  component: { type: "text" },
  logo_url: { type: "text" },
  tools: { type: "text" },
  properties: { type: "text" },
};
const buildQueries = (searchKey, sort) => {
  const queryFilter = searchKey ? `name: {_ilike: "%${searchKey}%"}` : "";
  let querySortOption;
  switch (sort) {
    case "z-a":
      querySortOption = `{ name: desc },`;
      break;
    case "a-z":
      querySortOption = `{ name: asc },`;
      break;
    default:
      querySortOption = "";
  }

  return `
query ListQuery($offset: Int, $limit: Int) {
  ${collection}(
      where: {${queryFilter}}
      order_by: [${querySortOption} ], 
      offset: $offset, limit: $limit) {
      ${Object.keys(schema).join("\n")}
  }
  ${collection}_aggregate {
    aggregate {
      count
    }
  }
}
`;
};
const queryName = "ListQuery";

const convertSnakeToPascal = (item) => {
  Object.keys(item).forEach((key) => {
    const pascalKey = key.replace(/(_\w)/g, (m) => m[1].toUpperCase());
    if (key !== pascalKey) {
      item[pascalKey] = item[key];
      delete item[key];
    }
  });
  return item;
};
const renderItem = (item, editFunction) => {
  return (
    <Widget
      src="${REPL_ACCOUNT}/widget/AI.Agent.AgentCard"
      props={{
        item: convertSnakeToPascal(item),
        editFunction,
      }}
    />
  );
};

const createWidget = "${REPL_ACCOUNT}/widget/AI.Agent.AgentCreate";
const description = "NEAR AI Nexus";

const Header = styled.h1`
  font-size: 24px;
  color: #11181c;
  margin: 0;
  font-weight: 600;
`;
return (
  <div>
    <Widget src="${REPL_ACCOUNT}/widget/AI.Agent.AgentHeader" props={{ text: description, color: "#11181c" }} />
    <Widget
      src="${REPL_ACCOUNT}/widget/Entities.Template.EntityList"
      props={{
        entityType,
        buildQueries,
        queryName,
        collection,
        renderItem,
        createWidget,
        schema: { entityTitle: "Agent" },
      }}
    />
  </div>
);
