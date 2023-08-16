State.init({
  selectedTab: props.tab ?? "discover",
});

if (props.tab && props.tab !== state.selectedTab) {
  State.update({
    selectedTab: props.tab,
  });
}

const appStoreIndexUrl = "#/${REPL_ACCOUNT}/widget/AppStore.IndexPage";

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

const MenuLink = styled.a`
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
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

return (
  <Wrapper>
    <Container>
      <H1>d.Apps</H1>

      <Main>
        <Menu>
          <MenuLink
            href={`${appStoreIndexUrl}?tab=discover`}
            data-active={state.selectedTab === "discover"}
          >
            Discover
          </MenuLink>
          <MenuLink
            href={`${appStoreIndexUrl}?tab=earn`}
            data-active={state.selectedTab === "earn"}
          >
            Earn
          </MenuLink>
          <MenuLink
            href={`${appStoreIndexUrl}?tab=play`}
            data-active={state.selectedTab === "play"}
          >
            Play
          </MenuLink>
          <MenuLink
            href={`${appStoreIndexUrl}?tab=develop`}
            data-active={state.selectedTab === "develop"}
          >
            Develop
          </MenuLink>
          <MenuLink
            href={`${appStoreIndexUrl}?tab=engage`}
            data-active={state.selectedTab === "engage"}
          >
            Engage
          </MenuLink>
          <MenuLink
            href={`${appStoreIndexUrl}?tab=search`}
            data-active={state.selectedTab === "search"}
          >
            Search
          </MenuLink>
        </Menu>

        {state.selectedTab === "search" ? (
          <Widget src="${REPL_ACCOUNT}/widget/AppStore.Search" />
        ) : (
          <Sections>
            <Section>
              <ThumbnailGrid>
                <Widget
                  src="${REPL_ACCOUNT}/widget/AppStore.AppThumbnail"
                  props={{
                    author: "calebjacob.near",
                    image: {
                      ipfs_cid:
                        "bafkreibhm4kokjpetrr7ztaixyanzbn5djvj4h4ryjshsfh2hgpi3v7uqu",
                    },
                    name: "My App",
                    widgetName: "MyApp",
                  }}
                />
              </ThumbnailGrid>
            </Section>

            <Section>
              <H2>Subheader</H2>

              <ContentGrid>
                <Widget
                  src="${REPL_ACCOUNT}/widget/ComponentCard"
                  props={{
                    src: `calebjacob.near/widget/MyApp`,
                    tags: ["foo", "bar"],
                    metadata: {
                      image: {
                        ipfs_cid:
                          "bafkreibhm4kokjpetrr7ztaixyanzbn5djvj4h4ryjshsfh2hgpi3v7uqu",
                      },
                      name: "My App",
                    },
                    blockHeight: undefined,
                  }}
                />
              </ContentGrid>
            </Section>

            <Section>
              <H2>Subheader</H2>

              <ContentGrid>
                <Widget
                  src="${REPL_ACCOUNT}/widget/AppStore.ArticleSummary"
                  props={{
                    author: "calebjacob.near",
                    image: {
                      ipfs_cid:
                        "bafkreibhm4kokjpetrr7ztaixyanzbn5djvj4h4ryjshsfh2hgpi3v7uqu",
                    },
                    title: "My Article",
                    url: "https://google.com",
                  }}
                />
              </ContentGrid>
            </Section>
          </Sections>
        )}
      </Main>
    </Container>
  </Wrapper>
);
