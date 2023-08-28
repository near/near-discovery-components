const { item, disabled } = props;

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

  &[disabled] {
    color: var(--sand8);
    cursor: initial;
  }
`;

const FlagButton = () => (
  <Button
    type="button"
    aria-label="Flag for moderation"
    disabled={disabled}
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
);

if (disabled) {
  return (
    <FlagButton />
  );
}

return (
  <OverlayTrigger
    placement="top"
    overlay={<Tooltip>Flag for moderation</Tooltip>}
  >
    <FlagButton />
  </OverlayTrigger>
);
