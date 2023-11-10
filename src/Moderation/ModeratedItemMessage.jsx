const moderationData = props.moderationData;
const accountId = props.accountId;
const blockHeight = props.blockHeight;
const contentTypeKey = props.contentTypeKey;
const moderationType = props.moderationType;

if (
  !moderationData ||
  moderationData.length > 0 ||
  !accountId ||
  !blockHeight ||
  !contentTypeKey ||
  !moderationType
) {
  return (
    <div className="alert alert-info mx-3" role="alert">
      Moderation message was not passed sufficient data. Properties are{" "}
      {JSON.stringify(props)}
    </div>
  );
}
const accountFound = moderationData[accountId];
if (typeof accountFound === "undefined") {
  return (
    <div className="alert alert-info mx-3" role="alert">
      Moderation message did not find matching account.
    </div>
  );
}

if (
  typeof accountFound === "string" ||
  typeof accountFound[""] !== "undefined"
) {
  const moderationAction =
    typeof accountFound === "string" ? accountFound : accountFound[""];
  const moderationLabel =
    typeof moderationAction === "string"
      ? moderationAction
      : moderationAction.label;
  return (
    <div className="alert alert-info mx-3" role="alert">
      {moderationType === "self"
        ? "You moderated content from this account. Moderation type: " +
          moderationLabel
        : "Content from this account has been moderated."}
    </div>
  );
}

const contentTypeLabels = {
  ".post.main": "Post",
  ".post.comment": "Comment",
};
const moderatedItem = accountFound[contentTypeKey];
if (moderatedItem && typeof moderatedItem[blockHeight] !== "undefined") {
  const contentLabel = contentTypeLabels[contentTypeKey] ?? contentTypeKey;
  const moderationAction = moderatedItem[blockHeight];
  const moderationLabel =
    typeof moderationAction === "string"
      ? moderationAction
      : moderationAction.label;
  return (
    <div className="alert alert-info mx-3" role="alert">
      {moderationType === "self"
        ? `You moderated this ${contentLabel}  with moderation type: ${moderationLabel}.`
        : `This ${contentLabel} has been moderated.`}
    </div>
  );
}

return (
  <div className="alert alert-info mx-3" role="alert">
    Moderation message did not find matching moderation data.
  </div>
);
