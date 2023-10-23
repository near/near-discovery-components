const requiredTag = "app";
const limit = 5;
let components = [];
let totalComponents = 0;
const componentsUrl = `#/${REPL_ACCOUNT}/widget/ComponentsPage`;
let recentAppPaths = [];

const taggedData = Social.keys(
  `*/widget/*/metadata/tags/${requiredTag}`,
  "final"
);

const blockHeights = Social.keys("*/widget/*", "final", {
  return_type: "BlockHeight",
});

if (blockHeights && taggedData) {
  const results = [];

  Object.keys(blockHeights).forEach((accountId) => {
    return Object.keys(blockHeights[accountId].widget).forEach((widgetName) => {
      const hasRequiredTag =
        taggedData[accountId]?.widget[widgetName]?.metadata?.tags?.app;

      totalComponents++;

      if (hasRequiredTag) {
        results.push({
          accountId,
          widgetName,
          blockHeight: blockHeights[accountId].widget[widgetName],
        });
      }
    });
  });

  results.sort((a, b) => b.blockHeight - a.blockHeight);

  recentAppPaths = results
    .slice(0, limit)
    .map((result) => `${result.accountId}/widget/${result.widgetName}`);
}

const componentData =
  recentAppPaths.length > 0 ? Social.getr(recentAppPaths) : null;

if (componentData) {
  recentAppPaths.forEach((src) => {
    const path = src.split("/");
    const result = {
      metadata: componentData[path[0]][path[1]][path[2]].metadata,
      src,
    };

    components.push(result);
  });
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const H2 = styled.h2`
  font-size: 19px;
  line-height: 22px;
  color: #11181c;
  margin: 0;
`;

const Items = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Item = styled.div``;

const ButtonLink = styled.a`
  display: block;
  width: 100%;
  padding: 8px;
  height: 32px;
  background: #fbfcfd;
  border: 1px solid #d7dbdf;
  border-radius: 50px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
  cursor: pointer;
  color: #11181c !important;
  margin: 0;

  &:hover,
  &:focus {
    background: #ecedee;
    text-decoration: none;
    outline: none;
  }

  span {
    color: #687076 !important;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const TextLink = styled.a`
  color: #006adc;
  outline: none;
  font-weight: 600;
  font-size: 12px;
  line-height: 20px;

  &:hover,
  &:focus {
    color: #006adc;
    text-decoration: underline;
  }
`;

return (
  <Wrapper>
    <Header>
      <H2>Recent Components</H2>
      <TextLink href={componentsUrl}>View All</TextLink>
    </Header>

    <Items>
      {components.map((component, i) => (
        <Item key={component.src}>
          <Widget
            src="${REPL_ACCOUNT}/widget/ComponentCard"
            props={{
              ...component,
              hideBlockHeightTimestamp: true,
            }}
          />
        </Item>
      ))}
    </Items>

    <ButtonLink href={componentsUrl}>
      View All Components ({totalComponents})
    </ButtonLink>
  </Wrapper>
);
