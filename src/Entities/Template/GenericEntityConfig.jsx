const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");
if (!href) {
  return <></>;
}

const { namespace, entityType, title, schemaFile } = props;

const schemaLocation = schemaFile ? schemaFile : `${REPL_ACCOUNT}/widget/Entities.Template.GenericSchema`;
const { genSchema } = VM.require(schemaLocation, { namespace, entityType });
if (!genSchema) {
  return <></>;
}
const schema = genSchema(namespace, entityType);

const Row = styled.div`
  vertical-align: middle;
  padding-bottom: 1em;
  img.logo {
    width: 30%;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    object-fit: cover;
  }
`;
const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const entityIndexer = "agents";
const entityTable = "entities";

const user = "dataplatform_near";
const collection = `${user}_${entityIndexer}_${entityTable}`;

const dataFields = Object.keys(schema).filter((key) => typeof schema[key] === "object");
const standardFields = ["id", "accountId", "name", "displayName", "logoUrl", "attributes"];
const attributeFields = dataFields.filter((key) => !standardFields.includes(key));
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
      querySortOption = "{ id: desc },";
  }
  return `
query ListQuery($offset: Int, $limit: Int) {
  ${collection}(
      where: {entity_type: {_eq: "${entityType}"}, ${queryFilter}}
      order_by: [${querySortOption} ], 
      offset: $offset, limit: $limit) {
      id
      account_id
      name
      display_name
      logo_url
      attributes
  }
  ${collection}_aggregate (
      where: {entity_type: {_eq: "${entityType}"}, ${queryFilter}}
    ){
    aggregate {
      count
    }
  }
}
`;
};
const queryName = "ListQuery";

const convertSnakeToPascal = (item) => {
  const newItems = {};
  Object.keys(item).forEach((key) => {
    const pascalKey = key.replace(/(_\w)/g, (m) => m[1].toUpperCase());
    newItems[pascalKey] = item[key];
  });
  return newItems;
};
const convertPascalToSnake = (itemArray) => {
  const newItems = [];
  itemArray.forEach((key) => {
    const snakeKey = key.replace(/([A-Z])/g, (m) => "_" + m.toLowerCase());
    newItems.unshift(snakeKey);
  });
  return newItems;
};

const renderItem = (rawItem, editFunction) => {
  const item = convertSnakeToPascal(rawItem);
  const { accountId, name, displayName, logoUrl, attributes } = item;
  const itemComponent = item.component ? item.component : `${REPL_AGIGUILD}/widget/Entities.Template.EntityDetails`;
  const imageUrl = logoUrl
    ? logoUrl
    : "https://ipfs.near.social/ipfs/bafkreibysr2mkwhb4j36h2t7mqwhynqdy4vzjfygfkfg65kuspd2bawauu";
  const actionLink = href({
    widgetSrc: itemComponent,
    params: { src: `${accountId}/${entityType}/${name}`, schemaFile, namespace },
  });
  const detailsLink = href({
    widgetSrc: `${REPL_AGIGUILD}/widget/Entities.Template.EntityDetails`,
    params: { src: `${accountId}/${entityType}/${name}`, schemaFile, namespace },
  });

  const actionUrl = `https://${REPL_NEAR_URL}/${itemComponent}?src=${accountId}/${entityType}/${item.name}`;
  const editType = accountId === context.accountId ? "edit" : "fork";
  const editLabel = editType === "edit" ? "Edit" : "Fork";
  const editIcon = editType === "edit" ? "ph-bold ph-pencil-simple" : "ph-bold ph-git-fork";

  return (
    <Row className="row">
      <div className="col-2">
        <img className="logo" src={imageUrl} alt="logo" />
      </div>
      <div className="col-4">{displayName}</div>
      <div className="col-2">{accountId}</div>
      <div className="col-2">
        {attributeFields.map((key) => (
          <span>{attributes[key]}</span>
        ))}
      </div>
      <div className="col-2">
        <Actions>
          <Widget
            src="${REPL_ACCOUNT}/widget/DIG.Tooltip"
            props={{
              content: editLabel,
              trigger: (
                <Widget
                  src="${REPL_ACCOUNT}/widget/DIG.Button"
                  props={{
                    onClick: () => editFunction(item),
                    iconLeft: editIcon,
                    variant: "secondary",
                    fill: "ghost",
                    size: "small",
                  }}
                />
              ),
            }}
          />
          <Widget
            src="${REPL_ACCOUNT}/widget/CopyUrlButton"
            props={{
              url: actionUrl,
            }}
          />
          <Widget
            src="${REPL_ACCOUNT}/widget/ShareButton"
            props={{
              postType: "Placeholder",
              url: actionUrl,
            }}
          />
          <Widget
            src="${REPL_ACCOUNT}/widget/DIG.Tooltip"
            props={{
              content: "View Details",
              trigger: (
                <Link to={detailsLink} style={{ all: "unset" }}>
                  <Widget
                    src="${REPL_ACCOUNT}/widget/DIG.Button"
                    props={{
                      iconLeft: "ph-bold ph-eye",
                      variant: "secondary",
                      fill: "ghost",
                      size: "small",
                    }}
                  />
                </Link>
              ),
            }}
          />
        </Actions>
      </div>
    </Row>
  );
};

const createWidget = "${REPL_ACCOUNT}/widget/Entities.Template.EntityCreate";

return (
  <div>
    <h4>{title}</h4>
    <Widget
      src="${REPL_ACCOUNT}/widget/Entities.Template.EntityList"
      props={{ table: true, loadItems, buildQueries, queryName, collection, renderItem, createWidget, schema }}
    />
  </div>
);
