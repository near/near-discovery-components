const componentsUrl = "/#/adminalpha.near/widget/ComponentsPage";
//bozon.near/widget/WidgetHistory

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const H2 = styled.h2`
  font-size: 19px;
  line-height: 22px;
  color: #11181c;
  margin: 0;
`;

const Items = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Item = styled.div``;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const TextLink = styled.a`
  color: #006adc;
  outline: none;
  font-weight: 600;
  font-size: 12px;
  line-height: 20px;

  &:hover,
  &:focus {
    color: #006adc;
    text-decoration: underline;
  }
`;

return (
  <Wrapper>
    <Header>
      <H2>Featured Components</H2>
      <TextLink href={componentsUrl}>View All</TextLink>
    </Header>

    <Items>
      <Item>
        <Widget
          src="adminalpha.near/widget/ComponentCard"
          props={{ src: "adminalpha.near/widget/FastAuth" }}
        />
      </Item>
      <Item>
        <Widget
          src="adminalpha.near/widget/ComponentCard"
          props={{ src: "dataplatform.near/widget/NearQueryApi" }}
        />
      </Item>
      <Item>
        <Widget
          src="adminalpha.near/widget/ComponentCard"
          props={{ src: "adminalpha.near/widget/ActivityPage" }}
        />
      </Item>
      <Item>
        <Widget
          src="adminalpha.near/widget/ComponentCard"
          props={{ src: "devgovgigs.near/widget/Ideas" }}
        />
      </Item>
      <Item>
        <Widget
          src="adminalpha.near/widget/ComponentCard"
          props={{ src: "frichard2.near/widget/most-active-contracts" }}
        />
      </Item>
    </Items>
  </Wrapper>
);
