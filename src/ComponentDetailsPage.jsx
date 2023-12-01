let { src, tab, highlightComment } = props;

const [selectedTab, setSelectedTab] = useState(props.tab ?? "source");

const detailsUrl = `/${REPL_ACCOUNT}/widget/ComponentDetailsPage?src=${src}`;
const [accountId, widget, widgetName] = src.split("/");
const existsData = Social.keys(`${accountId}/widget/${widgetName}`);
const exists = !existsData || Object.keys(existsData).length > 0;

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

const Tabs = styled.div`
  display: flex;
  height: 48px;
  border-bottom: 1px solid #eceef0;
  overflow: auto;
  scroll-behavior: smooth;

  @media (max-width: 995px) {
    background: #f8f9fa;
    border-top: 1px solid #eceef0;
    margin: 0 -12px 0;

    > * {
      flex: 1;
    }
  }
`;

const TabsButton = styled("Link")`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-weight: 600;
  font-size: 12px;
  padding: 0 12px;
  position: relative;
  color: ${(p) => (p.selected ? "#11181C" : "#687076")};
  background: none;
  border: none;
  outline: none;
  text-align: center;
  text-decoration: none !important;

  &:hover {
    color: #11181c;
  }

  &::after {
    content: "";
    display: ${(p) => (p.selected ? "block" : "none")};
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: #59e692;
  }

  > span {
    margin-right: 8px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;

    > span {
      margin-right: 0;
      margin-bottom: 8px;
    }
  }
`;

const Icon = styled.i`
  font-size: 15px;
  fill: currentColor;
  padding-right: 5px;
`;

if (!exists) {
  return (
    <>
      <Text bold>Error</Text>
      <Text>Could not find: {src}</Text>
    </>
  );
}

if (tab && tab !== selectedTab) {
  setSelectedTab(tab);
}

return (
  <Wrapper>
    <Widget
      src="${REPL_ACCOUNT}/widget/ComponentSummary"
      props={{
        primaryAction: "open",
        size: "large",
        showTags: true,
        descMaxWords: componentDescMaxWords,
        src,
      }}
    />

    <Tabs>
      <TabsButton
        href={`${detailsUrl}&tab=source`}
        selected={selectedTab === "source"}
      >
        <Icon className="ph ph-code" />
        Source & Preview
      </TabsButton>
      <TabsButton
        href={`${detailsUrl}&tab=about`}
        selected={selectedTab === "about"}
      >
        <Icon className="ph ph-file-text" />
        Read.me
      </TabsButton>
      <TabsButton
        href={`${detailsUrl}&tab=discussion`}
        selected={selectedTab === "discussion"}
      >
        <Icon className="ph ph-chat-circle-text" />
        Discussion
      </TabsButton>
    </Tabs>

    <ContentWrapper>
      <Widget
        src="${REPL_ACCOUNT}/widget/ComponentDetails.Content"
        props={{ src, selectedTab, highlightComment }}
      />

      <Widget
        src="${REPL_ACCOUNT}/widget/ComponentDetails.Sidebar"
        props={{ src, selectedTab, highlightComment }}
      />
    </ContentWrapper>
  </Wrapper>
);
