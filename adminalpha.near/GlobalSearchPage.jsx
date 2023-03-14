const componentsUrl = `/#/calebjacob.near/widget/ComponentsPage`;
const peopleUrl = `/#/calebjacob.near/widget/PeoplePage`;

function onSearchChange({ result, term }) {
  if (term.trim()) {
    State.update({ searchResults: result || [] });
  } else {
    State.update({ searchResults: null });
  }
}

const Wrapper = styled.div` 
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding-bottom: 48px;
  max-width: 600px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Search = styled.div``;

const H1 = styled.h1`
  font-weight: 600;
  font-size: 32px;
  line-height: 39px;
  color: #11181C;
  margin: 0;
`;

const H2 = styled.h2`
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;
  color: #687076;
  margin: 0;
`;

const H3 = styled.h3`
  color: #687076;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  text-transform: uppercase;
  margin: 0;
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const Text = styled.p`
  margin: 0;
  line-height: 1.5rem;
  color: ${(p) => (p.bold ? "#11181C" : "#687076")};
  font-weight: ${(p) => (p.bold ? "600" : "400")};
  font-size: ${(p) => (p.small ? "12px" : "14px")};
  overflow: ${(p) => (p.ellipsis ? "hidden" : "")};
  text-overflow: ${(p) => (p.ellipsis ? "ellipsis" : "")};
  white-space: ${(p) => (p.ellipsis ? "nowrap" : "")};
  overflow-wrap: anywhere;

  b {
    font-weight: 600;
    color: #11181C;
  }
  
  &[href] {
    color: #006ADC;
    outline: none;
    font-weight: 600;

    &:hover,
    &:focus {
      color: #006ADC;
      text-decoration: underline;
    }
  }
`;

const Items = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
`;

const Item = styled.div``;

return (
  <Wrapper>
    <Header>
      <H1>Search</H1>
      <H2>Find a specific person or component in the NEAR community.</H2>
    </Header>

    <Search>
      <Widget
        src="calebjacob.near/widget/GlobalSearch"
        props={{
          limitPerGroup: 3,
          onChange: onSearchChange,
          term: props.term,
        }}
      />
    </Search>

    {state.searchResults?.components.length === 0 &&
      state.searchResults?.people.length === 0 && (
        <Text>No people or components matched your search.</Text>
      )}

    {state.searchResults?.people.length > 0 && (
      <Group>
        <GroupHeader>
          <H3>People</H3>
          <Text as="a" href={peopleUrl} small>
            View All
          </Text>
        </GroupHeader>

        <Items>
          {state.searchResults.people.map((person, i) => (
            <Item key={person.accountId}>
              <Widget
                src="calebjacob.near/widget/AccountProfileCard"
                props={{
                  accountId: person.accountId,
                }}
              />
            </Item>
          ))}
        </Items>
      </Group>
    )}

    {state.searchResults?.components.length > 0 && (
      <Group>
        <GroupHeader>
          <H3>Components</H3>
          <Text as="a" href={componentsUrl} small>
            View All
          </Text>
        </GroupHeader>

        <Items>
          {state.searchResults.components.map((component, i) => (
            <Item key={component.accountId + component.widgetName}>
              <Widget
                src="calebjacob.near/widget/ComponentCard"
                props={{
                  src: `${component.accountId}/widget/${component.widgetName}`,
                }}
              />
            </Item>
          ))}
        </Items>
      </Group>
    )}
  </Wrapper>
);
