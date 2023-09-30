const handleClick = () => {
  State.update({ clicked: true });
};

State.init({
  clicked: false,
});

const Text = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: ${(p) => (p.bold ? "#11181C" : "#687076")};
  font-weight: ${(p) => (p.bold ? "600" : "400")};
  font-size: ${(p) => (p.small ? "10px" : "14px")};
  overflow: ${(p) => (p.ellipsis ? "hidden" : "")};
  text-overflow: ${(p) => (p.ellipsis ? "ellipsis" : "")};
  white-space: nowrap;
`;

return (
  <div onClick={handleClick}>
    <Widget
      src="${REPL_ACCOUNT}/widget/Recommender.Service.EngagementTracker"
      props={{
        accountId: props.accountId,
        accountIdRank: props.accountIdRank,
        fromContext: props.fromContext,
        event: "Profile Followed | Clicked on Profile Name",
        onClick: state.clicked,
      }}
    />
    <Text ellipsis bold>
      {props.profileName}
    </Text>

    {props.inlineContent}

        {props.blockHeight && (
          <Text small style={{ marginLeft: "auto" }}>
            Joined{" "}
            <Widget
              src="${REPL_MOB_2}/widget/TimeAgo${REPL_TIME_AGO_VERSION}"
              props={{ blockHeight: props.blockHeight }}
            />{" "}
            ago
          </Text>
        )}

        {props.scope == "friends" && props.becauseYouFollow.length > 0 && (
          <>
            <AvatarCount className="hover-state1">
              <Widget
                src="${REPL_ACCOUNT}/widget/Recommender.Views.RecommendedAvatars"
                props={{
                  avatarSize: "25px",
                  becauseYouFollow: props.becauseYouFollow,
                }}
              />
            </AvatarCount>
            <AvatarCount className="hover-state2">
              {props.becauseYouFollow.length} friends follow
            </AvatarCount>
          </>
        )}

        {props.scope == "similar" && (
          <AvatarCount>Shared interests</AvatarCount>
        )}
  </div>
);
