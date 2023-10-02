const handleClick = () => {
  State.update({ clicked: true });
};

State.init({
  clicked: false,
});

const Wrapper = styled.a`
  text-decoration: none !important;

  .solid-state {
    position: absolute;
    margin-right: 26px;
    right: 0;
  }

  .hover-state1 {
    position: absolute;
    right: 0;
    margin-right: 26px;
    opacity: 0;
  }

  .hover-state2 {
    position: absolute;
    right: 0;
    margin-right: 26px;
    opacity: 1;
  }

  &:hover,
  &:focus {
    div.hover {
      border-color: #d0d5dd;
    }
    .hover-state1 {
      opacity: 1;
      transition: opacity 0.3s ease;
    }
    .hover-state2 {
      opacity: 0;
      transition: opacity 0.3s ease;
    }
  }
`;

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
  width: ${props.scope ? "100px" : "170px"};
`;

const AvatarCount = styled.div`
  color: rgb(104, 112, 118);
  font-size: 14px;
  font-weight: 300;
  padding-left: 12px;
`;

return (
  <div
    onClick={handleClick}
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
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

    {props.scope == "friends" && props.becauseYouFollow.length > 0 && (
      <Wrapper>
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
      </Wrapper>
    )}
    {props.scope == "similar" && (
      <Wrapper>
        <AvatarCount className="solid-state">Shared interests</AvatarCount>
      </Wrapper>
    )}

    <Text ellipsis bold>
      {props.profileName}
    </Text>

    <Text ellipsis>@{props.accountId}</Text>
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
  </div>
);
