const accountId = props.accountId;
const profile = props.profile || Social.get(`${accountId}/profile/**`, "final");
// const tags = Object.keys(profile.tags || {});
const tags = Object.keys(profile.tags || { users: "dog", animals: "zoo" });
const profileUrl = `/near/widget/ProfilePage?accountId=${accountId}`;
const onPointerUp =
  props.onClick ??
  ((event) => {
    if (props.debug) {
      console.log("click", event);
    }
  });

State.init({
  show: false,
});

const Card = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0px;
  width: 100%;
`;

const CardLeft = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  width: 100%;
  min-width: 0;

  > div {
    display: flex;
    flex-direction: row;
    width: 100%;
    min-width: 0;
  }
`;

const Avatar = styled.a`
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 56px;
  transition: border-color 200ms;

  img {
    object-fit: cover;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  &:hover,
  &:focus {
    border-color: #d0d5dd;
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
  text-overflow: ${(p) => (p.ellipsis ? "ellipsis" : "unset")};
  white-space: nowrap;
  outline: none;

  &:focus,
  &:hover {
    text-decoration: underline;
  }
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10px;
  align-items: center;
  gap: 10px;
  padding-left: 5px;
`;

const Col = styled.div`
  flex: ${({ flex }) => flex || "1"};
  overflow: hidden; /* turn off overflow */
  text-overflow: ellipsis;
  overflow: ${({ noOverflow }) => (noOverflow ? "visible" : "hidden")};
`;

const col2 = {
  maxWidth: "40px",
};

const col3 = {
  maxWidth: "50px",
};

const col4 = {
  textAlign: "right",
  padding: 0,
  justifyContent: "center",
};
const TagsWrapper = styled.div`
  padding-top: 4px;
`;

const Text = styled.p`
  margin: 0;
  font-size: 10px;
  line-height: 14px;
  color: #687076;
  font-weight: 400;
  flex-shrink: 0;
  white-space: nowrap;
  text-align: center;
  overflow: hidden;

  i {
    font-size: 16px;
  }
`;

return (
  <Card>
    <CardLeft>
      <Row>
        <Col>
          <Avatar href={profileUrl} onPointerUp={onPointerUp}>
            <Widget
              src="mob.near/widget/Image"
              props={{
                image: profile.image,
                alt: profile.name,
                fallbackUrl:
                  "https://ipfs.near.social/ipfs/bafkreibiyqabm3kl24gcb2oegb7pmwdi6wwrpui62iwb44l7uomnn3lhbi",
              }}
            />
          </Avatar>
        </Col>

        <Col style={{ col2 }} flex={2} style={{ textAlign: "left" }}>
          <TextLink href={profileUrl} onPointerUp={onPointerUp} ellipsis bold>
            {profile.name || accountId.split(".near")[0]}
          </TextLink>
        </Col>
        <Col flex={2} style={{ textAlign: "left" }}>
          <TextLink href={profileUrl} onPointerUp={onPointerUp} ellipsis>
            @{accountId}
          </TextLink>
        </Col>

        <Col noOverflow style={{ textAlign: "right" }}>
          {!!context.accountId && context.accountId !== props.accountId && (
            <button
              onClick={() =>
                console.log(`redirecting you to the profile`, profileUrl)
              }
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
          )}
        </Col>
      </Row>
    </CardLeft>
  </Card>
);
