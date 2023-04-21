const SEARCH_API_KEY = props.searchApiKey ?? "0e42c01107b8f555a41bcc0fa7f2a4df";
const APPLICATION_ID = props.appId ?? "B6PI9UKKJT";
const INDEX = props.index ?? "prod_near-social-feed";
const API_URL =
  props.apiUrl ??
  `https://${APPLICATION_ID}-dsn.algolia.net/1/indexes/${INDEX}/query?`;
const INITIAL_PAGE = props.initialPage ?? 0;
const facets = props.facets ?? ["All", "People", "Apps", "Components", "Posts"];
const tab = props.tab ?? "All";
const showHeader = props.showHeader ?? true;
const showSearchBar = props.showSearchBar ?? true;
const showPagination = props.showPagination ?? true;
const userId = props.accountId ?? context.accountId;

State.init({
  currentPage: 0,
  selectedTab: "All",
  facet: tab,
  isFiltersPanelVisible: false,
  numColumns: 3,
  selectedTags: [],
  searchResults: [], // Assuming search results are stored here
  allTags: [],
  activeTags: [],

  showFollowed: false,
  showNotFollowed: false,
});

if (props.tab && props.tab !== state.selectedTab) {
  State.update({
    selectedTab: props.tab,
  });
}

const componentsUrl = `/#/near/widget/ComponentsPage`;
const peopleUrl = `/#/near/widget/PeoplePage`;

// Styling Specifications

const typeAheadContainer = {
  width: "513px",
  height: "458px",
  zIndex: "3",
  backgroundColor: "black",
  borderRadius: "10px",
  transform: "translateX(50px)",
  display: "flex",
  flexDirection: "column",
  textAlign: "center",
  justifyContent: "center",
  alignItems: "center",
  paddingLeft: "24px",
  paddingRight: "24px",
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  max-width: 600px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
  width: 100%;
`;
const NoResults = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
  color: #444;
`;

const Header = styled.div`

  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Facets = styled.div`
  overflow: auto;
  
`;

const H1 = styled.h1`
  font-weight: 600;
  font-size: 32px;
  line-height: 39px;
  color: #11181c;
  margin: 0;

`;

const FixedTabs = styled.div`
    text-align: right;
    top:0;
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
      margin:10px;

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
    color: #11181c;
  }

  &[href] {
    color: #006adc;
    outline: none;
    font-weight: 600;

    &:hover,
    &:focus {
      color: #006adc;
      text-decoration: underline;
    }
  }
`;

const Items = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Tabs = styled.div`
  display: flex;
  height: 48px;
  border-bottom: 1px solid #eceef0;
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

const Button = styled.button`
    background-color: transparent;
    border: none;
    font-size: 14px;
    font-weight: 600;
    color: #9799f8;
    cursor: pointer;
    padding: 0;
    text-decoration: underline;
            text-align:right


    &:hover {
      color: #9799f8;
    }
  `;

const FixedFooter = styled.div`
    padding: 1rem;
    text-align: right;
    border-top: 1px solid rgba(96, 109, 122, 0.4);
    bottom: 0;
    left: 16px;
    right: 16px;
    text-align:right
    height:56px;
    width: calc(100% - 32px); // 100% minus the parent's left and right padding
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
    content: "";x
    display: ${(p) => (p.selected ? "block" : "none")};
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: #59e692;
  }
`;

const ScrollableContent = styled.div`
    overflow-y: auto;
    flex-grow: 1;
    width:100%;
    height:350px
  `;

const Item = styled.div``;

//*********SEARCH FUNCTIONS ******** */

// Reset Search Results
const resetSearcheHits = () => {
  State.update({
    currentPage: 0,
    search: undefined,
    paginate: undefined,
    facet: undefined,
  });
};

// updates search params as the user enters in a search value
const writeStateTerm = (term) => {
  State.update({
    term,
  });

  if (term === "") {
    resetSearcheHits();
  }
};

