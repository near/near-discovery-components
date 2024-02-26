const { href } = VM.require("devhub.near/widget/core.lib.url");

if (!href) {
  return <></>;
}

const Card = styled.div`
  cursor: pointer;
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  gap: 1rem;
  height: 100%;
  min-height: 12rem;

  transition: all 300ms;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1);

  &:hover {
    box-shadow:
      0 4px 6px -1px rgb(0 0 0 / 0.1),
      0 2px 4px -2px rgb(0 0 0 / 0.1);
  }

  img.logo {
    height: 6rem;
    width: 6rem;
    border-radius: 50%;

    object-fit: cover;
  }

  h3,
  p {
    margin: 0;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
  }

  p {
    font-size: 1rem;
    font-weight: 400;
  }
`;
const CardBody = styled.div`
  display: flex;
  align-items: center;
`;
const Break = styled.div`
  flex-basis: 100%;
  height: 0;
`;
const Actions = styled.div`
  padding-top: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`;
const AgentCard = ({ item, editFunction }) => {
  const { accountId, name, displayName, prompt, logoUrl } = item;
  const agentComponent = item.component ? item.component : `${REPL_ACCOUNT}/widget/AI.Agent.AgentChat`;
  const imageUrl =
    logoUrl ?? "https://ipfs.near.social/ipfs/bafkreibysr2mkwhb4j36h2t7mqwhynqdy4vzjfygfkfg65kuspd2bawauu";
  const chatLink = href({
    widgetSrc: agentComponent,
    params: { src: `${accountId}/agent/${name}` },
  });
  const detailsLink = href({
    widgetSrc: `${REPL_ACCOUNT}/widget/AI.Agent.AgentDetails`,
    params: { src: `${accountId}/agent/${name}` },
  });

  const agentChatUrl = `https://${REPL_NEAR_URL}/${agentComponent}?src=${accountId}/agent/${item.name}`;
  const editType = accountId === context.accountId ? "edit" : "fork";
  const editLabel = editType === "edit" ? "Edit" : "Fork";
  const editIcon = editType === "edit" ? "ph-bold ph-pencil-simple" : "ph-bold ph-git-fork";

  return (
    <Card>
      <Link to={chatLink} style={{ all: "unset" }}>
        <div className="row">
          <div className="col-4">
            <img className="logo" src={imageUrl} alt="agent logo" />
          </div>

          <div className="col">
            <h3>{displayName}</h3>
            <p>by {accountId}</p>
            <Widget
              src="near/widget/DIG.Tooltip"
              props={{
                content: <span style={{ whiteSpace: "pre-line" }}>{prompt}</span>,
                trigger: <p>{prompt ? prompt.substring(0, 20) : ""}...</p>,
              }}
            />
          </div>
        </div>
      </Link>
      <Actions>
        <Widget
          src="near/widget/DIG.Tooltip"
          props={{
            content: editLabel,
            trigger: (
              <Widget
                src="near/widget/DIG.Button"
                props={{
                  onClick: () => editFunction(item),
                  iconLeft: editIcon,
                  variant: "secondary",
                  fill: "ghost",
                  size: "small",
                }}
              />
            ),
          }}
        />
        <Widget
          src="${REPL_ACCOUNT}/widget/CopyUrlButton"
          props={{
            url: agentChatUrl,
          }}
        />
        <Widget
          src="${REPL_ACCOUNT}/widget/ShareButton"
          props={{
            postType: "AI Agent",
            url: agentChatUrl,
          }}
        />
        <Widget
          src="near/widget/DIG.Tooltip"
          props={{
            content: "View Details",
            trigger: (
              <Link to={detailsLink} style={{ all: "unset" }}>
                <Widget
                  src="near/widget/DIG.Button"
                  props={{
                    iconLeft: "ph-bold ph-eye",
                    variant: "secondary",
                    fill: "ghost",
                    size: "small",
                  }}
                />
              </Link>
            ),
          }}
        />
        <Widget
          src="near/widget/DIG.Tooltip"
          props={{
            content: "Use agent",
            trigger: (
              <Link to={chatLink} style={{ all: "unset" }}>
                <Widget
                  src="near/widget/DIG.Button"
                  props={{
                    iconLeft: "ph-bold ph-chat-teardrop-text",
                    variant: "secondary",
                    fill: "ghost",
                    size: "small",
                  }}
                />
              </Link>
            ),
          }}
        />
      </Actions>
    </Card>
  );
};

return AgentCard(props);
