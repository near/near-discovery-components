// Styling
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

const H1 = styled.h1`
  font-weight: 600;
  font-size: 64px;
  line-height: normal;
  color: #11181c;
  margin: 4rem 0;
`;

const Profile = styled.div`
`;

const Profiles = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 800px) {
    grid-template-columns: minmax(0, 1fr);
  }

`;

const TrendingUsers = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 100px;
`;

// Set initial State
State.init({
  currentPage: 1,
  userData: [],
  isLoading: true,
  error: null,
});

const totalPages = 28;
const STORE = "storage.googleapis.com";
const BUCKET = "databricks-near-query-runner";
const BASE_URL = `https://${STORE}/${BUCKET}/output`;

const updateState = (data) => {
  State.update({
    isLoading: false,
    userData: [...state.userData, ...data],
  });
};

const getTrendingUsers = (page) => {
  try {
    const url = `${BASE_URL}/trending_users_page_${page}.json`;
    asyncFetch(url).then((res) => {
      if (res.ok) {
        const parsedResults = JSON.parse(res.body);
        updateState(parsedResults.data);
      } else {
        console.log("Error fetching data. Try reloading the page.");
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const loadMore = () => {
  const nextPage = state.currentPage + 1;
  if (nextPage <= totalPages) {
    State.update({ currentPage: nextPage });
    getTrendingUsers(nextPage);
  }
};

if (state.isLoading) {
  getTrendingUsers(state.currentPage);

  return (
    <Wrapper>
      <H1>Trending Users</H1>
      <p>Loading...</p>
    </Wrapper>
  );
}

if (state.error) {
  return <p>Error: {state.error}</p>;
}

return (
  <TrendingUsers>
    <H1>Trending Users</H1>
    <Profiles>
      {state.userData.map((user, index) => (
        <Profile key={index}>
          <Widget
            src="${REPL_ACCOUNT}/widget/AccountProfileCardLeaderboard"
            props={{
              accountId: user.signer_id,
              showTags: true,
              showFollowerStats: true,
              showFollowButton: state.multiSelectMode === false,
              likers: user.likers,
              followers: user.followers,
              following: user.following,
              profileImage: user.profileImage,
              profileName: user.profileName,
            }}
          />
        </Profile>
      ))}
    </Profiles>
    {state.currentPage < totalPages ? (
      <Button type="button" onClick={() => loadMore()}>
        Load More
      </Button>
    ) : null}
  </TrendingUsers>
);

