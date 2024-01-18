const GRAPHQL_ENDPOINT = props.GRAPHQL_ENDPOINT || "https://near-queryapi.api.pagoda.co";
const componentsUrl = "/${REPL_ACCOUNT}/widget/ComponentsPage";

const sortRaw = Storage.get("queryapi:component-feed-sort");
const intialSortOption = sortRaw === undefined ? 'featured' : sortRaw;

const [components, setComponents] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [sortOption, setSortOption] = useState('');

console.log(' sort options: ',sortOption);
const featuredComponentListRes = Social.get("${REPL_FEATURED_COMP_MANAGER}/listManager/FeaturedComponents", "final");
const featuredComponentPaths = featuredComponentListRes ? JSON.parse(featuredComponentListRes) : [];
const componentData = featuredComponentPaths.length > 0 ? Social.getr(featuredComponentPaths) : null;

const followGraph = context.accountId ? Social.keys(`${context.accountId}/graph/follow/*`, "final") : null;
const accountsFollowing =
  props.accountsFollowing ?? (followGraph ? Object.keys(followGraph[context.accountId].graph.follow || {}) : null);

function fetchGraphQL(operationsDoc, operationName, variables) {
  return asyncFetch(`${GRAPHQL_ENDPOINT}/v1/graphql`, {
    method: "POST",
    headers: { "x-hasura-role": "kevin0_near" },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });
}

const createQuery = (accountsFollowing) => {
  const limit = 8;
  console.log(accountsFollowing); //['roshaan.near', 'calebjacob.near']
  console.log('expected format', ["roshaan.near", "calebjacob.near"])
  return `
  query ComponentFollowingQuery {
    kevin0_near_component_01_info(
      where: {component_author_id: {_in: ["roshaan.near", "calebjacob.near"]}}
      order_by: {block_height: desc}
      limit: ${limit}
    ) {
      component_author_id
      fork_count
      component_name
      component_id
      code
      block_height
      block_timestamp_ms
      star_count
      tags
      image_ipfs_cid
      description
      website
    }
  }
    `;
  };
  
const renderComponents = (sortOption) => {
  setIsLoading(true);
 
  const componentContainer = [];

  if (sortOption === "featured") {
    if (componentData) {
      featuredComponentPaths.forEach((src) => {
        const path = src.split("/");
        const result = { metadata: componentData[path[0]][path[1]][path[2]].metadata, src,};
        componentContainer.push(result);
      });
    }
    setComponents(componentContainer);
    setIsLoading(false);
  } else if (sortOption === "followed") {
  const queryName = "ComponentFollowingQuery";

  fetchGraphQL(createQuery(accountsFollowing), queryName,{} )
  .then((result) => {
      if (result.status === 200 && result.body) {
        if (result.body.errors) { 
          console.log("error:", result.body.errors);
          return;
        }
        let data = result.body.data;
        if (data) {
          const components_item = data.kevin0_near_component_01_info;
          
          components_item.forEach((component) => {
            const {
              block_height,
              block_timestamp_ms,
              component_author_id,
              component_id,
              component_name,
              fork_count,
              star_count,
              tags,
              image_ipfs_cid,
              description,
              website,
            } = component;
            
            const component_container ={
              "metadata": {
                "name": component_name,
                "description": description,
                "linktree": {
                  "website": website
                },
                "image": {
                  "ipfs_cid": image_ipfs_cid
                },
                "tags": {
                  "app": "" //TODO: FIND FORMAT OF TAGS WITH AN FOLLOWED ITEM WITH TAGS
                },
                "star_count": star_count,
                "fork_count": fork_count,
              },
              "src": component_id,
            }

            componentContainer.push(component_container);
          });
          setComponents(componentContainer);
          setIsLoading(false);
        }
      }
    });
  }
}

useEffect(() => {
  renderComponents(sortOption);
}, [sortOption]);

useEffect(() => {
  console.log(intialSortOption);
  setSortOption(intialSortOption);
}, [intialSortOption]);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
const H2 = styled.h2`
  font-size: 19px;
  line-height: 22px;
  color: #11181C;
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
  color: #006ADC;
  outline: none;
  font-weight: 600;
  font-size: 12px;
  line-height: 20px;
  &:hover,
  &:focus {
    color: #006ADC;
    text-decoration: underline;
  }
`;
return (
  <Wrapper>
    <Header>
      <H2>Components</H2>
      <select
          value={sortOption}
          onChange={(event) => {
            setSortOption(event.target.value);
            Storage.set("queryapi:component-feed-sort", event.target.value);
          }}>
          <option value="featured">Featured </option>
          <option value="followed">From Followed</option>
        </select>
    </Header>
    <Items>
    {console.log(isLoading)}
    {!isLoading && components.map((component) => (
          <Item key={component.src}>
            <Widget src="${REPL_ACCOUNT}/widget/ComponentCard" props={{ ...component, hideBlockHeightTimestamp: true }} />
          </Item>
        ))}
    </Items>
  </Wrapper>
);