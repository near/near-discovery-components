const handleTurnOn = props?.handleTurnOn;
const handleOnCancel = props?.handleOnCancel;

const Card = styled.div`
  display: flex;
  padding: 24px 16px;
  align-items: flex-start;
  align-self: stretch;
  border-radius: 6px;
  background: var(--violet-light-9, #8279e2);
`;

const Component = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  flex: 1 0 0;
`;

const Icon = styled.div`
  & > i {
    font-size: 24px;
    color: white;
  }
`;

const Close = styled.div`
  flex-shrink: 0;

  & > i {
    font-size: 24px;
    color: white;
    cursor: pointer;
  }
`;

const Text = styled.div`
  color: var(--white, #fff);
  font: var(--text-base);
  font-weight: 600;
`;

const Buttons = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

return (
  <Card>
    <Component>
      <Icon>
        <i class="ph ph-bell-ringing" />
      </Icon>
      <Text>Don't miss out on updates, turn on desktop notifications.</Text>
      <Buttons>
        <Widget
          src="${REPL_ACCOUNT}/widget/DIG.Button"
          props={{
            label: "Turn on",
            variant: "primary",
            size: "default",
            onClick: handleTurnOn,
          }}
        />
        <Widget
          src="${REPL_ACCOUNT}/widget/DIG.Button"
          props={{
            label: "No thanks",
            variant: "secondary",
            size: "default",
            onClick: handleOnCancel,
          }}
        />
      </Buttons>
    </Component>
    <Close>
      <i class="ph ph-x" onClick={handleOnCancel} />
    </Close>
  </Card>
);
