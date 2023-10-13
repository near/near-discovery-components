const ButtonLink = styled.a`
  display: block;
  width: 100%;
  padding: 8px;
  height: 32px;
  background: #fbfcfd;
  border: 1px solid #d7dbdf;
  border-radius: 50px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
  cursor: pointer;
  color: #11181c !important;
  margin: 0;

  &:hover,
  &:focus {
    background: #ecedee;
    text-decoration: none;
    outline: none;
  }

  span {
    color: #687076 !important;
  }
`;

const TrendingUsersView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const STORE = "storage.googleapis.com";
const BUCKET = "databricks-near-query-runner";
const BASE_URL = `https://${STORE}/${BUCKET}/output/recommendations`;
const algorithm = "trending_users";
const dataset = `${BASE_URL}/${algorithm}`;

return (
  <>
    <TrendingUsersView>
      <Widget
        src={`${REPL_ACCOUNT}/widget/Recommender.Service.RecommendedUsers`}
        props={{
          dataset: dataset,
          sidebar: props.sidebar,
          fromContext: props.fromContext,
          gridCols: props.gridCols,
          returnElements: props.returnElements,
        }}
      />
    </TrendingUsersView>
    {props.sidebar && (
      <>
        <ButtonLink href="#/${REPL_ACCOUNT}/widget/PeoplePage?tab=trending">
          View Trending Users
        </ButtonLink>
      </>
    )}
  </>
);
