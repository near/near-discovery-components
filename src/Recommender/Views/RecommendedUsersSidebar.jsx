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

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RecommendationsView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const H3 = styled.h3`
  font-weight: 600;
  font-size: 24px;
  line-height: normal;
  color: #11181c;
  margin: 1.8rem 0 1.5rem 0;
`;

const RetroLinkButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: blue;
  font-size: 16px;
  padding: 0;
  margin: 0;
  outline: none;
  transition: color 0.3s;

  &:hover {
    color: purple;
  }

  &:active {
    color: red;
  }
`;

const STORE = "storage.googleapis.com";
const BUCKET = "databricks-near-query-runner";
const BASE_URL = `https://${STORE}/${BUCKET}/output/recommendations`;
const recommendedProfiles = "friends_of_friends";
const similarProfiles = "similarity_estimation";

const recommendedProfilesURL = `${BASE_URL}/${recommendedProfiles}_${context.accountId}`;
const similarProfilesURL = `${BASE_URL}/${similarProfiles}_${context.accountId}`;

return (
  <RecommendationsView>
    <Widget
      src="${REPL_ACCOUNT}/widget/Recommender.Service.RecommendedUsers"
      props={{
        dataset: recommendedProfilesURL,
        returnElements: 4,
        sidebar: props.sidebar || null,
        scope: "friends",
        fromContext: props.fromContext,
        gridCols: props.gridCols,
      }}
    />
    <Widget
      src="${REPL_ACCOUNT}/widget/Recommender.Service.RecommendedUsers"
      props={{
        dataset: similarProfilesURL,
        returnElements: 4,
        sidebar: props.sidebar || null,
        scope: "similar",
        fromContext: props.fromContext,
        gridCols: props.gridCols,
      }}
    />

    <ButtonLink href="#/${REPL_ACCOUNT}/widget/PeoplePage?tab=recommended">
      View Recommended Profiles
    </ButtonLink>
  </RecommendationsView>
);
