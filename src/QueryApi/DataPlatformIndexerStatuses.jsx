const GRAPHQL_ENDPOINT = props.GRAPHQL_ENDPOINT || "https://near-queryapi.api.pagoda.co";

const indexerAccount = props.indexerAccount || "dataplatform.near";
const indexerFilter = props.indexerFilter || null;
const fullFilter = indexerFilter ? indexerAccount + "/" + indexerFilter : indexerAccount;

const [statuses, setIndexerStatuses] = useState([]);
const [errors, setErrors] = useState("");
function fetchGraphQL(operationsDoc, operationName, variables) {
  return asyncFetch(`${GRAPHQL_ENDPOINT}/v1/graphql`, {
    method: "POST",
    headers: { "x-hasura-role": "append" },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });
}
const query = `query MyQuery {
  indexer_state(where: {function_name: {_like: "${fullFilter}%"}}) {
    current_historical_block_height
    status
    current_block_height
    function_name
  }
}`;
fetchGraphQL(query).then((result) => {
  if (result.status === 200 && result.body) {
    if (result.body.errors) {
      setErrors(result.body.errors);
      return;
    }
    let data = result.body.data;
    if (data) {
      const statuses = data.indexer_state;
      if (statuses.length > 0) {
        setIndexerStatuses(statuses);
      }
    }
  }
});

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
          <TableHeader>Current Historical Block Height</TableHeader>
        </tr>
      </thead>
      <tbody>
        {statuses.map((status) => (
          <tr key={status.function_name}>
            <TableElement>{status.function_name?.split("/")[1]}</TableElement>
            <TableElement>
              <span style={{ color: status.status === "RUNNING" ? "green" : "red" }}>{status.status}</span>
            </TableElement>
            <TableElement>{status.current_block_height}</TableElement>
            <TableElement>{status.current_historical_block_height}</TableElement>
          </tr>
        ))}
      </tbody>
    </StatusTable>

    <div>{errors}</div>
  </div>
);
