const profile_name = props.profile_name;
const accountId = props.accountId;
const profileUrl = `/${REPL_ACCOUNT}/widget/ProfilePage?accountId=${accountId}`;
const onPointerUp =
  props.onClick ??
  ((event) => {
    if (props.debug) {
      console.log("click", event);
    }
  });

const Profile = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 95%;
  height: 45px;
  overflow: hidden;
  gap: 16px;
  margin-left: 10px;
  padding: 0px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  flex: 1;

  img {
    height: 24px;
  }
`;

const Body = styled.div`
  align-items: center;
  flex: 1;
  font-size: 12px;
  overflow: ${(p) => (p.ellipsis ? "hidden" : "")};
  text-overflow: ${(p) => (p.ellipsis ? "ellipsis" : "")};
`;

const ButtonLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;

  img {
    width: 24px;
    height: 24px;
  }

  &:hover,
  &:focus {
    text-decoration: none;
    outline: none;
  }
`;

const TextLink = styled.a`
  display: block;
  margin: 0;
  margin-right: 42.22px;
  font-size: 14px;
  line-height: 18px;
  color: ${(p) => (p.bold ? "#FFFFFF !important" : "#606d7a !important")};
  font-weight: ${(p) => (p.bold ? "600" : "400")};
  font-size: ${(p) => (p.small ? "12px" : "14px")};
  font-style: normal;
  overflow: ${(p) => (p.ellipsis ? "hidden" : "visible")};
  text-align: left;
  text-overflow: ${(p) => (p.ellipsis ? "ellipsis" : "unset")};
  white-space: nowrap;
  outline: none;

  &:focus,
  &:hover {
    text-decoration: underline;
  }
`;

const Text = styled.p`
  display: block;
  font-size: 12px;
  line-height: 20px;
  font-weight: 400;
  color: #687076;
  white-space: nowrap;

  i {
    font-size: 16px;
  }
`;

return (
  <Profile href={profileUrl} onPointerUp={onClick}>
    <Header>
      <Widget
        src="${REPL_ACCOUNT}/widget/Search.AccountProfile"
        props={{
          accountId,
          hideAccountId: true,
        }}
      />
    </Header>

    <Body ellipsis={true}>
      <TextLink href={profileUrl} onPointerUp={onPointerUp} ellipsis>
        @{accountId}
      </TextLink>
    </Body>

    <ButtonLink href={postUrl} onPointerUp={onClick}>
      <button
        style={{
          backgroundColor: "rgba(255, 193, 7, 0)",
          padding: "10px 0px 10px 10px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        <a href={profileUrl}>
          <Text small bold>
            <i className="bi bi-arrow-right"></i>
          </Text>
        </a>
      </button>
    </ButtonLink>
  </Profile>
);
