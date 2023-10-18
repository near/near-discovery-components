const handleClick = () => {
  State.update({ clicked: true });
};

State.init({
  clicked: false,
});

const image =
  typeof props.profileImage === "string"
    ? props.profileImage.indexOf("http") === 0
      ? { url: props.profileImage }
      : { ipfs_cid: props.profileImage }
    : props.profileImage;

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
        image,
        alt: props.profileImageAlt,
        fallbackUrl:
          "https://ipfs.near.social/ipfs/bafkreibiyqabm3kl24gcb2oegb7pmwdi6wwrpui62iwb44l7uomnn3lhbi",
      }}
    />
  </div>
);
