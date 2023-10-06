let {
  open,
  handleTurnOn,
  handleOnCancel,
  isNotificationSupported,
  isPermisionGranted,
  isPushManagerSupported,
  setNotificationsSessionStorage,
  onOpenChange,
  iOSDevice,
  iOSVersion,
  recomendedIOSVersion,
} = props;

const showIosNoteText =
  (iOSDevice && !iOSVersion) || (iOSDevice && iOSVersion && iOSVersion < recomendedIOSVersion);

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 56px;
  margin: 8px 0 24px;
`;

const Title = styled.span`
  font: var(--text-l);
  font-weight: 700;
  letter-spacing: 0.3px;
  text-align: center;
`;

const DescriptionWrapper = styled.div`
  text-align: center;
  margin-bottom: ${(p) => (p.showIosNoteText ? "16px" : "56px")};
`;

const Img = styled.img`
  width: 78px;
  height: 78px;
`;

const NoteText = styled.div`
  text-align: center;
  font: var(--text-s);
  font-weight: 600;
`;

const Header = () => (
  <HeaderWrapper>
    <Img
      src="https://ipfs.near.social/ipfs/bafkreiblcgtfxkief54mlalzjxyuwwo6qqoft3i5vp2fzftjpnr6hg4qxy"
      alt="notify_icon"
    />
    <Title>Enable Push Notifications?</Title>
  </HeaderWrapper>
);

const Description = () => (
  <>
    <DescriptionWrapper showIosNoteText={showIosNoteText}>
      Stay in the know on updates and activity. Customize your preferences
      anytime.
    </DescriptionWrapper>
    {showIosNoteText && (
      <NoteText>
        <i class="ph-bold ph-info" />
        Mobile browser push notifications are only supported on iOS "{recomendedIOSVersion}" or
        greater.
      </NoteText>
    )}
  </>
);

const actionStyles = {
  flexDirection: "column-reverse",
};

const iOSContentStyles = iOSDevice ? {
  top: "calc(100% - 225px)",
  height: "65vh",
} : {};

const CancelButton = ({ handleOnCancel }) => (
  <Widget
    src="${REPL_ACCOUNT}/widget/DIG.Button"
    props={{
      label: "Not Now",
      variant: "secondary",
      fill: "ghost",
      onClick: handleOnCancel,
      style: { width: "100%" },
    }}
  />
);

const ConfirmButton = ({ handleTurnOn }) => (
  <Widget
    src="${REPL_ACCOUNT}/widget/DIG.Button"
    props={{
      label: "Turn On",
      variant: "primary",
      onClick: handleTurnOn,
      style: { width: "100%" },
    }}
  />
);

return (
  <Widget
    src="${REPL_ACCOUNT}/widget/DIG.Dialog"
    props={{
      type: "alert",
      title: <Header />,
      description: <Description />,
      cancelButton: <CancelButton handleOnCancel={handleOnCancel} />,
      confirmButton: <ConfirmButton handleTurnOn={handleTurnOn} />,
      open,
      actionStyles,
      overlayColor: "var(--blackA11)",
      overlayBlur: "blur(4px)",
      onOpenChange,
      contentStyles: iOSContentStyles,
    }}
  />
);
