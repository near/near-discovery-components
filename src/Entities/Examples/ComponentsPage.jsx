// This is an example of how to use the Entity components
// You can either:
// A. Copy the Entity components and adapt them
// B. Use the Entity components as is, passing in properties, as this file does.
//    You'll need to create a <Entity>Page but can reuse EntityList, EntityCreate
// The entity type in this example is 'components'

const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");
if (!href) {
  return <></>;
}
const { genSchema } = VM.require(`${REPL_ACCOUNT}/widget/Entities.Examples.ComponentSchema`);
if (!genSchema) {
  return <></>;
}
const schema = genSchema("", "component");

const entityType = "component";
const entityIndexer = "components";
const entityTable = "metadata";

const user = "dataplatform_near";
const collection = `${user}_${entityIndexer}_${entityTable}`;

const sortTypes = [
  { text: "Most Stars", value: "{ star_count: desc }, { block_height: desc }" },
  { text: "Least Stars", value: "{ star_count: asc }, { block_height: desc }" },
  { text: "Name A-Z", value: "{ component_name: asc }" },
  { text: "Name Z-A", value: "{ component_name: desc }" },
  { text: "Newest", value: "{ block_height: desc }" },
  { text: "Oldest", value: "{ block_height: asc }" },
];
const buildQueries = (searchKey, sort) => {
  const queryFilter = searchKey ? `component_name: {_ilike: "%${searchKey}%"}` : "";
  return `
query ListQuery($offset: Int, $limit: Int) {
  ${collection}(
      where: {${queryFilter}}
      order_by: [${sort} { block_height: desc }], 
      offset: $offset, limit: $limit) {
    block_height
    block_timestamp_ms
    code
    component_author_id
    component_id
    component_name
    description
    fork_count
    fork_of_block_height
    fork_of_source
    image_ipfs_cid
    name
    star_count
    tags
    website
  }
  ${collection}_aggregate(
      where: {${queryFilter}}
    ) {
    aggregate {
      count
    }
  }
}
`;
};
const queryName = "ListQuery";

const renderItem = (item, editFunction) => {
  return (
    <Widget
      src="${REPL_ACCOUNT}/widget/ComponentCard"
      props={{
        src: `${item.component_author_id}/widget/${item.component_name}`,
        blockHeight: item.block_height,
      }}
    />
  );
};
return (
  <div className="gateway-page-container">
    <Widget
      src="${REPL_ACCOUNT}/widget/Entities.Template.EntityList"
      props={{ loadItems, buildQueries, queryName, collection, renderItem, createWidget, schema, sortTypes }}
    />
  </div>
);
