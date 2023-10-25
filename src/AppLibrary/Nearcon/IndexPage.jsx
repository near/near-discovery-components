State.init({
  apps: [],
  isLoading: true,
  selectedTab: props.tab,
});
if (props.tab && props.tab !== state.selectedTab) {
  State.update({
    selectedTab: props.tab,
  });
}

const appLibraryIndexUrl =
  "#/${REPL_ACCOUNT}/widget/AppLibrary.Nearcon.IndexPage";
const detailsUrl = `https://near.org/#/${REPL_ACCOUNT}/widget/ComponentDetailsPage?src=`;
const selectedCategory = [];

function loadData() {
  if (state.apps.length > 0) return;

  asyncFetch(
    "https://storage.googleapis.com/databricks-near-query-runner/output/nearcon_apps/apps_qualified.json"
  )
    .then((res) => {
      const apps = JSON.parse(res.body).data.map((app_raw) => {
        const app = JSON.parse(app_raw);
        const metadata = {
          ...JSON.parse(app.metadata[0].metadata),
          image: { ipfs_cid: app.ipfs_cid },
        };
        const appUrl = `${detailsUrl}${app.widget_name}`;
        const imgURL = `https://ipfs.near.social/ipfs/${image_cid}`;
        return { ...app, metadata, appUrl };
      });

      State.update({
        apps,
        isLoading: false,
        selectedTab: state.selectedTab,
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
  background: url("https://ipfs.near.social/ipfs/bafkreifjwtibuq7kh2nvtbbn2vwfah4uxpagwbp656hxakwxquuz6mdb6i");
  background-position: right top;
  background-size: 100% auto;
  background-repeat: no-repeat;

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
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
  margin-top: 200px;
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
  gap: 10px;
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
  color: #000;
  padding: 0.5rem 1rem;
  border-radius: 7px;
  transition: background-color 0.3s;
  &:hover,
  &:focus {
    background-color: rgb(187 188 188);
    text-decoration: none;
  }

  &[data-active="true"] {
    background-color: #000000;
    color: #fff;
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

const categories = [
  // TODO Add Event Guide Page
  // "Event Guide",
  "Earn",
  "Play",
  "Develop",
  "Engage",
  // TODO Add Stats Page
  // "Stats",
];
return (
  <Wrapper>
    <Container>
      <Main>
        <Menu>
          {categories.map((category) => {
            return (
              <MenuLink
                href={`${appLibraryIndexUrl}?tab=${category}`}
                data-active={state.selectedTab === category}
                key={app.label}
              >
                {category}
              </MenuLink>
            );
          })}
        </Menu>

        <Sections>
          <>
            <Section>
              <ContentGrid>
                {state.apps.map((item) => {
                  return (
                    <Widget
                      src="${REPL_ACCOUNT}/widget/AppLibrary.AppCard"
                      key={item.widget_name}
                      props={{
                        src: `${item.widget_name}`,
                        metadata: {
                          image: item.metadata.image,
                          name: item.name,
                          tags: item.tags,
                        },
                        appUrl: item.appUrl,
                      }}
                    />
                  );
                })}
              </ContentGrid>
            </Section>
          </>
        </Sections>
      </Main>
    </Container>
  </Wrapper>
);
