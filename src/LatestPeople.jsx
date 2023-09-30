const accountsData = Social.keys("*", "final", {
  return_type: "BlockHeight",
});

const accountsWithProfileData = Social.keys("*/profile", "final", {
  return_type: "BlockHeight",
});

const limit = 5;
const totalAccounts = Object.keys(accountsData || {}).length;
const totalAccountsWithProfile = Object.keys(
  accountsWithProfileData || {}
).length;

let accounts = Object.entries(accountsWithProfileData || {})
  .slice(totalAccountsWithProfile - limit, totalAccountsWithProfile)
  .map((entry) => {
    return {
      accountId: entry[0],
      blockHeight: entry[1].profile,
    };
  });

accounts.reverse();

State.init({
  selectedView: { text: "Top", value: "trending" },
});

const handleViewChange = (option) => {
  State.update({ selectedView: { value: option.value } });
};

const options = [
  { text: "Latest", value: "latest" },
  { text: "Top", value: "trending" },
  { text: "Recommended", value: "recommended" },
];

const fromContext = props;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Wrapper = styled.div`
  display: grid;
  gap: 24px;
`;

const H2 = styled.h2`
  font-size: 19px;
  line-height: 22px;
  color: #11181c;
  margin: 0;
`;

const LatestPeople = styled.div`
  display: grid;
  gap: 18px;
`;

const Item = styled.div``;

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

const Select = styled.div`
  max-width: 100%;
`;

return (
  <Wrapper>
    <FlexContainer>
      <H2>People</H2>
      <Select>
        <Widget
          src="${REPL_ACCOUNT}/widget/Select"
          props={{
            border: "0px",
            noLabel: true,
            value: state.selectedView,
            options: options,
            onChange: handleViewChange,
          }}
        />
      </Select>
    </FlexContainer>
    {state.selectedView.value === "latest" && (
      <>
        <LatestPeople>
          {accounts.map((account) => (
            <Item key={account.accountId}>
              <Widget
                src="near/widget/AccountProfile"
                props={{
                  accountId: account.accountId,
                  blockHeight: account.blockHeight,
                }}
              />
            </Item>
          ))}
        </LatestPeople>
        <ButtonLink href="#/${REPL_ACCOUNT}/widget/PeoplePage">
          View All People <span>({totalAccounts})</span>
        </ButtonLink>
      </>
    )}
    {state.selectedView.value === "trending" && (
      <>
        <Widget
          src="${REPL_ACCOUNT}/widget/Recommender.Views.TrendingUsersView"
          props={{ sidebar: true, fromContext: fromContext }}
        />
      </>
    )}
    {state.selectedView.value === "recommended" && (
      <>
        <Widget
          src="${REPL_ACCOUNT}/widget/Recommender.Views.FriendsOfFriendsView"
          props={{ sidebar: true, fromContext: fromContext }}
        />
      </>
    )}
  </Wrapper>
);
