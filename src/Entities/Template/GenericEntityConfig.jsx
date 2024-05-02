const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");
const { ipfsUrl } = VM.require("${REPL_ACCOUNT}/widget/Entities.QueryApi.Ipfs");
const { convertObjectKeysSnakeToPascal } = VM.require("${REPL_ACCOUNT}/widget/Entities.QueryApi.Client");

if (!href || !ipfsUrl || !convertObjectKeysSnakeToPascal) {
  return <p>Loading modules...</p>;
}

const { namespace, entityType, schemaFile } = props; // data props
const { title, homeLink, globalTagFilter, setGlobalTagFilter } = props; // display props

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
const standardFields = ["id", "accountId", "name", "displayName", "logoUrl", "attributes", "tags"];
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

const Primary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-grow: 1;
`;

const Row = styled.div`
  display: flex;
  align-items: stretch;
  gap: 2rem;
  padding: 2rem;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #eceef0;
  box-shadow:
    0px 1px 3px rgba(16, 24, 40, 0.1),
    0px 1px 2px rgba(16, 24, 40, 0.06);

  @media (max-width: 800px) {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }
`;

const Name = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  .logo {
    width: 3rem;
    height: 3rem;
    object-fit: cover;
  }
`;

const NameAndTags = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Details = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  font: var(--text-xs);
  padding-top: 1rem;

  * {
    margin: 0;
  }

  @media (max-width: 800px) {
    padding-top: 0;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const ActionsAndAuthor = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2rem;
  flex-grow: 1;

  @media (max-width: 800px) {
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Author = styled.div`
  margin-top: auto;
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

const defaultRenderTableItem = (rawItem, editFunction) => {
  const item = convertObjectKeysSnakeToPascal(rawItem);
  const { accountId, name, displayName, logoUrl, tags, attributes } = item;
  const itemComponent = item.component ? item.component : `${REPL_ACCOUNT}/widget/Entities.Template.EntityDetails`;
  const imageUrl = logoUrl
    ? logoUrl.startsWith("http")
      ? logoUrl
      : ipfsUrl(logoUrl)
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
    <Row>
      <Primary>
        <Name>
          <img className="logo" src={imageUrl} alt="item logo" />

          <NameAndTags>
            <Link to={detailsLink}>{displayName}</Link>

            {tags && tags.length > 0 && (
              <Widget
                src="${REPL_ACCOUNT}/widget/Tags"
                props={{
                  tags,
                }}
              />
            )}
          </NameAndTags>
        </Name>

        {attributeFields.map((key) => {
          const schemaField = schema[key];
          const value = attributes[key];
          switch (schemaField.type) {
            case "file":
              if (value) {
                return (
                  <Details>
                    <Widget
                      src="${REPL_ACCOUNT}/widget/DIG.Button"
                      props={{
                        href: ipfsUrl(value),
                        target: "_blank",
                        icon: "ph-bold ph-download-simple",
                        fill: "outline",
                        size: "small",
                        title: value?.name,
                      }}
                    />
                    <p>{value.type}</p>
                    <p>{value.size} bytes</p>
                  </Details>
                );
              }
              return <></>;
            default:
              const formattedValue = value?.length > 50 ? value.substring(0, 50) + "..." : value;
              if (formattedValue) {
                return (
                  <Details>
                    <p>{formattedValue}</p>
                  </Details>
                );
              }
              return <></>;
          }
        })}
      </Primary>

      <ActionsAndAuthor>
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
                    icon: editIcon,
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
                <Widget
                  src="${REPL_ACCOUNT}/widget/DIG.Button"
                  props={{
                    icon: "ph-bold ph-eye",
                    variant: "secondary",
                    fill: "ghost",
                    size: "small",
                    href: detailsLink,
                  }}
                />
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
        </Actions>

        <Author>
          by <Widget src="${REPL_MOB}/widget/ProfileLine" props={{ accountId: accountId, hideAccountId: true }} />
        </Author>
      </ActionsAndAuthor>
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
      props={{
        table,
        buildQueries,
        queryName,
        collection,
        renderItem,
        createWidget,
        schema,
        globalTagFilter,
        setGlobalTagFilter,
      }}
    />
  </div>
);
