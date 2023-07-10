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

const FacetContainer =
  props.facetContainerStyle ??
  styled.ul`
    padding: 5px 2px 5px 2px;
    display: inline-flex;
    list-style-type: none;
    overflow: auto;
  `;

const FacetItem =
  props.facetItemStyle ??
  styled.li`
    padding: 0 14px 0 14px;
    border: 1px solid #d0d5dd !important;
    background: #ffffff;
    border-radius: 100px;

    height: 32px;
    text-align: center;
    margin: auto 4px;
    color: rgba(0, 0, 0, 0.87);
    display: flex;
    box-sizing: border-box;
    align-items: center;
    letter-spacing: 0.01071em;
    line-height: 1.43;
    font-size: 13px;
    min-width: 32px;

    &:hover {
      background-color: rgba(0, 0, 0, 0.04);
      cursor: pointer;
    }

    &.selected {
      background-color: rgba(0, 0, 0, 0.08);
    }
  `;

return (
  <FacetContainer>
    {facets?.map((facet) => (
      <FacetItem
        className={facet in (state.selected ?? {}) ? "selected" : ""}
        onClick={() => onFacetClick(facet)}
        key={facet}
      >
        {facet}
      </FacetItem>
    ))}
  </FacetContainer>
);
