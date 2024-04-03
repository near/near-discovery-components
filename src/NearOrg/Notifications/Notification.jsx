const {
  createNotificationMessage,
  getNotificationContent,
  createNotificationLink,
  getNotificationIconClassName,
  checkNotificationValueAvailability,
} = VM.require("${REPL_ACCOUNT}/widget/NearOrg.Notifications.utils") || (() => {});

if (
  !createNotificationMessage ||
  !getNotificationContent ||
  !createNotificationLink ||
  !getNotificationIconClassName ||
  !checkNotificationValueAvailability
) {
  return <></>;
}

const Notification = styled.div`
  display: flex;
  padding: 16px 24px 16px 16px;
  align-items: flex-start;
  gap: 16px;
  border-top: 1px solid var(--sand6);

  &:hover {
    background: var(--sand2);

    & i {
      color: #604cc8;
    }
  }

  @media (max-width: 575px) {
    padding: 16px;
    margin: 0 -16px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: inherit;
  align-items: flex-start;
  gap: 16px;
  flex: 1 0 0;
  &:hover {
    text-decoration: none;
  }
`;

const Icon = styled.i`
  color: var(--sand10);
  font-size: 24px;
  padding-top: 2px;
`;

const Username = styled.span`
  font: var(--text-s);
  font-weight: 600;
  color: var(--sand12);
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  word-break: break-word;
`;

const Action = styled.span`
  font: var(--text-s);
  color: #706f6c;
  white-space: nowrap;
`;

const ComponentName = styled.span`
  font: var(--text-s);
  font-weight: 600;
  color: #604cc8;
`;

const Dot = styled.span`
  padding: 0 8px 0 10px;
`;

const Button = styled("Link")`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  height: 32px;
  border-radius: 100px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
  cursor: pointer;
  background: #fbfcfd;
  border: 1px solid #d7dbdf;
  color: #006adc !important;
  white-space: nowrap;

  &.button--primary {
    width: 100%;
    color: #006adc !important;

    @media (max-width: 1024px) {
      width: auto;
    }
  }

  &:hover,
  &:focus {
    background: #ecedee;
    text-decoration: none;
    outline: none;
  }

  i {
    color: #7e868c;
  }

  .bi-16 {
    font-size: 16px;
  }
`;

const Timestamp = styled.div`
  font: var(--text-s);
  color: #706f6c;
  padding-top: 2px;
  white-space: nowrap;
`;

const Text = styled.div`
  display: flex;
  align-items: baseline;
  flex-wrap: nowrap;
  padding-top: 8px;
`;

const Description = styled.span`
  font: var(--text-s);
  color: var(--sand11);
  font-style: italic;
  border-left: 2px solid #e3e3e0;
  padding: 0 0 0 1rem;
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  word-break: break-word;
`;

const Left = styled.div`
  flex-grow: 1;
  & a {
    display: inline-block;
  }
`;

const Right = styled.div``;

const getNotificationDetailsFromChain = (initiator, blockHeight) => {
  if (!initiator) return null;
  try {
    const data = Social.get(`${initiator}/index/notify`, blockHeight);
    const { value } = data ? JSON.parse(data) : null ?? {};
    return value;
  } catch (error) {
    console.error("Error fetching notification details from chain: ", error);
    return null;
  }
};

let { blockHeight, accountId, manageNotification, permission, value } = props;
const checkedValue = checkNotificationValueAvailability(value);
value = checkedValue ? value : getNotificationDetailsFromChain(props.initiator, blockHeight);

if (value === null) return "Loading...";

const notificationType = value?.type;
const notifier = value?.notifier;

const showAuthorProfile = notificationType == "devhub/mention" || notificationType == "devhub/edit";
// notifier is the one who should be displayed as profile in notifications,
// since all the notifications will be created by devhub.near account but the actual person initiating it is the notifier
if (showAuthorProfile) {
  accountId = notifier;
}
const profile = props.profile || Social.get(`${accountId}/profile/**`, "final");

if (profile === null) return "Loading...";

const profileUrl = `/${REPL_ACCOUNT}/widget/ProfilePage?accountId=${accountId}`;

