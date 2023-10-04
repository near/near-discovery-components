const isLocalStorageSupported = props?.isLocalStorageSupported;
const isNotificationSupported = props?.isNotificationSupported;
const isPermisionGranted = props?.isPermisionGranted;
const isPushManagerSupported = props?.isPushManagerSupported;
const handleTurnOn = props?.handleTurnOn;
const handleOnCancel = props?.handleOnCancel;
const getNotificationLocalStorage = props?.getNotificationLocalStorage;
const handleOnCancelBanner = props?.handleOnCancelBanner;
const accountId = props?.accountId;
const showLimit = props?.showLimit;
const showInBox = props?.showInBox || false;
const bannerBorderRadius = props?.bannerBorderRadius;

const Header = styled.div`
  display: flex;
  padding: ${(props) =>
    props.showInBox ? "16px 16px 16px 24px" : "48px 16px 24px 16px"};
  align-items: center;
  align-self: stretch;
`;

const Title = styled.div`
  flex: 1 0 0;
  font: var(--text-xl);
  color: var(--sand12);
  font-weight: 500;
`;

const Settings = styled.a`
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
  <Card showInBox={showInBox}>
    <Header showInBox={showInBox}>
      <Title>Notifications</Title>
      <Widget
        src="${REPL_ACCOUNT}/widget/DIG.Button"
        props={{
          href: "#/notifications-settings",
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
        }}
      />
    )}

    <Widget
      src="${REPL_ACCOUNT}/widget/NearOrg.Notifications.NotificationsList"
      props={{ showLimit, showInBox }}
    />
  </Card>
);
