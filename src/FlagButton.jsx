const { item } = props;

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

  &:hover,
  &:focus {
    outline: none;
    color: #11181c;
  }
`;

return (
  <OverlayTrigger
    placement="top"
    overlay={<Tooltip>Flag for moderation</Tooltip>}
  >
    <Button
      type="button"
      aria-label="Flag for moderation"
      disabled={!context.accountId}
      onClick={() => {
        Social.set(
          {
            index: {
              flag: JSON.stringify({
                key: "main",
                value: item,
              }),
            },
          },
          {
            onCommit: () => {
              props.onFlag && props.onFlag();
            },
          }
        );
      }}
    >
      <i className="bi bi-flag"></i>
    </Button>
  </OverlayTrigger>
);
