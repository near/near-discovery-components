const [accountId, unused, widgetName] = props.src.split("/");
const detailsUrl = `/${REPL_ACCOUNT}/widget/ComponentDetailsPage?src=${accountId}/widget/${widgetName}`;
const appUrl = `/${accountId}/widget/${widgetName}`;
const accountUrl = `/${REPL_ACCOUNT}/widget/ProfilePage?accountId=${accountId}`;
const metadata = props.metadata ?? Social.get(`${accountId}/widget/${widgetName}/metadata/**`, "final") ?? {};
const tags = props.metadata ? Object.keys(props.metadata.tags || {}) : Object.keys(metadata.tags || {});

const Card = styled.div`
  position: relative;
  width: 100%;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #eceef0;
  box-shadow:
    0px 1px 3px rgba(16, 24, 40, 0.1),
    0px 1px 2px rgba(16, 24, 40, 0.06);
  overflow: hidden;
`;

const CardBody = styled.div`
  padding: 16px;
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

const CardFooter = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 16px;
  border-top: 1px solid #eceef0;
`;

const CardTag = styled.p`
  margin: 0;
  font-size: 9px;
  line-height: 14px;
  background: #eceef0;
  color: #687076;
  font-weight: 400;
  white-space: nowrap;
  position: absolute;
  top: 0;
  right: 0;
  border-bottom-left-radius: 3px;
  padding: 0 4px;

  i {
    margin-right: 3px;
  }
`;

const CardMetaDataContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 0 16px;
  font-size: 18px;
  column-gap: 14px;
  position: relative;
  height: 30px;
`;

const MetaDataItem = styled.div`
  display: flex;
  column-gap: 14px;
  color: #687076;
`;

const TextLink = styled("Link")`
  display: block;
  margin: 0;
  font-size: 14px;
  line-height: 18px;
  color: ${(p) => (p.$bold ? "#11181C !important" : "#687076 !important")};
  font-weight: ${(p) => (p.$bold ? "600" : "400")};
  font-size: ${(p) => (p.$small ? "12px" : "14px")};
  overflow: ${(p) => (p.$ellipsis ? "hidden" : "visible")};
  text-overflow: ${(p) => (p.$ellipsis ? "ellipsis" : "unset")};
  white-space: nowrap;
  outline: none;

  &:focus,
  &:hover {
    text-decoration: underline;
  }
`;

const Thumbnail = styled("Link")`
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

const ButtonLink = styled("Link")`
  padding: 8px;
  height: 32px;
  border: 1px solid #d7dbdf;
  border-radius: 100px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
  cursor: pointer;
  color: ${(p) => (p.$primary ? "#006ADC" : "#11181C")} !important;
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
    {!props.hideBlockHeightTimestamp && (
      <CardTag>
        <i className="bi bi-clock" />{" "}
        <Widget
          src="${REPL_MOB_2}/widget/TimeAgo${REPL_TIME_AGO_VERSION}"
          props={{
            blockHeight: props.blockHeight,
            keyPath: `${accountId}/widget/${widgetName}`,
          }}
        />{" "}
        ago
      </CardTag>
    )}

    <CardBody
      style={{ padding: (props.metadata?.star_count > 0 || props.metadata.fork_count > 0) && "16px 16px 4px 16px" }}
    >
      <Thumbnail href={detailsUrl}>
        <Widget
          src="${REPL_MOB}/widget/Image"
          props={{
            image: metadata.image,
            fallbackUrl: "https://ipfs.near.social/ipfs/bafkreifc4burlk35hxom3klq4mysmslfirj7slueenbj7ddwg7pc6ixomu",
            alt: metadata.name,
          }}
        />
      </Thumbnail>

      <CardContent>
        <TextLink href={detailsUrl} $bold $ellipsis>
          {metadata.name || widgetName}
        </TextLink>

        <TextLink href={accountUrl} $small $ellipsis>
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

    {(props?.metadata?.star_count > 0 || props?.metadata?.fork_count > 0) && (
      <CardMetaDataContainer>
        <MetaDataItem>
          <i className="ph ph-star" /> <p>{props.metadata.star_count === 0 ? "-" : props.metadata.star_count}</p>
        </MetaDataItem>
        <MetaDataItem>
          <i className="ph ph-git-fork" />
          <p>{props.metadata.fork_count === 0 ? "-" : props.metadata.fork_count}</p>
        </MetaDataItem>
      </CardMetaDataContainer>
    )}

    {!props.hideButtons && (
      <CardFooter>
        <ButtonLink href={detailsUrl}>View Details</ButtonLink>
        <ButtonLink href={appUrl} $primary>
          Open
        </ButtonLink>
      </CardFooter>
    )}
  </Card>
);
