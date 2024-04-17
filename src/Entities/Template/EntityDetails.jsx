const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");
if (!href) {
  return <p>Loading modules...</p>;
}
const { loadItem, convertObjectKeysSnakeToPascal, capitalize } = VM.require(
  "${REPL_ACCOUNT}/widget/Entities.QueryApi.Client",
);
if (!loadItem) {
  return <p>Loading modules...</p>;
}
const { src, tab, schemaFile, namespace } = props; // url params
const [accountId, entityType, entityName] = src.split("/") ?? [null, null, null];

const summaryComponent = props.summaryComponent ?? "${REPL_ACCOUNT}/widget/Entities.Template.EntitySummary";
const schemaLocation = schemaFile ? schemaFile : `${REPL_ACCOUNT}/widget/Entities.Template.GenericSchema`;
const { genSchema } = VM.require(schemaLocation, { namespace, entityType });
if (!genSchema) {
  return <>Loading schema...</>;
}
const schema = genSchema(namespace, entityType);

const entityIndexer = "entities";
const entityTable = "entities";
const user = "dataplatform_near";
const collection = `${user}_${entityIndexer}_${entityTable}`;

const query = `
query SingleEntity {
    ${collection}(
          where: { account_id: {_eq: "${accountId}"}, name: {_eq: "${entityName}"}, 
                   entity_type: {_eq: "${entityType}"}, namespace: {_eq: "${namespace}"}}
        ) {
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
    }
`;

const [entity, setEntity] = useState(null);
const [error, setError] = useState(null);
const onLoad = (itemInArray) => {
  if (itemInArray.length === 0 || !itemInArray[0]) {
    setError(`${entityType} with name ${entityName} not found`);
    return;
  }
  const fetchedItem = itemInArray[0];
  const fullEntity = convertObjectKeysSnakeToPascal(fetchedItem);
  setEntity(fullEntity);
};
loadItem(query, "SingleEntity", collection, onLoad);

if (error) {
  return (
    <div className="alert alert-danger mx-3" role="alert">
      <div>{error}</div>
      <Link to={href({ widgetSrc: `${REPL_ACCOUNT}/widget/Nexus` })}>Back to Nexus</Link>
    </div>
  );
}
if (!entity) {
  return <p>Loading...</p>;
}
const { title } = schema;

const editType = accountId === context.accountId ? "edit" : "fork";
const editLabel = editType === "edit" ? "Edit" : "Fork";
const editIcon = editType === "edit" ? "ph-bold ph-pencil-simple" : "ph-bold ph-git-fork";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-bottom: 48px;
  padding-left: 48px;
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 32px;

  @media (max-width: 1200px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
  }
`;

const Header = styled.h1`
  font-size: 24px;
  line-height: 39px;
  color: #11181c;
  margin: 0;
  font-weight: 600;
`;

const Properties = styled.div`
  margin: 2em;
  display: grid;
  grid-template-columns: 5em 1fr;
  gap: 16px;
`;
const Text = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: ${(p) => (p.bold ? "#11181C" : "#687076")};
  font-weight: ${(p) => (p.bold ? "600" : "400")};
  font-size: ${(p) => (p.small ? "12px" : "14px")};

  i {
    margin-right: 4px;
  }
`;
const PropValue = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  padding-bottom: 10px;
`;
const entityProperties = (obj) => {
  const attributes = obj.attributes;
  return (
    <Properties>
      {Object.keys(attributes).map((k) => (
        <>
          <Text bold key={k}>
            {capitalize(k)}:
          </Text>
          <PropValue>{attributes[k]}</PropValue>
        </>
      ))}
    </Properties>
  );
};
const listLink = href({
  widgetSrc: `${REPL_AGIGUILD}/widget/Nexus`,
});

return (
  <Wrapper>
    <Link to={listLink}>
      <Header>
        <i className="ph ph-arrow-left" />
        Nexus
      </Header>
    </Link>
    <Widget
      src={summaryComponent}
      props={{
        size: "small",
        showTags: true,
        entity,
        showActions: true,
      }}
    />
    <ContentWrapper>
      <Widget
        src="${REPL_ACCOUNT}/widget/DIG.Tabs"
        props={{
          variant: "line",
          size: "large",
          defaultValue: "properties",
          items: [
            {
              name: "Properties",
              value: "properties",
              content: entityProperties(entity),
              icon: "ph ph-code",
            },
            {
              name: editLabel,
              value: "edit",
              content: (
                <Widget
                  src={"${REPL_ACCOUNT}/widget/Entities.Template.EntityCreate"}
                  props={{ entityType, schema, data: entity, cancelLabel: "Clear changes" }}
                />
              ),
              icon: editIcon,
            },
          ],
        }}
      />

      <Widget src="${REPL_ACCOUNT}/widget/ComponentDetails.Sidebar" props={{ src }} />
    </ContentWrapper>
  </Wrapper>
);
