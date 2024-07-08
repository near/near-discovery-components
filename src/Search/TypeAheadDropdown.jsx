const SEARCH_API_KEY_APPS = props.searchApiKey ?? "fc7644a5da5306311e8e9418c24fddc4";
const APPLICATION_ID_APPS = props.appId ?? "B6PI9UKKJT";
const INDEX_APPS = props.index ?? "replica_prod_near-social-feed";
const API_URL_APPS = props.apiUrl ?? `https://${APPLICATION_ID_APPS}-dsn.algolia.net/1/indexes/${INDEX_APPS}/query?`;

const SEARCH_API_KEY_DOCS = props.searchApiKey ?? "6b114c851c9921e654b5a1ffa8cffb93";
const APPLICATION_ID_DOCS = props.appId ?? "0LUM67N2P2";
const INDEX_DOCS = props.index ?? "near";
const API_URL_DOCS = props.apiUrl ?? `https://${APPLICATION_ID_DOCS}-dsn.algolia.net/1/indexes/${INDEX_DOCS}/query?`;

const INITIAL_PAGE = props.initialPage ?? 0;
const facets = props.facets ?? ["All", "Docs", "Apps", "Components"];
const tab = props.tab ?? "Docs";
const userId = props.accountId ?? context.accountId;
const searchPageUrl = "/${REPL_ACCOUNT}/widget/Search.IndexPage";
const topmostCount = props.topmostCount ?? 3;

const URLS = {
  Docs: {
    SEARCH_API_KEY: SEARCH_API_KEY_DOCS,
    APPLICATION_ID: APPLICATION_ID_DOCS,
    INDEX: INDEX_DOCS,
    API_URL: API_URL_DOCS,
  },
  Apps: {
    SEARCH_API_KEY: SEARCH_API_KEY_APPS,
    APPLICATION_ID: APPLICATION_ID_APPS,
    INDEX: INDEX_APPS,
    API_URL: API_URL_APPS,
  },
  Components: {
    SEARCH_API_KEY: SEARCH_API_KEY_APPS,
    APPLICATION_ID: APPLICATION_ID_APPS,
    INDEX: INDEX_APPS,
    API_URL: API_URL_APPS,
  },
};

State.init({
  currentPage: 0,
  selectedTab: tab,
  facet: tab,
});

// Styling Specifications

const typeAheadContainer = {
  width: "513px",
  zIndex: "3",
  backgroundColor: "black",
  borderRadius: "10px",
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

  width: 100%;
`;

const NoResults = styled.div`
  padding: 16px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
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
  top: 0;
`;

const H2 = styled.h2`
  display: ${(p) => p.$display ?? "block"};
  justify-content: ${(p) => p.$justifyContent ?? "flex-start"};
  align-items: ${(p) => p.$alignItems ?? "flex-start"};
  position: ${(p) => p.$position ?? "relative"};
  top: ${(p) => p.$top ?? "0"};
  left: ${(p) => p.$left ?? "0"};
  width: ${(p) => p.$width ?? "auto"};
  font-weight: 400;
  font-size: ${(p) => p.$fontSize ?? "20px"};
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
  margin: 10px;
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

  @media (max-width: 1024px) {
    background: #f8f9fa;
    border-top: 1px solid #eceef0;
    margin-left: -12px;
    margin-right: -12px;

    > * {
      flex: 1;
    }
  }
`;

const ButtonLink = styled("Link")`
  background-color: transparent;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: #9799f8;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  text-align:right &:hover {
    color: #9799f8;
  }
`;

const FixedFooter = styled.div`
  text-align: right;
  border-top: 1px solid rgba(96, 109, 122, 0.4);
  bottom: 0;
  padding-bottom: 10px;
  left: 16px;
  right: 16px;
  text-align: right;
  width: 100%;
  justify-content: center;
  padding: 16px 16px 16px 16px;
`;

const TabsButton = styled("Link")`
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

const ScrollableContent = styled.div`
  overflow: auto;
  flex-grow: 1;
  width: 100%;
  height: 350px;
`;

const CardDocs = styled.a`
  width: 100%;
  display: block;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
  max-width: 400px;
  text-decoration: none;
  color: white;
  text-align: left;

  &:hover {
    cursor: pointer;
    text-decoration: none;
  }
`;

const TitleDocs = styled.h2`
  font-size: 18px;
  font-weight: 500;
  color: white;
  margin: 0;
  font-weigth: bold;
  text-align: left;
`;

const SubtitleDocs = styled.h3`
  font-size: 14px;
  font-weight: normal;
  margin: 4px 0 12px;
  text-align: left;
`;

const ContentDocs = styled.p`
  font-size: 14px;
  color: #333;
  margin: 0;
  line-height: 1.4;
  text-align: left;
  color: white;
`;

