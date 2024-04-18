let { emitGatewayEvent, src } = props;

if (!src) return "";

State.init({
  copiedShareUrl: false,
});

const primaryAction = props.primaryAction || "viewDetails";
const [accountId, widget, widgetName] = src.split("/");
const data = Social.get(`${accountId}/widget/${widgetName}/metadata/**`);
const metadata = data || {};
const tags = Object.keys(metadata.tags || {});
const appUrl = `/${src}`;
const detailsUrl = `/${REPL_ACCOUNT}/widget/ComponentDetailsPage?src=${src}`;
const shareUrl = `https://${REPL_NEAR_URL}${detailsUrl}`;
const size = props.size || "large";
const componentDescMaxWords = props.descMaxWords || 30;

if (props.showDesc && metadata.description) {
  const text = metadata.description.split(" ");
  metadata.description = text.slice(0, componentDescMaxWords);
  if (text.length >= componentDescMaxWords) {
    metadata.description.push("...");
  }
  metadata.description = metadata.description.join(" ");
}

const handleCloseMenu = () => {
  props.onCloseMenu();
};

const primaryActions = {
  open: {
    display: "Open",
    url: appUrl,
    fork: context.accountId === accountId ? false : true,
  },
  viewDetails: {
    display: "View Source",
    url: detailsUrl,
    fork: false,
  },
};

