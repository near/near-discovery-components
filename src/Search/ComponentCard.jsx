const [accountId, widget, widgetName] = props.src.split("/");
const variant = props.variant ?? "default";
const metadata =
  variant === "nearcatalog"
    ? { image: props.image, name: props.name }
    : Social.get(`${accountId}/widget/${widgetName}/metadata/**`, "final");
const appUrl = `/${accountId}/widget/${widgetName}`;
const detailsUrl =
  variant === "nearcatalog"
    ? appUrl
    : `/${REPL_ACCOUNT}/widget/ComponentDetailsPage?src=${accountId}/widget/${widgetName}`;
const accountUrl = `/${REPL_ACCOUNT}/widget/ProfilePage?accountId=${accountId}`;
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
  align-items: center;
  width: 95%;
  height: 45px;
  overflow: hidden;
  gap: 16px;
  margin-left: 10px;
`;

const Thumbnail = styled("Link")`
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

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

const HeaderAbove = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const Header = styled.div`
  display: inline-grid;
  width: 100%;
  align-items: center;
  gap: 12px;
  grid-template-columns: auto 1fr;
  cursor: pointer;
  margin: 0;
  color: #687076 !important;
  outline: none;
  text-decoration: none !important;
  background: none !important;
  border: none;
  text-align: left;
  padding: 0;

  > * {
    min-width: 0;
  }
`;

const WidgetName = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const Body = styled.div`
  margin: 0;
  align-items: center;
  flex: 1;
  font-size: 12px;
  overflow: ${(p) => (p.ellipsis ? "hidden" : "")};
  text-overflow: ${(p) => (p.ellipsis ? "ellipsis" : "")};
`;

const TextLink = styled("Link")`
  display: block;
  margin: 0;
  font-size: 12px;
  line-height: 18px;
  color: ${(p) => (p.bold ? "#FFFFFF !important" : "#606D7A !important")};
  font-weight: ${(p) => (p.bold ? "600" : "400")};
  font-size: ${(p) => (p.small ? "14px" : "14px")};
  text-align: left;
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

const ButtonLink = styled("Link")`
  display: inline-flex;
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
    <HeaderAbove>
      <Header>
        <Thumbnail href={detailsUrl} onPointerUp={onPointerUp}>
          <Widget
            src="${REPL_MOB}/widget/Image"
            props={{
              image: metadata.image,
              fallbackUrl: "https://ipfs.near.social/ipfs/bafkreifc4burlk35hxom3klq4mysmslfirj7slueenbj7ddwg7pc6ixomu",
              alt: metadata.name,
            }}
          />
        </Thumbnail>
        <WidgetName>
          <TextLink href={detailsUrl} onPointerUp={onPointerUp} bold ellipsis>
            {metadata.name ?? widgetName}
          </TextLink>
        </WidgetName>
      </Header>
    </HeaderAbove>

    <Body ellipsis={true}>
      <TextLink href={accountUrl} onPointerUp={onPointerUp}>
        @{accountId}
      </TextLink>
    </Body>
    <ButtonLink href={appUrl} onPointerUp={onPointerUp}>
      <button
        style={{
          padding: "10px 0px 10px 10px",
          backgroundColor: "rgba(255, 193, 7, 0)",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        <Link href={appUrl}>
          <Text small bold>
            <i className="bi bi-arrow-right"></i>
          </Text>
        </Link>
      </button>
    </ButtonLink>
  </Card>
);
