State.init({
  copiedShareUrl: false,
  selectedTab: props.tab ?? "about",
});

if (props.tab && props.tab !== state.selectedTab) {
  State.update({
    selectedTab: props.tab,
  });
}

const src = props.src;
const [accountId, widget, widgetName] = src.split("/");
const existsData = Social.keys(`${accountId}/widget/${widgetName}`);
const exists = !existsData || Object.keys(existsData).length > 0;
const code = Social.get(`${accountId}/widget/${widgetName}`);
const data = Social.get(`${accountId}/widget/${widgetName}/**`);
const metadata = data.metadata;
const tags = Object.keys(metadata.tags || {});
const detailsUrl = `#/${REPL_ACCOUNT}/widget/ComponentDetailsPage?src=${src}`;
const shareUrl = `https://${REPL_NEAR_URL}${detailsUrl}`;
const stats = {
  developerStats: {
    numberOfComponentsPublished: 40,
    developerSince: new Date("2015-01-01").getFullYear(),
  },
  componentStats: {
    numberOfForks: 10,
    impressions: 93,
    parents: [
      "mob.near/widget/Image",
      "mob.near/widget/Image",
      "mob.near/widget/Image",
      "mob.near/widget/Image",
    ],
  },
};

const dependencyMatch =
  code && code.matchAll(/<Widget[\s\S]*?src=.*?"(.+)"[\s\S]*?\/>/g);
let dependencySources = [...(dependencyMatch || [])]
  .map((r) => r[1])
  .filter((r) => !!r);
dependencySources = dependencySources.filter(
  (r, i) => dependencySources.indexOf(r) === i && r !== "(.+)"
);

const sourceCode = `
\`\`\`jsx
${code}
\`\`\`
`;

const Wrapper = styled.div`
  padding-bottom: 48px;
`;

const SummaryWrapper = styled.div`
  margin-bottom: 32px;
`;

const Tabs = styled.div`
  display: flex;
  height: 48px;
  border-bottom: 1px solid #eceef0;
  margin-bottom: 32px;
  overflow: auto;
  scroll-behavior: smooth;

  @media (max-width: 1024px) {
    background: #f8f9fa;
    border-top: 1px solid #eceef0;
    margin: 0 -12px 48px;

    > * {
      flex: 1;
    }
  }
`;

const TabsButton = styled.a`
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
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: ${(p) =>
    p.noSidebar ? "1fr" : "minmax(0, 1fr) 336px"};
  gap: 64px;

  @media (max-width: 995px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const Sidebar = styled.div`
  > div {
    padding-bottom: 32px;
    border-bottom: 1px solid #eceef0;
    margin-bottom: 32px;

    &:last-child {
      padding-bottom: 0;
      border-bottom: none;
      margin-bottom: 0;
    }
  }

  @media (max-width: 995px) {
    padding-bottom: 32px;
    border-bottom: 1px solid #eceef0;
    grid-row: 1;
  }
`;

const SmallTitle = styled.h3`
  color: #687076;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  margin-bottom: 32px;
  text-transform: uppercase;

  @media (max-width: 770px) {
    margin-bottom: 16px;
  }
`;

const TextLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #0091ff;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
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

const Component = styled.div`
  margin-bottom: 24px;
`;

const IconWrapper = styled.div`
  display: flex;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 50px;
  background: var(--violet3);
  color: var(--violet8);
`;

const Icon = styled.i`
  font-size: 15px;
  fill: currentColor;
  padding-right: 5px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 25px;
  padding-bottom: 25px;
  border-bottom: 1px solid #eceef0;
`;

const Stats = styled.div`
  display: flex;
  flex-direction: row;
`;

const StatsBadge = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
`;

const StatsText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: "#11181C";
  font-weight: ${(p) => (p.bold ? "600" : "400")};
  font-size: ${(p) => (p.small ? "12px" : "14px")};
  border-radius: 12px;
