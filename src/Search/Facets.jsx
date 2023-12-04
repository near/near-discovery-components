// List of facets to show
const facets = props.facets ?? ["facet0", "facet1", "facet2", "facet3"];
// Whether to allow multiselecting or not.
const multiSelect = props.multiSelect ?? false;
// If no facet is selected, this will be the facet to be selected automatically.
const defaultFacet = props.defaultFacet;
// Options to modify the interactions behind the default facet.
const defaultFacetOptions = props.defaultFacetOptions ?? {
  // Default facet will be disabled when selecting on other facets.
  disableOnSelectOthers: true,
  // Selecting default facet will disable other facets.
  disableOthersOnSelect: true,
};
// Differs from a default facet. This will set the initial facet if needed which
// can be different from a default facet.
const initialFacet = props.initialFacet ?? defaultFacet;

const onFacetClick = (facet) => {
  let selected = {};
  if (multiSelect) {
    selected = { ...state.selected };
  }
  if (facet in selected) {
    delete selected[facet];
  } else {
    selected[facet] = true;
  }

  if (defaultFacet) {
    if (facet !== defaultFacet && defaultFacetOptions.disableOnSelectOthers) {
      delete selected[defaultFacet];
    }
    if (facet === defaultFacet && defaultFacetOptions.disableOthersOnSelect) {
      selected = {};
    }
    if (Object.keys(selected).length === 0) selected[defaultFacet] = true;
  }

  if (props.debug) {
    console.log(`Clicked ${facet}`);
  }

  State.update({
    selected,
  });

  if (props.onFacetClick) {
    props.onFacetClick(facet);
  }

  if (multiSelect && props.onMultiFacetClick) {
    props.onMultiFacetClick({
      recentFacetClick: facet,
      selectedFacets: Object.keys(selected),
    });
  }
};

const initSelected = () => {
  const selected = {};
  if (facets.includes(initialFacet)) {
    selected[initialFacet] = true;
  } else if (facets.includes(defaultFacet)) {
    selected[defaultFacet] = true;
  }
  return selected;
};

if (!state.initialized) {
  State.update({
    initialized: true,
    selected: initSelected(),
  });
}

const FacetContainer = styled.div`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  list-style-type: none;
  width: 100%;
  margin: 0;
  padding: 12px 0;
`;

const Tabs = styled.div`
  display: flex;
  overflow: auto;
  scroll-behavior: smooth;
  margin: 0;
  gap: 4px;

  @media (max-width: 1024px) {
    margin-left: -12px;
    margin-right: -12px;
    border-bottom: 1px solid rgba(112, 109, 218, 0.15);

    > * {
      flex: 1;
    }
  }
`;

const TabsButton = styled.button`
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-weight: 600;
  font-size: 12px;
  padding: 8px 12px;
  position: relative;
  color: #687076;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  outline: none;
  text-align: center;
  text-decoration: none !important;
  flex: 1;

  &:hover,
  &[data-selected="true"] {
    color: #ffffff;
    border-bottom-color: #9799f8;
  }
`;

return (
  <FacetContainer>
    <Tabs>
      {facets.map((facet) => (
        <TabsButton type="button" onClick={() => onFacetClick(facet)} key={facet} data-selected={state.selected[facet]}>
          {facet}
        </TabsButton>
      ))}
    </Tabs>
  </FacetContainer>
);
