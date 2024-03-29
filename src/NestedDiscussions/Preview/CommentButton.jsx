const comments = Social.index("discuss", props.item);
const totalComments = comments?.length || 0;

const CommentButton = styled.button`
  border: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #687076;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  cursor: pointer;
  background: none;
  padding: 6px;
  transition: color 200ms;

  i {
    font-size: 16px;
    transition: color 200ms;
  }

  &:hover,
  &:focus {
    outline: none;
    color: #11181c;
  }
`;

return (
  <CommentButton disabled={context.loading || !context.accountId} title="Add Comment" onClick={props.onClick}>
    <i className="bi-chat" />
    {totalComments}
  </CommentButton>
);
