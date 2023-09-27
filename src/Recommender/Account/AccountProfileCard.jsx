const accountId = props.accountId;
const profile = props.profile || Social.get(`${accountId}/profile/**`, "final");
const tags = Object.keys(profile.tags || {});
const profileUrl = `#/near/widget/ProfilePage?accountId=${accountId}`;

State.init({
  isHovered: false,
});

return (
  <>
    {props.sidebar ? (
      <Widget
        src="${REPL_ACCOUNT}/widget/Recommender.Account.AccountProfile"
        props={{
          accountId: props.accountId,
          sidebar: props.sidebar || null,
          followsYou: props.followsYou || null,
          becauseYouFollow: props.becauseYouFollow || null,
          likers: props.likers || null,
          followers: props.followers || null,
          following: props.following || null,
          profileImage: props.profileImage || null,
          profileName: props.profileName || null,
          scope: props.scope || null,
          overlayPlacement: "auto", //"left",
        }}
      />
    ) : (
      <Widget
        src="${REPL_ACCOUNT}/widget/Recommender.Account.AccountProfileLargeCard"
        props={{
          accountId: props.accountId,
          sidebar: props.sidebar || null,
          followsYou: props.followsYou || null,
          becauseYouFollow: props.becauseYouFollow || null,
          likers: props.likers || null,
          followers: props.followers || null,
          following: props.following || null,
          profileImage: props.profileImage || null,
          profileName: props.profileName || null,
          scope: props.scope || null,
        }}
      />
    )}
  </>
);
