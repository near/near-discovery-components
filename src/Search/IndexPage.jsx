// Discovery Search Credentials
const SEARCH_API_KEY = props.searchApiKey ?? "0e42c01107b8f555a41bcc0fa7f2a4df";
const APPLICATION_ID = props.appId ?? "B6PI9UKKJT";
const INDEX = props.index ?? "prod_near-social-feed";
const API_URL =
  props.apiUrl ??
  `https://${APPLICATION_ID}-dsn.algolia.net/1/indexes/${INDEX}/query?`;
const INITIAL_PAGE = props.initialPage ?? 0;
const facets = props.facets ?? [
  "All",
  "Users",
  "Apps",
  "Components",
  "Posts",
  "Documentation",
];
const tab = props.tab ?? "All";
// Documentation  Search Credentials
const appId = props.searchAppId ?? "0LUM67N2P2";
const apiKey = props.docsSearchApiKey ?? "129d0f429e1bb0510f0261dda1e88ed4";
const docsIndex = "near";
const searchApiUrl = `https://${appId}-dsn.algolia.net/1/indexes/${docsIndex}/query?`;

const showHeader = props.showHeader ?? true;
const showSearchBar = props.showSearchBar ?? true;
const showPagination = props.showPagination ?? true;
const userId = props.accountId ?? context.accountId;

const componentsUrl = `/#/near/widget/ComponentsPage`;
const peopleUrl = `/#/near/widget/PeoplePage`;

