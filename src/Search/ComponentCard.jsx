const [accountId, widget, widgetName] = props.src.split("/");
const metadata = Social.get(
  `${accountId}/widget/${widgetName}/metadata/**`,
  "final"
);
const tags = Object.keys(metadata.tags || {});
const detailsUrl = `/near/widget/ComponentDetailsPage?src=${accountId}/widget/${widgetName}`;
const appUrl = `/${accountId}/widget/${widgetName}`;
const accountUrl = `/near/widget/ProfilePage?accountId=${accountId}`;
const onPointerUp =
  props.onClick ??
  ((event) => {
    if (props.debug) {
      console.log("click", event);
    }
  });

const Card = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0px;
  width: 100%;
`;

const CardBody = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  width: 100%;
  flex-direction: row;
  min-width: 0;

  > div {
    display: flex;
    flex-direction: row;
    width: 100%;
    min-width: 0;
  }
`;

const Thumbnail = styled.a`
  display: block;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border: 1px solid #eceef0;
  border-radius: 8px;
  overflow: hidden;
  outline: none;
  transition: border-color 200ms;
  align-items: center;
  float: center;
  justify-content: center;
  &:focus,
  &:hover {
    border-color: #d0d5dd;
  }
  margin-left: 10px;

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  width: 95%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const Body = styled.div`
  align-items: center;
  flex: 1;
  font-size: 12px;
  overflow: ${(p) => (p.ellipsis ? "hidden" : "")};
  text-overflow: ${(p) => (p.ellipsis ? "ellipsis" : "")};
`;

const Col = styled.div`
  flex: ${({ flex }) => flex || "1"};
  justify-content: ${({ centered }) => (centered ? "center" : "auto")};
  overflow: hidden;
  text-overflow: ellipsis;
  overflow: ${({ noOverflow }) => (noOverflow ? "visible" : "hidden")};
`;

const TextLink = styled.a`
  display: block;
  margin: 0;
  font-size: 14px;
  line-height: 18px;
  color: ${(p) => (p.bold ? "#FFFFFF !important" : "#606D7A !important")};
  font-weight: ${(p) => (p.bold ? "600" : "400")};
  font-size: ${(p) => (p.small ? "14px" : "14px")};
  overflow: ${(p) => (p.ellipsis ? "hidden" : "visible")};
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

const ButtonLink = styled.a`
  align-items: right;
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

return (
  <Card>
    <CardBody>
      <Row>
        <Col flex={1}>
          <Header>
            <Thumbnail href={detailsUrl} onPointerUp={onPointerUp}>
              <Widget
                src="mob.near/widget/Image"
                props={{
                  image: metadata.image,
                  fallbackUrl:
                    "https://ipfs.near.social/ipfs/bafkreifc4burlk35hxom3klq4mysmslfirj7slueenbj7ddwg7pc6ixomu",
                  alt: metadata.name,
                }}
              />
            </Thumbnail>

            <TextLink
              as="a"
              style={{ marginLeft: "10px" }}
              href={detailsUrl}
              onPointerUp={onPointerUp}
              bold
              ellipsis
            >
              {metadata.name || widgetName}
            </TextLink>
          </Header>
        </Col>
        <Col style={{ alignItems: "center", textAlign: "left" }}>
          <Body>
            <TextLink
              small
              as="a"
              href={accountUrl}
              onPointerUp={onPointerUp}
              ellipsis
            >
              @{accountId}
            </TextLink>
          </Body>
        </Col>
        <Col style={{ float: "right", textAlign: "right" }} flex={1}>
          <ButtonLink href={appUrl} onPointerUp={onPointerUp}>
            <button
              style={{
                backgroundColor: "rgba(255, 193, 7, 0)",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              <a href={appUrl}>
                <Text small bold>
                  <i className="bi bi-arrow-right"></i>
                </Text>
              </a>
            </button>
          </ButtonLink>
        </Col>
      </Row>
    </CardBody>
  </Card>
);
