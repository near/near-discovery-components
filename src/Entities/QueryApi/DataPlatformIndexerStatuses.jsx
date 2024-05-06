const { fetchGraphQL } = VM.require("${REPL_ACCOUNT}/widget/Entities.QueryApi.Client");
if (!fetchGraphQL) {
  return <p>Loading modules...</p>;
}

const indexerAccount = props.indexerAccount || "dataplatform.near";
const sanitizedAccountId = indexerAccount.replace(/[^a-zA-Z0-9]/g, "_").replace(/^([0-9])/, "_$1");
const indexerFilter = props.indexerFilter || null;

const [statuses, setIndexerStatuses] = useState({});
const [errors, setErrors] = useState("");
const [timer, setTimer] = useState(null);

const [latestBlock, setLatestBlock] = useState(0);
const [latestFinalBlock, setLatestFinalBlock] = useState(0);
const [indexerList, setIndexerList] = useState(null);
const registryContract = "queryapi.dataplatform.near";
const registry = Near.view(registryContract, "list_indexer_functions", {
  account_id: indexerAccount,
});

if (!registry) {
  return <div>Loading indexer list from contract...</div>;
} else {
  try {
    const keys = Object.keys(registry["Account"]);
    const sanitizedIndexerNames = keys.map((k) => k.replace(/[^a-zA-Z0-9]/g, "_").replace(/^([0-9])/, "_$1"));

    setIndexerList(sanitizedIndexerNames);
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

const query = (indexer) => `query StatusQuery($offset: Int, $limit: Int) {
  ${sanitizedAccountId}_${indexer}_sys_metadata(offset: $offset, limit: $limit) {
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
        const statuses = data[`${sanitizedAccountId}_${indexer}_sys_metadata`];
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

const rpcBlock = (finality) =>
  asyncFetch("https://rpc.mainnet.near.org", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "dontcare",
      method: "block",
      params: {
        finality,
      },
    }),
  });

const update = () => {
  rpcBlock("optimistic").then((res) => setLatestBlock(res.body.result.header.height));
  rpcBlock("final").then((res) => setLatestFinalBlock(res.body.result.header.height));
  if (indexerList) {
    indexerList.forEach((indexer) =>
      fetchGraphQL(
        query(indexer),
        "StatusQuery",
        {
          offset: 0,
          limit: 100,
        },
        sanitizedAccountId,
      ).then((result) => handleResults(indexer, result)),
    );
  }
};

if (!timer) {
  update();
  setTimer(setInterval(update, 1000));
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
          <TableElement bold>Latest Optimistic Block</TableElement>
          <TableElement>MAINNET</TableElement>
          <TableElement bold>{latestBlock}</TableElement>
        </tr>
        <tr>
          <TableElement bold>Latest Final Block</TableElement>
          <TableElement>MAINNET</TableElement>
          <TableElement bold>{latestFinalBlock}</TableElement>
        </tr>
        {Object.entries(statuses)
          .sort()
          .map(([indexer, status]) => (
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
      href={`https://cloud.hasura.io/public/graphiql?endpoint=https://near-queryapi.api.pagoda.co/v1/graphql&header=x-hasura-role%3A${sanitizedAccountId}`}
    >
      Explore Data
    </Link>
  </div>
);
