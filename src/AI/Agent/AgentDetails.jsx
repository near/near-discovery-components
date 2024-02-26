const { href } = VM.require("devhub.near/widget/core.lib.url");
if (!href) {
  return <></>;
}
let { src, tab, highlightComment } = props;
const [accountId, agentType, agentName] = src.split("/") ?? [null, null, null];

let agent = Social.get(`${accountId}/agent/${agentName}/**`);
const exists = !existsData || Object.keys(existsData).length > 0;

if (!exists) {
  return (
    <div className="alert alert-danger mx-3" role="alert">
      <Text bold>Error</Text>
      <Text>Could not find: {src}</Text>
    </div>
  );
}

agent = { accountId, name: agentName, ...agent };
const { prompt } = agent;
const editType = accountId === context.accountId ? "edit" : "fork";
const editLabel = editType === "edit" ? "Edit" : "Fork";
const editIcon = editType === "edit" ? "ph-bold ph-pencil-simple" : "ph-bold ph-git-fork";
const listLink = href({
  widgetSrc: `${REPL_ACCOUNT}/widget/AI.Nexus`,
});

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

return (
  <Wrapper>
    <Link to={listLink}>
      <Header>
        <i className="ph ph-arrow-left" />
        Agent List
      </Header>
    </Link>
    <Widget
      src="${REPL_ACCOUNT}/widget/AI.Agent.AgentSummary"
      props={{
        size: "small",
        showTags: true,
        agent: agent,
        showActions: true,
      }}
    />
    <ContentWrapper>
      <Widget
        src="near/widget/DIG.Tabs"
        props={{
          variant: "line",
          size: "large",
          defaultValue: "prompt",
          items: [
            {
              name: "Properties",
              value: "prompt",
              content: <Text>{prompt}</Text>,
              icon: "ph ph-code",
            },
            {
              name: editLabel,
              value: "edit",
              content: <Widget src={"${REPL_ACCOUNT}/widget/AI.Agent.AgentCreate"} props={{ data: agent }} />,
              icon: editIcon,
            },
            {
              name: "Chat",
              value: "chat",
              content: <Widget src={"${REPL_ACCOUNT}/widget/AI.Agent.AgentChat"} props={{ src, embedded: true }} />,
              icon: "ph ph-code",
            },
          ],
        }}
      />

      <Widget src="${REPL_ACCOUNT}/widget/ComponentDetails.Sidebar" props={{ src }} />
    </ContentWrapper>
  </Wrapper>
);
