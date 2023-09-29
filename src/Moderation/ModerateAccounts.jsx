// noinspection JSAnnotator

const moderatorAccount = props?.moderatorAccount || "${REPL_MODERATOR}";
const moderationStream = props.moderationStream || moderatorAccount;

State.init({
    inputContent: ""
});

function blockAccounts(input) {
    let accountIds = input.split(",").map((a) => a.trim());

    return accountIds.map((accountId) =>
        ({key: moderationStream, value: {path: accountId, label: 'moderate'}}), []);
}

function unblockAccount(accountId) {
    return JSON.stringify({key: moderationStream, value: {path: accountId, label: null, operation: 'delete'}});
}

const moderatedObjects = context.accountId
    ? Social.index("moderate", moderationStream, {subscribe: true, order: 'desc'})
        .filter((f) => f.accountId === moderatorAccount)
    : [];
const modifiedModerations = {}; // track update & delete operations

return (
    <>
        <div className="d-flex flex-row gap-2 mb-5">
        <span style={{color: "grey", float: left, paddingRight: '2em'}}>
          When saving, ensure data is being written to moderator key. You may need
          to refresh your browser if you used "Pretend to be another account" while
          on this page
        </span>
            <input
                type="text"
                value={state.inputContent}
                onChange={(e) => {
                    State.update({
                        inputContent: e.target.value,
                    });
                }}
                placeholder="Comma-separated list of accounts"
            />
            <CommitButton
                force
                data={ {index: {moderate: blockAccounts(state.inputContent)} } }
                onCommit={() => {
                    State.update({inputContent: ""});
                }}
            >
                Add to filter
            </CommitButton>

        </div>
        <h3>Moderated (blocked) Accounts</h3>
        <table className="table">
            <th>Account</th>
            <th>Reason</th>
            <th>Clear moderation</th>
            <tbody>
            {moderatedObjects && moderatedObjects.map((f) => {
                if(!f || !f.value || !f.value.path) {
                    return
                }

                const account = f.value.path;
                const mod = modifiedModerations[account];
                if(mod && mod.operation === 'delete') {
                    return;
                }

                // todo account for longer sequences of operations
                if(f.value.operation) {
                    modifiedModerations[account] = {operation: f.value.operation, label: f.value.label};
                } else {
                    const label = mod && mod.operation === 'update' ? mod.label : f.value.label;
                    return (
                        <tr key={account}>
                            <td>{account}</td>
                            <td>{label}</td>
                            <td>
                                <CommitButton
                                    className="btn btn-danger"
                                    data={{
                                        index: {
                                            moderate: unblockAccount(account),
                                        }
                                    }}
                                >
                                    <i className="bi bi-x"/>
                                </CommitButton>
                            </td>
                        </tr>
                    )}})}
            </tbody>
        </table>

    </>
);