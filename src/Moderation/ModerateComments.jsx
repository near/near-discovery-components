// noinspection JSAnnotator

const moderatorAccount = props?.moderatorAccount || "${REPL_MODERATOR}";
const objectPath = "/post/comment";
const moderationStream =
  (props.moderationStream || moderatorAccount) + objectPath;

State.init({
  accountInput: "",
  blockInput: "",
});

function blockComment(accountId, blockHeight) {
  const account = accountId.trim();
  const block = blockHeight.trim();

  return JSON.stringify({
    key: moderationStream,
    value: {
      path: `${account}${objectPath}`,
      blockHeight: block,
      label: "moderate",
    },
  });
}

function unblockComment(accountId, blockHeight) {
  return JSON.stringify({
    key: moderationStream,
    value: {
      path: `${accountId}${objectPath}`,
      blockHeight: blockHeight,
      label: null,
      operation: "delete",
    },
  });
}

const moderatedObjects = context.accountId
  ? Social.index("moderate", moderationStream, {
      subscribe: true,
      order: "desc",
    })
  : // .filter((f) => f.accountId === moderatorAccount)
    [];
const modifiedModerations = {}; // track update & delete operations

return (
  <>
    <div className="d-flex flex-row gap-2 mb-5">
      <span style={{ color: "grey", float: left, paddingRight: "2em" }}>
        When saving, ensure data is being written to moderator key. You may need
        to refresh your browser if you used "Pretend to be another account"
        while on this page
      </span>
      <input
        type="text"
        value={state.accountInput}
        onChange={(e) => {
          State.update({
            accountInput: e.target.value,
          });
        }}
        placeholder="The account of the comment to moderate"
      />
      <input
        type="text"
        value={state.blockInput}
        onChange={(e) => {
          State.update({
            blockInput: e.target.value,
          });
        }}
        placeholder="The block height of the comment to moderate"
      />

      <CommitButton
        force
        data={{
          index: {
            moderate: blockComment(state.accountInput, state.blockInput),
          },
        }}
        onCommit={() => {
          State.update({ accountInput: "", blockInput: "" });
        }}
      >
        Add to filter
      </CommitButton>
    </div>
    <h3>Moderated (blocked) Comments</h3>
    <table className="table">
      <th>Account</th>
      <th>Block Height</th>
      <th>Reason</th>
      <th>Clear moderation</th>
      <tbody>
        {moderatedObjects &&
          moderatedObjects.map((f) => {
            if (!f || !f.value || !f.value.path || !f.value.blockHeight) {
              return;
            }

            const account = f.value.path.split("/")[0];
            const block = f.value.blockHeight;
            const key = `${account}@${block}`;
            const mod = modifiedModerations[key];
            if (mod && mod.operation === "delete") {
              return;
            }

            if (f.value.operation) {
              modifiedModerations[key] = {
                operation: f.value.operation,
                label: f.value.label,
              };
            } else {
              const label =
                mod && mod.operation === "update" ? mod.label : f.value.label;
              return (
                <tr key={account}>
                  <td>{account}</td>
                  <td>{block}</td>
                  <td>{label}</td>
                  <td>
                    <CommitButton
                      className="btn btn-danger"
                      data={{
                        index: {
                          moderate: unblockComment(account, block),
                        },
                      }}
                    >
                      <i className="bi bi-x" />
                    </CommitButton>
                  </td>
                </tr>
              );
            }
          })}
      </tbody>
    </table>
  </>
);
