const listName = props?.listName;
const managerAccount = props?.managerAccount;
const isManager = managerAccount === context.accountId;

if (!managerAccount || !listName) {
  return <>Missing props.managerAccount props.listName</>;
}

State.init({ inputContent: "" });

const socialDbKey = `${managerAccount}/listManager/${listName}`;
const itemsRes = Social.get(socialDbKey, "optimistic", {
  subscribe: true,
});

const items = itemsRes ? JSON.parse(itemsRes) : [];

return (
  <div className="d-flex flex-column gap-5">
    <div className="d-flex flex-column gap-1">
      <span>
        <strong>List:</strong> {listName}
      </span>
      <span>
        <strong>Manager account:</strong> {managerAccount}
      </span>
      <span>
        <strong>SocialDB Key:</strong> {socialDbKey}
      </span>
    </div>
    <table className="table">
      <th>Items</th>
      <tbody>
        {items.length ? (
          items.map((f) => (
            <tr key={f}>
              <td>{f}</td>
              {isManager && (
                <td>
                  <CommitButton
                    className="btn btn-danger"
                    data={{
                      listManager: {
                        [listName]: items.filter((j) => j !== f),
                      },
                    }}
                  >
                    <i className="bi bi-x" />
                  </CommitButton>
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <i>No items</i>
          </tr>
        )}
      </tbody>
    </table>
    {isManager && (
      <div className="d-flex flex-row gap-2">
        <input
          type="text"
          value={state.inputContent}
          onChange={(e) => {
            State.update({ inputContent: e.target.value });
          }}
          placeholder="Comma-separated list of items (no spaces between)"
        />
        <CommitButton
          data={{
            listManager: {
              [listName]: items.concat(
                state.inputContent.split(",").map((i) => i.trim()),
              ),
            },
          }}
          onCommit={() => {
            State.update({ inputContent: "" });
          }}
        >
          Add to list
        </CommitButton>
        <CommitButton
          data={{
            listManager: {
              [listName]: state.inputContent.split(",").map((i) => i.trim()),
            },
          }}
          onCommit={() => {
            State.update({ inputContent: "" });
          }}
        >
          Replace list
        </CommitButton>
      </div>
    )}
    <span style={{ color: "grey" }}>
      To change ordering, use the Replace List functionality with the full contents
      of the newly ordered list
    </span>
  </div>
);
