const overviewPageUrl = "/${REPL_ACCOUNT}/widget/DIG.OverviewPage";
const authorId = "${REPL_ACCOUNT}";
const defaultData = {
  [authorId]: {
    widget: {},
  },
};

const keysData = Social.keys(`${authorId}/widget/*`) ?? defaultData;
const componentNames = Object.keys(keysData[authorId].widget)
  .filter((item) => {
    return item.indexOf("DIG.") > -1 && item.indexOf("OverviewPage") === -1;
  })
  .sort();

const data =
  componentNames.length > 0
    ? Social.get(componentNames.map((name) => `${authorId}/widget/${name}/**`)) ?? defaultData
    : defaultData;
const components = data[authorId].widget;

const selectedComponentName = props.component ?? componentNames[0];
const selectedComponent = components[selectedComponentName];

function returnExampleCodeForComponent(componentName) {
  if (!componentName) return;
  const component = components[componentName];
  if (!component?.metadata?.description) return;

  /*
    Grab the first jsx code block in the description - we're assuming
    it's a valid example for now:
  */
  const matches = component.metadata.description.match(/```jsx([\s\S]*?)(?=```)/);

  /*
    The example code in the descriptions have `src="near/widget/DIG...""`
    hardcoded, so we need to dynamically replace it with `author` to
    properly handle testnet and mainnet:
  */
  const code = (matches[1] ?? "").replace(/src="near\/widget/g, `src="${authorId}/widget`);

  if (code) {
    /*
      Some of the examples simply start with "<Widget ..." - which need
      to be wrapped in a `return(...)` statement to execute correctly:
    */
    if (code.replace(/\s/g, "").indexOf("<Widget") === 0) {
      return `return (${code});`;
    } else {
      return code;
    }
  }
}

const Wrapper = styled.div`
  padding: 48px 0;
  margin-top: calc(var(--body-top-padding) * -1);
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Main = styled.div`
  display: flex;
  gap: 2rem;
  padding-top: 3rem;

  @media (max-width: 900px) {
    flex-direction: column;
    padding-top: 1rem;
  }
`;

const Menu = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: auto;
  scroll-behavior: smooth;

  @media (max-width: 900px) {
    width: 100%;
    flex-direction: row;
  }
`;

const MenuLink = styled("Link")`
  display: block;
  font: var(--text-s);
  font-weight: 600;
  color: var(--sand12);
  outline: none;
  white-space: nowrap;

  &:hover,
  &:focus {
    color: var(--sand12);
    text-decoration: underline;
  }

  &[data-active="true"] {
    color: var(--violet7);
  }
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 2rem;
  border-left: 1px solid var(--sand4);
  padding-left: 2rem;

  h3 {
    font: var(--text-l);
    margin-bottom: 1rem;
  }

  @media (max-width: 900px) {
    border-left: none;
    padding-left: 0;
  }
`;

const ContentHeader = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Preview = styled.div`
  border-top: 1px solid var(--sand4);
  border-bottom: 1px solid var(--sand4);
  padding: 2rem 0;
`;

const Text = styled.p`
  font: var(--${(p) => p.size ?? "text-base"});
  font-weight: ${(p) => p.fontWeight};
  color: var(--${(p) => p.color ?? "sand12"});
  margin: 0;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

return (
  <Wrapper>
    <Container>
      <Text size="text-3xl">DIG Components</Text>

      <Text>
        DIG (Decentralized Interface Guidelines) is a collection of UI components that can be used to quickly build
        decentralized apps with a consistent look and feel.
      </Text>

      <Main>
        <Menu>
          {componentNames.map((name) => {
            return (
              <MenuLink
                href={`${overviewPageUrl}?component=${name}`}
                data-active={selectedComponentName === name}
                key={name}
              >
                {name.replace("DIG.", "")}
              </MenuLink>
            );
          })}
        </Menu>

        {selectedComponent && (
          <Content>
            <ContentHeader>
              <Text size="text-2xl">{selectedComponentName.replace("DIG.", "")}</Text>

              <Widget
                src="${REPL_ACCOUNT}/widget/DIG.Button"
                props={{
                  label: "View Details",
                  iconRight: "ph-bold ph-arrow-right",
                  href: `/${authorId}/widget/ComponentDetailsPage?src=${authorId}/widget/${selectedComponentName}`,
                  variant: "primary",
                  fill: "outline",
                  size: "small",
                }}
              />
            </ContentHeader>

            <Preview>
              {returnExampleCodeForComponent(selectedComponentName) ? (
                <Widget code={returnExampleCodeForComponent(selectedComponentName)} />
              ) : (
                <Text>This component has no preview.</Text>
              )}
            </Preview>

            {selectedComponent.metadata?.description ? (
              <div>
                <Markdown text={selectedComponent.metadata.description} />
              </div>
            ) : (
              <Text>This component has no description.</Text>
            )}
          </Content>
        )}
      </Main>
    </Container>
  </Wrapper>
);
