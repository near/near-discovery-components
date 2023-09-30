const handleClick = () => {
  State.update({ clicked: true });
};

State.init({
  clicked: false,
});

return (
  <div onClick={handleClick}>
    <Widget
      src="${REPL_ACCOUNT}/widget/Recommender.Service.EngagementTracker"
      props={{
        accountId: props.accountId,
        accountIdRank: props.accountIdRank,
        fromContext: props.fromContext,
        event: "Profile Interest | Clicked on Avatar Image",
        onClick: state.clicked,
      }}
    />
      <Widget
        src="${REPL_MOB}/widget/Image"
        props={{
          image: props.profileImage,
          alt: props.profileImageAlt,
          fallbackUrl:
            "https://ipfs.near.social/ipfs/bafkreibiyqabm3kl24gcb2oegb7pmwdi6wwrpui62iwb44l7uomnn3lhbi",
        }}
      />
  </div>
);