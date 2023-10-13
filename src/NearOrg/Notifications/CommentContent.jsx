const accountId = props.accountId;
const blockHeight = parseInt(props.blockHeight);
const content =
  props.content ??
  JSON.parse(Social.get(`${accountId}/post/comment`, blockHeight) ?? "null");
const highlight = !!props.highlight;
const raw = !!props.raw;
const groupId = props.groupId;
const groupIdLinkPart = groupId ? `&groupId=${groupId}` : "";
const permissions = props.permissions;

const extractNotifyAccountId = (item) => {
  if (!item || item.type !== "social" || !item.path) {
    return undefined;
  }
  const accountId = item.path.split("/")[0];
  return `${accountId}/post/main` === item.path ? accountId : undefined;
};

const link = `${REPL_ACCOUNT}/widget/NearOrg.Notifications.CommentPost?accountId=${accountId}&blockHeight=${blockHeight}${groupIdLinkPart}`;

const item = {
  type: "social",
  path: `${accountId}/post/comment`,
  blockHeight,
};

return (
  <>
    <div className={`post ${highlight ? "bg-warning bg-opacity-10" : ""}`}>
      <div className="left">
        <Widget
          loading=""
          src="${REPL_MOB}/widget/MainPage.N.Post.Left"
          props={{ accountId }}
        />
      </div>
      <div className="right">
        <Widget
          loading={
            <div
              className="overflow-hidden w-100 placeholder-glow"
              style={{ minHeight: "100px" }}
            />
          }
          src="${REPL_MOB}/widget/MainPage.N.Post.Content"
          props={{ content, raw }}
        />
        <div className="buttons d-flex justify-content-between">
          <Widget
            loading=""
            src="${REPL_ACCOUNT}/widget/v1.LikeButton"
            props={{
              notifyAccountId,
              item,
            }}
          />
        </div>
      </div>
    </div>
  </>
);
