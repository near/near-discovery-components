if (!props.src) return "";

State.init({
  copiedShareUrl: false,
  showVoteButton: false,
});

const src = props.src;
const primaryAction = props.primaryAction || "viewDetails";
const [accountId, widget, widgetName] = src.split("/");
const data = Social.get(`${accountId}/widget/${widgetName}/metadata/**`);
const metadata = data || {};
const tags = Object.keys(metadata.tags || {});
const appUrl = `/${src}`;
const detailsUrl = `/${REPL_ACCOUNT}/widget/ComponentDetailsPage?src=${src}`;
const shareUrl = `https://${REPL_NEAR_URL}${detailsUrl}`;
const size = props.size || "large";
const componentDescMaxWords =  props.descMaxWords || 30;

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
  },
  viewDetails: {
    display: "View Details",
    url: detailsUrl,
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
  box-shadow: 0px 1px 3px rgba(16, 24, 40, 0.1),
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

const votes = Social.index("vote", src);

const dataLoading = votes === null;
const votesByUsers = {};

(votes || []).forEach((vote) => {
  if (vote.value.type === "vote") {
    votesByUsers[vote.accountId] = vote;
  } else if (vote.value.type === "unvote") {
    delete votesByUsers[vote.accountId];
  }
});

if (state.hasVote === true) {
  votesByUsers[context.accountId] = {
    accountId: context.accountId,
  };
} else if (state.hasVote === false) {
  delete votesByUsers[context.accountId];
}

const accountsWithVotes = Object.keys(votesByUsers);
const voteCount = accountsWithVotes.length;
const hasVote = context.accountId && !!votesByUsers[context.accountId];

function checkNearConEventDate() {
  const today = new Date();
  const compareDate = new Date('2023-11-05T00:00:00');

  if (today >= compareDate) {
    return true
  } else {
    return false
  }
}

function loadAppQuestData() {
  if (state.apps.length > 0) return;

  asyncFetch(
    "https://storage.googleapis.com/databricks-near-query-runner/output/nearcon_apps/apps_qualified.json"
  )
    .then((res) => {
        const apps = [JSON.parse(JSON.parse(res.body).data)];
        if (!apps) return

        const isAppSignedUpToNearConAppQuest = apps.some((app) => app.widget_name === src);
        const showVoteButton = isAppSignedUpToNearConAppQuest && checkNearConEventDate()

      State.update({
        showVoteButton
      });
    })
}

loadAppQuestData();

const VoteButton = styled.div`
  line-height: 20px;
  min-height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: left;
  .icon {
    position: relative;
    &:before {
      margin: -8px;
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      border-radius: 50%;
    }
  }

  .count {
    margin-left: 8px;
  }

  &:not([disabled]) {
    cursor: pointer;
  }

  &:not([disabled]):hover {
    opacity: 1 !important;

  }
`;

const voteClick = () => {
  if (state.loading || dataLoading || !context.accountId) {
    return;
  }
  State.update({
    loading: true,
  });
  const type = hasVote ? "unvote" : "vote";
  const data = {
    index: {
      vote: JSON.stringify({
        key: src,
        value: {
          type,
        },
      }),
      nearConAppQuest2023: JSON.stringify({
        key: src,
        value: {
          type,
        }
      })
    },
  };

  if (item.type === "social" && typeof item.path === "string") {
    const keys = item.path.split("/");
    if (keys.length > 0) {
      data.graph = {
        vote: {},
      };
      let root = data.graph.vote;
      keys.slice(0, -1).forEach((key) => {
        root = root[key] = {};
      });
      root[keys[keys.length - 1]] = hasVote ? null : "";
    }
  }

  if (!hasVote && props.notifyAccountId) {
    data.index.notify = JSON.stringify({
      key: props.notifyAccountId,
      value: {
        type,
        item,
      },
    });
  }
  Social.set(data, {
    onCommit: () => State.update({ loading: false, hasVote: !hasVote }),
    onCancel: () => State.update({ loading: false }),
  });
};

const nearcon_logo = () => {
  return (<svg width="37" height="22" viewBox="0 0 37 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_848_4312)">
      <rect x="0.1875" y="0.375" width="36.25" height="21.25" rx="10.625" fill="#00EC97" />
      <path d="M37.232 5.21744L13.2495 3.52244C12.812 3.49244 12.3945 3.71744 12.1795 4.09994C11.9645 4.48244 11.9895 4.95494 12.2445 5.31244L25.577 24.0224C25.852 24.4099 26.342 24.5824 26.7995 24.4599H26.802C27.262 24.3324 27.592 23.9324 27.632 23.4574L28.457 13.1999L37.7595 7.30994C38.1745 7.04744 38.372 6.54994 38.252 6.07494C38.132 5.59494 37.7195 5.25244 37.232 5.21744Z" fill="white" />
      <path d="M13.0148 6.98755C12.6973 6.98755 12.4023 7.15255 12.2373 7.42255L10.4473 10.08C10.3898 10.1675 10.4123 10.285 10.4998 10.345C10.5698 10.3925 10.6648 10.3875 10.7298 10.33L12.4923 8.80255C12.5223 8.77505 12.5673 8.78005 12.5923 8.80755C12.6048 8.82005 12.6098 8.83755 12.6098 8.85505V13.64C12.6098 13.68 12.5773 13.7125 12.5373 13.7125C12.5173 13.7125 12.4973 13.7025 12.4823 13.6875L7.1573 7.31005C6.9848 7.10505 6.7298 6.98755 6.4598 6.98755H6.2748C5.7698 6.98755 5.3623 7.39505 5.3623 7.90005V14.64C5.3623 15.145 5.7698 15.5525 6.2748 15.5525C6.5923 15.5525 6.8873 15.3875 7.0523 15.1175L8.8423 12.46C8.8998 12.3725 8.8773 12.255 8.7898 12.195C8.71981 12.1475 8.6248 12.1525 8.5598 12.21L6.7973 13.7375C6.7673 13.765 6.7223 13.76 6.6973 13.7325C6.6848 13.72 6.6798 13.7025 6.6798 13.685V8.89755C6.6798 8.85755 6.7123 8.82505 6.7523 8.82505C6.7723 8.82505 6.7923 8.83505 6.8073 8.85005L12.1348 15.2275C12.3073 15.4325 12.5623 15.55 12.8323 15.55H13.0173C13.5223 15.55 13.9298 15.1425 13.9298 14.6375V7.90005C13.9273 7.39505 13.5198 6.98755 13.0148 6.98755Z" fill="black" />
      <path d="M24.5303 15.415H18.4678V14.3975L21.5903 11.565C22.4578 10.77 22.9878 10.2425 22.9878 9.4525C22.9878 8.69 22.4703 8.25 21.5703 8.25C20.5678 8.25 20.0053 8.7475 19.9828 9.6525L19.9803 9.71749H18.5603V9.4825C18.6053 7.9475 19.7653 6.995 21.5853 6.995C23.3878 6.995 24.4628 7.89 24.4628 9.3875C24.4628 10.835 23.5278 11.635 22.3453 12.65L22.2828 12.7025L20.6203 14.165H24.5228V15.415H24.5303ZM18.6003 15.2825H24.3978V14.2925H20.2778L22.2653 12.545C23.4228 11.5525 24.3353 10.77 24.3353 9.3825C24.3353 7.9675 23.3078 7.12249 21.5878 7.12249C19.8178 7.12249 18.7378 8.00499 18.6953 9.48V9.5825H19.8553C19.9028 8.65 20.5253 8.11749 21.5703 8.11749C22.5403 8.11749 23.1178 8.615 23.1178 9.45C23.1178 10.28 22.5728 10.8375 21.6753 11.66L18.5953 14.4525V15.2825H18.6003Z" fill="black" stroke="black" stroke-width="0.25" />
      <path d="M27.2727 11.295L26.7727 11.2275L26.7052 10.7275C26.6977 10.67 26.6152 10.67 26.6077 10.7275L26.5402 11.2275L26.0402 11.295C25.9827 11.3025 25.9827 11.385 26.0402 11.3925L26.5402 11.46L26.6077 11.96C26.6152 12.0175 26.6977 12.0175 26.7052 11.96L26.7727 11.46L27.2727 11.3925C27.3302 11.385 27.3302 11.3025 27.2727 11.295Z" fill="black" stroke="black" stroke-width="0.25" />
      <path d="M18.1175 7.26507L17.4975 9.43507C17.475 9.52007 17.3975 9.58007 17.3075 9.58007C17.2 9.58007 17.11 9.49257 17.11 9.38507V7.26507H18.1175ZM18.2925 7.13257H18.1175H17.11H16.9775V7.26507V9.38507C16.9775 9.56757 17.125 9.71257 17.3075 9.71257C17.455 9.71257 17.585 9.61257 17.625 9.47007L18.245 7.30007L18.2925 7.13257Z" fill="black" stroke="black" stroke-width="0.25" />
      <path d="M27.7676 11.265H27.5801V11.3975H27.7676C28.7976 11.3975 29.4176 11.79 29.5451 12.5125L29.6651 12.4375C29.5026 11.685 28.8326 11.265 27.7676 11.265Z" fill="black" stroke="black" stroke-width="0.25" />
      <path d="M26.615 10.3376V10.4001H26.7475L29.325 8.25507H25.1925V7.26507H30.8675V8.13507L28.0625 10.4551H28.365C29.515 10.4551 30.345 10.9451 30.695 11.7826L30.81 11.7101C30.4425 10.8501 29.5975 10.3426 28.4275 10.3251L31 8.19757V7.13257H25.0625V8.38507H28.965L26.615 10.3376Z" fill="black" stroke="black" stroke-width="0.25" />
      <path d="M28.2698 15.5375L28.2798 15.405C28.1648 15.4125 28.0473 15.4175 27.9248 15.4175C26.1298 15.4175 24.9123 14.4625 24.8948 13.045V12.94H26.0348C26.0973 13.8475 26.8248 14.4275 27.9073 14.4275C28.0673 14.4275 28.2198 14.415 28.3598 14.39L28.3698 14.2525C28.2273 14.28 28.0698 14.295 27.9048 14.295C26.8723 14.295 26.1873 13.735 26.1598 12.87L26.1573 12.8075H24.7598V13.045C24.7773 14.5425 26.0473 15.55 27.9198 15.55C28.0423 15.55 28.1573 15.545 28.2698 15.5375Z" fill="black" stroke="black" stroke-width="0.25" />
    </g>
    <defs>
      <clipPath id="clip0_848_4312">
        <rect x="0.1875" y="0.375" width="36.25" height="21.25" rx="10.625" fill="white" />
      </clipPath>
    </defs>
  </svg>
  )
}
const title = hasVote ? "Downvote" : "Upvote";
const inner = (
  <div className="d-inline-flex align-items-center">
    <VoteButton
      disabled={state.loading || dataLoading || !context.accountId}
      title={title}
      onClick={voteClick}
    >
      {nearcon_logo()}
      <span className={`icon ${state.loading ? "loading " : ""}`}>
        {hasVote ? <> <i class="bi mx-2 bi-arrow-down-square" /> Downvote </> : <> <i className="bi mx-1 bi-arrow-up-square"></i> Upvote </>}
      </span>
    </VoteButton>
  </div>
);

function normalizeMarkdown(text) {
  // convert headers to normal text (remove # symbols)
  text = text.replace(/^#+\s*/gm, '');
  // convert bold and italic to normal text (remove * and _ symbols)
  text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
  text = text.replace(/(\*|_)(.*?)\1/g, '$2');
  // remove links
  text = text.replace(/\[(.*?)\]\(.*?\)/g, '$1');
  // remove images
  text = text.replace(/!\[(.*?)\]\(.*?\)/g, '$1');
  return text.trim();
}

return (
  <Wrapper>
    <Header size={size}>
      <Thumbnail size={size}>
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

      <ButtonLink href={`/edit/${src}`}>
        {context.accountId === accountId ? (
          <>
            <i className="bi bi-pencil-fill"></i> Edit
          </>
        ) : (
          <>
            <i className="bi bi-git"></i> Fork
          </>
        )}
      </ButtonLink>

      <ButtonLink href={`${detailsUrl}&tab=source`}>
        <i className="bi bi-code-square"></i>
        View Source
      </ButtonLink>

      <OverlayTrigger
        placement="top"
        overlay={<Tooltip>Copy URL to clipboard</Tooltip>}
      >
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
      </OverlayTrigger>
      {state.showVoteButton && <Button type="button" onClick={voteClick}>
        {inner}
        {context.accountId == accountId ? `(${voteCount})` : null}
      </Button>
      }

    </Actions>
  </Wrapper>
);