const Item = styled.div``;

const _parceDataByFacet = (facet, arr) => {
  if (!arr || arr.length === 0) return [];
  return arr.slice(0, topmostCount).map((item) => ({
    ...item,
    variant: item.variant ?? facet,
    relevance: item.searchPosition,
  }));
};

const DisplayResultsByFacet = ({ title, count, items }) => (
  <Group>
    <GroupHeader>
      <H3>
        {title}
        <span
          style={{
            marginLeft: "10px",
          }}
        >
          {count}
        </span>
      </H3>
    </GroupHeader>
    <Items>{items}</Items>
  </Group>
);

const DisplayAllResults = () => {
  const apps = _parceDataByFacet("apps", state.apps.hits);
  const components = _parceDataByFacet("components", state.components.hits);
  const allResults = [...apps, ...components];
  const sortedResults = allResults?.sort((a, b) => a.relevance - b.relevance);
  return (
    <DisplayResultsByFacet
      title="All"
      count={sortedResults.length}
      items={sortedResults.map((item, index) => (
        <ResultByFacet key={`${item.accountId}-${index}`} {...item} />
      ))}
    />
  );
};

const ResultByFacet = (record) => {
  switch (record.variant) {
    case "apps":
    case "components":
    case "nearcatalog":
      const isNearCatalogItem = record.variant === "nearcatalog";
      const componentSrc = isNearCatalogItem
        ? `${record.accountId}/widget/${record.widgetName}?id=${record.slug}`
        : `${record.accountId}/widget/${record.widgetName}`;
      const componentProps = isNearCatalogItem
        ? { image: record.image, name: record.name, variant: record.variant }
        : {};
      return (
        <Item key={componentSrc} onClick={handleCloseSearchMenu}>
          <Widget
            src="${REPL_ACCOUNT}/widget/Search.ComponentCard"
            props={{
              src: componentSrc,
              ...componentProps,
              onClick: () =>
                onSearchResultClick({
                  queryID: record.queryID,
                  searchPosition: record.searchPosition,
                  objectID: `${record.accountId}/widget/${record.widgetName}`,
                  eventName: "Clicked App After Search",
                }),
            }}
          />
        </Item>
      );
  }
};

const TextMessage = ({ message, ...props }) => (
  <H2
    $display="flex"
    $justifyContent="center"
    $alignItems="center"
    $position="absolute"
    $fontSize="15px"
    $width="100%"
    $top="40%"
    $left="-0%"
    {...props}
  >
    {message}
  </H2>
);

//*********SEARCH FUNCTIONS ******** */

