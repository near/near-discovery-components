const TrendingUsersView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const STORE = "storage.googleapis.com";
const BUCKET = "databricks-near-query-runner";
const BASE_URL = `https://${STORE}/${BUCKET}/output/recommendations`;
const algorithm = "trending_users";
const trendingProfilesURL = `${BASE_URL}/${algorithm}_page`;

return (
  <TrendingUsersView>
    <Widget
      src={`${REPL_ACCOUNT}/widget/Recommender.Service.RecommendedUsers`}
      props={{
        dataset: trendingProfilesURL,
        sidebar: props.sidebar,
      }}
    />
  </TrendingUsersView>
);