State.init({
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

// #region Component Styles
const Wrapper = styled.div`
  border-radius: 32px 32px 0px 0px;
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding-bottom: 48px;
  max-width: 800px;
  margin: 0 auto;
`;

const SearchPageContainer = styled.div`
  transition: transform 0.3s ease-in-out;
  transform: ${({ isFiltersPanelOpen }) =>
    isFiltersPanelOpen ? "translateX(-250px)" : "translateX(0)"};
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  flex: 1;
  border-bottom: 1px solid #ECEEF0

  &:hover {
    color: #11181C;
    border-bottom: 4px solid #20A46C;

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

const Search = styled.div``;

const Facets = styled.div`
  overflow: auto;
  width: 100%;
`;

const FacetContainer = styled.ul`
  padding: 16px 16px 0px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  list-style-type: none;
  width: 100%;
  height: 36px;
`;

const H1 = styled.h1`
  font-style: normal;
  font-weight: 400;
  font-size: 36px;
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

const H3 = styled.h3`
  color: #11181c;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  margin: 0;
  width: 188px;
  height: 30px;
  font-style: normal;
  font-weight: 600;
  font-size: 19px;
  line-height: 23px;
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
const FiltersPanel = styled.div`
  border-left: 1px solid #eceef0;
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background-color: white;
  border-left: 1px solid #e6e6e6;
  padding: 20px;
  z-index: 1000;
  box-sizing: border-box;
  overflow-y: auto;
  transition: transform 0.3s ease-in-out;
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
  align-items: stretch;
  gap: 12px;
`;

const PostsGridItems = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 16px;
`;

const Item = styled.div``;

// Add the following styles to your CSS or a styled-component
const GridItems = styled.div`
  display: grid;
  grid-template-columns: ${({ numColumns }) =>
    numColumns === 3 ? "repeat(3, 1fr)" : "repeat(2, 1fr)"};
  grid-gap: 16px;
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

const filterButtonDesign = {
  display: "flex",
  padding: `4px 8px 4px 4px`,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#F2F1EA",
  color: "black",
};

const filterImg = {
  marginRight: "4px",
};

// #endregion

// #region Search Index Functions

// #region Helper Functions

const debounce = (callable, timeout) => {
  return (args) => {
    clearTimeout(state.timer);
    State.update({
      timer: setTimeout(() => callable(args), timeout ?? 50),
    });
  };
};

function arraysIntersect(a, b) {
  for (let i = 0; i < b.length; i++) {
    if (a.includes(b[i])) {
      return true;
    }
  }
  return false;
}

// #endregion

// #region State Update Functions

const writeStateTerm = (term) => {
  State.update({
    term,
  });

  if (term === "") {
    resetSearcheHits();
  }
};

const toggleFiltersPanel = () => {
  State.update({
    isFiltersPanelVisible: !state.isFiltersPanelVisible,
    numColumns: state.numColumns === 3 ? 2 : 3,
  });
};

const resetSearcheHits = () => {
  State.update({
    currentPage: 0,
    search: undefined,
    paginate: undefined,
    facet: undefined,
  });
};

// #endregion

// #region Data Processing Functions

const profiles = (records) => {
  console.log('the records are',records)
  const profiles = [];
  for (const [i, record] of records ?? []) {
    profiles.push({
      accountId: record.author,
      searchPosition: i,
    });
  }
  return profiles;
};

const posts = (content, postType) => {
  const posts = [];
  for (const [i, post] of content || []) {
    const accountId = post.author;
    const blockHeight = post.objectID.split("/").slice(-1)[0];

    let snipContent = true;
    let text = post.content;
    if (post._highlightResult.content.matchLevel === "full") {
      // Use algolia provided snipped content:
      snipContent = false;
      text = post._snippetResult.content.value
        .replaceAll("<em>", "")
        .replaceAll("</em>", "");
    }

    const postContent = {
      type: "md",
      text,
    };

    posts.push({
      accountId,
      blockHeight,
      postContent,
      postType,
      snipContent,
      searchPosition: i,
    });
  }
  return posts;
};

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
  console.log("The raw resp is",rawResp)
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

  // Filter out duplicates
  const uniqueAllTags = [...new Set(allTags)];
  const uniqueUserTags = [...new Set(userTags)];
  const uniqueComponentTags = [...new Set(componentTags)];

  // Update the state with the unique tags
  State.update({
    allTags: uniqueAllTags,
    userTags: uniqueUserTags,
    componentTags: uniqueComponentTags,
  });
};

const getComponentTags = (accountId, widgetName) => {
  const metadata = Social.get(
    `${accountId}/widget/${widgetName}/metadata/**`,
    "final"
  );
  const tags = Object.keys(metadata.tags || {});
  State.update({ selectedTags: tags });
};

const processDocSearchResults = (rawResp) => {
  return {results:rawResp.hits, hitsPerPage: rawResp.hitsPerPage, hitsTotal: rawResp.nbHits}
  // Process the raw response and format it into the desired structure.
  // The resulting object should include the necessary information such as title, URL, and description.
  State.update({ documentation: processedResults.results });
};




// #endregion

// #region Event Handlers

const onSearchChange =  ({ term }) => {
  writeStateTerm(term);
    // updateSearchHits({ term, pageNumber: INITIAL_PAGE });

    // updateDocSearchHits({term,pageNumber:INITIAL_PAGE});
    updateCombinedSearchHits({term,pageNumber:INITIAL_PAGE});
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
  updateCombinedSearchHits({ term: state.term, pageNumber: algoliaPageNumber });
};

const onFacetClick = (facet) => {
  if (facet === state.facet) {
    return;
  }

  const sortByDateCreated = (data, sortingKey) => {
    if (!sortByDate) return data;

    return data.sort((a, b) => {
      const blockHeightA = a[sortingKey];
      const blockHeightB = b[sortingKey];

      const blockA = Near.block(blockHeightA);
      const blockB = Near.block(blockHeightB);

      const timeMsA = parseFloat(blockA.header.timestamp_nanosec) / 1e6;
      const timeMsB = parseFloat(blockB.header.timestamp_nanosec) / 1e6;

      return timeMsA - timeMsB;
    });
  };
  State.update({
    facet,
  });

  updateCombinedSearchHits({
    term: state.term,
    configs: configsPerFacet(facet),
  });
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

const handleClick = (tag) => {
  // Your logic to update activeTags, e.g.:
  const newActiveTags = state.activeTags.includes(tag)
    ? state.activeTags.filter((t) => t !== tag)
    : [...state.activeTags, tag];

  // Call the callback function passed as a prop
  props.onTagClick(newActiveTags);
};

const handleCheckboxChange = (checkboxName, isChecked) => {
  // Update the state based on the checkboxName and isChecked values
  console.log(checkboxName, isChecked);
  const updatedState = {};
  updatedState[checkboxName] = isChecked;
  State.update(updatedState);
  console.log(`the ${checkboxName} check is`, state[checkboxName]);
};

// #endregion

// #region Search Configuration Functions

const searchFilters = (facet) => {
  const category = FACET_TO_CATEGORY[facet];
  let filters = category ? `categories:${category}` : undefined;
  if (category === "post") {
    filters = `(${filters} OR categories:comment)`;
  }
  if (category === "app") {
    filters = `(${filters} OR tags:app)`;
  }
  // Handle the documentation category
  if (category === "documentation") {
    filters = `(${filters} OR tags:documentation)`;
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

// #endregion

// #region API Functions

const fetchSearchHits = (query, { pageNumber, configs, optionalFilters }) => {
  configs = configs ?? configsPerFacet(state.facet);
  let body = {
    query,
    clickAnalytics: false,
    page: pageNumber ?? 0,
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

const fetchDocSearchHits = (query, { pageNumber, configs }) => {
  configs = configs ??  {};
  let body = {
    query,
    clickAnalytics: false,
    page: pageNumber ?? 0,
    attributesToRetrieve: [
      "hierarchy.lvl0",
      "hierarchy.lvl1",
      "hierarchy.lvl2",
      "hierarchy.lvl3",
      "hierarchy.lvl4",
      "hierarchy.lvl5",
      "hierarchy.lvl6",
      "type",
      "url",
      "title",
      "description",
    ].join(','),
    attributesToSnippet: [`hierarchy.lvl1:20`, `hierarchy.lvl2:20`],
    highlightPreTag: "",
    highlightPostTag: "",
    ...configs,
  };

  return asyncFetch(searchApiUrl, {
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "X-Algolia-Api-Key": "129d0f429e1bb0510f0261dda1e88ed4",
      "X-Algolia-Application-Id": "0LUM67N2P2",
    },
  
    method: "POST",
  });
};


// #endregion

// #region Updating Search Hits and Tags

// const updateSearchHits = debounce(({ term, pageNumber, configs }) => {
//   console.log(configs)

//   fetchSearchHits(term, { pageNumber, configs }).then((resp) => {
//     const { results, hitsTotal, hitsPerPage } = categorizeSearchHits(resp.body);
//     const combinedResults = [
//       ...profiles(results["profile"]),
//       ...components(results["widget"]),
//       ...posts(results["post"], "post"),
//       ...posts(results["comment, post"], "post-comment"),
//     ];

//     State.update({
//       search: {
//         profiles: profiles(results["profile"]),
//         components: components(results["widget"]),
//         postsAndComments: posts(results["post"], "post").concat(
//           posts(results["comment, post"], "post-comment")
//         ),
//       },
//       currentPage: pageNumber,
//       paginate: {
//         hitsTotal,
//         hitsPerPage,
//       },
//       queryID: resp.body.queryID,
//     });
//     fetchDocSearchHits(term,{ pageNumber, configs }).then((resp)=>{
//     })

//     getAllTagsFromSearchResults(combinedResults);
//   });
// });

// const updateDocSearchHits = debounce(({ term, pageNumber, configs }) => {

//   fetchDocSearchHits(term, { pageNumber, configs }).then((resp) => {
//     const {results ,hitsPerPage,hitsTotal} = processDocSearchResults(resp.body);
//     console.log("the state is",state.search)
//     // Update the state with the search results.
//     State.update({
//       search: {...state.search,documentation:results},
//       currentPage: pageNumber,
//       paginate:{
//         hitsTotal:state.paginate.hitsTotal+hitsTotal,
//         hitsPerPage:state.paginate.hitsPerPage+hitsPerPage,
//       }
//     });


//   });
// });

const updateCombinedSearchHits = debounce(({ term, pageNumber, configs }) => {
  let searchResults;
  let docSearchResults;

  console.log('configs are',configs)

  if (state.facet === "Documentation") {
    fetchDocSearchHits(term, { pageNumber }).then((docSearchResp) => {
      const { results, hitsTotal, hitsPerPage } = processDocSearchResults(docSearchResp.body);
      docSearchResults = {
        results,
        hitsTotal,
        hitsPerPage,
      };

      // Update the state with the search results.
      State.update({
        search: {
          documentation: docSearchResults.results,
        },
        currentPage: pageNumber,
        paginate: {
          hitsTotal: docSearchResults.hitsTotal,
          hitsPerPage: docSearchResults.hitsPerPage,
        },
        queryID: docSearchResp.body.queryID,
      });
    });
  }else{
  fetchSearchHits(term, { pageNumber, configs })
    .then((searchResp) => {
      const { results, hitsTotal, hitsPerPage } = categorizeSearchHits(searchResp.body);
      searchResults = {
        results,
        hitsTotal,
        hitsPerPage,
      };
      return fetchDocSearchHits(term, { pageNumber, configs });
    })
    .then((docSearchResp) => {
      const { results, hitsTotal, hitsPerPage } = processDocSearchResults(docSearchResp.body);
      docSearchResults = {
        results,
        hitsTotal,
        hitsPerPage,
      };

      const combinedResults = [
        ...profiles(searchResults.results["profile"]),
        ...components(searchResults.results["widget"]),
        ...posts(searchResults.results["post"], "post"),
        ...posts(searchResults.results["comment, post"], "post-comment"),
      ];



      // Update the state with the search results.
      State.update({
        search: {
          profiles: profiles(searchResults.results["profile"]),
          components: components(searchResults.results["widget"]),
          postsAndComments: posts(searchResults.results["post"], "post").concat(
            posts(searchResults.results["comment, post"], "post-comment")
          ),
          documentation: docSearchResults.results,
        },
        currentPage: pageNumber,
        paginate: {
          hitsTotal: searchResults.hitsTotal + docSearchResults.hitsTotal,
          hitsPerPage: searchResults.hitsPerPage + docSearchResults.hitsPerPage,
        },
        queryID: searchResp.body.queryID, // Assuming queryID is the same for both searchResp and docSearchResp
      });

      getAllTagsFromSearchResults(combinedResults);
    })
    .catch((error) => {
      console.error('Error fetching combined search hits:', error);
    });}

});



const updateFilteredTags = (inputValue) => {
  State.update({
    filteredTags: tags.filter((tag) => tag.includes(inputValue)),
  });
};

const updateTags = () => {
  let selectedTags = [];

  if (state.facet === "Users") {
    selectedTags = state.userTags;
  } else if (state.facet === "Components") {
    selectedTags = state.componentTags;
  } else {
    selectedTags = state.allTags;
  }

  tags = selectedTags ?? [];
  updateFilteredTags(state.inputValue);
};

const updateSelectedTags = (tags) => {
  State.update({
    selectedTags: tags,
  });

  updateCombinedSearchHits();
};

// #endregion

// #region User Following Functions

const isUserFollowing = (accountId, contextAccountId) => {
  const followEdge = Social.keys(
    `${accountId}/graph/follow/${contextAccountId}`,
    undefined,
    {
      values_only: true,
    }
  );
  return Object.keys(followEdge || {}).length > 0;
};

// #endregion
// #region Tag Management Functions

const toggleActiveTag = (tag) => {
  const newActiveTags = state.activeTags.includes(tag)
    ? state.activeTags.filter((t) => t !== tag)
    : [...state.activeTags, tag];

  State.update({ activeTags: newActiveTags });
  emit("onTagClick", { activeTags: newActiveTags });
};

// #endregion

const FACET_TO_CATEGORY = {
  Users: "profile",
  Apps: "app",
  Components: "widget",
  Posts: "post",
  Documentation:"documentation"
};

// #endregion

// #region return statement
return (
  <>
    <div
      style={{
        transition: "transform 0.3s ease-in-out",
        transform: state.isFiltersPanelVisible
          ? "translateX(-250px)"
          : "translateX(0)",
      }}
    >
      <Wrapper>
        {showHeader && (
          <Header>
            <H1>Search</H1>
          </Header>
        )}
        {showSearchBar && (
          <Search>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Widget
                src='near/widget/Search.Pill'
                props={{
                  onChange: onSearchChange,
                  term: props.term,
                }}
              />
              <button style={filterButtonDesign} onClick={toggleFiltersPanel}>
                <img style={filterImg} src='https://i.imgur.com/D66BvyR.png' />{" "}
                Filters
              </button>
            </div>
          </Search>
        )}

        {state.search && (
          <Facets>
            <Widget
              src='near/widget/Search.Facets'
              props={{
                facets,
                onFacetClick,
                defaultFacet: facets[0],
                initialFacet: tab,
                tabButtonStyle: TabsButton,
              }}
            />
          </Facets>
        )}

        {state.paginate?.hitsTotal == 0 && (
          <H2>No matches were found for "{state.term}".</H2>
        )}

        {state.search?.components.length > 0 && (
          <Group>
            <GroupHeader>
              {state.facet === "Components" ? (
                <H3>Components</H3>
              ) : (
                <H3>Apps</H3>
              )}
              <Text as='a' onClick={() => onFacetClick("Components")} small>
                View All
              </Text>
            </GroupHeader>
            <GridItems numColumns={state.numColumns}>
              {state.search.components
                .filter((component, index) => {
                  const metadata = Social.get(
                    `${component.accountId}/widget/${component.widgetName}/metadata/**`,
                    "final"
                  );
                  const tags = Object.keys(metadata.tags || {});

                  const hasActiveTag =
                    state.activeTags.length === 0 ||
                    arraysIntersect(state.componentTags, tags);

                  const displayCondition =
                    state.facet === "Components" ||
                    ((state.facet === "Apps" ) &&
                      tags.includes("Apps") &&
                      index < 3) ||
                    index < 3;

                  const followingCondition = isUserFollowing(
                    context.accountId,
                    component.accountId
                  );

                  return (
                    hasActiveTag &&
                    displayCondition &&
                    ((state.showFollowed && followingCondition) ||
                      (state.showNotFollowed && !followingCondition) ||
                      (!state.showFollowed && !state.showNotFollowed))
                  );
                })

                .map((component, i) => {
                  const tags = getComponentTags(
                    component.accountId,
                    component.widgetName
                  );

                  return (
                    <Item key={component.accountId + component.widgetName}>
                      <Widget
                        src='near/widget/ComponentCard'
                        props={{
                          src: `${component.accountId}/widget/${component.widgetName}`,
                          blockHeight: component.blockHeight,
                        }}
                      />
                    </Item>
                  );
                })}
            </GridItems>
          </Group>
        )}

        {state.search?.profiles.length > 0 && (
          <Group>
            <GroupHeader>
              <H3>People</H3>
              <Text as='a' onClick={() => onFacetClick("Users")} small>
                View All
              </Text>
            </GroupHeader>
            <GridItems numColumns={state.numColumns}>
              {state.search.profiles
                .filter((profile, index) => {
                  const fetchedProfile = Social.get(
                    `${profile.accountId}/profile/**`,
                    "final"
                  );
                  const profileTags = Object.keys(fetchedProfile.tags || {});

                  const hasActiveTag =
                    state.activeTags.length === 0 ||
                    arraysIntersect(state.activeTags, profileTags);

                  const displayCondition =
                    state.facet === "Users" ||
                    index < 3;

                  const followingCondition = isUserFollowing(
                    context.accountId,
                    profile.accountId
                  );

                  return (
                    hasActiveTag &&
                    displayCondition &&
                    ((state.showFollowed && followingCondition) ||
                      (state.showNotFollowed && !followingCondition) ||
                      (!state.showFollowed && !state.showNotFollowed))
                  );
                })

                .map((profile, i) => (
                  <Item key={profile.accountId}>
                    <Widget
                      src='near/widget/Search.AccountSearchCard'
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
                ))}
            </GridItems>
          </Group>
        )}

        {state.search?.postsAndComments.length > 0 && (
          <Group>
            <GroupHeader>
              <H3>Posts</H3>
              <Text as='a' onClick={() => onFacetClick("Posts")} small>
                View All
              </Text>
            </GroupHeader>
            <PostsGridItems>
              {state.search.postsAndComments
                .filter((_, index) => {
                  const displayCondition =
                    state.facet === "Posts" 
                      ? true
                      : index < 3;

                  const followingCondition = isUserFollowing(
                    context.accountId,
                    _.accountId
                  );

                  return (
                    displayCondition &&
                    ((state.showFollowed && followingCondition) ||
                      (state.showNotFollowed && !followingCondition) ||
                      (!state.showFollowed && !state.showNotFollowed))
                  );
                })

                .map((post, i) => (
                  <Item
                    key={`${post.accountId}/${post.postType}/${post.blockHeight}`}
                  >
                    <Widget
                      src='near/widget/Search.IndexPostCard'
                      props={{
                        accountId: post.accountId,
                        blockHeight: post.blockHeight,
                        content: post.postContent,
                        snipContent: post.snipContent,
                        postType: post.postType,
                        onClick: () =>
                          onSearchResultClick({
                            searchPosition: post.searchPosition,
                            objectID: `${post.accountId}/${post.postType}/${post.blockHeight}`,
                            eventName: "Clicked Post After Search",
                          }),
                      }}
                    />
                  </Item>
                ))}
            </PostsGridItems>
          </Group>
        )}
{state.search?.documentation.length > 0 && (
  <Group>
    <GroupHeader>
      <H3>Documentation</H3>
      <Text as='a' onClick={() => onFacetClick("Documentation")} small>
        View All
      </Text>
    </GroupHeader>
    <GridItems numColumns={state.numColumns}>
      {state.search.documentation
        .filter((_, index) => {
          const displayCondition =
            state.facet === "Documentation" ||
            index < 4;

          return displayCondition;
        })

        .map((doc, i) => (
          <Item key={doc.url}>

            <Widget
        src='chaotictempest.near/widget/SearchDocsCard'
                      props={{
                        pageTitle: doc.title,
                        docsUrl: doc.url,
                        content:{text:doc.description,type:'md'}

              }}
            />
          </Item>
        ))}
    </GridItems>
  </Group>
)}




        {!props.disableInsights && (
          <Widget
            src='near/widget/Search.Insights'
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
    {state.isFiltersPanelVisible && (
      <FiltersPanel
        style={{
          transform: state.isFiltersPanelVisible
            ? "translateX(0)"
            : "translateX(100%)",
        }}
      >
        <Widget
          src={`near/widget/Search.FilterComponent`}
          props={{
            showFollowed: state.showFollowed,
            showNotFollowed: state.showNotFollowed,
            onCheckboxChange: handleCheckboxChange,
            updateTags: updateTags,

            selectedTags: state.allTags,
            onTagClick: (tags) => {
              // handle tag click
              // Update the state with the new activeTags
              State.update({ activeTags: tags });
            },
          }}
        />
      </FiltersPanel>
    )}

    <button onClick={()=>console.log(state)}>get state</button>
  </>
);
// #endregion
