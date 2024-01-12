const { createNotificationMessage, getNotificationContent, createNotificationLink, getNotificationIconClassName } =
  VM.require("${REPL_ACCOUNT}/widget/NearOrg.Notifications.utils") || (() => {});

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
`;

const Content = styled("Link")`
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
`;

const Action = styled.span`
  font: var(--text-s);
  color: #706f6c;
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
`;

const Text = styled.div`
  display: flex;
  direction: columns;
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
`;

const Left = styled.div`
  flex-grow: 1;
  & a {
    display: inline-block;
  }
`;

const Right = styled.div``;

let { blockHeight, accountId, manageNotification, permission, value } = props;
let { item, type, post, message } = value;
item = item ?? {};
post = post ?? {};
message = message ?? "";
const path = item.path || "";

const profile = props.profile || Social.get(`${accountId}/profile/**`, "final");
const profileUrl = `/${REPL_ACCOUNT}/widget/ProfilePage?accountId=${accountId}`;

// notification type that doesn't have a content preview
// which means it's not actionable
// as for example "like", "comment", "star", "custom",
// "devgovgigs/mention", "devgovgigs/edit", "devgovgigs/reply", "devgovgigs/like"
const ordinaryNotification = ["follow", "unfollow", "poke"].indexOf(type) >= 0;

// Assert is a valid type
const notificationMessageByType = createNotificationMessage && createNotificationMessage(type, path, post, message);
if (!notificationMessageByType) return "";

const previewContent = getNotificationContent(type, path, post, context, accountId, blockHeight);
const postUrl = createNotificationLink(type, value, props.initiator, accountId, blockHeight);
const iconClassName = getNotificationIconClassName(type);

const [isModalOpen, setIsModalOpen] = useState(false);

const toggleModal = () => {
  setIsModalOpen(!isModalOpen);
};

const onClose = () => {
  setIsModalOpen(false);
};

const onConfirm = async () => {
  const block = true;
  manageNotification(context.accountId, type, block);
  setIsModalOpen(false);
};

const ProfileOverlay = ({ children }) => (
  <Widget
    src="${REPL_ACCOUNT}/widget/AccountProfileOverlay"
    props={{
      accountId,
      profile,
      children,
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

return (
  <Notification>
    <Icon className={iconClassName} />
    <Content
      className="notification-item"
      as={!ordinaryNotification ? "Link" : "div"}
      href={!ordinaryNotification && postUrl}
    >
      <Left>
        <Link href={!props.onClick && profileUrl}>
          <ProfileOverlay>
            <Widget
              src="${REPL_ACCOUNT}/widget/DIG.Avatar"
              props={{
                alt: accountId,
                image: profile.image,
                size: "small",
              }}
            />
          </ProfileOverlay>
        </Link>
        <Text>
          <ProfileOverlay>
            <div>
              <Link href={!props.onClick && profileUrl}>
                <Username>{profile.name || accountId.split(".near")[0]}</Username>
              </Link>
              <Action>{notificationMessageByType}</Action>
            </div>
          </ProfileOverlay>

          <Timestamp>
            <Dot>·</Dot>
            {/* TODO: add title tag to show full time on hover */}
            <Widget src="${REPL_MOB_2}/widget/TimeAgo@97556750" props={{ blockHeight }} />
          </Timestamp>
        </Text>
        {previewContent && <Description>{previewContent}</Description>}
      </Left>
      <Right>
        {(type === "follow" || type === "unfollow") && (
          <Widget src="${REPL_ACCOUNT}/widget/FollowButton" props={{ accountId }} />
        )}

        {type === "poke" && (
          <Widget
            src="${REPL_ACCOUNT}/widget/PokeButton"
            props={{
              accountId,
              back: true,
              primary: true,
            }}
          />
        )}

        {!ordinaryNotification && <Button href={postUrl}>View</Button>}
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
          title: `Do you want to stop receiving push notification for ${type}?`,
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
