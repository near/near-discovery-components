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
  width: 445.85px;
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
  border: 1px solid #eceef0;
  overflow: hidden;
  border-radius: 56px;
  transition: border-color 200ms;

  img {
    object-fit: cover;
    width: 50px;
    height: 50px;
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
`;

const Col = styled.div`
  flex: 1;
  padding: 0 10px;
  overflow: hidden; /* turn off overflow */
  text-overflow: ellipsis;
`;

const col1 = {
  width: "66.32px",
  backgroundColor: "blue",
};

const col2 = {
  width: "107px",
  marginRight: 42.22,
};

const col3 = {
  width: "300px",
};

const col4 = {
  textAlign: "right",
  padding: 0,
  justifyContent: "center",
};
const TagsWrapper = styled.div`
  padding-top: 4px;
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

        <Col>
          <TextLink href={profileUrl} onPointerUp={onPointerUp} ellipsis bold>
            {profile.name || accountId.split(".near")[0]}
          </TextLink>
        </Col>
        <Col>
          <TextLink href={profileUrl} onPointerUp={onPointerUp} ellipsis>
            @{accountId}
          </TextLink>
        </Col>

        <Col>
          {!!context.accountId && context.accountId !== props.accountId && (
            <button
              onClick={() =>
                console.log(`redirecting you to the profile`, profileUrl)
              }
              style={{
                backgroundColor: "rgba(255, 193, 7, 0)",
                padding: "10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              <a href={profileUrl}>
                <img
                  src="https://i.imgur.com/dIDX59g.png"
                  alt="Follow icon"
                  style={{ height: "20px", marginRight: "5px" }}
                />
              </a>
            </button>
          )}
        </Col>
      </Row>
    </CardLeft>
  </Card>
);
