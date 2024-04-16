if (!props.entity) return "";
const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");
if (!href) {
  return <></>;
}

const { entity, showActions, returnTo } = props;
const { namespace, entityType, accountId, name, displayName, logoUrl, tags } = entity;

const [entityDeleted, setEntityDeleted] = useState(false);
const deleteEntity = async (entity) => {
  const { name } = entity;
  const entityData = { [name]: { operation: "delete" } };
  const ns = namespace ? namespace : "default";
  const data = { [ns]: { [entityType]: entityData } };
  const result = Social.set(
    { entities: JSON.stringify(data) },
    {
      force: true,
      onCommit: () => {
        setEntityDeleted(true);
      },
      onCancel: () => {},
    },
  );
};
if (entityDeleted) {
  return (
    <div className="alert alert-success mx-3" role="alert">
      <div>Entity deleted</div>
      <Link to={href({ widgetSrc: returnTo })}>Back to List</Link>
    </div>
  );
}

const size = props.size || "small";

const sizes = {
  small: {
    gap: "16px",
    thumbnail: "100px",
    title: "16px",
  },
  large: {
    gap: "16px",
    thumbnail: "200px",
    title: "32px",
  },
};

const Wrapper = styled.div``;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => sizes[p.size].gap};
  margin-bottom: 32px;

  > * {
    min-width: 0;
  }

  @media (max-width: 770px) {
    gap: 16px;
  }
`;

const TagsWrapper = styled.div`
  margin-bottom: 16px;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

const Title = styled.h1`
  font-size: ${(p) => sizes[p.size].title};
  line-height: 1.2em;
  color: #11181c;
  margin: 0 0 8px;
  font-weight: 600;

  @media (max-width: 770px) {
    font-size: 16px;
    margin: 0;
  }
`;

const Thumbnail = styled.div`
  width: ${(p) => sizes[p.size].thumbnail};
  height: ${(p) => sizes[p.size].thumbnail};
  flex-shrink: 0;
  border: 1px solid #eceef0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow:
    0 1px 3px rgba(16, 24, 40, 0.1),
    0 1px 2px rgba(16, 24, 40, 0.06);

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  @media (max-width: 770px) {
    width: 58px;
    height: 58px;
  }
`;

const sharedButtonStyles = `
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  height: 32px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
  cursor: pointer;

  &:hover,
  &:focus {
    text-decoration: none;
    outline: none;
  }

  i {
    color: #7E868C;
  }

  .bi-16 {
    font-size: 16px;
  }
`;

const Button = styled.button`
  ${sharedButtonStyles}
  color: ${(p) => (p.primary ? "#09342E" : "#11181C")} !important;
  background: ${(p) => (p.primary ? "#59E692" : "#FBFCFD")};
  border: ${(p) => "none"};

  &:hover,
  &:focus {
    background: ${(p) => (p.primary ? "rgb(112 242 164)" : "#ECEDEE")};
  }
`;

const Text = styled.p`
  margin: 0;
  line-height: 20px;
  color: ${(p) => (p.bold ? "#11181C" : "#687076")};
  font-weight: ${(p) => (p.bold ? "600" : "400")};
  font-size: ${(p) => (p.small ? "12px" : "14px")};
  overflow: ${(p) => (p.ellipsis ? "hidden" : "visible")};
  text-overflow: ${(p) => (p.ellipsis ? "ellipsis" : "unset")};
  white-space: ${(p) => (p.ellipsis ? "nowrap" : "")};

  i {
    margin-right: 4px;
  }
`;

return (
  <Wrapper>
    <Header size={size}>
      <Thumbnail size={size}>
        <Widget
          src="${REPL_MOB}/widget/Image"
          props={{
            image: { url: logoUrl },
            fallbackUrl: "https://ipfs.near.social/ipfs/bafkreibysr2mkwhb4j36h2t7mqwhynqdy4vzjfygfkfg65kuspd2bawauu",
            alt: name,
          }}
        />
      </Thumbnail>

      <div>
        <Title size={size}>{displayName}</Title>
        <Text ellipsis>{name}</Text>
        <Text ellipsis>by {accountId}</Text>
      </div>
    </Header>

    {tags && tags.length > 0 && (
      <TagsWrapper>
        <Widget
          src="${REPL_ACCOUNT}/widget/Tags"
          props={{
            tags,
          }}
        />
      </TagsWrapper>
    )}

    {showActions && (
      <Actions>
        {accountId === context.accountId && (
          <Widget
            src="${REPL_ACCOUNT}/widget/DIG.Tooltip"
            props={{
              content: "Edit",
              trigger: (
                <Widget
                  src="${REPL_ACCOUNT}/widget/DIG.Button"
                  props={{
                    label: "Delete",
                    disabled: !context.accountId || context.accountId !== accountId,
                    onClick: () => deleteEntity(entity),
                    iconLeft: "ph-bold ph-trash",
                    variant: "destructive",
                    fill: "ghost",
                    size: "small",
                  }}
                />
              ),
            }}
          />
        )}
        <Widget
          src="${REPL_ACCOUNT}/widget/CopyUrlButton"
          props={{
            url: entityChatUrl,
          }}
        />
        <Widget
          src="${REPL_ACCOUNT}/widget/ShareButton"
          props={{
            postType: "AI Entity",
            url: entityChatUrl,
          }}
        />
        <Widget
          src="${REPL_ACCOUNT}/widget/SocialIndexActionButton"
          props={{
            actionName: "star",
            actionUndoName: "unstar",
            item: {
              type: "social",
              path: `${accountId}/entities/${namespace}/${entityType}/${name}`,
            },
            notifyAccountId: accountId,
            button: (starCount, starIsActive, starOnClick) => (
              <Button type="button" onClick={starOnClick} aria-label="Star this">
                {starIsActive ? (
                  <i className="bi bi-star-fill" style={{ color: "var(--amber10)" }} />
                ) : (
                  <i className="bi bi-star" />
                )}{" "}
                {starCount}
              </Button>
            ),
          }}
        />{" "}
      </Actions>
    )}
  </Wrapper>
);
