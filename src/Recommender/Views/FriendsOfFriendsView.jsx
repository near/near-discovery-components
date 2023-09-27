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

const Profile = styled.div``;

const Profiles = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 800px) {
    grid-template-columns: minmax(0, 1fr);
  }
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
  currentPage: 1,
  userData: [],
  isLoading: true,
  error: null,
  totalPages: 1,
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
const recommendedProfiles = "second_degree_following";
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
              {state.expandedList === "list1"
                ? "Back to categories"
                : "View all"}
            </RetroLinkButton>
          </CategoryHeader>
        )}
        <Widget
          src={`${REPL_ACCOUNT}/widget/Recommender.Service.RecommendedUsers`}
          props={{
            dataset: recommendedProfilesURL,
            returnElements: state.expandedList === "list1" ? null : 4,
            sidebar: props.sidebar || null,
            scope: "friends",
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
              {state.expandedList === "list2"
                ? "Back to categories"
                : "View all"}
            </RetroLinkButton>
          </CategoryHeader>
        )}
        <Widget
          src={`${REPL_ACCOUNT}/widget/Recommender.Service.RecommendedUsers`}
          props={{
            dataset: similarProfilesURL,
            returnElements: state.expandedList === "list2" ? null : 4,
            sidebar: props.sidebar || null,
            scope: "similar",
            onFollow: { removeListProfileOnFollow },
          }}
        />
      </>
    )}
  </RecommendationsView>
);
