State.init({
  categories: [],
  isLoading: true,
  selectedTab: props.tab,
});

if (props.tab && props.tab !== state.selectedTab) {
  State.update({
    selectedTab: props.tab,
  });
}

const appLibraryIndexUrl = "/${REPL_ACCOUNT}/widget/AppLibrary.IndexPage";
const selectedCategory = state.categories.find((category) => category.label === state.selectedTab);

function loadData() {
  if (state.categories.length > 0) return;

  asyncFetch("https://storage.googleapis.com/databricks-near-query-runner/output/app-store-updated.json")
    .then((res) => {
      const data = JSON.parse(res.body);

      State.update({
        categories: data.data,
        isLoading: false,
        selectedTab: state.selectedTab ?? data.data[0].label,
      });
    })
    .catch((error) => {
      State.update({
        isLoading: false,
      });
      console.log(error);
    });
}

loadData();

const Wrapper = styled.div`
  padding: 100px 0;
  background: url("https://ipfs.near.social/ipfs/bafkreie5t75jirebnuyozmsc5hxzhxpoqivaxmc4rypaaogab6qh7asb2i");
  background-position: right top;
  background-size: 1440px auto;
  background-repeat: no-repeat;
  margin-top: calc(var(--body-top-padding) * -1);

  @media (max-width: 1024px) {
    padding: 50px 0;
  }

  @media (max-width: 800px) {
    background-image: none;
    padding: 2rem 0;
  }
`;

const Container = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 16px;
`;

const Main = styled.div`
  display: flex;
  gap: 6.5rem;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 3rem;
  }

  @media (max-width: 800px) {
    gap: 2rem;
  }
`;

const Menu = styled.div`
  width: 7.5rem;
  flex-shrink: 0;
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow: auto;
  scroll-behavior: smooth;

  @media (max-width: 1024px) {
    width: 100%;
    text-align: left;
    flex-direction: row;
  }
`;

const MenuLink = styled("Link")`
  display: block;
  font: var(--text-s);
  font-weight: 600;
  color: var(--sand12);
  outline: none;

  &:hover,
  &:focus {
    color: var(--sand12);
    text-decoration: underline;
  }

  &[data-active="true"] {
    color: var(--violet7);
  }
`;

const Sections = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  flex-grow: 1;
`;

const Section = styled.div``;

const H1 = styled.h1`
  font: var(--text-hero);
  color: var(--sand12);
  margin: 0 0 3rem;
  padding-left: 14rem;

  @media (max-width: 1024px) {
    padding-left: 0;
  }

  @media (max-width: 800px) {
    font: var(--text-3xl);
    font-weight: 600;
    margin: 0 0 2rem;
  }
`;

const H2 = styled.h2`
  font: var(--text-l);
  color: var(--sand12);
  margin: 0 0 1.5rem;
  font-weight: 600;
`;

const Text = styled.p`
  font: var(--${(p) => p.size ?? "text-base"});
  font-weight: ${(p) => p.fontWeight};
  color: var(--${(p) => p.color ?? "sand12"});
  margin: 0;
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 850px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media (max-width: 550px) {
    gap: 0.5rem;
    grid-template-columns: 1fr 1fr;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 2rem;

  @media (max-width: 650px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

return (
  <Wrapper>
    <Container>
      <H1>{state.selectedTab === "Search" ? "Search" : selectedCategory?.title}</H1>

      <Main>
        <Menu>
          {state.categories.map((category) => {
            return (
              <MenuLink
                href={`${appLibraryIndexUrl}?tab=${category.label}`}
                data-active={state.selectedTab === category.label}
                key={category.label}
              >
                {category.label}
              </MenuLink>
            );
          })}

          <MenuLink href={`${appLibraryIndexUrl}?tab=Search`} data-active={state.selectedTab === "Search"}>
            Search
          </MenuLink>
        </Menu>

        <Sections>
          {state.selectedTab === "Search" && <Widget src="${REPL_ACCOUNT}/widget/AppLibrary.Search" />}

          {state.selectedTab !== "Search" && selectedCategory && (
            <>
              {selectedCategory.sections.map((section) => {
                switch (section.format) {
                  case "MEDIUM":
                    return (
                      <Section key={section.title}>
                        {section.title && <H2>{section.title}</H2>}
                        <ThumbnailGrid>
                          {section.items.map((item) => {
                            return (
                              <Widget
                                src="${REPL_ACCOUNT}/widget/AppLibrary.AppThumbnail"
                                key={item.author + item.widget_name}
                                props={{
                                  author: item.author,
                                  image: item.image,
                                  name: item.name,
                                  widgetName: item.widget_name,
                                }}
                              />
                            );
                          })}
                        </ThumbnailGrid>
                      </Section>
                    );

                  case "SMALL":
                    return (
                      <Section key={section.title}>
                        {section.title && <H2>{section.title}</H2>}

                        <ContentGrid>
                          {section.items.map((item) => {
                            return (
                              <Widget
                                src="${REPL_ACCOUNT}/widget/AppLibrary.AppCard"
                                key={item.author + item.widget_name}
                                props={{
                                  src: `${item.author}/widget/${item.widget_name}`,
                                  metadata: {
                                    image: item.image,
                                    name: item.name,
                                    tags: item.tags,
                                  },
                                  blockHeight: item.receipt_block_height,
                                }}
                              />
                            );
                          })}
                        </ContentGrid>
                      </Section>
                    );

                  case "ARTICLE":
                    return (
                      <Section key={section.title}>
                        {section.title && <H2>{section.title}</H2>}

                        <ContentGrid>
                          {section.items.map((item) => {
                            return (
                              <Widget
                                src="${REPL_ACCOUNT}/widget/AppLibrary.ArticleSummary"
                                key={item.url}
                                props={{
                                  author: item.author,
                                  image: item.image,
                                  title: item.title,
                                  url: item.url,
                                }}
                              />
                            );
                          })}
                        </ContentGrid>
                      </Section>
                    );

                  default:
                    return null;
                }
              })}
            </>
          )}
        </Sections>
      </Main>
    </Container>
  </Wrapper>
);
