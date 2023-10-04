let { handleTurnOn, handleOnCancel, radius } = props;

const Card = styled.div`
  display: flex;
  padding: 24px 16px;
  align-items: flex-start;
  align-self: stretch;
  border-radius: ${(p) => p.borderRadius ?? "6px"};
  background: var(--violet9);
`;

const Component = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  flex: 1 0 0;
`;

const Icon = styled.i`
  font-size: 24px;
  color: var(--white);
`;

const Close = styled.i`
  flex-shrink: 0;
  font-size: 24px;
  color: var(--white);
  cursor: pointer;
`;

const Text = styled.div`
  color: var(--white);
  font: var(--text-base);
  font-weight: 600;
`;

const Buttons = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

return (
  <Card borderRadius={radius}>
    <Component>
      <Icon className="ph ph-bell-ringing" />
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
    <Close className="ph ph-x" onClick={handleOnCancel} />
  </Card>
);
