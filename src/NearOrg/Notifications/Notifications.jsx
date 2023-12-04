let {
  isLocalStorageSupported,
  isNotificationSupported,
  isPermisionGranted,
  isPushManagerSupported,
  manageNotification,
  handleTurnOn,
  handleOnCancel,
  getNotificationLocalStorage,
  handleOnCancelBanner,
  accountId,
  showLimit,
  showInBox,
  bannerBorderRadius,
  iOSDevice,
  iOSVersion,
  recomendedIOSVersion,
} = props;

showInBox = showInBox ?? false;

const Header = styled.div`
  display: flex;
  padding: ${(props) => (props.showInBox ? "16px 16px 16px 24px" : "48px 16px 24px 16px")};
  align-items: center;
  align-self: stretch;
`;

const Title = styled.div`
  flex: 1 0 0;
  font: var(--text-xl);
  color: var(--sand12);
  font-weight: 500;
`;

const Settings = styled("Link")`
  display: flex;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 50px;
  border: 1px solid var(--sand6);
  background: var(--sand1);
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 592px;
  margin: ${(props) => (props.showInBox ? "" : "0 auto")};

  .notification-item {
    &:first-child {
      border-top: none;
    }
  }
`;

const bannerNotNowTS = getNotificationLocalStorage()?.bannerNotNowTS;
const permission = getNotificationLocalStorage()?.permission;

State.init({
  showBanner: !bannerNotNowTS && !permission,
});

const checkShowBanner = () => {
  const bannerNotNowTS = getNotificationLocalStorage()?.bannerNotNowTS;
  const permission = getNotificationLocalStorage()?.permission;
  State.update({ showBanner: !bannerNotNowTS && !permission });
};

return (
  <Card className={showInBox ? "" : "container-xl"} showInBox={showInBox}>
    <Header showInBox={showInBox}>
      <Title>Notifications</Title>
      <Widget
        src="${REPL_ACCOUNT}/widget/DIG.Button"
        props={{
          href: "/notifications-settings",
          icon: "ph-bold ph-gear-six",
          variant: "secondary",
          fill: "outline",
        }}
      />
    </Header>
    {state.showBanner && (
      <Widget
        src="${REPL_ACCOUNT}/widget/NearOrg.Notifications.Banner"
        props={{
          handleTurnOn: async () => {
            handleTurnOn(accountId, checkShowBanner);
          },
          handleOnCancel: () => {
            handleOnCancelBanner();
            checkShowBanner();
          },
          radius: bannerBorderRadius,
          iOSDevice,
          iOSVersion,
          recomendedIOSVersion,
        }}
      />
    )}

    <Widget
      src="${REPL_ACCOUNT}/widget/NearOrg.Notifications.NotificationsList"
      props={{ showLimit, showInBox, manageNotification, permission }}
    />
  </Card>
);