// Reset Search Results
const resetSearcheHits = () => {
  State.update({
    currentPage: 0,
    paginate: undefined,
    facet: undefined,
    profiles: undefined,
    apps: undefined,
    components: undefined,
    docs: undefined,
    postsAndComments: undefined,
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

// creates an array of components
const components = (records, app) => {
  const components = [];
  for (const [i, component] of records || []) {
    const idParts = component.objectID.split("/");
    const widgetName = idParts[idParts.length - 1];
    const accountId = component.author;
    components.push({
      app,
      accountId,
      widgetName,
      searchPosition: i,
    });
  }
  return components;
};

// creates an array of components
const nearcatalog = (records) => {
  const components = [];
  for (const [i, component] of records || []) {
    const widgetName = "Index";
    const accountId = "nearcatalog.near";
    components.push({
      accountId,
      widgetName,
      slug: component.slug,
      image: component.image,
      name: component.name,
      variant: "nearcatalog",
      searchPosition: i,
    });
  }
  return components;
};

const convertUrl = (url) => url.replace(/^https:\/\/docs\.near\.org\/(.+)$/, "https://dev.near.org/documentation/$1");

const docsComponents = (rawResp) => {
  return rawResp.hits.map((item) => {
    return (
      <CardDocs href={convertUrl(item.url)}>
        <TitleDocs>{item.hierarchy.lvl0}</TitleDocs>
        <SubtitleDocs>{item.hierarchy.lvl1}</SubtitleDocs>
        <ContentDocs>{item.content ? item.content.substr(0, 80) : ""}</ContentDocs>
      </CardDocs>
    );
  });
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

const parseSearchHitsForDocs = (rawResp) => {
  return {
    results: rawResp.hits,
    hitsTotal: rawResp.nbHits,
    hitsPerPage: rawResp.hitsPerPage,
  };
};

const debounce = (callable, timeout) => {
  return (args) => {
    clearTimeout(state.timer);
    State.update({
      timer: setTimeout(() => callable(args), timeout ?? 150),
    });
  };
};

const fetchSearchHits = (facet, query, { pageNumber, configs, optionalFilters }) => {
  let body = {
    query,
    page: pageNumber ?? 0,
    optionalFilters: optionalFilters ?? ["categories:nearcatalog<score=1>", "categories:widget<score=2>"],
    clickAnalytics: true,
    ...configs,
  };

  return asyncFetch(URLS[facet].API_URL, {
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "X-Algolia-Api-Key": URLS[facet].SEARCH_API_KEY,
      "X-Algolia-Application-Id": URLS[facet].APPLICATION_ID,
    },
    method: "POST",
  });
};

const updateSearchHits = debounce(({ term, pageNumber }) => {
  const localState = {
    hitsTotal: 0,
    lastUpdatedHitsTotal: 0,
  };
  // NOTE: This puts all search results into state directly instead of categorized
  // under `search`. This is due to how many times the state is updated and reading the
  // state with current near social isn't feasible.
  const updateStateAfterFetching = (facet) => {
    return (resp) => {
      const { results, hitsTotal, hitsPerPage } =
        facet != "Docs" ? categorizeSearchHits(resp.body) : parseSearchHitsForDocs(resp.body);

      if (facet === "Apps") {
        State.update({
          apps: {
            hitsTotal,
            hitsPerPage,
            hits: components(results["app, widget, nearcatalog"])
              .concat(nearcatalog(results["nearcatalog"]))
              .concat(components(results["widget"])),
            queryID: resp.body.queryID,
          },
        });
      }

      if (facet === "Docs") {
        State.update({
          docs: {
            hitsTotal,
            hitsPerPage,
            hits: docsComponents(resp.body),
            queryID: resp.body.queryID,
          },
        });
      }

      if (facet === "Components") {
        State.update({
          components: {
            hitsTotal,
            hitsPerPage,
            hits: components(results["widget"]),
            queryID: resp.body.queryID,
          },
        });
      }

      localState.hitsTotal += hitsTotal;
      if (localState.hitsTotal >= localState.lastUpdatedHitsTotal) {
        localState.lastUpdatedHitsTotal = localState.hitsTotal;
        State.update({
          paginate: {
            hitsPerPage,
            hitsTotal: localState.hitsTotal,
          },
        });
      }
    };
  };

  for (const facet of facets.filter((i) => i !== "All")) {
    fetchSearchHits(facet, term, {
      pageNumber,
      configs: configsPerFacet(facet),
    }).then(updateStateAfterFetching(facet));
  }
});

const onSearchChange = ({ term }) => {
  writeStateTerm(term);
  updateSearchHits({ term, pageNumber: INITIAL_PAGE });
};

const FACET_TO_CATEGORY = {
  Apps: "app",
  Components: "widget",
};

const FACET_TO_FILTER = {
  Apps: "(categories:nearcatalog OR categories:app OR tags:app)",
  Components: "categories:widget",
};

const searchFilters = (facet) => {
  let filters = FACET_TO_FILTER[facet];
  if (filters) {
    filters = `${filters} AND `;
  }
  return `${filters}NOT author:hypefairy.near AND NOT _tags:hidden`;
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

const handleCloseSearchMenu = () => {
  props.focusChange(false);
};

const onSearchResultClick = ({ searchPosition, queryID, objectID, eventName }) => {
  const position = searchPosition + state.currentPage * state.paginate.hitsPerPage;
  const event = {
    type: "clickedObjectIDsAfterSearch",
    data: {
      eventName,
      queryID,
      userToken: userId.replace(".", "+"),
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
  }, 100);
};

const tabCount = (tab) => {
  switch (tab) {
    case "All":
      // Return the count for All
      return state.paginate?.hitsTotal;
    case "Apps":
      // Return the count for Apps
      return state.apps.hitsTotal ?? 0;
    case "Docs":
      // Return the count for Apps
      return state.docs.hitsTotal ?? 0;
    case "Components":
      // Return the count for Components
      return state.components.hitsTotal ?? 0;
    default:
      // Return 0 if the tab name is not in the list
      return 0;
  }
};

const topmostComponents = (apps) => {
  if (state.selectedTab === "Docs") {
    return <Items>{state.docs.hits}</Items>;
  }
  let output = [];
  if (state.selectedTab === "Components" || state.selectedTab === "Apps") {
    if (state.selectedTab === "Components") {
      output = state.components.hits.slice(0, 6);
    } else if (state.selectedTab === "Apps") {
      output = state.apps.hits.slice(0, 6);
    }
  } else {
    if (apps) {
      output = state.apps.hits.slice(0, topmostCount);
    } else {
      output = state.components.hits.slice(0, topmostCount);
    }
  }

  const queryID = apps ? state.apps.queryID : state.components.queryID;
  const eventName = apps ? "App" : "Component";
  return output.map((component, i) => {
    const isNearCatalogItem = component.variant && component.variant === "nearcatalog";
    const componentSrc = isNearCatalogItem
      ? `${component.accountId}/widget/${component.widgetName}?id=${component.slug}`
      : `${component.accountId}/widget/${component.widgetName}`;
    const componentProps = isNearCatalogItem
      ? { image: component.image, name: component.name, variant: component.variant }
      : {};
    return (
      <Item key={componentSrc} onClick={handleCloseSearchMenu}>
        <Widget
          src="${REPL_ACCOUNT}/widget/Search.ComponentCard"
          props={{
            src: componentSrc,
            ...componentProps,
            onClick: () =>
              onSearchResultClick({
                queryID,
                searchPosition: component.searchPosition,
                objectID: `${component.accountId}/widget/${component.widgetName}`,
                eventName: `Clicked ${eventName} After Search`,
              }),
          }}
        />
      </Item>
    );
  });
};

const displayResultsByFacet = (selectedTab) => {
  switch (selectedTab) {
    case "Docs":
      return state.components.hits?.length > 0 ? (
        <DisplayResultsByFacet title="Components" count={state.docs.hitsTotal} items={topmostComponents(false)} />
      ) : (
        <>
          <TextMessage message={`No Component matches were found for "${state.term}".`} />
          <TextMessage
            message={`Trying to find a app built by an user? Try search their account id.`}
            $fontSize="12px"
            $top="45%"
          />{" "}
        </>
      );

    case "Apps": {
      return state.apps.hits?.length > 0 ? (
        <DisplayResultsByFacet title="Apps" count={state.apps.hitsTotal} items={topmostComponents(true)} />
      ) : (
        <>
          <TextMessage message={`No App matches were found for "${state.term}".`} />
          <TextMessage
            message={`Trying to find a app built by an user? Try search their account id.`}
            $fontSize="12px"
            $top="45%"
          />{" "}
        </>
      );
    }

    case "Components":
      return state.components.hits?.length > 0 ? (
        <DisplayResultsByFacet title="Components" count={state.components.hitsTotal} items={topmostComponents(false)} />
      ) : (
        <>
          <TextMessage message={`No Component matches were found for "${state.term}".`} />
          <TextMessage
            message={`Trying to find a app built by an user? Try search their account id.`}
            $fontSize="12px"
            $top="45%"
          />{" "}
        </>
      );
    case "All":
      return <DisplayAllResults />;
  }
};

if (props.term !== state.lastSyncedTerm) {
  State.update({
    lastSyncedTerm: props.term,
  });
  onSearchChange({ term: props.term });
}

const encodeURIComponent = (text) => {
  const hexDigits = "0123456789ABCDEF";
  const result = [];
  for (var i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (
      (c >= 48 /*0*/ && c <= 57) /*9*/ ||
      (c >= 97 /*a*/ && c <= 122) /*z*/ ||
      (c >= 65 /*A*/ && c <= 90) /*Z*/ ||
      c == 45 /*-*/ ||
      c == 95 /*_*/ ||
      c == 46 /*.*/ ||
      c == 33 /*!*/ ||
      c == 126 /*~*/ ||
      c == 42 /***/ ||
      c == 92 /*\\*/ ||
      c == 40 /*(*/ ||
      c == 41 /*)*/
    ) {
      result.push(text[i]);
    } else {
      const firstHexDigit = hexDigits.charAt((c & 0xf0) / 16);
      const secondHexDigit = hexDigits.charAt(c & 0x0f);
      result.push(`%${firstHexDigit}${secondHexDigit}`);
    }
  }
  return result.join("");
};

return (
  <div style={typeAheadContainer}>
    <Wrapper>
      <FixedTabs>
        <Widget
          src="${REPL_ACCOUNT}/widget/Search.Facets"
          props={{
            facets,
            onFacetClick,
            defaultFacet: facets[0],
          }}
        />
      </FixedTabs>
      <ScrollableContent>
        {state.paginate?.hitsTotal == 0 && state.selectedTab == "All" && (
          <H2
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
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
        <ButtonLink
          href={`${searchPageUrl}?term=${encodeURIComponent(props.term)}&tab=${state.selectedTab}`}
          onClick={handleCloseSearchMenu}
        >
          {state.paginate?.hitsTotal > 0 && ` See ${tabCount(state.selectedTab)} Results`}
        </ButtonLink>
      </FixedFooter>

      {!props.disableInsights && (
        <Widget
          src="${REPL_ACCOUNT}/widget/Search.Insights"
          props={{
            event: state.event,
            searchApiKey: SEARCH_API_KEY_APPS,
            appId: APPLICATION_ID_APPS,
            index: INDEX_APPS,
          }}
        />
      )}
    </Wrapper>
  </div>
);
