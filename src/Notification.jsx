const { value } = props;
const { type } = value;
const item = value?.item || {};
const path = item.path || "";

// Build notification
const isComment = path.indexOf("/post/comment") > 0 || type === "comment";
const isPost = !isComment && path.indexOf("/post/main") > 0;

const accountId = type === "like" ? path.split("/")[0] : props.accountId;
const blockHeight = type === "like" ? item.blockHeight : props.blockHeight;
const urlBlockHeight = isComment ? "commentBlockHeight" : "blockHeight";

let postUrl = "";

if (type !== "custom") {
  postUrl = `/#/near/widget/PostPage?accountId=${accountId}&${urlBlockHeight}=${blockHeight}`;
} else {
  postUrl = `/#/${value.widget}?${Object.entries(value.params)
    .map(([k, v]) => `${k}=${v}`)
    .join("&")}`;
}

const actionable =
  type === "like" ||
  type === "comment" ||
  type === "mention" ||
  type === "custom";

let notificationMessage = {
  follow: "Followed you",
  unfollow: "Unfollowed you",
  poke: "Poked you",
  like: isPost ? "Liked your post" : isComment ? "Liked your comment" : "",
  comment: "Commented on your post",
  mention: "Mentioned you",
  custom: value.message ?? "",
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  border: 1px solid #eceef0;
  box-shadow: 0px 1px 3px rgba(16, 24, 40, 0.1),
    0px 1px 2px rgba(16, 24, 40, 0.06);
  padding: 12px;
  border-radius: 12px;
  transition: background-color 200ms;

  &:hover {
    background: #eefeef;
  }

  > *:first-child {
    width: 200px;
    border-right: 1px solid #eceef0;
    padding-right: 24px;
  }

  > *:last-child {
    margin-left: auto;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: start;
    gap: 8px;

    > *:first-child {
      width: 100%;
      border-right: none;
      padding-right: 0;
    }

    > *:last-child {
      margin-left: 0;
    }
  }
`;

const Text = styled.p`
  margin: 0;
  line-height: 1.5rem;
  color: ${(p) => (p.bold ? "#11181C" : "#687076")} !important;
  font-weight: 400;
  font-size: ${(p) => (p.small ? "12px" : "14px")};
  overflow: ${(p) => (p.ellipsis ? "hidden" : "")};
  text-overflow: ${(p) => (p.ellipsis ? "ellipsis" : "")};
  white-space: ${(p) => (p.ellipsis ? "nowrap" : "")};
  overflow-wrap: anywhere;

  b {
    font-weight: 600;
    color: #11181c;
  }

  &[href] {
    font-weight: 600;
    color: #006adc !important;
    display: inline-flex;
    gap: 0.25rem;

    &:hover,
    &:focus {
      text-decoration: underline;
    }
  }
`;

const Button = styled.a`
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

    @media (max-width: 1200px) {
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

// DevGov handles their own type
if (type && type.startsWith("devgovgigs/")) {
  return (
    <Widget src="mob.near/widget/Notification.Item.DevGov" props={props} />
  );
}

// Assert is a valid type
if (!(type in notificationMessage) || !notificationMessage[type]) return <></>;

return (
  <>
    <Wrapper>
      <div>
        <Widget
          src="near/widget/AccountProfile"
          props={{ accountId: props.accountId }}
        />
      </div>

      <Text bold>
        <Text as={actionable ? "a" : "p"} href={actionable ? postUrl : ""}>
          {notificationMessage[type]}
        </Text>
        <Widget
          src="mob.near/widget/TimeAgo"
          props={{ blockHeight: props.blockHeight }}
        />
        ago
      </Text>

      <div>
        {(type === "follow" || type === "unfollow") && (
          <Widget
            src="near/widget/FollowButton"
            props={{ accountId: props.accountId }}
          />
        )}

        {type === "poke" && (
          <Widget
            src="near/widget/PokeButton"
            props={{ accountId: props.accountId, back: true, primary: true }}
          />
        )}

        {actionable && <Button href={postUrl}>View</Button>}
      </div>
    </Wrapper>
  </>
);
