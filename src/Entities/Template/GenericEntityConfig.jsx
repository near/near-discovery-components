const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");
if (!href) {
  return <></>;
}

const { namespace, entityType, schemaFile } = props; // data props
const { title, homeLink } = props; // display props

const schemaLocation = schemaFile ? schemaFile : `${REPL_ACCOUNT}/widget/Entities.Template.GenericSchema`;
const { genSchema } = VM.require(schemaLocation);
if (!genSchema) {
  return <></>;
}
const schema = genSchema(namespace, entityType);

const entityIndexer = "entities";
const entityTable = "entities";

const user = "dataplatform_near";
const collection = `${user}_${entityIndexer}_${entityTable}`;

const dataFields = Object.keys(schema).filter((key) => typeof schema[key] === "object");
const standardFields = ["id", "accountId", "name", "displayName", "logoUrl", "attributes"];
const attributeFields = dataFields.filter((key) => !standardFields.includes(key));
const ns = namespace ? namespace : "default";
const buildQueries = (searchKey, sort, filters) => {
  function arrayInPostgresForm(a) {
    if (!a) return a;
    try {
      const stringArray = JSON.stringify(a);
      return stringArray.replaceAll("[", "{").replaceAll("]", "}").replaceAll('"', '\\"');
    } catch (error) {
      console.error("Malformed array field - Error parsing JSON", error);
      return "";
    }
  }

  let queryFilter = searchKey ? `, display_name: {_ilike: "%${searchKey}%"}` : "";
  if (filters) {
    Object.keys(filters).forEach((key) => {
      const filter = filters[key];
      if (!key || !filter) return;
      if (filter) {
        switch (key) {
          case "tags":
            if (filter && filter.length > 0) {
              queryFilter += `, tags: {_contains: "${arrayInPostgresForm(filter)}"}`;
            }
            break;
          case "stars":
            queryFilter += `, stars: {_gte: ${filter}}`;
            break;
          default:
            queryFilter += `, ${key}: {_eq: "${filter}"}`;
            break;
        }
      }
    });
  }

  return `
query ListQuery($offset: Int, $limit: Int) {
  ${collection}(
      where: {namespace: {_eq: "${ns}"}, entity_type: {_eq: "${entityType}"} ${queryFilter}}
      order_by: [${sort} ], 
      offset: $offset, limit: $limit) {
      entity_type
      namespace
      id
      account_id
      name
      display_name
      logo_url
      attributes
      stars
      tags
      created_at
      updated_at
  }
  ${collection}_aggregate (
      where: {namespace: {_eq: "${ns}"}, entity_type: {_eq: "${entityType}"}, ${queryFilter}}
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
const sharedButtonStyles = `
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 8px;
  height: 32px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
  cursor: pointer;

  &:hover,
  &:focus {
    text-decoration: none;
    outline: none;
  }

  i {
    color: #7E868C;
  }

  .bi-16 {
    font-size: 16px;
  }
`;
const Button = styled.button`
  ${sharedButtonStyles}
  color: ${(p) => (p.primary ? "#09342E" : "#11181C")} !important;
  background: ${(p) => (p.primary ? "#59E692" : "#FBFCFD")};
  border: ${(p) => "none"};

  &:hover,
  &:focus {
    background: ${(p) => (p.primary ? "rgb(112 242 164)" : "#ECEDEE")};
  }
`;
const TagsWrapper = styled.div`
  padding: 4px;
`;

const defaultRenderTableItem = (rawItem, editFunction) => {
  const item = convertSnakeToPascal(rawItem);
  const { accountId, name, displayName, logoUrl, tags, attributes } = item;
  const itemComponent = item.component ? item.component : `${REPL_ACCOUNT}/widget/Entities.Template.EntityDetails`;
  const imageUrl = logoUrl
    ? logoUrl
    : "https://ipfs.near.social/ipfs/bafkreibysr2mkwhb4j36h2t7mqwhynqdy4vzjfygfkfg65kuspd2bawauu";
  const actionLink = href({
    widgetSrc: itemComponent,
    params: { src: `${accountId}/${entityType}/${name}`, schemaFile, namespace },
  });
  const detailsLink = href({
    widgetSrc: `${REPL_ACCOUNT}/widget/Entities.Template.EntityDetails`,
    params: { src: `${accountId}/${entityType}/${name}`, schemaFile, namespace, entityType, returnTo: homeLink },
  });

  const actionUrl = `https://${REPL_NEAR_URL}/${itemComponent}?src=${accountId}/${entityType}/${item.name}`;
  const editType = accountId === context.accountId ? "edit" : "fork";
  const editLabel = editType === "edit" ? "Edit" : "Fork";
  const editIcon = editType === "edit" ? "ph-bold ph-pencil-simple" : "ph-bold ph-git-fork";

  return (
    <Row className="row">
      <div className="col-2">
        <img className="logo" src={imageUrl} alt="item logo" />
      </div>
      <div className="col-2">
        <Link to={detailsLink}>{displayName}</Link>
        {tags && tags.length > 0 && (
          <TagsWrapper>
            <Widget
              src="${REPL_ACCOUNT}/widget/Tags"
              props={{
                tags,
              }}
            />
          </TagsWrapper>
        )}
      </div>
      {attributeFields.map((key) => {
        const value = attributes[key];
        const formattedValue = value?.length > 50 ? value.substring(0, 50) + "..." : value;
        return <div className="col-1">{formattedValue}</div>;
      })}
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
          <Widget
            src="${REPL_ACCOUNT}/widget/SocialIndexActionButton"
            key={name}
            props={{
              actionName: "star",
              actionUndoName: "unstar",
              item: {
                type: "social",
                path: `${accountId}/entities/${namespace}/${entityType}/${name}`,
              },
              notifyAccountId: accountId,
              button: (starCount, starIsActive, starOnClick) => (
                <Button type="button" onClick={starOnClick} aria-label="Star this">
                  {starIsActive ? (
                    <i className="bi bi-star-fill" style={{ color: "var(--amber10)" }} />
                  ) : (
                    <i className="bi bi-star" />
                  )}{" "}
                  {item.stars}
                </Button>
              ),
            }}
          />{" "}
          <Button>
            <Widget
              src="${REPL_ACCOUNT}/widget/CopyUrlButton"
              props={{
                url: actionUrl,
              }}
            />
          </Button>
          <Button>
            <Widget
              src="${REPL_ACCOUNT}/widget/ShareButton"
              props={{
                postType: "Placeholder",
                url: actionUrl,
              }}
            />
          </Button>
          <span style={{ whiteSpace: "nowrap" }}>
            by <Widget src="${REPL_MOB}/widget/ProfileLine" props={{ accountId: accountId, hideAccountId: true }} />
          </span>
        </Actions>
      </div>
    </Row>
  );
};

const createWidget = "${REPL_ACCOUNT}/widget/Entities.Template.EntityCreate";
const renderItem = props.renderItem ? props.renderItem : defaultRenderTableItem;
const table = props.renderItem ? false : true;
return (
  <div>
    <Widget
      src="${REPL_ACCOUNT}/widget/Entities.Template.EntityList"
      props={{ table, buildQueries, queryName, collection, renderItem, createWidget, schema }}
    />
  </div>
);