`;

if (!exists) {
  return (
    <>
      <Text bold>Error</Text>
      <Text>Could not find: {src}</Text>
    </>
  );
}

return (
  <Content>
    <Wrapper>
      <SummaryWrapper>
          <Widget
            src="${REPL_ACCOUNT}/widget/ComponentSummary"
            props={{
              primaryAction: "open",
              size: "large",
              showTags: true,
              showDesc: true,
              src,
            }}
          />
      </SummaryWrapper>

      <Tabs>
        <TabsButton
          href={`${detailsUrl}&tab=source`}
          selected={state.selectedTab === "source"}
        >
          <Icon className="ph ph-code" />
          Source & Preview
        </TabsButton>
        <TabsButton
          href={`${detailsUrl}&tab=about`}
          selected={state.selectedTab === "about"}
        >
          <Icon className="bi bi-file-earmark-text" />
          Read.me
        </TabsButton>
        <TabsButton
          href={`${detailsUrl}&tab=discussion`}
          selected={state.selectedTab === "discussion"}
        >
          <Icon className="bi bi-chat-text" />
          Discussion
        </TabsButton>
      </Tabs>

      {state.selectedTab === "about" && (
        <Content noSidebar>
          <div>
            {metadata.description ? (
              <Markdown text={metadata.description} />
            ) : (
              <Text>This component has no description.</Text>
            )}
          </div>
        </Content>
      )}

      {state.selectedTab === "source" && (
        <Content noSidebar>
          <Widget
            src="${REPL_ACCOUNT}/widget/ComponentHistory"
            props={{ widgetPath: src }}
          />
        </Content>
      )}

      {state.selectedTab === "discussion" && (
        <Content noSidebar>
          <Widget
            src="${REPL_ACCOUNT}/widget/NestedDiscussions"
            props={{
              identifier: src,
              notifyAccountId: accountId,
              parentComponent: "${REPL_ACCOUNT}/widget/ComponentDetailsPage",
              parentParams: { tab: "discussion", src },
              highlightComment: props.highlightComment,
            }}
          />
        </Content>
      )}
    </Wrapper>
    <Sidebar>
      <div>
        <SmallTitle>DEVELOPER</SmallTitle>
        <Widget
          src="${REPL_ACCOUNT}/widget/AccountProfile"
          props={{
            accountId: accountId,
          }}
        />
        <Container>
          <Stats>
            <StatsBadge>
              <Icon className="ph ph-code" />
              <span className="badge rounded-pill bg-secondary">
                {stats.developerStats.numberOfComponentsPublished} published
              </span>
            </StatsBadge>
            <StatsBadge>
              <Icon className="bi bi-shuffle" />
              <span className="badge rounded-pill bg-secondary">
                {stats.numberOfForks} forks
              </span>
            </StatsBadge>
            <StatsBadge>
              <Icon className="bi bi-calendar" />
              <span className="badge rounded-pill bg-secondary">
                {stats.developerStats.developerSince}
              </span>
            </StatsBadge>
          </Stats>
        </Container>
        <Container>
          <SmallTitle>STATS</SmallTitle>
          <Text medium style={{ "margin-bottom": "10px" }}>
            Impressions
          </Text>
          <Text medium bold style={{ "margin-bottom": "10px" }}>
            {stats.componentStats.impressions}
          </Text>
          <Text small style={{ "margin-bottom": "10px" }}>
            Last Updated
          </Text>
          <Text medium bold style={{ "margin-bottom": "10px" }}>
            <Widget
              src="${REPL_MOB_2}/widget/TimeAgo${REPL_TIME_AGO_VERSION}"
              props={{ keyPath: `${accountId}/widget/${widgetName}` }}
            />{" "}
            ago.
          </Text>
        </Container>
        <Container>
          <SmallTitle>
            PARENTS ({stats.componentStats.parents.length})
          </SmallTitle>
          {stats.componentStats.parents.length === 0 && (
            <Text>This component has no parents.</Text>
          )}
          {stats.componentStats.parents.map((parent) => (source) => (
            <Component
              key={source}
              src="${REPL_ACCOUNT}/widget/ComponentProfile"
              props={{ src: source }}
            />
          ))}
          {!state.showAllComponentParents &&
            stats.componentStats.parents.length > 5 && (
              <Widget
                src="${REPL_ACCOUNT}/widget/DIG.Button"
                props={{
                  fill: "outline",
                  variant: "secondary",
                  label: "Show All",
                  size: "small",
                  style: { width: "30%" },
                  onClick: () => {
                    State.update({ showAllComponentParents: true });
                  },
                }}
              />
            )}
        </Container>
        <Container>
          <SmallTitle>DEPENDENCIES ({dependencySources.length})</SmallTitle>
          {dependencySources.length === 0 && (
            <Text>This component has no dependencies.</Text>
          )}
          {dependencySources.map((source) => (
            <Component
              key={source}
              src="${REPL_ACCOUNT}/widget/ComponentProfile"
              props={{ src: source }}
            />
          ))}
          {!state.showAllDependencies && dependencySources.length > 5 && (
            <Widget
              src="${REPL_ACCOUNT}/widget/DIG.Button"
              props={{
                fill: "outline",
                variant: "secondary",
                label: "Show All",
                size: "small",
                style: { width: "30%" },
                onClick: () => {
                  State.update({ showAllDependencies: true });
                },
              }}
            />
          )}
        </Container>
      </div>
    </Sidebar>
  </Content>
);
