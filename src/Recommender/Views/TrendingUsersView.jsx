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

const passedContext = props.fromContext;
const fromContext = { ...passedContext, scope: props.scope || null };

const STORE = "storage.googleapis.com";
const BUCKET = "databricks-near-query-runner";
const BASE_URL = `https://${STORE}/${BUCKET}/output/recommendations`;
const algorithm = "trending_users";
const dataset = `${BASE_URL}/${algorithm}`;

const getRecommendedUsers = (page) => {
  if (state.hasLoaded) return;

  State.update({ isLoading: true });
  try {
    const url = `${dataset}_${page}.json`;
    asyncFetch(url).then((res) => {
      if (res.ok) {
        const data = JSON.parse(res.body);
        const totalPageNum = data.total_pages || 28;
        updateState(data.data, totalPageNum);
      } else {
        State.update({ isLoading: false, error: true, hasLoaded: true });
        console.error("Error fetching data. Try reloading the page, or no data available.");
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

const returnProfileForUser = (user) => {
  const rawImage = user.profile_image_1 || user.profile_image_2 || user.profile_image_3;
  const image = rawImage && rawImage.indexOf("http") === 0 ? { url: rawImage } : { ipfs_cid: rawImage };
  const name = user.profile_name ?? "";
  let tags = null;

  if (user.profile_tags) {
    tags = {};
    user.profile_tags.forEach((tag) => (tags[tag] = ""));
  }

  if (image && tags) {
    return {
      image,
      name,
      tags,
    };
  }

  return null;
};

if (!state.isLoading && !state.hasLoaded) {
  getRecommendedUsers(state.currentPage);
}

if (state.error) {
  console.error("Error, try again later", state.error);
}

return (
  <RecommendedUsers>
    {state.isLoading && <p>Loading...</p>}
    {!state.isLoading && state.error && <NotEnoughData>404. Data not loading. Try again later.</NotEnoughData>}
    {!props.sidebar && (
      <Profiles>
        {state.userData.map((user, rank) => (
          <Profile key={user.recommended_profile || user.similar_profile || user.signer_id}>
            <Widget
              src="${REPL_ACCOUNT}/widget/Recommender.Account.AccountProfileLargeCard"
              props={{
                accountId: user.recommended_profile || user.similar_profile || user.signer_id,
                accountIdRank: rank + 1,
                showTags: true,
                showFollowerStats: true,
                showFollowButton: state.multiSelectMode === false,
                followsYou: user.follows_you || null,
                becauseYouFollow: user.because_you_follow || null,
                likers: user.likers || null,
                followers: user.followers || null,
                following: user.following || null,
                profile: returnProfileForUser(user),
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
        {state.userData.map((user, rank) => (
          <Profile key={rank}>
            <Widget
              src="${REPL_ACCOUNT}/widget/Recommender.Account.AccountProfileSidebar"
              props={{
                accountId: user.recommended_profile || user.similar_profile || user.signer_id,
                accountIdRank: rank + 1,
                showTags: true,
                showFollowerStats: true,
                showFollowButton: state.multiSelectMode === false,
                followsYou: user.follows_you || null,
                becauseYouFollow: user.because_you_follow || null,
                likers: user.likers || null,
                followers: user.followers || null,
                following: user.following || null,
                profile: returnProfileForUser(user),
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
