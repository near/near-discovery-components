let { src, selectedTab, highlightComment } = props;
const [accountId, widget, widgetName] = src.split("/");

const Wrapper = styled.div``;
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

const SourceTab = () => (
  <Wrapper>
    <Widget
      src="${REPL_ACCOUNT}/widget/ComponentHistory"
      props={{ widgetPath: src }}
    />
  </Wrapper>
);

const AboutTab = () => {
  let data;
  data = Social.get(`${accountId}/widget/${widgetName}/**`);
  const metadata = data.metadata;
  return (
    <Wrapper>
      {data === undefined ? (
        "Loading..."
      ) : metadata.description ? (
        <Markdown text={metadata.description} />
      ) : (
        <Text>This component has no description.</Text>
      )}
    </Wrapper>
  );
};

const DiscussionTab = () => (
  <Widget
    src="${REPL_ACCOUNT}/widget/NestedDiscussions"
    props={{
      identifier: src,
      notifyAccountId: accountId,
      parentComponent: "${REPL_ACCOUNT}/widget/ComponentDetailsPage",
      parentParams: { tab: "discussion", src },
      highlightComment,
    }}
  />
);

const ComponentTabsContent = () => {
  switch (selectedTab) {
    case "about":
      return <AboutTab />;
    case "discussion":
      return <DiscussionTab />;

    case "source":
    default:
      return <SourceTab />;
  }
};

return (
  <ComponentTabsContent />
);