// creates an array of profiles
const profiles = (records) => {
  const profiles = [];
  for (const [i, record] of records ?? []) {
    profiles.push({
      accountId: record.author,
      searchPosition: i,
    });
  }
  return profiles;
};

// creates an array of objects that provide the details of the loaded posts
const posts = (content, postType) => {
  const posts = [];
  for (const [i, post] of content || []) {
    const accountId = post.author;
    const blockHeight = post.objectID.split("/").slice(-1)[0];
    const postContent = {
      type: "md",
      text: post.content,
    };
    const headerStyling =
      postType === "post"
        ? "border rounded-4 p-3 pb-1"
        : "pt-3 border-top pb-2";

    posts.push({
      accountId,
      blockHeight,
      postContent,
      postType,
      headerStyling,
      searchPosition: i,
    });
  }
  return posts;
};

// creates an array of components
const components = (records) => {
  const components = [];
  for (const [i, component] of records || []) {
    const idParts = component.objectID.split("/");
    const widgetName = idParts[idParts.length - 1];
    const accountId = component.author;
    components.push({
      accountId,
      widgetName,
      searchPosition: i,
    });
  }
  return components;
};

const categorizeSearchHits = (rawResp) => {
  const results = {};
  for (const [i, result] of rawResp.hits?.entries()) {
    const { categories: categories_raw } = result;
    if (categories_raw.length > 1) {
      categories_raw.sort();
    }

    const categories = categories_raw.join(", ");
    results[categories] = results[categories] || [];
    results[categories].push([i + 1, result]);
  }
  return {
    results,
    hitsTotal: rawResp.nbHits,
    hitsPerPage: rawResp.hitsPerPage,
  };
};

const debounce = (callable, timeout) => {
  return (args) => {
    clearTimeout(state.timer);
    State.update({
      timer: setTimeout(() => callable(args), timeout ?? 50),
    });
  };
};

const fetchSearchHits = (query, { pageNumber, configs, optionalFilters }) => {
  configs = configs ?? configsPerFacet(state.facet);
  let body = {
    query,
    page: pageNumber ?? 0,
    hitsPerPage: rawResp.hitsPerPage,
    optionalFilters: optionalFilters ?? [
      "categories:profile<score=3>",
      "categories:widget<score=2>",
      "categories:post<score=1>",
      "categories:comment<score=0>",
    ],
    clickAnalytics: true,
    ...configs,
  };
  return asyncFetch(API_URL, {
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "X-Algolia-Api-Key": SEARCH_API_KEY,
      "X-Algolia-Application-Id": APPLICATION_ID,
    },
    method: "POST",
  });
};

const updateSearchHits = debounce(({ term, pageNumber, configs }) => {
  fetchSearchHits(term, { pageNumber, configs }).then((resp) => {
    const { results, hitsTotal, hitsPerPage } = categorizeSearchHits(resp.body);
    const combinedResults = [
      ...profiles(results["profile"]),
      ...components(results["widget"]),
      ...posts(results["post"], "post"),
      ...posts(results["comment, post"], "post-comment"),
    ];

    State.update({
      search: {
        profiles: profiles(results["profile"]),
        components: components(results["widget"]),
        postsAndComments: posts(results["post"], "post").concat(
          posts(results["comment, post"], "post-comment")
        ),
      },
      currentPage: pageNumber,
      paginate: {
        hitsTotal,
        hitsPerPage,
      },
      queryID: resp.body.queryID,
    });

    getAllTagsFromSearchResults(combinedResults);
  });
});

const onSearchChange = ({ term }) => {
  writeStateTerm(term);
  updateSearchHits({ term, pageNumber: INITIAL_PAGE });
};

