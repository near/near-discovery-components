
const componentsUrl = "/${REPL_ACCOUNT}/widget/ComponentsPage";

const sortRaw = Storage.get("queryapi:component-feed-sort");
const sort = sortRaw ? sortRaw : "featured";

const [components, setComponents] = useState([]);
// const [isLoading, setIsLoading] = useState(false);
const [sortState, setSortState] = useState(sort);

const options = [
  { text: "Featured", value: "featured" },
  { text: "From Followed", value: "followed" },
];

const selectSort = (newSort) => {
  Storage.set("queryapi:component-feed-sort", newSort);
  setIsLoading(true);
  setSortState(newSort);
}

const featuredComponentListRes = Social.get("${REPL_FEATURED_COMP_MANAGER}/listManager/FeaturedComponents", "final");
const featuredComponentPaths = featuredComponentListRes ? JSON.parse(featuredComponentListRes) : [];
const componentData = featuredComponentPaths.length > 0 ? Social.getr(featuredComponentPaths) : null;

if (componentData) {
const tempComponents = [];
featuredComponentPaths.forEach((src) => {
  const path = src.split("/");
  const result = {
    metadata: componentData[path[0]][path[1]][path[2]].metadata,
    src,
  };
  tempComponents.push(result);
});

setComponents(tempComponents);
}

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

const TextLink = styled("Link")`
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
      
        <Widget
          src={`${REPL_ACCOUNT}/widget/Select`}
          props={{
            border: "0px",
            noLabel: true,
            value: { text: optionsMap[sort], value: sort },
             options: [
              { text: "Featured", value: "featured" },
              { text: "From Followed", value: "followed" },
            ],
            onChange: ({ value }) => selectSort(value),
          }}
        />

    </Header>

    <Items>
      {sortState === 'featured' ? components.map((component) => (
          <Item key={component.src}>
            <Widget src="${REPL_ACCOUNT}/widget/ComponentCard" props={{ ...component, hideBlockHeightTimestamp: true }} />
          </Item>
        )) : 
        <div>Followed Query Here</div>
      }
    </Items>
  </Wrapper>
);
