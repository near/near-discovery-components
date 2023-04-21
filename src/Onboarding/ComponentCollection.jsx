const accountId = props.accountId || context.accountId;

if (!accountId) return "Login or send accountId in the props";

const profile = Social.getr(`${accountId}/profile`);

const allWidgetsHistoryChangesBlocks = Social.keys(
  `${accountId}/widget/*`,
  "final",
  {
    return_type: "History",
  }
);

if (allWidgetsHistoryChangesBlocks === null) return "Loading...";

const widget = allWidgetsHistoryChangesBlocks[accountId].widget;

const totalCommits = Object.keys(widget)
  .map((key) => widget[key])
  .flat();

const widgets = Social.getr(`${accountId}/widget`) ?? {};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
`;
const Items = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 24px;

  @media (max-width: 700px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;
const Text = styled.p`
  padding: 20px;
  text-align: center;
  color: #687076;
`;

return (
  <Wrapper>
    {Object.keys(widgets)?.length > 0 ? (
      <Items>
        {Object.keys(widgets)?.map((item, index) => (
          <Widget
            src="near/widget/Onboarding.ComponentCard"
            props={{
              name: item,
              accountId,
              gateway: "https://alpha.near.org",
              commits: allWidgetsHistoryChangesBlocks[accountId].widget[item],
            }}
          />
        ))}
      </Items>
    ) : (
      <Text>{profile?.name} does not have any widgets yet.</Text>
    )}
  </Wrapper>
);
