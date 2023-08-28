const GRAPHQL_ENDPOINT = "https://near-queryapi.api.pagoda.co";

let lastPostSocialApi = Social.index("post", "main", {
  limit: 1,
  order: "desc",
});

State.init({
  // If QueryAPI Feed is lagging behind Social API, fallback to old widget.
  shouldFallback: props.shouldFallback ?? false,
  selectedTab: props.tab || "posts",
});

function fetchGraphQL(operationsDoc, operationName, variables) {
  return asyncFetch(`${GRAPHQL_ENDPOINT}/v1/graphql`, {
    method: "POST",
    headers: { "x-hasura-role": "dataplatform_near" },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });
}

const lastPostQuery = `
query IndexerQuery {
  dataplatform_near_social_feed_posts( limit: 1, order_by: { block_height: desc }) {
      block_height 
  }
}
`;

fetchGraphQL(lastPostQuery, "IndexerQuery", {})
  .then((feedIndexerResponse) => {
    if (
      feedIndexerResponse &&
      feedIndexerResponse.body.data.dataplatform_near_social_feed_posts.length >
        0
    ) {
      const nearSocialBlockHeight = lastPostSocialApi[0].blockHeight;
      const feedIndexerBlockHeight =
        feedIndexerResponse.body.data.dataplatform_near_social_feed_posts[0]
          .block_height;

      const lag = nearSocialBlockHeight - feedIndexerBlockHeight;
      let shouldFallback = lag > 2 || !feedIndexerBlockHeight;
      State.update({ shouldFallback });
    } else {
      console.log("Falling back to old widget.");
      State.update({ shouldFallback: true });
    }
  })
  .catch((error) => {
    console.log(
      "Error while fetching GraphQL(falling back to old widget): ",
      error
    );
    State.update({ shouldFallback: true });
  });

if (props.tab && props.tab !== state.selectedTab) {
  State.update({
    selectedTab: props.tab,
  });
}

const activityUrl = `#/${REPL_ACCOUNT}/widget/ActivityPage`;

const Wrapper = styled.div`
  margin-top: calc(var(--body-top-padding) * -1);
  padding-bottom: 48px;
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
  border-left: ${(p) => (p.primary ? "1px solid #ECEEF0" : "none")};
  border-right: ${(p) => (p.primary ? "1px solid #ECEEF0" : "none")};

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
    display: ${(p) => (p.active ? "block" : "none")};
    margin: ${(p) => (p.negativeMargin ? "0 -12px" : "0")};
  }
`;

const Tabs = styled.div`
  display: none;
  height: 48px;
  background: #f8f9fa;
  border-bottom: 1px solid #eceef0;
  margin-bottom: ${(p) => (p.noMargin ? "0" : p.halfMargin ? "24px" : "24px")};
  overflow: auto;
  scroll-behavior: smooth;

  @media (max-width: 1024px) {
    display: flex;
    margin-left: -12px;
    margin-right: -12px;

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

return (
  <Wrapper
    className="container-xl"
    negativeMargin={state.selectedTab === "posts"}
  >
    <Tabs
      halfMargin={state.selectedTab === "apps"}
      noMargin={state.selectedTab === "posts"}
    >
      <TabsButton
        href={`${activityUrl}?tab=posts`}
        selected={state.selectedTab === "posts"}
      >
        Posts
      </TabsButton>

      <TabsButton
        href={`${activityUrl}?tab=apps`}
        selected={state.selectedTab === "apps"}
      >
        Components
      </TabsButton>

      <TabsButton
        href={`${activityUrl}?tab=explore`}
        selected={state.selectedTab === "explore"}
      >
        Explore
      </TabsButton>
    </Tabs>

    <Main>
      <Section active={state.selectedTab === "apps"}>
        <Widget src="${REPL_ACCOUNT}/widget/FeaturedComponents" />
        <Widget src="${REPL_ACCOUNT}/widget/LatestComponents" />
      </Section>
      <Section negativeMargin primary active={state.selectedTab === "posts"}>
        {state.shouldFallback == true ? (
          <Widget src={`${REPL_ACCOUNT}/widget/v1.Posts`} />
        ) : (
          <Widget
            src={`${REPL_ACCOUNT}/widget/Posts`}
            props={{
              GRAPHQL_ENDPOINT,
              accountsFollowing,
            }}
          />
        )}
      </Section>
      <Section active={state.selectedTab === "explore"}>
        <Widget src="${REPL_ACCOUNT}/widget/ExploreWidgets" />
      </Section>
    </Main>
  </Wrapper>
);
