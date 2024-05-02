const GRAPHQL_ENDPOINT = props.GRAPHQL_ENDPOINT ?? "https://near-queryapi.api.pagoda.co";

console.log("determine activity feed props", props);

let lastPostSocialApi = Social.index("post", "main", {
  limit: 1,
  order: "desc",
});

if (lastPostSocialApi == null) {
  return "Loading...";
}

State.init({
  // If QueryAPI Feed is lagging behind Social API, fallback to old widget.
  shouldFallback: false,
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
    if (feedIndexerResponse && feedIndexerResponse.body.data.dataplatform_near_social_feed_posts.length > 0) {
      const nearSocialBlockHeight = lastPostSocialApi[0].blockHeight;
      const feedIndexerBlockHeight = feedIndexerResponse.body.data.dataplatform_near_social_feed_posts[0].block_height;

      const lag = nearSocialBlockHeight - feedIndexerBlockHeight;
      let shouldFallback = lag > 2 || !feedIndexerBlockHeight;
      if (shouldFallback === true) {
        console.log(
          "Falling back to Social index feed. Block difference is: ",
          nearSocialBlockHeight - feedIndexerBlockHeight,
        );
        State.update({ shouldFallback });
      }
    } else {
      console.log("Falling back to Social index feed. No QueryApi data received.");
      State.update({ shouldFallback: true });
    }
  })
  .catch((error) => {
    console.log("Error while fetching QueryApi feed (falling back to index feed): ", error);
    State.update({ shouldFallback: true });
  });

return (
  <>
    {state.shouldFallback ? (
      <>
        {props.filteredAccountIds ? (
          <Widget
            src={`${REPL_ACCOUNT}/widget/v1.Feed`}
            props={{
              showFlagAccountFeature: true,
              accounts: props.filteredAccountIds,
            }}
          />
        ) : (
          <Widget
            src={`${REPL_ACCOUNT}/widget/v1.Posts`}
            props={{
              showFlagAccountFeature: true,
            }}
          />
        )}
      </>
    ) : (
      <Widget
        src={`${REPL_ACCOUNT}/widget/ActivityFeeds.PostsFeedControls`}
        props={{
          GRAPHQL_ENDPOINT,
          showFlagAccountFeature: true,
          ...props,
        }}
      />
    )}
  </>
);
