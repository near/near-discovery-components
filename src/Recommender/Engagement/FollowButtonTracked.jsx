State.init({
  clicked: false,
});

return (
  <div>
    <Widget
      src="${REPL_ACCOUNT}/widget/Recommender.Service.EngagementTracker"
      props={{
        accountId: props.accountId,
        accountIdRank: props.accountIdRank,
        fromContext: props.fromContext,
        event: "Profile Followed | Clicked on Follow Button",
        onClick: state.clicked,
      }}
    />
    <Widget
      src="${REPL_ACCOUNT}/widget/FollowButton"
      props={{
        accountId: props.accountId,
        onCommit: () => {
          props.onFollowed();
        },
        onClick: () => {
          State.update({ clicked: true });
        },
      }}
    />
  </div>
);
