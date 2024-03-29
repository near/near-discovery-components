const [selectedTab, setSelectedTab] = useState(props.tab ?? "posts");
const activityUrl = `/${REPL_ACCOUNT}/widget/ActivityPage`;

const Wrapper = styled.div`
  padding-top: 0;

  @media (max-width: 1024px) {
    padding-left: 0;
    padding-right: 0;
  }
`;

const Main = styled.div`
  display: grid;
  grid-template-columns: 290px minmax(0, 1fr) 290px;
  grid-gap: 16px;

  @media (max-width: 1024px) {
    display: block;
  }
`;

const Section = styled.div`
  padding-top: 24px;
  border-left: ${(p) => (p.$primary ? "1px solid #ECEEF0" : "none")};
  border-right: ${(p) => (p.$primary ? "1px solid #ECEEF0" : "none")};

  > div {
    padding-bottom: 24px;
    margin-bottom: 24px;
    border-bottom: 1px solid #eceef0;

    &:last-child {
      padding-bottom: 0;
      margin-bottom: 0;
      border-bottom: none;
    }
  }

  @media (max-width: 1024px) {
    padding-top: 0px;
    border-left: none;
    border-right: none;
    display: ${(p) => (p.$active ? "block" : "none")};
    padding: ${(p) => p.$smallScreenPadding};
  }
`;

const Tabs = styled.div`
  display: none;
  height: 48px;
  background: #f8f9fa;
  border-bottom: 1px solid #eceef0;
  overflow: auto;
  scroll-behavior: smooth;

  @media (max-width: 1024px) {
    display: flex;

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
  color: ${(p) => (p.$selected ? "#11181C" : "#687076")};
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
    display: ${(p) => (p.$selected ? "block" : "none")};
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: #59e692;
  }
`;

return (
  <Wrapper className="gateway-page-container">
    <Tabs>
      <TabsButton
        href={`${activityUrl}?tab=posts`}
        $selected={selectedTab === "posts"}
        onClick={() => setSelectedTab("posts")}
      >
        Posts
      </TabsButton>

      <TabsButton
        href={`${activityUrl}?tab=apps`}
        $selected={selectedTab === "apps"}
        onClick={() => setSelectedTab("apps")}
      >
        Components
      </TabsButton>

      <TabsButton
        href={`${activityUrl}?tab=explore`}
        $selected={selectedTab === "explore"}
        onClick={() => setSelectedTab("explore")}
      >
        Explore
      </TabsButton>
    </Tabs>

    <Main>
      <Section $smallScreenPadding="1rem" $active={selectedTab === "apps"}>
        <Widget src="${REPL_ACCOUNT}/widget/FeaturedComponents" />
        <Widget src="${REPL_ACCOUNT}/widget/LatestComponents" />
      </Section>

      <Section $smallScreenPadding="0" $primary $active={selectedTab === "posts"}>
        <Widget src={`${REPL_ACCOUNT}/widget/ActivityFeeds.DetermineActivityFeed`} />
      </Section>

      <Section $smallScreenPadding="1rem" $active={selectedTab === "explore"}>
        <Widget src="${REPL_ACCOUNT}/widget/ExploreWidgets" />
      </Section>
    </Main>
  </Wrapper>
);
