// TODO: Use Radix popover to avoid having to set state?

const accountId = props.accountId;
const profile = props.profile || Social.get(`${accountId}/profile/**`, "final");
const tags = Object.keys(profile.tags || {});
const profileUrl = `/${REPL_ACCOUNT}/widget/ProfilePage?accountId=${accountId}`;
const verifications = props.verifications;
const overlayStyles = props.overlayStyles;
const side = props.side ?? "top";

const [hasBeenFlagged, setHasBeenFlagged] = useState(false);
const [showConfirmModal, setShowConfirmModal] = useState(false);

const onReport = () => {
  setShowConfirmModal(false);
  setHasBeenFlagged(true);
};

const onReportCancel = () => {
  setShowConfirmModal(false);
  setHasBeenFlagged(false);
};

const Wrapper = styled.span`
  display: ${props.inline ? "inline-flex" : "flex"};
  vertical-align: ${props.inline ? "baseline" : ""};
  max-width: 100%;
  white-space: normal;
`;

const TriggerWrapper = styled.span`
  display: ${props.inline ? "inline-flex" : "flex"};
  vertical-align: ${props.inline ? "baseline" : ""};
  max-width: 100%;
  white-space: normal;
`;

const HoverCardContent = styled("HoverCard.Content")`
  animation: fadeIn 200ms 100ms forwards;
  opacity: 0;
  pointer-events: none;
  z-index: 1001;

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
      pointer-events: auto;
    }
  }
`;

const FlaggedWrapper = styled.div`
  position: absolute;
`;

const AvatarCount = styled.div`
  color: rgb(104, 112, 118);
  font-size: 14px;
  font-weight: 300;
  padding-left: 12px;
`;

const CardWrapper = styled.div`
  z-index: 100;
  padding: 6px;
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
`;

const FollowButtonWrapper = styled.div`
  width: 100%;

  div,
  button {
    width: 100%;
  }
`;

const VerificationText = styled.div`
  display: inline;
  position: relative;
  top: 1px;
  font-size: 14px;
  color: ${(props) => (props.secondary ? "#717069" : "black")};
`;

const RecommendedAvatars = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px 0 0;
`;

const OverlayTagsWrapper = styled.div`
  margin-left: 50px;
`;

const contentModerationItem = {
  type: "social",
  path: profileUrl,
  reportedBy: context.accountId,
};

const overlay = (
  <CardWrapper style={overlayStyles}>
    <Card>
      <div className="d-flex align-items-center">
        {props.sidebar && (
          <Widget
            src="${REPL_ACCOUNT}/widget/Recommender.Account.AccountProfileSidebar"
            props={{
              accountId: props.accountId,
              profile,
              noOverlay: true,
            }}
          />
        )}
        {!props.sidebar && (
          <Widget
            src="${REPL_ACCOUNT}/widget/AccountProfile"
            props={{ accountId: props.accountId, profile, noOverlay: true }}
          />
        )}
        {!props.showFlagAccountFeature && !!context.accountId && context.accountId !== props.accountId && (
          <Widget
            src="${REPL_ACCOUNT}/widget/FlagButton"
            props={{
              item: contentModerationItem,
              onFlag: () => {
                setHasBeenFlagged(true);
              },
            }}
          />
        )}
        {props.showFlagAccountFeature && !!context.accountId && context.accountId !== props.accountId && (
          <Widget
            src="${REPL_ACCOUNT}/widget/Flagged.Trigger"
            props={{
              onClick: () => {
                setShowConfirmModal(true);
              },
            }}
          />
        )}
      </div>

      {verifications && (
        <Widget src="${REPL_ACCOUNT}/widget/ProfilePage.ProfileBadges" props={{ accountId, verifications }} />
      )}

      {props.scope === "friends" ? (
        <OverlayTagsWrapper>
          <Widget className="layout" src="${REPL_ACCOUNT}/widget/Tags" props={{ tags, scroll: true }} />
          <RecommendedAvatars>
            <Widget
              src="${REPL_ACCOUNT}/widget/Recommender.Views.RecommendedAvatars"
              props={{
                avatarSize: "25px",
                becauseYouFollow: props.becauseYouFollow,
              }}
            />
            <AvatarCount>{props.becauseYouFollow.length} friends following</AvatarCount>
          </RecommendedAvatars>
        </OverlayTagsWrapper>
      ) : (
        <Widget src="${REPL_ACCOUNT}/widget/Tags" props={{ tags, scroll: true }} />
      )}

      {!!context.accountId && context.accountId !== props.accountId && (
        <FollowButtonWrapper>
          {props.sidebar && (
            <Widget
              src="${REPL_ACCOUNT}/widget/Recommender.Engagement.FollowButtonTracked"
              props={{
                accountIdRank: props.accountIdRank || null,
                accountId: accountId || props.accountId,
                fromContext: props.fromContext,
                onFollowed: props.onFollowed,
              }}
            />
          )}
          {!props.sidebar && (
            <Widget src="${REPL_ACCOUNT}/widget/FollowButton" props={{ accountId: props.accountId }} />
          )}
        </FollowButtonWrapper>
      )}
    </Card>
  </CardWrapper>
);

return (
  <Wrapper>
    <HoverCard.Root openDelay={200} closeDelay={300}>
      <HoverCard.Trigger asChild>
        <TriggerWrapper>{props.children || "Hover Me"}</TriggerWrapper>
      </HoverCard.Trigger>

      <HoverCardContent side={side} sideOffset={3}>
        {overlay}
      </HoverCardContent>
    </HoverCard.Root>

    <FlaggedWrapper>
      <Widget
        src="${REPL_ACCOUNT}/widget/DIG.Toast"
        props={{
          type: "info",
          title: "Flagged for moderation",
          description: "Thanks for helping our Content Moderators. The item you flagged will be reviewed.",
          open: hasBeenFlagged,
          onOpenChange: () => {
            setHasBeenFlagged(false);
          },
          duration: 5000,
        }}
      />

      <Widget
        src="${REPL_ACCOUNT}/widget/Flagged.Modal"
        props={{
          open: showConfirmModal,
          reportedAccountId: props.accountId,
          contentModerationFlagValue: contentModerationItem,
          onReport,
          onReportCancel,
        }}
      />
    </FlaggedWrapper>
  </Wrapper>
);
