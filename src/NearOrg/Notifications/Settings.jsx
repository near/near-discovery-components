let {
  isLocalStorageSupported,
  isNotificationSupported,
  isPermisionGranted,
  isPushManagerSupported,
  handleTurnOn,
  handleOnCancel,
  getNotificationLocalStorage,
  handleOnCancelBanner,
  accountId,
  handlePushManagerUnsubscribe,
  iOSDevice,
  loading,
  disabled,
} = props;

const notificationSupported = isNotificationSupported();

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 592px;
`;

const Text = styled.div`
  font: var(--text-s);
  color: var(--sand11);
  font-weight: 450;
`;

const TextLink = styled("Link")`
  font-weight: 600;
`;

const IosNotification = () => (
  <Text>
    <i className="ph-bold ph-info" />
    In order to enable Mobile Browser notifications on iOS, you will also need to add near.org as a icon to your home
    screen. Click on the share icon, and then tap on <b>"Add to Home Screen"</b>
  </Text>
);

const SettingHeaderContent = () => {
  return (
    <>
      {iOSDevice && <IosNotification />}
      <Text>
        Learn more about notifications
        <TextLink href="https://near.org/blog/announcing-web-push-notifications-on-b-o-s">here</TextLink>
      </Text>
    </>
  );
};

// TODO: solution to pass data to this component
// at this moment we don't have a simple solution to pass data to this component
// we are not able to detect if notifications are supported,
// and we are not able to handle Turn On button

const permission = getNotificationLocalStorage()?.permission;

State.init({
  showTurnOn: !isPermisionGranted() || (isPermisionGranted() && !permission),
  showTurnOff: isPermisionGranted() && !!permission,
});

const checkShow = () => {
  const permission = getNotificationLocalStorage()?.permission;
  State.update({
    showTurnOn: !isPermisionGranted() || (isPermisionGranted() && !permission),
    showTurnOff: isPermisionGranted() && !!permission,
  });
};

return (
  <Wrapper className="gateway-page-container">
    <Widget
      src="${REPL_ACCOUNT}/widget/NearOrg.Notifications.SettingsHeader"
      props={{
        title: "Notification Settings",
        text: "Configure your notifications for activity on near.org",
        content: <SettingHeaderContent />,
      }}
    />

    {state.showTurnOn && (
      <Widget
        src="${REPL_ACCOUNT}/widget/NearOrg.Notifications.SettingsListItem"
        props={{
          handleOnClick: () => {
            handleTurnOn(accountId, checkShow);
          },
          label: "Turn On",
          loading,
          disabled,
        }}
      />
    )}
    {state.showTurnOff && (
      <Widget
        src="${REPL_ACCOUNT}/widget/NearOrg.Notifications.SettingsListItem"
        props={{
          handleOnClick: () => {
            handlePushManagerUnsubscribe(checkShow);
          },
          label: "Turn Off",
          loading,
          disabled,
        }}
      />
    )}
    {!notificationSupported && (
      <Widget
        src="${REPL_ACCOUNT}/widget/NearOrg.Notifications.SettingsTurnOn"
        props={{
          iOSDevice,
        }}
      />
    )}
  </Wrapper>
);
