const { fetchGraphQL, loadItems } = VM.require("${REPL_ACCOUNT}/widget/Entities.QueryApi.Client");
if (!fetchGraphQL || !loadItems) {
  return <p>Loading modules...</p>;
}

const accountId = props.accountId || context.accountId;
const { entityType, description, buildQueries, queryName, collection, renderItem, createWidget } = props;

const finalCreateWidget = createWidget ?? "${REPL_ACCOUNT}" + `/widget/Entities.${entityType}.${entityType}Create`;

const [searchKey, setSearchKey] = useState("");
const [sort, setSort] = useState("");
const [items, setItems] = useState([]);
const [totalItems, setTotalItems] = useState(0);
const [showCreateModal, setShowCreateModal] = useState(false);

const closeModal = () => {
  setShowCreateModal(false);
};
const toggleModal = () => {
  setShowCreateModal(!showCreateModal);
};
const onLoad = (newItems, totalItems) => {
  setItems([...items, ...newItems]);
  setTotalItems(totalItems);
};
const loadItemsUseState = () =>
  loadItems(buildQueries(searchKey, sort), queryName, items.length ?? 0, collection, onLoad);
useEffect(() => {
  setItems([]);
  loadItemsUseState();
}, [sort, searchKey]);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding-bottom: 48px;
  padding-top: 48px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Search = styled.div`
  width: 246px;

  @media (max-width: 500px) {
    width: 100%;
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

return (
  <Wrapper className="container-xl">
    <Header>
      <div className="row">
        <div className="col">
          <H1>
            {totalItems} {entityType + (totalItems > 1 ? "s" : "")}
          </H1>
          {description && <Text>{description}</Text>}
        </div>
        {context.accountId && (
          <div className="col-2">
            <Widget
              src="near/widget/DIG.Button"
              props={{
                label: "Create " + entityType,
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
                description: <Widget src={finalCreateWidget} props={{ onCancel: closeModal }} />,
                onOpenChange: closeModal,
                open: showCreateModal,
                contentStyles: dialogStyles,
                actionButtons: <></>,
              }}
            />
          </div>
        )}
      </div>
    </Header>

    {items.length > 0 && (
      <InfiniteScroll
        className="mb-5"
        pageStart={0}
        loadMore={loadItemsUseState}
        hasMore={totalItems !== items.length}
        initialLoad={false}
        loader={
          <div className="loader">
            <span className="spinner-grow spinner-grow-sm me-1" role="status" aria-hidden="true" />
            Loading ...
          </div>
        }
      >
        <Items>
          {items.map((item) => (
            <Item key={item.accountId + item.widgetName}>{renderItem(item)}</Item>
          ))}
        </Items>
      </InfiniteScroll>
    )}
  </Wrapper>
);
