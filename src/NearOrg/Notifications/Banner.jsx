let { handleTurnOn, handleOnCancel, radius, iOSDevice, iOSVersion, recomendedIOSVersion } = props;
const showIosNoteText = (iOSDevice && !iOSVersion) || (iOSDevice && iOSVersion && iOSVersion < recomendedIOSVersion);

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
  font: ${(p) => `var(--${p.small ? "text-s" : "text-base"})`};
  font-weight: 600;
`;

const Buttons = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

const TextLink = styled("Link")`
  color: var(--white);
  text-decoration: underline;
`;

return (
  <Card borderRadius={radius}>
    <Component>
      <Icon className="ph ph-bell-ringing" />
      <Text>
        Don't miss out on updates, <TextLink href="/notifications-settings">turn on desktop notifications.</TextLink>
      </Text>
      {showIosNoteText && (
        <Text small>
          <i className="ph-bold ph-info" />
          Mobile browser push notifications are only supported on iOS "{recomendedIOSVersion}" or greater.
        </Text>
      )}
      <Buttons>
        <Widget
          src="${REPL_ACCOUNT}/widget/DIG.Button"
          props={{
            label: "Turn on",
            variant: "primary",
            fill: "outline",
            size: "default",
            style: {
              color: "var(--violet8)",
              background: "var(--white)",
            },
            onClick: handleTurnOn,
          }}
        />
        <Widget
          src="${REPL_ACCOUNT}/widget/DIG.Button"
          props={{
            label: "No thanks",
            variant: "primary",
            size: "default",
            fill: "ghost",
            style: {
              color: "var(--white)",
              background: "transparent",
            },
            onClick: handleOnCancel,
          }}
        />
      </Buttons>
    </Component>
    <Close className="ph ph-x" onClick={handleOnCancel} />
  </Card>
);
