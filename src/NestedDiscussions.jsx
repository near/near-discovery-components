const identifier = props.identifier;
const notifyAccountId = props.notifyAccountId;
const highlightComment = props.highlightComment;
const moderatorAccount = props.moderatorAccount || "${REPL_MODERATOR}";
const placeholder = props.placeholder || "Join the discussion";

// discussions happen inside other components
const parentComponent = props.parentComponent;
const parentParams = { ...props.parentParams };

if (!identifier) {
  return "[NestedDiscussions]: Please setup an identifier for the discussion";
}

const DiscussionContainer = styled.div`
  @media (max-width: 1024px) {
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

    @media (max-width: 1024px) {
      padding-left: 12px;
      padding-right: 12px;
    }
  }
`;

const Highlight = styled.div`
  a {
    position: fixed;
    bottom: 1.2rem;
    right: 1.2rem;
    background: var(--bs-link-color);
    color: white;
    padding: 0.3rem 0.6rem;
    border-radius: 12px;
    z-index: 99;
  }

  a:hover {
    color: white;
  }
`;

return (
  <DiscussionContainer>
    {context.accountId ? (
      <ComposeWrapper>
        <Widget
          src="${REPL_ACCOUNT}/widget/NestedDiscussions.Compose"
          props={{
            placeholder,
            indexKey: identifier,
            notificationWidget: parentComponent,
            notificationParams: parentParams,
            notifyAccountId,
          }}
        />
      </ComposeWrapper>
    ) : (
      <p> Login to {placeholder.toLowerCase()} </p>
    )}
    {highlightComment && (
      <Highlight>
        <a href="#highlight">Jump to highlighted comment</a>
      </Highlight>
    )}
    <FeedWrapper>
      <Widget
        src="${REPL_ACCOUNT}/widget/NestedDiscussions.Feed"
        props={{
          indexKey: identifier,
          moderatorAccount,
          parentComponent,
          parentParams,
          highlightComment,
        }}
      />
    </FeedWrapper>
  </DiscussionContainer>
);
