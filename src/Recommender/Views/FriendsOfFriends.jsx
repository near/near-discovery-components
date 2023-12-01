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

const NotEnoughData = styled.div`
  width: 100vw;
`;

State.init({
  currentPage: 1,
  userData: [],
  isLoading: false,
  error: null,
  totalPages: 1,
  hasLoaded: false,
});

const updateState = (data, totalPageNum) => {
  State.update({
    isLoading: false,
    userData: [...state.userData, ...data],
    totalPages: totalPageNum,
    hasLoaded: true,
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
const algorithm = "friends_of_friends";
const dataset = `${BASE_URL}/${algorithm}_${props.accountId}`;

const getRecommendedUsers = (page) => {
  if (state.hasLoaded) return;

  State.update({ isLoading: true });
  try {
    const url = `${dataset}_${page}.json`;
    asyncFetch(url).then((res) => {
      if (res.ok) {
        const data = JSON.parse(res.body);
        updateState(data.data, data.total_pages);
      } else {
        State.update({ isLoading: false, error: true, hasLoaded: true });
        console.error(
          "Error fetching data. Try reloading the page, or no data available.",
        );
      }
    });
  } catch (error) {
    State.update({ isLoading: false, error: true, hasLoaded: true });
    console.error("Error on fetching recommended users: ", error.message);
  }
};

const loadMore = () => {
  const nextPage = state.currentPage + 1;
  if (nextPage <= state.totalPages) {
    State.update({ currentPage: nextPage, hasLoaded: false });
    getRecommendedUsers(nextPage);
  }
};

if (!state.isLoading) {
  getRecommendedUsers(state.currentPage);
}

if (state.error) {
  console.error("Error, try again later", state.error);
}

return (
  <RecommendedUsers>
    {state.isLoading && <p>Loading...</p>}
    <Profiles>
      {!state.isLoading && displayedUsers.length < 4 && state.error ? (
        <NotEnoughData>
          Follow More Users to Unlock More Personalized Recommendations, See
          Who’s
          <Link href="https://${REPL_NEAR_URL}/${REPL_ACCOUNT}/widget/PeoplePage?tab=trending">
            Trending
          </Link>
        </NotEnoughData>
      ) : (
        displayedUsers.map((user, rank) => (
          <Profile
            key={
              user.recommended_profile || user.similar_profile || user.signer_id
            }
          >
            <Widget
              src="${REPL_ACCOUNT}/widget/Recommender.Account.AccountProfileLargeCard"
              props={{
                accountId:
                  user.recommended_profile ||
                  user.similar_profile ||
                  user.signer_id,
                accountIdRank: rank + 1,
                showTags: true,
                showFollowerStats: true,
                showFollowButton: state.multiSelectMode === false,
                followsYou: user.follows_you || null,
                becauseYouFollow: user.because_you_follow || null,
                likers: user.likers || null,
                followers: user.followers || null,
                following: user.following || null,
                profileImage: user.profileImage || null,
                profileName: user.profileName || null,
                sidebar: props.sidebar || null,
                scope: props.scope || null,
                fromContext: fromContext,
              }}
            />
          </Profile>
        ))
      )}
    </Profiles>
    {!props.returnElements && state.currentPage < state.totalPages ? (
      <Button type="button" onClick={() => loadMore()}>
        Load More
      </Button>
    ) : null}
  </RecommendedUsers>
);
