const { loadItems, fetchGraphQL } = VM.require("${REPL_ACCOUNT}/widget/Entities.QueryApi.Client");
if (!loadItems) {
  return <p>Loading modules...</p>;
}

const { namespace, entityType, onSelect, limit, initialTags } = props;
const tagLimit = limit ?? 100;

const [items, setItems] = useState(null);
const [tags, setTags] = useState(initialTags);

const user = "dataplatform_near";
const entityIndexer = "entities";
const tagsTable = "tags";
const collection = `${user}_${entityIndexer}_${tagsTable}`;

const buildQueries = () => {
  const namespaceClause = namespace ? `namespace: {_eq: "${namespace}"}` : "";
  const entityTypeClause = entityType ? `entity_type: {_eq: "${entityType}"}` : "";
  const whereClause = namespace || entityType ? `where: {${namespaceClause}, ${entityTypeClause}}` : "";

  return `
query ListQuery($offset: Int, $limit: Int) {
  ${collection}(
      ${whereClause}
      order_by: {count: desc, tag: asc}, 
      offset: $offset, limit: $limit) {
    namespace
    entity_type
    tag
    count
  }
  ${collection}_aggregate (
      ${whereClause}
    ){
    aggregate {
      count
    }
  }
}
`;
};
const queryName = "ListQuery";

const onLoad = (newItems, totalItems) => {
  // no paging, just top tags
  setItems({ list: newItems ?? [], total: totalItems });
};
loadItems(buildQueries(), queryName, 0, collection, onLoad, tagLimit);
if (items === null) {
  return "Loading tags";
}

const Wrapper = styled.div`
  position: relative;

  ${(p) =>
    p.scroll
      ? `
    ul {
      padding-right: 16px;
    }

    &::after {
      content: '';
      display: block;
      height: 100%;
      width: 16px;
      background: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,1));
      position: absolute;
      top: 0;
      right: 0;
    }

    ul {
        flex-wrap: nowrap;
    }
  `
      : ""}
`;

const Tags = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  gap: 6px;
  overflow: auto;
  margin: 0;
  padding: 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Tag = styled.li`
  padding: 3px 6px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 12px;
  border: 1px solid currentcolor;
  border-color: ${(p) => (p.primary ? "currentcolor" : "#E6E8EB")};
  color: ${(p) => (p.primary ? "#26A65A" : "#687076")};
  font-weight: 500;
  white-space: nowrap;
`;

const Count = styled.span`
  font-family: var(--font-mono);
  color: #687076;
  margin-left: 6px;
`;
const TooltipTag = styled.span`
  font-family: var(--font-mono);
  font-weight: bold;
  margin-left: 4px;
`;

const selectTag = (tag) => {
  setTags([tag]);
  if (onSelect) {
    onSelect(tag);
  }
};
const humanize = (str) => {
  if (!str) return "";
  return str.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
};

const isSelected = (tag, tagList) =>
  tagList && tagList.find((t) => t.tag === tag.tag && t.entity_type === tag.entity_type);

return (
  <div>
    <p>Filter by Tag</p>
    <Wrapper scroll={props.scroll}>
      <Tags>
        {items && items.list
          ? items.list.map((tag, i) => (
              <Widget
                src="${REPL_ACCOUNT}/widget/DIG.Tooltip"
                props={{
                  content: (
                    <span>
                      {humanize(tag.entity_type)}s with Tag <TooltipTag> {tag.tag}</TooltipTag>
                    </span>
                  ),
                  trigger: (
                    <Tag key={i} onClick={() => selectTag(tag)} primary={isSelected(tag, props.initialTags)}>
                      {tag.tag} <Count>{tag.count}</Count>
                    </Tag>
                  ),
                }}
              />
            ))
          : ""}
      </Tags>
    </Wrapper>
  </div>
);