const onPageChange = (pageNumber) => {
  const algoliaPageNumber = pageNumber - 1;
  if (algoliaPageNumber === state.currentPage) {
    console.log(`Selected the same page number as before: ${pageNumber}`);
    return;
  }
  // Need to clear out old search data otherwise we'll get multiple entries
  // from the previous pages as well. Seems to be cache issue on near.social.
  State.update({
    search: undefined,
    currentPage: algoliaPageNumber,
  });
  updateSearchHits({ term: state.term, pageNumber: algoliaPageNumber });
};

const FACET_TO_CATEGORY = {
  People: "profile",
  Apps: "app",
  Components: "widget",
  Posts: "post",
};

const searchFilters = (facet) => {
  const category = FACET_TO_CATEGORY[facet];
  let filters = category ? `categories:${category}` : undefined;
  if (category === "post") {
    filters = `(${filters} OR categories:comment)`;
  }
  if (category === "app") {
    filters = `(${filters} OR tags:app)`;
  }
  if (filters) {
    filters = `${filters} AND `;
  }
  filters = `${filters}NOT author:hypefairy.near AND NOT _tags:hidden`;

  return filters;
};

const restrictSearchable = (facet) => {
  const category = FACET_TO_CATEGORY[facet];
  let restrictSearchableAttrs = undefined;
  if (category === "post") {
    // Only the content should be searchable when the posts facet is selected.
    restrictSearchableAttrs = ["content"];
  }
  return restrictSearchableAttrs;
};

const configsPerFacet = (facet) => {
  return {
    filters: searchFilters(facet),
    restrictSearchableAttributes: restrictSearchable(facet),
  };
};
const onFacetClick = (facet) => {
  if (facet === state.selectedTab) {
    return;
  }

  State.update({
    selectedTab: facet,
  });

  displayResultsByFacet(facet);
};
const onSearchResultClick = ({ searchPosition, objectID, eventName }) => {
  const position =
    searchPosition + state.currentPage * state.paginate.hitsPerPage;
  const event = {
    type: "clickedObjectIDsAfterSearch",
    data: {
      eventName,
      userToken: userId.replace(".", "+"),
      queryID: state.queryID,
      objectIDs: [objectID],
      positions: [position],
      timestamp: Date.now(),
    },
  };

  // Deferred due to State.update causing multiple clicks to be needed
  // before the browser redirect to the page the user clicks on.
  setTimeout(() => {
    // This will trigger the Insights widget:
    State.update({ event });
  }, 50);
};

const getComponentTags = (accountId, widgetName) => {
  const metadata = Social.get(
    `${accountId}/widget/${widgetName}/metadata/**`,
    "final"
  );
  const tags = Object.keys(metadata.tags || {});
  State.update({ selectedTags: tags });
};
const getAllTagsFromSearchResults = (results) => {
  const allTags = [];
  const userTags = [];
  const componentTags = [];

  results.forEach((result) => {
    if (result.widgetName) {
      const metadata = Social.get(
        `${result.accountId}/widget/${result.widgetName}/metadata/**`,
        "final"
      );
      const widgetTags = Object.keys(metadata.tags || {});
      componentTags.push(...widgetTags);
      allTags.push(...widgetTags);
    } else {
      const profile = Social.get(`${result.accountId}/profile/**`, "final");
      const profileTags = Object.keys(profile.tags || {});
      userTags.push(...profileTags);
      allTags.push(...profileTags);
    }
  });
};

const topTwoAccounts = () => {
  let output = [];

  if (state.selectedTab === "People") {
    for (let i = 0; i < 6; i++) {
      if (i < state.search.profiles.length) {
        output.push(state.search.profiles[i]);
      }
    }
  } else {
    output = state.search.profiles.slice(0, 2);
    console.log("else called", output);
  }

  console.log(output);

  return output.map((profile, i) => (
    <Item key={profile.accountId}>
      <Widget
        src="dorgon108.near/widget/dropdownAccountCard"
        props={{
          accountId: profile.accountId,
          onClick: () =>
            onSearchResultClick({
              searchPosition: profile.searchPosition,
              objectID: `${profile.accountId}/profile`,
              eventName: "Clicked Profile After Search",
            }),
        }}
      />
    </Item>
  ));
};

