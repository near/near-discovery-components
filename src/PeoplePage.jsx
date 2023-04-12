const limitPerPage = 21;
let people = [];
const peopleUrl = "/#/adminalpha.near/widget/PeoplePage";
let followingData = null;
let followersData = null;

State.init({
  currentPage: 0,
  selectedTab: props.tab || "everyone",
});

if (props.tab && props.tab !== state.selectedTab) {
  State.update({
    selectedTab: props.tab,
  });
}

if (context.accountId) {
  followingData = Social.keys(`${context.accountId}/graph/follow/*`, "final");
  followersData = Social.keys(`*/graph/follow/${context.accountId}`, "final");
}

// This data includes all accounts with or without profiles:
const accountsData = Social.keys("*", "final", {
  return_type: "BlockHeight",
});
const totalAccounts = Object.keys(accountsData || {}).length;

// This data only includes accounts that have set up a profile:
const data = Social.keys("*/profile", "final", {
  return_type: "BlockHeight",
});

if (data) {
  const result = [];

  Object.keys(data).forEach((accountId) => {
    const isFollowing =
      followingData &&
      followingData[context.accountId]?.graph?.follow[accountId] === true;

    const isFollower =
      followersData &&
      followersData[accountId]?.graph?.follow[context.accountId] === true;

    if (
      state.selectedTab === "everyone" ||
      (state.selectedTab === "following" && isFollowing) ||
      (state.selectedTab === "followers" && isFollower)
    ) {
      result.push({
        accountId,
        blockHeight: data[accountId].profile,
      });
    }
  });

  result.sort((a, b) => b.blockHeight - a.blockHeight);
  people = result.slice(0, state.currentPage * limitPerPage + limitPerPage);
}

function onSearchChange({ result, term }) {
  if (term.trim()) {
    State.update({ searchResults: result || [] });
  } else {
    State.update({ searchResults: null });
  }
}

const items = state.searchResults || people;
const showLoadMoreButton =
  !state.searchResults && people.length % limitPerPage === 0;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding-bottom: 48px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Search = styled.div`
  width: 246px;

  @media (max-width: 500px) {
    width: 100%;
  }
`;

const H1 = styled.h1`
  font-weight: 600;
  font-size: 32px;
  line-height: 39px;
  color: #11181c;
  margin: 0;
`;

const H2 = styled.h2`
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;
  color: #687076;
  margin: 0;
`;

const Text = styled.p`
  margin: 0;
  line-height: 1.5rem;
  color: ${(p) => (p.bold ? "#11181C" : "#687076")} !important;
  font-weight: ${(p) => (p.bold ? "600" : "400")};
  font-size: ${(p) => (p.small ? "12px" : "14px")};
  overflow: ${(p) => (p.ellipsis ? "hidden" : "")};
  text-overflow: ${(p) => (p.ellipsis ? "ellipsis" : "")};
  white-space: ${(p) => (p.ellipsis ? "nowrap" : "")};
  overflow-wrap: anywhere;

  b {
    font-weight: 600;
    color: #11181c;
  }

  &[href] {
    display: inline-flex;
    gap: 0.25rem;

    &:hover,
    &:focus {
      text-decoration: underline;
    }
  }
`;

const Items = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 800px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Item = styled.div``;

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

const Tabs = styled.div`
  display: flex;
  height: 48px;
  border-bottom: 1px solid #eceef0;
  margin-bottom: -24px;
  overflow: auto;
  scroll-behavior: smooth;

  @media (max-width: 1200px) {
    background: #f8f9fa;
    border-top: 1px solid #eceef0;
    margin-left: -12px;
    margin-right: -12px;

    > * {
      flex: 1;
    }
  }
`;

const TabsButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-weight: 600;
  font-size: 12px;
  padding: 0 12px;
  position: relative;
  color: ${(p) => (p.selected ? "#11181C" : "#687076")};
  background: none;
  border: none;
  outline: none;
  text-align: center;
  text-decoration: none !important;

  &:hover {
    color: #11181c;
  }

  &::after {
    content: "";
    display: ${(p) => (p.selected ? "block" : "none")};
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: #59e692;
  }
`;

return (
  <Wrapper>
    <Header>
      <H1>{totalAccounts} People</H1>
      <H2>Connect with the NEAR community.</H2>
    </Header>

    <Search>
      <Widget
        src="adminalpha.near/widget/ProfileSearch"
        props={{
          limit: 21,
          onChange: onSearchChange,
        }}
      />
    </Search>

    {!state.searchResults && (
      <Tabs>
        <TabsButton
          href={`${peopleUrl}?tab=everyone`}
          selected={state.selectedTab === "everyone"}
        >
          Everyone
        </TabsButton>

        {context.accountId && (
          <TabsButton
            href={`${peopleUrl}?tab=following`}
            selected={state.selectedTab === "following"}
          >
            Following
          </TabsButton>
        )}

        {context.accountId && (
          <TabsButton
            href={`${peopleUrl}?tab=followers`}
            selected={state.selectedTab === "followers"}
          >
            Followers
          </TabsButton>
        )}
      </Tabs>
    )}

    {state.searchResults?.length === 0 && (
      <Text>No people matched your search.</Text>
    )}

    {items.length > 0 && (
      <Items>
        {items.map((person, i) => (
          <Item key={person.accountId}>
            <Widget
              src="adminalpha.near/widget/AccountProfileCard"
              props={{
                accountId: person.accountId,
                blockHeight: person.blockHeight,
              }}
            />
          </Item>
        ))}
      </Items>
    )}

    {showLoadMoreButton && (
      <Button
        type="button"
        onClick={() => State.update({ currentPage: state.currentPage + 1 })}
      >
        Load More
      </Button>
    )}
  </Wrapper>
);
