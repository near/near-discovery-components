const identifier = props.identifier;
const dbAction = props.dbAction || "discuss";
const moderatorAccount = props.moderatorAccount || "bosmod.near";
const composeWidget = props.composeWidget || "near/widget/NestedDiscussions.Compose";
const previewWidget = props.previewWidget || "near/widget/NestedDiscussions.Preview";
const notLoggedMessage = props.notLoggedMessage || "Please login to join the discussion";

if (!identifier) {
  return "[NestedDiscussions]: Please setup an identifier for the discussion";
}

const DiscussionContainer = styled.div`
  @media (max-width: 1200px) {
    > div:first-child {
      border-top: none;
    }
  }
`;

const ComposeWrapper = styled.div`
  border-top: 1px solid #ECEEF0;
  border-bottom: 1px solid #ECEEF0;
`;

const FeedWrapper = styled.div`
  .post {
    padding-left: 24px;
    padding-right: 24px;

    @media (max-width: 1200px) {
      padding-left: 12px;
      padding-right: 12px;
    }
  }
`;

return (
  <DiscussionContainer>
    {context.accountId ? (
      <ComposeWrapper>
        <Widget
          src={composeWidget}
          props={{ dbAction, identifier, previewWidget }}
        />
      </ComposeWrapper>
    ) : (
      <p> {notLoggedMessage} </p>
    )}
    <FeedWrapper>
      <Widget
        src="near/widget/NestedDiscussions.Feed"
        props={{
          dbAction,
          composeWidget,
          previewWidget,
          identifier,
          moderatorAccount,
        }}
      />
    </FeedWrapper>
  </DiscussionContainer>
);