const topTwoComponents = () => {
  let output = [];

  if (state.selectedTab === "Components") {
    for (let i = 0; i < 6; i++) {
      if (i < state.search.components.length) {
        output.push(state.search.components[i]);
      }
    }
  } else {
    output = state.search.components.slice(0, 2);
    console.log("else called", output);
  }

  console.log(output);

  return output.map((component, i) => (
    <Item key={component.accountId + component.widgetName}>
      <Widget
        src="dorgon108.near/widget/ComponentCard"
        props={{
          src: `${component.accountId}/widget/${component.widgetName}`,
          onClick: () =>
            onSearchResultClick({
              searchPosition: component.searchPosition,
              objectID: `${component.accountId}/widget/${component.widgetName}`,
              eventName: "Clicked Component After Search",
            }),
        }}
      />
    </Item>
  ));
};

const topTwoComments = () => {
  let output = [];

  if (state.selectedTab === "Posts") {
    for (let i = 0; i < 6; i++) {
      if (i < state.search.postsAndComments.length) {
        output.push(state.search.postsAndComments[i]);
      }
    }
  } else {
    output = state.search.postsAndComments.slice(0, 2);
    console.log("else called", output);
  }

  console.log(output);

  return output.map((post, i) => (
    <Item key={`${post.accountId}/${post.postType}/${post.blockHeight}`}>
      {console.log("the content is", JSON.stringify(post.postContent))}
      <Widget
        src="dorgon108.near/widget/SearchPost"
        props={{
          accountId: post.accountId,
          blockHeight: post.blockHeight,
          content: post.postContent,
          term: props.term,
        }}
      />
    </Item>
  ));
};

