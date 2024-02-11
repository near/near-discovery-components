// This is an example of how to use the Entity components
// You can either:
// A. Copy the Entity components and adapt them
// B. Use the Entity components as is, passing in properties, as this file does.
//    You'll need to create a <Entity>Page but can reuse EntityList
// The entity type in this example is 'components'

const entityType = "Component";
const entityIndexer = "components";
const entityTable = "metadata";

const user = "dataplatform_near";
const collection = `${user}_${entityIndexer}_${entityTable}`;
const buildQueries = (searchKey, sort) => {
  const queryFilter = searchKey ? `name: {_ilike: "%${searchKey}%"}` : "";
  let querySortOption = "";
  switch (sort) {
    case "z-a":
      querySortOption = `{ component_name: desc },`;
      break;
    case "a-z":
      querySortOption = `{ component_name: asc },`;
      break;
    default:
      querySortOption = "{ block_height: desc },";
  }

  return `
query ListQuery($offset: Int, $limit: Int) {
  ${collection}(
      where: {${queryFilter}}
      order_by: [${querySortOption} { block_height: desc }], 
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
  ${collection}_aggregate {
    aggregate {
      count
    }
  }
}
`;
};
const queryName = "ListQuery";

const renderItem = (item) => {
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
  <Widget
    src="${REPL_ACCOUNT}/widget/Entities.Template.EntityList"
    props={{ entityType, buildQueries, queryName, collection, renderItem }}
  />
);
