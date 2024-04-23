const loadItemsQueryApi = VM.require("${REPL_ACCOUNT}/widget/Entities.QueryApi.Client")?.loadItems;
if (!loadItemsQueryApi) {
  return <p>Loading modules...</p>;
}
const loadItems = props.loadItems ?? loadItemsQueryApi;

const accountId = props.accountId || context.accountId;
const {
  schema,
  description,
  buildQueries,
  queryName,
  collection,
  renderItem,
  createWidget,
  createWidgetProps,
  globalTagFilter,
  setGlobalTagFilter,
} = props;

const finalCreateWidget = createWidget ?? `${REPL_ACCOUNT}/widget/Entities.Template.EntityCreate`;

const sortTypes = props.sortTypes ?? [
  { text: "Most Stars", value: "{ stars: desc }, { id: desc }" },
  { text: "Least Stars", value: "{ stars: asc }, { id: desc }" },
  { text: "Name A-Z", value: "{ display_name: asc }" },
  { text: "Name Z-A", value: "{ display_name: desc }" },
  { text: "Newest", value: "{ created_at: desc }" },
  { text: "Oldest", value: "{ created_at: asc }" },
  { text: "Newest Updates", value: "{ updated_at: desc }" },
  { text: "Oldest Updates", value: "{ updated_at: asc }" },
];

const [searchKey, setSearchKey] = useState("");
const [sort, setSort] = useState(sortTypes[0].value);
const [tagsFilter, setTagsFilter] = useState(
  Array.isArray(globalTagFilter) ? globalTagFilter.map((it) => it.tag) : null,
);
const [items, setItems] = useState({ list: [], total: 0 });
const [showCreateModal, setShowCreateModal] = useState(false);
const [activeItem, setActiveItem] = useState(null);

const [debounceTimer, setDebounceTimer] = useState(null);

const closeModal = () => {
  setActiveItem(null);
  setShowCreateModal(false);
};
const toggleModal = () => {
  setShowCreateModal(!showCreateModal);
};
const editFunction = (item) => {
  setActiveItem(item);
  setShowCreateModal(true);
};
const onLoad = (newItems, totalItems) => {
  setItems({ list: [...items.list, ...newItems], total: totalItems });
};
const onLoadReset = (newItems, totalItems) => {
  setItems({ list: newItems, total: totalItems });
};
const loadItemsUseState = (isResetOrPageNumber) => {
  const loader = isResetOrPageNumber === true ? onLoadReset : onLoad;
  const offset = isResetOrPageNumber === true ? 0 : items.list.length;
  return loadItems(buildQueries(searchKey, sort, { tags: tagsFilter }), queryName, offset, collection, loader);
};

const onTagFilterChanged = (tags) => {
  setTagsFilter(tags);
  setGlobalTagFilter(tags.map((tag) => ({ entity_type: schema.entityType, tag })));
};

useEffect(() => {
  if (debounceTimer) clearTimeout(debounceTimer);
  const search = (searchKey ?? "").toLowerCase();
  setItems({
    list: items.list.filter((item) => (item.display_name ?? "").toLowerCase().includes(search)),
    total: items.total,
  });
  setDebounceTimer(
    setTimeout(() => {
      loadItemsUseState(true);
    }, 500),
  );
  return () => clearTimeout(debounceTimer);
}, [searchKey]);
useEffect(() => {
  loadItemsUseState(true);
}, [sort, tagsFilter]);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding-left: 24px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px 0 12px 0px;
`;

const Search = styled.div`
  width: 246px;

  @media (max-width: 500px) {
    width: 100%;
  }
`;
const SortContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;

  @media (max-width: 1200px) {
    padding: 12px;
  }
`;
const Sort = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;

  & > span.label {
    font-family: "Inter";
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 18px;
    color: #11181c;
    white-space: nowrap;
  }

  &:last-child {
    width: 40%;

    @media screen and (max-width: 768px) {
      width: 85%;
    }
  }
`;
const H1 = styled.h1`
  font-weight: 600;
  font-size: 24px;
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

const Text = styled.p`
  margin: 0;
  line-height: 1.5rem;
  color: ${(p) => (p.bold ? "#11181C" : "#687076")} !important;
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
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 800px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Item = styled.div``;
const dialogStyles = {
  maxWidth: "800px",
  borderRadius: "14px",
};
const ScrollBox = styled.div`
  max-height: 80vh;
  overflow-y: auto;
`;

return (
  <Wrapper>
    <Header>
      <div className="row">
        <div className="col">
          <H2>
            {items.total} {schema.entityTitle + (items.total !== 1 ? "s" : "")}
          </H2>
          {description && <Text>{description}</Text>}
        </div>
        {context.accountId && (
          <div className="col-3" style={{ textAlign: "right" }}>
            <Widget
              src="${REPL_ACCOUNT}/widget/DIG.Button"
              props={{
                label: "Create " + schema.entityTitle,
                onClick: toggleModal,
                iconLeft: "ph ph-plus-circle",
                variant: "primary",
                fill: "outline",
                size: "small",
              }}
            />
            <Widget
              src="${REPL_ACCOUNT}/widget/DIG.Dialog"
              props={{
                type: "dialog",
                description: (
                  <ScrollBox>
                    <Widget
                      src={finalCreateWidget}
                      props={{ schema, onCancel: closeModal, data: activeItem, ...createWidgetProps }}
                    />
                  </ScrollBox>
                ),
                onOpenChange: closeModal,
                open: showCreateModal,
                contentStyles: dialogStyles,
                actionButtons: <></>,
              }}
            />
          </div>
        )}
      </div>
      <div className="row">
        <div className="col">
          <Search>
            <Widget
              src="${REPL_ACCOUNT}/widget/DIG.Input"
              props={{
                label: "",
                placeholder: "Search by name",
                value: searchKey,
                onChange: (e) => setSearchKey(e.target.value),
              }}
            />
          </Search>
        </div>
        <div className="col-2">
          <Widget
            src="${REPL_ACCOUNT}/widget/Entities.Template.Forms.TagsEditor"
            props={{
              placeholder: "Filter by Tag",
              value: tagsFilter,
              setValue: onTagFilterChanged,
              namespace: schema.namespace,
              entityType: schema.entityType,
              allowNew: false,
            }}
          />
        </div>
        <div className="col">
          <SortContainer>
            <Sort>
              <Widget
                src={`${REPL_ACCOUNT}/widget/Select`}
                props={{
                  noLabel: true,
                  value: { text: sortTypes.find((it) => it.value === sort), value: sort },
                  onChange: ({ value }) => setSort(value),
                  options: sortTypes,
                  border: "none",
                }}
              />
            </Sort>
          </SortContainer>
        </div>
      </div>
    </Header>

    {items.total > 0 && (
      <InfiniteScroll
        className="mb-5"
        pageStart={0}
        loadMore={loadItemsUseState}
        hasMore={items.total > items.list.length}
        initialLoad={false}
        loader={
          <div className="loader">
            <span className="spinner-grow spinner-grow-sm me-1" role="status" aria-hidden="true" />
            Loading ...
          </div>
        }
      >
        {props.table ? (
          items.list.map((item) => (
            <div key={`${item.accountId}-${item.widgetName}`}>{renderItem(item, editFunction)}</div>
          ))
        ) : (
          <Items>
            {items.list.map((item) => (
              <Item key={`${item.accountId}-${item.widgetName}`}>{renderItem(item, editFunction)}</Item>
            ))}
          </Items>
        )}
      </InfiniteScroll>
    )}
  </Wrapper>
);
