const { url } = props;

const Button = styled.button`
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
    font-size: 18px;
    transition: color 200ms;
  }

  &:hover, &:focus {
    outline: none;
    color: #11181C;
  }
`;

return (
  <OverlayTrigger
    placement="top"
    overlay={<Tooltip>Copy URL to clipboard</Tooltip>}
  >
    <Button
      type="button"
      aria-label="Copy URL to clipboard"
      onMouseLeave={() => {
        State.update({ copiedShareUrl: false });
      }}
      onClick={() => {
        clipboard.writeText(url).then(() => {
          State.update({ copiedShareUrl: true });
        });
      }}
    >
      {state.copiedShareUrl ? (
        <i className="bi bi-check"></i>
      ) : (
        <i className="bi bi-link-45deg"></i>
      )}
    </Button>
  </OverlayTrigger>
);
