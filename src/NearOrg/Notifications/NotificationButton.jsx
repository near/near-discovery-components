const accountId = context.accountId;
const notificationFeedSrc = "${REPL_ACCOUNT}/widget/NearOrg.Notifications.NotificationsList";

let { size, buttonStyles, mobileView, moderatorAccount, ...forwardedProps } = props;

size = size ?? "45px";
moderatorAccount = moderatorAccount ?? "${REPL_MODERATOR}";

const CHECK_PERIOD = 5000;

const [lastBlockHeight, setLastBlockHeight] = useState(null);
const [notificationsCount, setNotificationsCount] = useState(0);

const Wrapper = styled.div``;

const ButtonWrapper = styled.div`
  position: relative;
  display: inline-flex;
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

const Counter = ({ count }) => {
  if (!count) return;
  return <Count>{count}</Count>;
};

const Button = ({ count }) => {
  const icon = count > 0 ? "ph ph-bell-ringing" : "ph ph-bell";
  return (
    <ButtonWrapper>
      <Widget
        src="${REPL_ACCOUNT}/widget/DIG.Button"
        props={{
          icon,
          variant: "secondary",
          href: "/notifications",
          style: { width: size, height: size, ...buttonStyles },
        }}
      />
      <Counter count={count} />
    </ButtonWrapper>
  );
};

useEffect(() => {
  const checkNotificationsCountPeriod = setInterval(() => {
    const lastBlockHeight = Storage.get("lastBlockHeight", notificationFeedSrc);
    setLastBlockHeight(lastBlockHeight);

    const filterUsersRaw = Social.get(
      `${moderatorAccount}/moderate/users`, //TODO
      "optimistic",
    );
    const filterUsers = filterUsersRaw ? JSON.parse(filterUsersRaw) : [];
    const notifications =
      Social.index("notify", accountId, {
        order: "asc",
        from: (lastBlockHeight ?? 0) + 1,
        subscribe: true,
      }) || [];
    const filterNotifications = notifications?.filter((i) => !filterUsers.includes(i.accountId));
    setNotificationsCount(filterNotifications.length || 0);
  }, CHECK_PERIOD);
  () => {
    clearInterval(checkNotificationsCountPeriod);
    setFilterBlockedUsers(null);
    setLastBlockHeight(null);
  };
}, [lastBlockHeight, moderatorAccount, accountId]);

const disableCounter = lastBlockHeight === null || mobileView;

return (
  <Widget
    src="${REPL_ACCOUNT}/widget/NearOrg.Notifications.Preview"
    props={{
      children: <Button count={notificationsCount} />,
      accountId,
      moderatorAccount,
      showLimit: 5,
      showInBox: true,
      bannerBorderRadius: "0",
      disabled: disableCounter,
      ...forwardedProps,
    }}
  />
);
