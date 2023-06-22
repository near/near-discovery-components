const accountId = props.accountId ?? context.accountId;

const homepage = accountId
  ? Social.get(`${accountId}/settings/near.social/homepage`)
  : undefined;

if (homepage === null) {
  return "Loading";
}
return <Widget src={homepage ?? "${ACCOUNT}/widget/ActivityPage"} />;
