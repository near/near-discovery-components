// noinspection JSAnnotator

const moderatorAccount = props?.moderatorAccount || "${REPL_MODERATOR}";
const objectPath = "/post/main";
const moderationStream = (props.moderationStream || moderatorAccount) + objectPath;

State.init({
  accountInput: "",
  blockInput: "",
});

function blockPost(accountId, blockHeight) {
  const account = accountId.trim();
  const block = blockHeight.trim();

  return JSON.stringify({
    key: moderationStream,
    value: {
      path: `${account}${objectPath}`,
      blockHeight: parseInt(block),
      label: "moderate",
    },
  });
}

function unblockPost(accountId, blockHeight) {
  return JSON.stringify({
    key: moderationStream,
    value: {
      path: `${accountId}${objectPath}`,
      blockHeight: parseInt(blockHeight),
      label: null,
      operation: "delete",
    },
  });
}

const moderatedObjectsRaw = context.accountId
  ? Social.index("moderate", moderationStream, {
      subscribe: true,
      order: "desc",
    }) ?? []
  : [];
const moderatedObjects = moderatedObjectsRaw.filter((f) => f.accountId === moderatorAccount);
const modifiedModerations = {}; // track update & delete operations

return (
  <>
    {context.accountId && context.accountId === moderatorAccount && (
      <div className="d-flex flex-row gap-2 mb-5">
        <span>Manual moderation:</span>
        <input
          type="text"
          value={state.accountInput}
          onChange={(e) => {
            State.update({
              accountInput: e.target.value,
            });
          }}
          placeholder="The account of the post to moderate"
        />
        <input
          type="text"
          value={state.blockInput}
          onChange={(e) => {
            State.update({
              blockInput: e.target.value,
            });
          }}
          placeholder="The block height of the post to moderate"
        />

        <CommitButton
          force
          data={{
            index: {
              moderate: blockPost(state.accountInput, state.blockInput),
            },
          }}
          onCommit={() => {
            State.update({ accountInput: "", blockInput: "" });
          }}
        >
          Moderate
        </CommitButton>
      </div>
    )}
    <h3>Moderated (blocked) Posts</h3>
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
            if (!account) {
              return;
            }
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
              const label = mod && mod.operation === "update" ? mod.label : f.value.label;
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
                          moderate: unblockPost(account, block),
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
