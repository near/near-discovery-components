const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");
if (!href) {
  return <></>;
}
let { src, tab, highlightComment, schemaFile, namespace } = props;
const [accountId, entityType, entityName] = src.split("/") ?? [null, null, null];

let entity = Social.get(`${accountId}/entities/${namespace}/${entityType}/${entityName}/**`);
const exists = !existsData || Object.keys(existsData).length > 0;
if (!exists) {
  return (
    <div className="alert alert-danger mx-3" role="alert">
      <div>Error</div>
      <div>Could not find: {src}</div>
    </div>
  );
}

const schemaLocation = schemaFile ? schemaFile : `${REPL_ACCOUNT}/widget/Entities.Template.GenericSchema`;
const { genSchema } = VM.require(schemaLocation, { namespace, entityType });
if (!genSchema) {
  return <></>;
}
const schema = genSchema(namespace, entityType);
const { title } = schema;

entity = { accountId, namespace: namespace, entityType: entityType, name: entityName, ...entity };
const { prompt } = entity;
const editType = accountId === context.accountId ? "edit" : "fork";
const editLabel = editType === "edit" ? "Edit" : "Fork";
const editIcon = editType === "edit" ? "ph-bold ph-pencil-simple" : "ph-bold ph-git-fork";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-bottom: 48px;
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
  const { accountId, name, displayName, logoUrl, namespace, entityType, ...attributes } = obj;
  return (
    <>
      {Object.keys(attributes).map((k) => (
        <>
          <Text bold key={k}>
            {k}:
          </Text>
          <PropValue>{obj[k]}</PropValue>
        </>
      ))}
    </>
  );
};

return (
  <Wrapper>
    <Widget
      src="${REPL_ACCOUNT}/widget/Entities.Template.EntitySummary"
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
          defaultValue: "prompt",
          items: [
            {
              name: "Properties",
              value: "prompt",
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
