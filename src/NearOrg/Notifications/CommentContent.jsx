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
    {
      <Widget
        loading=""
        src="${REPL_ACCOUNT}/widget/Comments.Comment"
        props={{ accountId, blockHeight: item.blockHeight }}
      />
    }
  </>
);
