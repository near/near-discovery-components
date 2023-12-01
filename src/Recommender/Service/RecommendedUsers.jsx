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

const NotEnoughData = styled.div`
  width: 100%;
`;

State.init({
  currentPage: 1,
  isLoading: false,
  displayedUsers: [],
  allUsers: [],
  error: null,
  totalPages: 1,
  hasLoaded: false,
  returnElements: props.returnElements,
});

const updateState = (data, totalPageNum) => {
  State.update({
    isLoading: false,
    allUsers: [...state.allUsers, ...data],
    totalPages: totalPageNum,
    hasLoaded: true,
  });
};

State.update({
  displayedUsers: state.returnElements
    ? state.allUsers.slice(0, state.returnElements)
    : state.allUsers,
});

const passedContext = props.fromContext;
const fromContext = { ...passedContext, scope: props.scope || null };

const getRecommendedUsers = (page) => {
  if (state.hasLoaded) return;

  State.update({ isLoading: true });
  try {
    const url = `${props.dataset}_${page}.json`;
    asyncFetch(url).then((res) => {
      if (res.ok) {
        const data = JSON.parse(res.body);
        const totalPageNum = data.total_pages || 28;
        updateState(data.data, totalPageNum);
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

if (!state.isLoading) {
  getRecommendedUsers(state.currentPage);
}

if (state.error) {
  console.error("Error, try again later", state.error);
}

const isAccountMatch = (user, accountId) =>
  user.recommended_profile === accountId || user.similar_profile === accountId;

const handleFollowed = (accountId) => {
  const updatedDisplayedUsers = state.displayedUsers.filter(
    (user) => !isAccountMatch(user, accountId),
  );

  const updatedAllUsers = state.allUsers.filter(
    (user) => !isAccountMatch(user, accountId),
  );

  const nextUser = updatedAllUsers.find(
    (user) =>
      !updatedDisplayedUsers.some(
        (displayedUser) =>
          isAccountMatch(displayedUser, user.recommended_profile) ||
          isAccountMatch(displayedUser, user.similar_profile),
      ),
  );

  if (nextUser) {
    updatedDisplayedUsers.push(nextUser);
  }

  State.update({
    allUsers: updatedAllUsers,
    displayedUsers: updatedDisplayedUsers,
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
      {(!state.isLoading && displayedUsers.length < 3) || state.error ? (
        <NotEnoughData>
          Follow More Users to Unlock More Personalized Recommendations, See
          Who’s
          <Link href="https://${REPL_NEAR_URL}/${REPL_ACCOUNT}/widget/PeoplePage?tab=trending">
            Trending
          </Link>
        </NotEnoughData>
      ) : (
        state.displayedUsers.map((user, rank) => (
          <Profile key={user.recommended_profile || user.similar_profile}>
            <Widget
              src="${REPL_ACCOUNT}/widget/Recommender.Account.AccountProfileSidebar"
              props={{
                accountId: user.recommended_profile || user.similar_profile,
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
                sidebar: props.sidebar || null,
                scope: props.scope || null,
                fromContext: fromContext,
                onFollowed: () =>
                  handleFollowed(
                    user.recommended_profile || user.similar_profile,
                  ),
              }}
            />
          </Profile>
        ))
      )}
    </Profiles>
  </RecommendedUsers>
);
