const { loadItems, fetchGraphQL } = VM.require("${REPL_ACCOUNT}/widget/Entities.QueryApi.Client");
if (!loadItems) {
  return <p>Loading modules...</p>;
}

const { namespace, entityType, value, setValue } = props;

const placeholder = props.placeholder ?? "Tags";

const [items, setItems] = useState(null);
const [tags, setTags] = useState(value || []);

const user = "dataplatform_near";
const entityIndexer = "entities";
const tagsTable = "tags";
const collection = `${user}_${entityIndexer}_${tagsTable}`;

const ns = namespace ? namespace : "default";
const buildQueries = () => {
  return `
query ListQuery($offset: Int, $limit: Int) {
  ${collection}(
      where: {namespace: {_eq: "${ns}"}, entity_type: {_eq: "${entityType}"}}
      order_by: {count: desc, tag: asc}, 
      offset: $offset, limit: $limit) {
    namespace
    entity_type
    tag
    count
  }
  ${collection}_aggregate (
      where: {namespace: {_eq: "${ns}"}, entity_type: {_eq: "${entityType}"}}
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
  // no paging, just top 100 tags
  const tagArray = newItems.map((o) => o.tag);
  setItems({ list: tagArray ?? [], total: totalItems });
};
loadItems(buildQueries(), queryName, 0, collection, onLoad, 100);

if (items === null) {
  return "Loading";
}

const normalizeTag = (tag) =>
  tag
    .replaceAll(/[- \.]/g, "_")
    .replaceAll(/[^\w]+/g, "")
    .replaceAll(/_+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .toLowerCase()
    .trim("-");

const valueChanged = (tags) => {
  if (tags) {
    tags = tags.map((o) => {
      if (typeof o === "string") {
        return normalizeTag(o);
      } else if (typeof o === "object" && o.name) {
        o.name = normalizeTag(o.name);
        return o.name;
      }
    });
    setTags(tags);
    if (setValue) {
      setValue(tags);
    }
  }
};

return (
  <>
    <Typeahead
      id={`tags-selector-${Date.now()}`}
      multiple
      labelKey="name"
      onChange={valueChanged}
      options={items.list}
      placeholder={placeholder}
      selected={tags ?? []}
      positionFixed
      allowNew
    />
  </>
);