const displayResultsByFacet = (selectedTab) => {
  switch (selectedTab) {
    case "People":
      return state.search?.profiles.length > 0 ? (
        <Group>
          <GroupHeader>
            <H3>
              People
              <span
                style={{
                  marginLeft: "10px",
                }}
              >
                {` ${state.search?.profiles.length ?? 0}`}
              </span>{" "}
            </H3>
          </GroupHeader>

          <Items>{topTwoAccounts()}</Items>
        </Group>
      ) : (
        <div>No People Found</div>
      );
    case "Apps": {
      const appComponents = state.search?.components
        .filter((component, index) => {
          const metadata = Social.get(
            `${component.accountId}/widget/${component.widgetName}/metadata/**`,
            "final"
          );
          const tags = Object.keys(metadata.tags || {});
          const displayCondition =
            (state.selectedTab === "Apps" && tags.includes("Apps")) ||
            (tags.includes("app") && index < 7);

          return displayCondition;
        })
        .map((component, i) => {
          return (
            <Item key={component.accountId + component.widgetName}>
              <Widget
                src="dorgon108.near/widget/ComponentCard"
                props={{
                  src: `${component.accountId}/widget/${component.widgetName}`,
                  onClick: () =>
                    onSearchResultClick({
                      searchPosition: component.searchPosition,
                      objectID: `${component.accountId}/widget/${component.widgetName}`,
                      eventName: "Clicked Component After Search",
                    }),
                }}
              />
            </Item>
          );
        });

      return appComponents.length > 0 ? (
        <Group>
          <GroupHeader>
            <H3>
              Apps{" "}
              <span
                style={{
                  marginLeft: "10px",
                }}
              >
                {` ${appComponents.length}`}
              </span>{" "}
            </H3>
          </GroupHeader>
          <Items>{appComponents}</Items>
        </Group>
      ) : (
        <NoResults>No Apps Found</NoResults>
      );
    }

    case "Components":
      return state.search?.components.length > 0 ? (
        <Group>
          <GroupHeader>
            <H3>
              Components{" "}
              <span
                style={{
                  marginLeft: "10px",
                }}
              >
                {` ${state.search?.components.length ?? 0}`}
              </span>{" "}
            </H3>
          </GroupHeader>

          <Items>{topTwoComponents()}</Items>
        </Group>
      ) : (
        <NoResults>No Components Found</NoResults>
      );
    case "Posts":
      return state.search?.postsAndComments.length > 0 ? (
        <Group style={{ marginTop: "20px" }}>
          <GroupHeader>
            <H3>
              Posts and Comments
              <span
                style={{
                  marginLeft: "10px",
                }}
              >
                {` ${state.search?.postsAndComments.length ?? 0}`}
              </span>{" "}
            </H3>
          </GroupHeader>

          <Items>{topTwoComments()}</Items>
        </Group>
      ) : (
        <div>No People Found</div>
      );
    case "All":
      return (
        <>
          {state.search?.profiles.length > 0 && (
            <Group>
              <GroupHeader>
                <H3>
                  People
                  <span
                    style={{
                      marginLeft: "10px",
                    }}
                  >
                    {` ${state.search?.profiles.length ?? 0}`}
                  </span>{" "}
                </H3>
              </GroupHeader>
              <Items>{topTwoAccounts()}</Items>
            </Group>
          )}
          {state.search?.components.length > 0 && (
            <Group>
              <GroupHeader>
                <H3>
                  Components{" "}
                  <span
                    style={{
                      marginLeft: "10px",
                    }}
                  >
                    {` ${state.search?.components.length ?? 0}`}
                  </span>{" "}
                </H3>
              </GroupHeader>
              <Items>{topTwoComponents()}</Items>
            </Group>
          )}
          {state.search?.postsAndComments.length > 0 && (
            <Group style={{ marginTop: "20px" }}>
              <GroupHeader>
                <H3>
                  Posts and Comments
                  <span
                    style={{
                      marginLeft: "10px",
                    }}
                  >
                    {` ${state.search?.postsAndComments.length ?? 0}`}
                  </span>{" "}
                </H3>
              </GroupHeader>
              <Items>{topTwoComments()}</Items>
            </Group>
          )}
        </>
      );
  }
};

if (props.term !== state.lastSyncedTerm) {
  State.update({
    lastSyncedTerm: props.term,
  });
  onSearchChange({ term: props.term });
}

return (
  <div style={typeAheadContainer}>
    <Wrapper>
      {state.search && (
        <FixedTabs>
          <Widget
            src="dorgon108.near/widget/Facets"
            props={{
              facets,
              onFacetClick,
              defaultFacet: facets[0],
            }}
          />
        </FixedTabs>
      )}
      <ScrollableContent>
        {state.paginate?.hitsTotal == 0 && (
          <H2
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              top: "50%", // Adjust this value to position the text lower
              top: "40%", // Adjust this value to position the text lower
              width: "100%",
              fontSize: "15px",
              left: "-0%",
            }}
          >
            No matches were found for "{state.term}".
          </H2>
        )}
        {displayResultsByFacet(state.selectedTab)}
      </ScrollableContent>

      <FixedFooter>
        <a
          href={`https://alpha.near.org/chaotictempest.near/widget/Search?term=${props.term}`}
        >
          <Button
            onClick={() => {
              console.log("redirect you");
            }}
          >
            {console.log("the count", state.search?.totalCount)}
            {state.search?.totalCount
              ? ` See ${state.search?.totalCount} Results`
              : null}
          </Button>
        </a>
      </FixedFooter>
      {!props.disableInsights && (
        <Widget
          src="chaotictempest.near/widget/Insights"
          props={{
            event: state.event,
            searchApiKey: SEARCH_API_KEY,
            appId: APPLICATION_ID,
            index: INDEX,
          }}
        />
      )}
    </Wrapper>
  </div>
);
