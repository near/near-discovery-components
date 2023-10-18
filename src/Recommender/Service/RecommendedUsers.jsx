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
  margin: 36px 0;

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

const H1 = styled.h1`
  font-weight: 600;
  font-size: 64px;
  line-height: normal;
  color: #11181c;
  margin: 4rem 0;
`;

const Profile = styled.div``;

const Profiles = styled.div`
  display: grid;
  grid-template-columns: ${props.gridCols
    ? props.gridCols
    : "repeat(4, minmax(0, 1fr))"};
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 800px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const RecommendedUsers = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: ${props.sidebar ? "12px" : "50px"};
`;

State.init({
  currentPage: 1,
  hasFetched: false,
  isLoading: true,
  error: null,
  totalPages: 1,
  displayedUsers: [],
});

const updateState = (data, totalPageNum) => {
  const users = [...state.displayedUsers, ...data];

  State.update({
    isLoading: false,
    displayedUsers: props.returnElements
      ? users.slice(0, props.returnElements)
      : users,
    totalPages: totalPageNum,
  });
};

const passedContext = props.fromContext;
const fromContext = { ...passedContext, scope: props.scope };

const STORE = "storage.googleapis.com";
const BUCKET = "databricks-near-query-runner";
const BASE_URL = `https://${STORE}/${BUCKET}/output/recommendations`;

const accountId = props.accountId;
const profileUrl = `#/${REPL_ACCOUNT}/widget/ProfilePage?accountId=${accountId}`;

const getRecommendedUsers = (page) => {
  const url = `${props.dataset}_${page}.json`;

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

const handleFollowed = (accountId) => {
  const updatedUsers = state.displayedUsers.filter(
    (user) => (user.recommended_profile || user.similar_profile) !== accountId
  );
  State.update({
    displayedUsers: updatedUsers,
  });
};

function returnProfileForUser(user) {
  const rawImage =
    user.profile_image_1 || user.profile_image_2 || user.profile_image_3;
  const image =
    rawImage && rawImage.indexOf("http") === 0
      ? { url: rawImage }
      : { ipfs_cid: rawImage };
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
}

return (
  <RecommendedUsers>
    {state.isLoading && <p>Loading...</p>}
    <Profiles>
      {!state.isLoading && state.displayedUsers.length < 4 ? (
        <>
          {!state.isLoading && (
            <div>
              Follow More Users to Unlock More Personalized Recommendations, See
              Who’s
              <a href="https://${REPL_NEAR_URL}/${REPL_ACCOUNT}/widget/PeoplePage?tab=trending">
                Trending
              </a>
            </div>
          )}
        </>
      ) : (
        state.displayedUsers.map((user, index) => (
          <Profile key={user.recommended_profile || user.similar_profile}>
            <Widget
              src="${REPL_ACCOUNT}/widget/Recommender.Account.AccountProfileSidebar"
              props={{
                accountId: user.recommended_profile || user.similar_profile,
                accountIdRank: index + 1,
                showTags: true,
                showFollowerStats: true,
                showFollowButton: state.multiSelectMode === false,
                followsYou: user.follows_you || null,
                becauseYouFollow: user.because_you_follow || null,
                likers: user.likers || null,
                followers: user.followers || null,
                following: user.following || null,
                profile: returnProfileForUser(user),
                sidebar: props.sidebar || null,
                scope: props.scope || null,
                fromContext: fromContext,
                onFollowed: () =>
                  handleFollowed(
                    user.recommended_profile || user.similar_profile
                  ),
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
