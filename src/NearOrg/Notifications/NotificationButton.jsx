const accountId = context.accountId;
let {
  moderatorAccount,
  preview,
  notificationFeedSrc,
  previewItems,
  showMoreButton,
} = props;
moderatorAccount = moderatorAccount ?? "${REPL_MODERATOR}";
notificationFeedSrc =
  notificationFeedSrc ?? "${REPL_ACCOUNT}/widget/NotificationsPage";

State.init({
  open: false,
});

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
  top: 55px;
  right: 75%;
  max-width: 490px;
  width: 100%;
  visibility: hidden;
  overflow: hidden;
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
          href: !preview ? notificationFeedSrc : undefined,
          onClick: () => State.update({ open: !!state.open }),
        }}
      />
      <Counter count={notificationsCount} />
    </ButtonWrapper>
  );
};

if (!preview) {
  return <Button />;
}

return (
  <Wrapper
    onMouseEnter={() => State.update({ open: true })}
    onMouseLeave={() => State.update({ open: false })}
  >
    <Button />
    <PreviewWrapper data-state={state.open}>
      <PreviewContent>
        {previewItems}
        {showMoreButton}
      </PreviewContent>
    </PreviewWrapper>
  </Wrapper>
);