// notification type that doesn't have a content preview
// which means it's not actionable
// as for example "like", "comment", "star", "custom",
// "devgovgigs/mention", "devgovgigs/edit", "devgovgigs/reply", "devgovgigs/like"
// "devhub/mention", "devhub/edit", "devhub/reply", "devhub/like"
const ordinaryNotification = ["follow", "unfollow", "poke"].indexOf(notificationType) >= 0;

// Assert is a valid type
const notificationMessageByType = createNotificationMessage(value) ?? null;
if (!notificationMessageByType) return "";

const previewContent = getNotificationContent(value, context.accountId, accountId, blockHeight) ?? null;
const postUrl = createNotificationLink(value, props.initiator, accountId, blockHeight) ?? null;
const iconClassName = getNotificationIconClassName(notificationType);

const [isModalOpen, setIsModalOpen] = useState(false);

const toggleModal = () => {
  setIsModalOpen(!isModalOpen);
};

const onClose = () => {
  setIsModalOpen(false);
};

const onConfirm = async () => {
  const block = true;
  manageNotification(context.accountId, notificationType, block);
  setIsModalOpen(false);
};

const ProfileOverlay = ({ children, ...props }) => (
  <Widget
    src="${REPL_ACCOUNT}/widget/AccountProfileOverlay"
    props={{
      accountId,
      profile,
      children,
      ...props,
    }}
  />
);

const buildMenu = () => {
  return [
    {
      name: (
        <>
          <i className="ph-bold ph-bell-simple-slash" style={{ color: "#D95C4A" }} />
          <span style={{ color: "#D95C4A" }}>Block</span>
        </>
      ),
      onSelect: toggleModal,
    },
  ];
};

const isClickable = !!(!ordinaryNotification && postUrl);
const displayName = profile.name || accountId?.split(".near")[0];

return (
  <Notification>
    <Icon className={iconClassName} />
    <Content
      className="notification-item"
      as={isClickable ? "a" : "div"}
      data-clickable={isClickable}
      href={isClickable && postUrl}
    >
      <Left>
        <Link href={profileUrl}>
          <ProfileOverlay>
            <Widget
              src="${REPL_ACCOUNT}/widget/DIG.Avatar"
              props={{
                alt: accountId,
                image:
                  profile.image ??
                  "https://ipfs.near.social/ipfs/bafkreibiyqabm3kl24gcb2oegb7pmwdi6wwrpui62iwb44l7uomnn3lhbi",
                size: "small",
              }}
            />
          </ProfileOverlay>
        </Link>
        <Text>
          {displayName && (
            <ProfileOverlay inline>
              <Link href={profileUrl}>
                <Username>{displayName}</Username>
              </Link>
            </ProfileOverlay>
          )}
          &nbsp;
          <Action>{notificationMessageByType}</Action>
          <Timestamp>
            <Dot>·</Dot>

            {blockHeight && (
              <Widget src="${REPL_MOB_2}/widget/TimeAgo${REPL_TIME_AGO_VERSION}" props={{ blockHeight }} />
            )}
          </Timestamp>
        </Text>
        {previewContent && <Description>{previewContent}</Description>}
      </Left>
      <Right>
        {(notificationType === "follow" || notificationType === "unfollow") && accountId && (
          <Widget src="${REPL_ACCOUNT}/widget/FollowButton" props={{ accountId }} />
        )}

        {notificationType === "poke" && accountId && (
          <Widget
            src="${REPL_ACCOUNT}/widget/PokeButton"
            props={{
              accountId,
              back: true,
              primary: true,
            }}
          />
        )}

        {!ordinaryNotification && postUrl && <Button href={postUrl}>View</Button>}
      </Right>
    </Content>
    {permission && (
      <Widget
        src="${REPL_ACCOUNT}/widget/DIG.DropdownMenu"
        props={{
          trigger: <i className="ph-bold ph-dots-three" />,
          items: buildMenu(),
        }}
      />
    )}
    {isModalOpen && (
      <Widget
        src="${REPL_ACCOUNT}/widget/DIG.Dialog"
        props={{
          type: "alert",
          title: `Do you want to stop receiving push notification for ${notificationType}?`,
          cancelButtonText: "Cancel",
          confirmButtonText: "Confirm",
          onCancel: onClose,
          onConfirm: onConfirm,
          open: isModalOpen,
        }}
      />
    )}
  </Notification>
);
