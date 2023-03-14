const moderatorAccount = props?.moderatorAccount || "adminalpha.near";
State.init({ inputContent: "" });

const filterUserList = Social.get(
  `${moderatorAccount}/moderate/users`,
  "optimistic",
  {
    subscribe: true,
  }
);

const filtered = filterUserList ? JSON.parse(filterUserList) : [];
return (
  <div className="d-flex flex-column gap-5">
    <span>Admin: {moderatorAccount}</span>
    <table className="table">
      <th>Filtered users</th>
      <tbody>
        {filtered.map((f) => (
          <tr key={f}>
            <td>{f}</td>
            <td>
              <CommitButton
                className="btn btn-danger"
                data={{
                  moderate: {
                    users: filtered.filter((j) => j !== f),
                  },
                }}
              >
                <i className="bi bi-x" />
              </CommitButton>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="d-flex flex-row gap-2">
      <input
        type="text"
        value={state.inputContent}
        onChange={(e) => {
          State.update({ inputContent: e.target.value });
        }}
        placeholder="Comma-separated list of accounts"
      />
      <CommitButton
        data={{
          moderate: {
            users: filtered.concat(
              state.inputContent.split(",").map((i) => i.trim())
            ),
          },
        }}
        onCommit={() => {
          State.update({ inputContent: "" });
        }}
      >
        Add to filter
      </CommitButton>
    </div>
    <span style={{ color: "grey" }}>
      When saving, ensure data is being written to moderator key. You may need
      to refresh your browser if you used "Pretend to be another account" while
      on this page
    </span>
  </div>
);
