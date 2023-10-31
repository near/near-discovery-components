const Notification = styled.div`
  display: flex;
  padding: 16px 24px 16px 16px;
  align-items: flex-start;
  gap: 16px;
  border-top: 1px solid var(--sand-light-6, #e3e3e0);

  &:hover {
    background: var(--sand-light-2, #f9f9f8);

    & i {
      color: #604cc8;
    }
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: inherit;
  align-items: flex-start;
  gap: 16px;
  flex: 1 0 0;
`;

const Icon = styled.div`
  & > i {
    color: #868682;
    font-size: 24px;
    padding-top: 2px;
  }
`;

const Username = styled.span`
  font: var(--text-s);
  font-weight: 600;
  color: var(--sand-light-12, var(--sand-light-12, #1b1b18));
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

const Desc = styled.span`
  font: var(--text-s);
  color: #706f6c;
  font-style: italic;
  border-left: 2px solid #e3e3e0;
  padding: 0 0 0 1rem;
`;

const Left = styled.div`
  flex-grow: 1;
  & a {
    display: inline-block;
  }
`;

const Right = styled.div``;

const { value } = props;
let { type } = value;
const item = value?.item || {};
const path = item.path || "";

// Build notification
let { blockHeight, accountId } = props;
let postUrl = "";

// Construct DevGov postUrl
function buildPostUrl(widgetName, linkProps) {
  linkProps = { ...linkProps };

  const nearDevGovGigsWidgetsAccountId =
      props.nearDevGovGigsWidgetsAccountId ||
      (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

  if (props.nearDevGovGigsContractAccountId) {
    linkProps.nearDevGovGigsContractAccountId =
        props.nearDevGovGigsContractAccountId;
  }

  if (props.nearDevGovGigsWidgetsAccountId) {
    linkProps.nearDevGovGigsWidgetsAccountId =
        props.nearDevGovGigsWidgetsAccountId;
  }

  if (props.referral) {
    linkProps.referral = props.referral;
  }

  const linkPropsQuery = Object.entries(linkProps)
      .filter(([_key, nullable]) => (nullable ?? null) !== null)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

  return `/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
      linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}

switch (type) {
  case "mention":
    accountId = props.initiator;
    postUrl = `/${REPL_ACCOUNT}/widget/NearOrg.Notifications.CommentPost?accountId=${accountId}&blockHeight=${blockHeight}`;
    break;
  case "custom":
    postUrl = `/${value.widget}?${Object.entries(value.params || {})
      .map(([k, v]) => `${k}=${v}`)
      .join("&")}`;
    break;
  case "like":
    blockHeight = item.blockHeight;
    const pathAccountId = path.split("/")[0];
    postUrl = `/${REPL_ACCOUNT}/widget/PostPage?accountId=${pathAccountId}&blockHeight=${blockHeight}`;
    break;
  case "comment":
    accountId = props.initiator;
    postUrl = `/${REPL_ACCOUNT}/widget/PostPage?accountId=${accountId}&commentBlockHeight=${blockHeight}`;
    break;
  case "devgovgigs/mention":
  case "devgovgigs/edit":
  case "devgovgigs/reply":
  case "devgovgigs/like":
    postUrl = buildPostUrl("Post",  { id: value.post })
    break
  default:
    postUrl = `/${REPL_ACCOUNT}/widget/PostPage?accountId=${accountId}&blockHeight=${blockHeight}`;
}

const profile = props.profile || Social.get(`${accountId}/profile/**`, "final");
const profileUrl = `/${REPL_ACCOUNT}/widget/ProfilePage?accountId=${accountId}`;
const isComment = path.indexOf("/post/comment") > 0 || type === "comment";
const isPost = !isComment && path.indexOf("/post/main") > 0;

let notificationMessage = {
  like: isPost ? "liked your post" : "liked your comment",
  follow: "followed you",
  unfollow: "unfollowed you",
  comment: "replied to your post",
  mention: "mentioned you in their post",
  poke: "poked you",
  custom: value.message ?? "",
  "devgovgigs/mention": "mentioned you in their post",
  "devgovgigs/edit": "edited your",
  "devgovgigs/reply":"replied to your post",
  "devgovgigs/like": isPost ? "liked your post" : "liked your comment",
};

const actionable =
  type === "like" ||
  type === "comment" ||
  type === "mention" ||
  type === "devgovgigs/mention"||
  type === "devgovgigs/edit" ||
  type === "devgovgigs/reply" ||
  type === "devgovgigs/like"||
  type === "custom";


// Assert is a valid type
if (!(type in notificationMessage) || !notificationMessage[type]) return <></>;

const ProfileOverlay = ({ children }) => (
  <Widget
    src="${REPL_ACCOUNT}/widget/AccountProfileOverlay"
    props={{
      accountId: props.accountId,
      profile,
      children,
      placement: props.overlayPlacement,
      overlayStyles: { zIndex: 1069 },
    }}
  />
);

const iconType = {
  like: <i className="ph ph-heart" />,
  // fork: <i className="ph ph-git-fork" />,
  follow: <i className="ph ph-user-plus" />,
  unfollow: <i className="ph ph-user-minus" />,
  comment: <i className="ph ph-share-fat" />,
  mention: <i className="ph ph-at" />,
  poke: <i className="ph ph-hand-pointing" />,
  custom: <i className="ph ph-" />,
  "devgovgigs/like":<i className="ph ph-heart" />,
  "devgovgigs/mention":  <i className="ph ph-at" />,
  "devgovgigs/edit": <i className="ph ph-pencil" />,
  "devgovgigs/reply": <i className="ph ph-share-fat" />,
};

return (
  <Notification className="notification-item">
    <Icon>{iconType[type]}</Icon>
    <Content>
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
            <div style={{ "text-align": "center" }}>
              <Link href={!props.onClick && profileUrl}>
                <Username>
                  {profile.name || accountId.split(".near")[0]}
                </Username>
              </Link>
              <Action>{notificationMessage[type]}</Action>
            </div>
          </ProfileOverlay>
          {/*<ComponentName>{componentName}</ComponentName>*/}

          <Timestamp>
            <Dot>·</Dot>
            {/* TODO: add title tag to show full time on hover */}
            <Widget
              src="${REPL_MOB_2}/widget/TimeAgo@97556750"
              props={{ blockHeight: props.blockHeight }}
            />
          </Timestamp>
        </Text>
        {/* <Desc>{desc}</Desc> */}
      </Left>
      <Right>
        {(type === "follow" || type === "unfollow") && (
          <Widget
            src="${REPL_ACCOUNT}/widget/FollowButton"
            props={{ accountId: props.accountId }}
          />
        )}

        {type === "poke" && (
          <Widget
            src="${REPL_ACCOUNT}/widget/PokeButton"
            props={{
              accountId: props.accountId,
              back: true,
              primary: true,
            }}
          />
        )}

        {actionable && <Button href={postUrl}>View</Button>}
      </Right>
    </Content>
  </Notification>
);