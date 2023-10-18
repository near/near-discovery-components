const Button = styled.button`
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

const Profile = styled.div``;

const Profiles = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
  padding-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 800px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const RecommendedUsers = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 100px;
`;

State.init({
  currentPage: 1,
  userData: [],
  hasFetched: false,
  isLoading: true,
  error: null,
  totalPages: 1,
});

const updateState = (data, totalPageNum) => {
  State.update({
    isLoading: false,
    userData: [...state.userData, ...data],
    totalPages: totalPageNum,
  });
};

const displayedUsers = props.returnElements
  ? state.userData.slice(0, props.returnElements)
  : state.userData;

const passedContext = props.fromContext;
const fromContext = { ...passedContext, scope: props.scope || null };

const STORE = "storage.googleapis.com";
const BUCKET = "databricks-near-query-runner";
const BASE_URL = `https://${STORE}/${BUCKET}/output/recommendations`;
const algorithm = "trending_users";
const dataset = `${BASE_URL}/${algorithm}`;

const getRecommendedUsers = (page) => {
  const url = `${dataset}_${page}.json`;

  State.update({
    hasFetched: true,
  });

  asyncFetch(url)
    .then((res) => {
      if (res.ok) {
        const parsedResults = JSON.parse(res.body);
        const totalPageNum = parsedResults.total_pages || 10;
        updateState(parsedResults.data, totalPageNum);
      } else {
        throw res;
      }
    })
    .catch((e) => {
      State.update({ isLoading: false });
      console.error("Error on fetching recommended users: ", error);
    });
};

const loadMore = () => {
  const nextPage = state.currentPage + 1;
  if (nextPage <= state.totalPages) {
    State.update({ currentPage: nextPage });
    getRecommendedUsers(nextPage);
  }
};

if (state.isLoading && !state.hasFetched) {
  getRecommendedUsers(state.currentPage);
}

if (state.error) {
  console.error("Error, try again later", state.error);
}

return (
  <RecommendedUsers>
    {state.isLoading && displayedUsers.length == null && <p>Loading...</p>}
    {(displayedUsers.length < 4 || displayedUsers == null) &&
      state.isLoading &&
      (props.scope == "friends" || props.scope === "similar") && (
        <p>
          Follow More Users to Unlock More Personalized Recommendations, See
          Who’s
          <a href="https://${REPL_NEAR_URL}/${REPL_ACCOUNT}/widget/PeoplePage?tab=trending">
            Trending
          </a>
        </p>
      )}
    {!props.sidebar && (
      <Profiles>
        {state.userData.map((user, index) => (
          <Profile key={index}>
            <Widget
              src="${REPL_ACCOUNT}/widget/Recommender.Account.AccountProfileLargeCard"
              props={{
                accountId:
                  user.recommended_profile ||
                  user.similar_profile ||
                  user.signer_id,
                accountIdRank: index + 1,
                showTags: true,
                showFollowerStats: true,
                showFollowButton: state.multiSelectMode === false,
                followsYou: user.follows_you || null,
                becauseYouFollow: user.because_you_follow || null,
                likers: user.likers || null,
                followers: user.followers || null,
                following: user.following || null,
                profileImage:
                  user.profile_image_1 ||
                  user.profile_image_2 ||
                  user.profile_image_3 ||
                  null,
                profileName: user.profile_name || null,
                scope: props.scope || null,
                fromContext: fromContext,
              }}
            />
          </Profile>
        ))}
      </Profiles>
    )}
    {props.sidebar && (
      <Profiles>
        {state.userData.map((user, index) => (
          <Profile key={index}>
            <Widget
              src="${REPL_ACCOUNT}/widget/Recommender.Account.AccountProfileSidebar"
              props={{
                accountId:
                  user.recommended_profile ||
                  user.similar_profile ||
                  user.signer_id,
                accountIdRank: index + 1,
                showTags: true,
                showFollowerStats: true,
                showFollowButton: state.multiSelectMode === false,
                followsYou: user.follows_you || null,
                becauseYouFollow: user.because_you_follow || null,
                likers: user.likers || null,
                followers: user.followers || null,
                following: user.following || null,
                profileImage:
                  user.profile_image_1 ||
                  user.profile_image_2 ||
                  user.profile_image_3 ||
                  null,
                profileName: user.profile_name || null,
                scope: props.scope || null,
                fromContext: fromContext,
              }}
            />
          </Profile>
        ))}
      </Profiles>
    )}
    {state.currentPage < state.totalPages ? (
      <Button type="button" onClick={() => loadMore()}>
        Load More
      </Button>
    ) : null}
  </RecommendedUsers>
);
