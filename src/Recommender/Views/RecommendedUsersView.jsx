const ButtonLink = styled("Link")`
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

State.init({
  expandedList: "",
});

const handleToggleList = (listId) => {
  if (state.expandedList === listId) {
    State.update({ expandedList: "" });
  } else {
    State.update({ expandedList: listId });
  }
};

const STORE = "storage.googleapis.com";
const BUCKET = "databricks-near-query-runner";
const BASE_URL = `https://${STORE}/${BUCKET}/output/recommendations`;

const similarProfiles = "similarity_estimation";

const recommendedProfilesURL = `${BASE_URL}/${recommendedProfiles}_${context.accountId}`;
const similarProfilesURL = `${BASE_URL}/${similarProfiles}_${context.accountId}`;

return (
  <RecommendationsView>
    {state.expandedList !== "list2" && (
      <>
        {props.sidebar ? (
          <></>
        ) : (
          <CategoryHeader>
            <H3>Friends of Friends</H3>
            <RetroLinkButton onClick={() => handleToggleList("list1")}>
              {state.expandedList === "list1" ? "Back to categories" : "View all"}
            </RetroLinkButton>
          </CategoryHeader>
        )}
        <Widget
          src="${REPL_ACCOUNT}/widget/Recommender.Views.FriendsOfFriends"
          props={{
            returnElements: state.expandedList === "list1" ? null : 4,
            sidebar: props.sidebar || null,
            scope: "friends",
            fromContext: props.fromContext,
            gridCols: props.gridCols,
            accountId: props.accountId,
          }}
        />
      </>
    )}

    {state.expandedList !== "list1" && (
      <>
        {props.sidebar ? (
          <></>
        ) : (
          <CategoryHeader>
            <H3>Similar to you</H3>
            <RetroLinkButton onClick={() => handleToggleList("list2")}>
              {state.expandedList === "list2" ? "Back to categories" : "View all"}
            </RetroLinkButton>
          </CategoryHeader>
        )}
        <Widget
          src={`${REPL_ACCOUNT}/widget/Recommender.Views.SimilarProfiles`}
          props={{
            returnElements: state.expandedList === "list2" ? null : 4,
            sidebar: props.sidebar || null,
            scope: "similar",
            fromContext: props.fromContext,
            gridCols: props.gridCols,
            accountId: props.accountId,
          }}
        />
      </>
    )}

    {props.sidebar && (
      <ButtonLink href="/${REPL_ACCOUNT}/widget/PeoplePage?tab=recommended">View Recommended Profiles</ButtonLink>
    )}
  </RecommendationsView>
);