const sizes = {
  medium: {
    gap: "16px",
    thumbnail: "56px",
    title: "16px",
  },
  large: {
    gap: "16px",
    thumbnail: "100px",
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
    0px 1px 3px rgba(16, 24, 40, 0.1),
    0px 1px 2px rgba(16, 24, 40, 0.06);

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
  border: ${(p) => (p.primary ? "none" : "1px solid #D7DBDF")};

  &:hover,
  &:focus {
    background: ${(p) => (p.primary ? "rgb(112 242 164)" : "#ECEDEE")};
  }
`;

const ButtonLink = styled("Link")`
  ${sharedButtonStyles}
  color: ${(p) => (p.primary ? "#09342E" : "#11181C")} !important;
  background: ${(p) => (p.primary ? "#59E692" : "#FBFCFD")};
  border: ${(p) => (p.primary ? "none" : "1px solid #D7DBDF")};

  &:hover,
  &:focus {
    background: ${(p) => (p.primary ? "rgb(112 242 164)" : "#ECEDEE")};
  }
`;

const Text = styled.p`
  margin: 0;
  font-size: 14px;
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

function normalizeMarkdown(text) {
  // convert headers to normal text (remove # symbols)
  text = text.replace(/^#+\s*/gm, "");
  // convert bold and italic to normal text (remove * and _ symbols)
  text = text.replace(/(\*\*|__)(.*?)\1/g, "$2");
  text = text.replace(/(\*|_)(.*?)\1/g, "$2");
  // remove links
  text = text.replace(/\[(.*?)\]\(.*?\)/g, "$1");
  // remove images
  text = text.replace(/!\[(.*?)\]\(.*?\)/g, "$1");
  return text.trim();
}

function emitPinnedAppsGatewayEvent(isPinned) {
  const app = {
    authorAccountId: accountId,
    displayName: metadata.name || widgetName,
    componentName: widgetName,
    imageUrl: metadata.image?.ipfs_cid ? `https://ipfs.near.social/ipfs/${metadata.image.ipfs_cid}` : null,
  };

  emitGatewayEvent &&
    emitGatewayEvent({
      type: "PINNED_APPS",
      app,
      action: isPinned ? "PINNED" : "UNPINNED",
    });
}

function pinnedAppsFeatureEnabled() {
  if (emitGatewayEvent) {
    return emitGatewayEvent({
      type: "PINNED_APPS",
      action: "FEATURE_ENABLED",
    });
  }
  return false;
}

return (
  <Wrapper>
    <Header size={size}>
      <Thumbnail size={size}>
        <Widget
          src="${REPL_MOB}/widget/Image"
          props={{
            image: metadata.image,
            fallbackUrl: "https://ipfs.near.social/ipfs/bafkreigk3gygr4sqswn6tr2upw2w7xlp4klay36mic4cpc6by3ki45uqf4",
            alt: metadata.name,
          }}
        />
      </Thumbnail>

      <div>
        <Title size={size}>{metadata.name || widgetName}</Title>
        <Text ellipsis>{src}</Text>
      </div>
    </Header>

    {props.showDesc && (
      <div style={{ paddingBottom: "10px" }}>
        {metadata.description ? (
          <Text>{normalizeMarkdown(metadata.description)}</Text>
        ) : (
          <Text>This component has no description.</Text>
        )}
      </div>
    )}

    {props.showTags && tags.length > 0 && (
      <TagsWrapper>
        <Widget
          src="${REPL_ACCOUNT}/widget/Tags"
          props={{
            tags,
          }}
        />
      </TagsWrapper>
    )}

    <Actions>
      <ButtonLink primary href={primaryActions[primaryAction].url} onClick={handleCloseMenu}>
        {primaryActions[primaryAction].display}
      </ButtonLink>

      {context.accountId === accountId && (
        <ButtonLink href={`/edit/${src}`}>
          <i className="bi bi-pencil-fill"></i> Edit
        </ButtonLink>
      )}

      {primaryActions[primaryAction].fork && (
        <ButtonLink href={`/edit/${src}`}>
          <i className="bi bi-git"></i> Fork
        </ButtonLink>
      )}

      <Widget
        src="${REPL_ACCOUNT}/widget/SocialIndexActionButton"
        key="social-index-action-star"
        props={{
          actionName: "star",
          actionUndoName: "unstar",
          item: {
            type: "social",
            path: src,
          },
          notifyAccountId: accountId,
          button: (starCount, starIsActive, starOnClick) => (
            <Widget
              src="${REPL_ACCOUNT}/widget/DIG.Tooltip"
              props={{
                content: context.accountId
                  ? starIsActive
                    ? "Unstar this app"
                    : "Star this app"
                  : "Sign in to star this app",
                trigger: (
                  <Button type="button" onClick={starOnClick} aria-label="Star this component">
                    {starIsActive ? (
                      <i className="bi bi-star-fill" style={{ color: "var(--amber10)" }} />
                    ) : (
                      <i className="bi bi-star" />
                    )}{" "}
                    {starCount}
                  </Button>
                ),
              }}
            />
          ),
        }}
      />

      {pinnedAppsFeatureEnabled() && (
        <Widget
          src="${REPL_ACCOUNT}/widget/SocialIndexActionButton"
          key="social-index-action-pin"
          props={{
            actionName: "pin",
            actionUndoName: "unpin",
            item: {
              type: "social",
              path: src,
            },
            notifyAccountId: accountId,
            onCommitStart: (pinIsActive) => {
              emitPinnedAppsGatewayEvent(pinIsActive);
            },
            onCommitFailure: (pinIsActive) => {
              emitPinnedAppsGatewayEvent(pinIsActive);
            },
            button: (pinCount, pinIsActive, pinOnClick) => (
              <Widget
                src="${REPL_ACCOUNT}/widget/DIG.Tooltip"
                props={{
                  content: context.accountId
                    ? pinIsActive
                      ? "Unpin this app"
                      : "Pin this app to access it quickly"
                    : "Sign in to pin this app",
                  trigger: (
                    <Button type="button" onClick={pinOnClick} aria-label="Pin this component">
                      {pinIsActive ? (
                        <>
                          <i className="ph-fill ph-push-pin" style={{ color: "var(--amber10)", fontSize: "1rem" }} />{" "}
                          Pinned
                        </>
                      ) : (
                        <>
                          <i className="ph ph-push-pin" style={{ fontSize: "1rem" }} />
                          Pin
                        </>
                      )}
                    </Button>
                  ),
                }}
              />
            ),
          }}
        />
      )}

      <Widget
        src="${REPL_ACCOUNT}/widget/DIG.Tooltip"
        props={{
          content: "Copy URL to clipboard",
          trigger: (
            <Button
              type="button"
              onMouseLeave={() => {
                State.update({ copiedShareUrl: false });
              }}
              onClick={() => {
                clipboard.writeText(shareUrl).then(() => {
                  State.update({ copiedShareUrl: true });
                });
              }}
            >
              {state.copiedShareUrl ? (
                <i className="bi bi-16 bi-check"></i>
              ) : (
                <i className="bi bi-16 bi-link-45deg"></i>
              )}
              Share
            </Button>
          ),
        }}
      />
    </Actions>
  </Wrapper>
);
