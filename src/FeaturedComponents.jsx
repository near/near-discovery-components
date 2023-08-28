const componentsUrl = "#/${REPL_ACCOUNT}/widget/ComponentsPage";
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

const featuredComponentListRes = Social.get(
  "${REPL_FEATURED_COMP_MANAGER}/listManager/FeaturedComponents"
);
const featuredComponents = featuredComponentListRes
  ? JSON.parse(featuredComponentListRes)
  : [];

return (
  <Wrapper>
    <Header>
      <H2>Featured Components</H2>
      <TextLink href={componentsUrl}>View All</TextLink>
    </Header>

    <Items>
      {featuredComponents.map((featuredComp) => (
        <Item key={featuredComp}>
          <Widget
            src="${REPL_ACCOUNT}/widget/ComponentCard"
            props={{ src: featuredComp }}
          />
        </Item>
      ))}
    </Items>
  </Wrapper>
);
