const accountId = props.accountId;
const profile = props.profile || Social.get(`${accountId}/profile/**`, "final");
const tags = Object.keys(profile.tags || {});
const profileUrl = `#/${REPL_ACCOUNT}/widget/ProfilePage?accountId=${accountId}`;

const handleOnMouseEnter = () => {
  State.update({ show: true });
};
const handleOnMouseLeave = () => {
  State.update({ show: false });
};

State.init({
  show: false,
  hasBeenFlagged: false,
});

const CardWrapper = styled.div`
  z-index: 100;
  padding: 6px;
`;

const OverlayTagsWrapper = styled.div`
  margin-left: 50px;
`;

const AvatarCount = styled.div`
  color: rgb(104, 112, 118);
  font-size: 14px;
  font-weight: 300;
  padding-left: 12px;
`;

const RecommendedAvatars = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px 0 0;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  gap: 12px;
  width: 275px;
  border-radius: 12px;
  z-index: 1070;
  background: #fff;
  border: 1px solid #eceef0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  padding: 12px;

  div.layout {
    margin-left: 63px;
  }
`;

const FollowButtonWrapper = styled.div`
  width: 100%;
  div,
  button {
    width: 100%;
  }
`;

const contentModerationItem = {
  type: "social",
  path: profileUrl,
  reportedBy: context.accountId,
};

const handleFollow = (userId) => {
  console.log("remove from list, because followed:", userId);
  // callback function
  // removeListProfileOnFollow(userId);
};

const overlay = (
  <CardWrapper>
    <Card onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave}>
      <div className="d-flex align-items-center">
        <Widget
          src="${REPL_ACCOUNT}/widget/AccountProfile"
          props={{ accountId: props.accountId, profile, noOverlay: true }}
        />
        {!!context.accountId && context.accountId !== props.accountId && (
          <Widget
            src="${REPL_ACCOUNT}/widget/FlagButton"
            props={{
              item: contentModerationItem,
              onFlag: () => {
                State.update({ hasBeenFlagged: true });
              },
            }}
          />
        )}
      </div>

      {props.scope === "friends" ? (
        <OverlayTagsWrapper>
          <Widget
            className="layout"
            src="${REPL_ACCOUNT}/widget/Tags"
            props={{ tags, scroll: true }}
          />
          <RecommendedAvatars>
            <Widget
              src="${REPL_ACCOUNT}/widget/Recommender.Views.RecommendedAvatars"
              props={{
                avatarSize: "25px",
                becauseYouFollow: props.becauseYouFollow,
              }}
            />
            <AvatarCount>
              {props.becauseYouFollow.length} friends following
            </AvatarCount>
          </RecommendedAvatars>
        </OverlayTagsWrapper>
      ) : (
        <Widget
          src="${REPL_ACCOUNT}/widget/Tags"
          props={{ tags, scroll: true }}
        />
      )}

      {!!context.accountId && context.accountId !== props.accountId && (
        <FollowButtonWrapper>
          <Widget
            src="${REPL_ACCOUNT}/widget/FollowButton"
            props={{
              accountId: props.accountId,
              onClick: handleFollow(props.accountId),
            }}
          />
        </FollowButtonWrapper>
      )}
    </Card>
  </CardWrapper>
);

return (
  <OverlayTrigger
    show={state.show}
    trigger={["hover", "focus"]}
    delay={{ show: 250, hide: 300 }}
    placement={props.placement || "auto"}
    overlay={overlay}
  >
    <div
      className={props.inline ? "d-inline-flex" : ""}
      style={{
        verticalAlign: props.inline ? "baseline" : "",
        maxWidth: "100%",
      }}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
    >
      {props.children || "Hover Me"}

      {state.hasBeenFlagged && (
        <Widget
          src={`${REPL_ACCOUNT}/widget/DIG.Toast`}
          props={{
            type: "info",
            title: "Flagged for moderation",
            description:
              "Thanks for helping our Content Moderators. The item you flagged will be reviewed.",
            open: state.hasBeenFlagged,
            onOpenChange: (open) => {
              State.update({ hasBeenFlagged: open });
            },
            duration: 10000,
          }}
        />
      )}
    </div>
  </OverlayTrigger>
);
