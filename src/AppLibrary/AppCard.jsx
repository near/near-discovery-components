const [accountId, unused, widgetName] = props.src.split("/");
const appUrl = `#/${accountId}/widget/${widgetName}`;
const accountUrl = `#/${REPL_ACCOUNT}/widget/ProfilePage?accountId=${accountId}`;
const metadata =
  props.metadata ??
  Social.get(`${accountId}/widget/${widgetName}/metadata/**`, "final") ??
  {};
const tags = props.metadata
  ? props.metadata.tags
  : Object.keys(metadata.tags || {});

const Card = styled.div`
  position: relative;
  width: 100%;
`;

const CardBody = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;

  > * {
    min-width: 0;
  }
`;

const CardContent = styled.div`
  width: 100%;
`;

const TextLink = styled.a`
  display: block;
  margin: 0;
  font-size: 14px;
  line-height: 18px;
  color: ${(p) => (p.bold ? "#11181C !important" : "#687076 !important")};
  font-weight: ${(p) => (p.bold ? "600" : "400")};
  font-size: ${(p) => (p.small ? "12px" : "14px")};
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
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: ${(p) => (p.bold ? "#11181C" : "#687076")};
  font-weight: ${(p) => (p.bold ? "600" : "400")};
  font-size: ${(p) => (p.small ? "12px" : "14px")};
  overflow: ${(p) => (p.ellipsis ? "hidden" : "")};
  text-overflow: ${(p) => (p.ellipsis ? "ellipsis" : "")};
  white-space: nowrap;

  i {
    margin-right: 3px;
  }
`;

const Thumbnail = styled.a`
  display: block;
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border: 1px solid #eceef0;
  border-radius: 8px;
  overflow: hidden;
  outline: none;
  transition: border-color 200ms;

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

const TagsWrapper = styled.div`
  position: relative;
  margin-top: 4px;
`;

const ButtonLink = styled.a`
  padding: 8px;
  height: 32px;
  border: 1px solid #d7dbdf;
  border-radius: 100px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
  cursor: pointer;
  color: ${(p) => (p.primary ? "#006ADC" : "#11181C")} !important;
  background: #fbfcfd;
  white-space: nowrap;

  &:hover,
  &:focus {
    background: #ecedee;
    text-decoration: none;
    outline: none;
  }
`;

return (
  <Card>
    <CardBody>
      <Thumbnail href={appUrl}>
        <Widget
          src="${REPL_MOB}/widget/Image"
          props={{
            image: metadata.image,
            fallbackUrl:
              "https://ipfs.near.social/ipfs/bafkreifc4burlk35hxom3klq4mysmslfirj7slueenbj7ddwg7pc6ixomu",
            alt: metadata.name,
          }}
        />
      </Thumbnail>

      <CardContent>
        <TextLink as="a" href={appUrl} bold ellipsis>
          {metadata.name || widgetName}
        </TextLink>

        <TextLink small as="a" href={accountUrl} ellipsis>
          @{accountId}
        </TextLink>

        {tags.length > 0 && (
          <TagsWrapper>
            <Widget
              src="${REPL_ACCOUNT}/widget/Tags"
              props={{
                tags,
                scroll: true,
              }}
            />
          </TagsWrapper>
        )}
      </CardContent>
    </CardBody>
  </Card>
);
