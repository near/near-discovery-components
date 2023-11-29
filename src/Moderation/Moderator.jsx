const Instructions = styled.div`
  width: 70%;
  color: #555;
`;
const Wrapper = styled.div`
  display: grid;
  gap: 40px;
  grid-template-columns: 264px minmax(0, 1fr);
  align-items: start;
  height: 100%;
`;

const activeTab = Storage.get("moderator-tab") || "overview";
if (props.tab && props.tab !== activeTab) {
  State.update({
    activeTab: props.tab,
  });
}

const moderatorAccount = props?.moderatorAccount || "${REPL_MODERATOR}";
const moderationStream = props.moderationStream || moderatorAccount;
const group = "near.org";

function overview() {
  return (
    <div>
      <h4 style={{ textAlign: "left" }}>Overview</h4>
      <Instructions>
        <p>Welcome to Moderation for Group: {group}</p>
        {context.accountId === moderatorAccount ? (
          <p>
            <span style={{ fontWeight: "bold" }}>{moderatorAccount}</span> you are a
            Moderator of this group.
          </p>
        ) : (
          <>
            <p>{context.accountId} you are NOT a moderator of this group.</p>
            <p style={{ color: "grey", float: left, paddingRight: "2em" }}>
              When saving, ensure data is being written to moderator key. You may
              need to refresh your browser if you used "Pretend to be another
              account" while on this page
            </p>
          </>
        )}
        <div style={{ paddingLeft: "2em" }}>
          <p>
            Moderating a post or comment will prevent users other than the posting
            user from seeing it in near widgets (ones where the path starts with
            /near/widget).
          </p>
          <p>
            Moderating an account will apply moderation to all posts and comments
            made by that account.
          </p>
        </div>
        <p>
          The Flagged Feed (in Needs Moderation) is being phased out in favor of the
          new reporting options and data. While widgets transition, some items may be
          Flagged instead of Reported. These items can still be reviewed and manually
          moderated (using the controls in the Previously Moderated section).
        </p>
      </Instructions>
    </div>
  );
}

function needsModeration() {
  return (
    <div>
      <h4 style={{ textAlign: "left" }}>Needs Moderation</h4>
      <Widget
        src="near/widget/DIG.Tabs"
        props={{
          variant: "line",
          size: "large",
          defaultValue: "needsModeration",
          items: [
            {
              name: "Reported",
              value: "needsModeration",
              content: (
                <Widget src="${REPL_ACCOUNT}/widget/Moderation.NeedsModeration" />
              ),
              icon: "ph ph-warning-octagon",
            },
            {
              name: "Flagged Posts (being phased out)",
              value: "flaggedPosts",
              content: <Widget src="${REPL_ACCOUNT}/widget/Flagged.Feed" />,
              icon: "ph ph-flag",
            },
          ],
        }}
      />
    </div>
  );
}

function previouslyModerated() {
  return (
    <div>
      <h4 style={{ textAlign: "left" }}>Previously Moderated</h4>
      <Widget
        src="near/widget/DIG.Tabs"
        props={{
          variant: "line",
          size: "large",
          defaultValue: "moderatedAccounts",
          items: [
            {
              name: "Moderated Accounts",
              value: "moderatedAccounts",
              content: (
                <Widget
                  src="${REPL_ACCOUNT}/widget/Moderation.ModerateAccounts"
                  props={{ moderatorAccount, moderationStream }}
                />
              ),
              icon: "ph ph-browser",
            },
            {
              name: "Moderated Posts",
              value: "moderatedPosts",
              content: (
                <Widget
                  src="${REPL_ACCOUNT}/widget/Moderation.ModeratePosts"
                  props={{ moderatorAccount, moderationStream }}
                />
              ),
              icon: "ph ph-browser",
            },
            {
              name: "Moderated Comments",
              value: "moderatedComments",
              content: (
                <Widget
                  src="${REPL_ACCOUNT}/widget/Moderation.ModerateComments"
                  props={{ moderatorAccount, moderationStream }}
                />
              ),
              icon: "ph ph-browser",
            },
          ],
        }}
      />
    </div>
  );
}

const renderContent = () => {
  switch (activeTab) {
    case "overview":
      return overview();
    case "needsModeration":
      return needsModeration();
    case "previouslyModerated":
      return previouslyModerated();
    default:
      return null;
  }
};

const handleMenuClick = (value) => {
  Storage.set("moderator-tab", value);
};
return (
  <>
    <div className="d-flex flex-column gap-5">
      <Wrapper>
        <Widget
          src={`${REPL_ACCOUNT}/widget/Moderation.Sidebar`}
          props={{
            title: "Moderation",
            activeTab,
            items: [
              {
                name: "Overview",
                value: "overview",
                icon: "ph ph-flower-lotus",
                onSelect: () => {
                  handleMenuClick("overview");
                },
              },
              {
                name: "Needs Moderation",
                value: "needsModeration",
                count: "12",
                icon: "ph ph-warning-octagon",
                onSelect: () => {
                  handleMenuClick("needsModeration");
                },
              },
              {
                name: "Previously Moderated",
                value: "previouslyModerated",
                count: "12",
                icon: "ph ph-list-checks",
                onSelect: () => {
                  handleMenuClick("previouslyModerated");
                },
              },
            ],
          }}
        />
        {renderContent()}
      </Wrapper>
    </div>
  </>
);
