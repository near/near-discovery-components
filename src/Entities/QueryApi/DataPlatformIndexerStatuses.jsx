const GRAPHQL_ENDPOINT = props.GRAPHQL_ENDPOINT || "https://near-queryapi.api.pagoda.co";

const indexerAccount = props.indexerAccount || "dataplatform.near";
const indexerAccountLink = indexerAccount.replace(".", "_");
const indexerFilter = props.indexerFilter || null;

const [statuses, setIndexerStatuses] = useState({});
const [errors, setErrors] = useState("");
const [timer, setTimer] = useState(null);

const [latestBlock, setLatestBlock] = useState(0);
const [indexerList, setIndexerList] = useState(null);
const registryContract = "queryapi.dataplatform.near";
const registry = Near.view(registryContract, "list_indexer_functions", {
  account_id: indexerAccount,
});

if (!registry) {
  return <div>Loading indexer list from contract...</div>;
} else {
  try {
    setIndexerList(Object.keys(registry["Account"]).sort());
  } catch (e) {
    setErrors(e);
  }
}

const defaultIndexerList = [
  "access_keys_v1",
  "accounts",
  "components",
  "entities",
  "feed",
  "moderation",
  "notifications",
  "social_feed",
  "verifications",
];

if (!indexerList) {
  return (
    <div>
      <p>Indexer list failed to load from contract</p>
      <button onClick={() => setIndexerList(defaultIndexerList)}>Use default indexer list</button>
    </div>
  );
}

function fetchGraphQL(operationsDoc, operationName, variables) {
  return asyncFetch(`${GRAPHQL_ENDPOINT}/v1/graphql`, {
    method: "POST",
    headers: { "x-hasura-role": indexerAccountLink },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });
}
const query = (indexer) => `query MyQuery {
  ${indexerAccountLink}_${indexer}_sys_metadata {
    attribute
    value
  }
}`;

function handleResults(indexer, result) {
  try {
    if (result.status === 200 && result.body) {
      if (result.body.errors) {
        setErrors(result.body.errors);
        return;
      }
      let data = result.body.data;
      if (data) {
        const statuses = data[`${indexerAccountLink}_${indexer}_sys_metadata`];
        if (statuses.length > 0) {
          const status = statuses.find((s) => s.attribute === "STATUS")?.value;
          const blockHeight = statuses.find((s) => s.attribute === "LAST_PROCESSED_BLOCK_HEIGHT")?.value;
          const newStatus = { [indexer]: { status, blockHeight } };
          setIndexerStatuses((prev) => ({ ...prev, ...newStatus }));
        }
      }
    }
  } catch (e) {
    setErrors(e);
  }
}

const update = () => {
  asyncFetch("https://rpc.mainnet.near.org", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "dontcare",
      method: "status",
      params: {},
    }),
  }).then((res) => setLatestBlock(res.body.result.sync_info.latest_block_height));
  if (indexerList) {
    indexerList.forEach((indexer) => fetchGraphQL(query(indexer)).then((result) => handleResults(indexer, result)));
  }
};

update();
if (!timer) {
  setTimer(setInterval(update, 3000));
}

const StatusTable = styled.table`
  border-collapse: collapse;
  border-spacing: 0;
  width: 80%;
  font-family: "Roboto Mono", monospace;
  font-size: 11px;
  background-color: rgb(250, 250, 250);
  color: rgb(32, 33, 36);
`;

const TableHeader = styled.th`
  word-wrap: break-word;
  padding: 1em;
  font-size: 14px;
`;

const TableElement = styled.td`
  font-weight: ${(td) => (td.bold ? "800" : "400")};
  word-wrap: break-word;
  padding: 1em;
`;

return (
  <div>
    <StatusTable>
      <thead>
        <tr>
          <TableHeader>
            Indexers {indexerAccount} {indexerFilter}
          </TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader>Current Block Height</TableHeader>
        </tr>
      </thead>
      <tbody>
        <tr>
          <TableElement bold>Latest Block</TableElement>
          <TableElement>MAINNET</TableElement>
          <TableElement bold>{latestBlock}</TableElement>
        </tr>
        {Object.entries(statuses).map(([indexer, status]) => (
          <tr key={indexer}>
            <TableElement>{indexer}</TableElement>
            <TableElement>
              <span style={{ color: status.status === "RUNNING" ? "green" : "red" }}>{status.status}</span>
            </TableElement>
            <TableElement>{status.blockHeight}</TableElement>
          </tr>
        ))}
      </tbody>
    </StatusTable>
    <hr />
    <div>{errors ? JSON.stringify(errors) : ""}</div>
    <Link
      target="_blank"
      href={`https://cloud.hasura.io/public/graphiql?endpoint=https://near-queryapi.api.pagoda.co/v1/graphql&header=x-hasura-role%3A${indexerAccountLink}`}
    >
      Explore Data
    </Link>
  </div>
);
