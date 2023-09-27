const accountId = context.accountId;
const moderatorAccount = props?.moderatorAccount || "${REPL_MODERATOR}";

const isLocalStorageSupported = props?.isLocalStorageSupported;
const isNotificationSupported = props?.isNotificationSupported;
const isPermisionGranted = props?.isPermisionGranted;
const isPushManagerSupported = props?.isPushManagerSupported;
const handleTurnOn = props?.handleTurnOn;
const handleOnCancel = props?.handleOnCancel;
const getNotificationLocalStorage = props?.getNotificationLocalStorage;
const handleOnCancelBanner = props?.handleOnCancelBanner;
const mobileView = props?.mobileView;

State.init({
  open: false,
});

const handleDropdownOpen = () => {
  if (notificationsCount === 0) return;
  State.update({ open: true });
}

if (context.loading || !accountId) return <></>;

const filterUsersRaw = Social.get(
  `${moderatorAccount}/moderate/users`, //TODO
  "optimistic",
  {
    subscribe: true,
  }
);

if (filterUsers === null) {
  // haven't loaded filter list yet, return early
  return <></>;
}

const filterUsers = filterUsersRaw ? JSON.parse(filterUsersRaw) : [];
const notificationFeedSrc =
  "${REPL_ACCOUNT}/widget/NearOrg.Notifications.NotificationsList";
const lastBlockHeight = Storage.get("lastBlockHeight", notificationFeedSrc);
let notifications =
  Social.index("notify", accountId, {
    order: "asc",
    from: (lastBlockHeight ?? 0) + 1,
    subscribe: true,
  }) || [];
notifications = notifications.filter((i) => !filterUsers.includes(i.accountId));

const notificationsCount = notifications.length || 0;

const Wrapper = styled.div``;

const ButtonWrapper = styled.div`
  position: relative;
  display: inline-flex;
  margin: 1rem;
`;

const Count = styled.span`
  min-width: 13px;
  height: 13px;
  padding: 0 3px;
  display: block;
  color: var(--white);
  background: var(--red8);
  border-radius: 100px;
  font-size: 10px;
  line-height: 13px;
  text-align: center;
  font-weight: 600;
  position: absolute;
  top: -2px;
  right: -1px;
`;

const PreviewWrapper = styled.div`
  position: absolute;
  border-radius: 6px;
  background: var(--white);
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 0px 1px rgba(0, 0, 0, 0.06);
  top: 70px;
  right: 68%;
  width: 460px;
  max-height: 80vh;
  visibility: hidden;
  overflow: hidden auto;
  transition: visibility 300ms ease;
  transform-origin: right top;

  &[data-state="true"] {
    visibility: visible;
    animation: fadeIn 200ms ease;
  }
  [data-state="false"] {
    animation: fadeOut 200ms ease;
  }

  @keyframes fadeIn {
    from {
      visibility: hidden;
      opacity: 0;
    }
    to {
      visibility: visible;
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      visibility: visible;
      opacity: 1;
    }
    to {
      visibility: hidden;
      opacity: 0;
    }
  }
`;

const PreviewContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const SeeAll = styled.div`
  padding: 16px;
`;

const Counter = ({ count }) => {
  if (!count) return;
  return <Count>{count}</Count>;
};

const Button = () => {
  const icon = notificationsCount > 0 ? "ph ph-bell-ringing" : "ph ph-bell";
  return (
    <ButtonWrapper>
      <Widget
        src="${REPL_ACCOUNT}/widget/DIG.Button"
        props={{
          icon,
          variant: "secondary",
          style: { width: "45px", height: "45px" },
          href: "#/notifications",
          onClick: () => State.update({ open: !!state.open }),
        }}
      />
      <Counter count={notificationsCount} />
    </ButtonWrapper>
  );
};

if (mobileView) return <Button />;

return (
  <Wrapper
    onMouseEnter={handleDropdownOpen}
    onMouseLeave={() => State.update({ open: false })}
    onClick={() => State.update({ open: false })}
  >
    <Button />
    <PreviewWrapper data-state={state.open}>
      <PreviewContent>
        <Widget
          src="${REPL_ACCOUNT}/widget/NearOrg.Notifications.Notifications"
          props={{
            isLocalStorageSupported,
            isNotificationSupported,
            isPermisionGranted,
            isPushManagerSupported,
            handleOnCancel,
            getNotificationLocalStorage,
            handleOnCancelBanner,
            accountId,
            handleTurnOn,
            showLimit: 5,
            showInBox: true,
          }}
        />
        <SeeAll>
          <Widget
            src="${REPL_ACCOUNT}/widget/DIG.Button"
            props={{
              href: "#/notifications",
              fill: "outline",
              variant: "secondary",
              label: "See all",
              size: "small",
              style: { width: "100%" },
            }}
          />
        </SeeAll>
      </PreviewContent>
    </PreviewWrapper>
  </Wrapper>
);
