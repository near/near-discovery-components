State.init({
  apps: [],
  isLoading: true,
  selectedTab: props.tab || "Event Guide",
});
if (props.tab && props.tab !== state.selectedTab) {
  State.update({
    selectedTab: props.tab,
  });
}

const appLibraryIndexUrl =
  "/${REPL_ACCOUNT}/widget/AppLibrary.Nearcon.IndexPage";
const detailsUrl = `/${REPL_ACCOUNT}/widget/ComponentDetailsPage?src=`;
const selectedCategory = [];
const targetTags = ["develop", "earn", "play", "engage"];

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

        app.appUrl = appUrl;
        app.recentTag = app.lastest_tag;

        const uniqueTags = Array.from(new Set(app.tags));
        app.tags = uniqueTags;

        return { ...app, metadata };
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
      console.error(error);
    });
}

loadData();

const Wrapper = styled.div`
  padding: 100px 0;
  background: url("https://ipfs.near.social/ipfs/bafkreifbcebsx2gguifpzvd7skcctkdiujgu3gtahmdby4u6kajmavu5bq");
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

const MenuLink = styled("Link")`
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

const H3 = styled.h3`
  font: var(--text-m);
  color: var(--sand12);
  margin: 0 0 1.5rem;
  font-weight: 400;
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
  grid-template-columns: ${({ gridEnabled }) =>
    gridEnabled
      ? "minmax(0, 1fr) minmax(0, 1fr)"
      : "minmax(0, 7fr) minmax(0, 1fr)"};
  gap: 2rem;

  @media (max-width: 650px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const P1 = styled.p`
  font-weight: 500;
  font-size: 17px;
  margin-bottom: 0;
  padding-bottom: 0.3rem;
`;

const P2 = styled.p`
  font-weight: 200;
  padding-bottom: 1rem;
`;

const P21 = styled.p`
  font-weight: 600;
  padding-bottom: 1rem;
`;

const P3 = styled.p`
  font-weight: 200;
  margin-bottom: 0;
  padding-bottom: 0.3rem;
`;

const S1 = styled.span``;

const Em = styled.span`
  font-style: oblique;
`;

const List = styled.ul`
  padding-bottom: 1rem;
`;

const ListItem = styled.li`
  font-weight: 200;
  margin-left: 0.5rem;
`;

const SubTabMenu = styled.div`
  display: flex;
`;

const SubTabLink = styled.button`
  all: unset;
  display: flex;
  align-items: center;
  font-size: 0.825rem;
  padding: 7px 15px;
  border-radius: 50px;
  background-color: ${({ isActive }) => (isActive ? "#fbfaff" : "transparent")};
  color: ${({ isActive }) => (isActive ? "#5746af" : "#706f6c")};
  text-decoration: none;
  margin-bottom: 50px;

  i {
    margin-right: 5px;
  }
`;

const [selectedSubTab, setSelectedSubTab] = useState("Everyone");
const isActive = (tabName) => selectedSubTab === tabName;

const categories = [
  "Event Guide",
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
                key={category}
              >
                {category}
              </MenuLink>
            );
          })}
        </Menu>

        <Sections>
          <>
            {categories.map((category) => {
              const lowerCaseCategory = category.toLowerCase();
              if (targetTags.includes(lowerCaseCategory)) {
                if (state.selectedTab === category) {
                  const filteredApps = state.apps.filter(
                    (item) =>
                      item.recentTag &&
                      item.recentTag.toLowerCase() === lowerCaseCategory
                  );
                  return (
                    <Section key={category}>
                      <ContentGrid gridEnabled={filteredApps.length > 0}>
                        {filteredApps.length > 0 ? (
                          filteredApps.map((item) => (
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
                          ))
                        ) : (
                          <div>
                            {" "}
                            Help Spread the word and get more Apps in this
                            category to participate in the App Upvoting event,
                            instructions in the
                            <Link
                              href={`${appLibraryIndexUrl}?tab=Event+Guide`}
                            >
                              Event Guide Section
                            </Link>
                            .<br></br> Explore in{" "}
                            <Link href="https://near.org/applications">
                              near.org/applications
                            </Link>
                            for all B.O.S. Apps in the meantime!
                          </div>
                        )}
                      </ContentGrid>
                    </Section>
                  );
                }
                return null;
              }
              return null;
            })}
            {state.selectedTab === "Event Guide" && (
              <Section>
                <SubTabMenu>
                  <SubTabLink
                    isActive={isActive("Everyone")}
                    onClick={() => setSelectedSubTab("Everyone")}
                    data-active={selectedSubTab === "Everyone"}
                  >
                    Everyone
                  </SubTabLink>
                  <SubTabLink
                    isActive={isActive("App Owners")}
                    onClick={() => setSelectedSubTab("App Owners")}
                    data-active={selectedSubTab === "App Owners"}
                  >
                    App Owners
                  </SubTabLink>
                </SubTabMenu>

                {selectedSubTab === "Everyone" && (
                  <>
                    <P1>
                      <H2>
                        Earn NCONs and Help Decide the Featured App on B.O.S.
                      </H2>
                    </P1>

                    <P1>
                      <H3>
                        <S1>🌟</S1> NEARCON APP QUEST: UPVOTE Your Favorite
                        dApp! <S1>🚀</S1>
                      </H3>
                    </P1>

                    <P21>
                      Welcome aboard to the NCON Bounty to help find the first
                      group of featured Apps on B.O.S. Your upvotes decide the
                      stars of the NEAR App Library for 3 months! Be part of the
                      movement to shape the NEAR ecosystem and earn more NCONs!
                    </P21>

                    <P1>
                      <S1>🎉</S1> Why Participate?
                    </P1>

                    <P2>
                      Discover innovation and influence the future! Your upvotes
                      determine the top 8 dApps featured on the NEAR App Library
                      landing page and the top 4 in each category for the next
                      three months.
                    </P2>

                    <P1>
                      <S1>🚀</S1> How to Participate?
                    </P1>

                    <P2>
                      Explore and find your favorite dApps.<br></br> Hit the
                      Upvote button on the <strong>details page</strong>
                      of your favorite apps!
                    </P2>

                    <P1>
                      <S1>💡</S1> Make Your Likes Count!
                    </P1>

                    <P2>
                      Share your favorite dApps on social media. Spread the word
                      and invite others to participate. This is your opportunity
                      to showcase what you love in the NEAR ecosystem.
                    </P2>

                    <P1>
                      <S1>🔗</S1> #NEARConAppLibrary #LikeToInnovate
                      #NEARCon2023
                    </P1>
                  </>
                )}

                {selectedSubTab === "App Owners" && (
                  <>
                    <H2>
                      <S1>🚀</S1> Get your Apps qualified to Participate in the
                      NCON App Upvoting Event <S1>🚀</S1>
                    </H2>

                    <P2>
                      <Em>
                        Attendees at NEARCON will be incentivized with NCON to
                        upvote apps in the App Upvoting Bounty Page
                      </Em>
                    </P2>

                    <P2>Dear NEAR BOS Developer Community,</P2>

                    <P2>
                      The Pagoda product team launched the App Library this week
                      to help B.O.S founders and developers showcase and promote
                      their apps. The App Library is a page on near.org
                      dedicated to spotlighting B.O.S-powered apps to increase
                      their discoverability and engagement. With over 200
                      applications powered by BOS and more than 11,000
                      components now in the ecosystem, the App Library is
                      designed to help users and community members find your
                      applications and promote greater usage across the NEAR
                      ecosystem.
                    </P2>

                    <P2>
                      <strong>
                        To find the first group of featured apps on App Library,
                        we are launching the App Upvoting Event as a NCON Bounty
                        to invite all NEARCON attendees to upvote and decide who
                        gets featured!
                      </strong>
                    </P2>

                    <P2>
                      “NCON Bounties” is a Web3 gamified event experience for
                      attendees to engage throughout the event. Attendees will
                      earn NCON by completing Bounties and have the option to
                      redeem NCON for food, merchandise, and more. Participants
                      who decide to complete this special NCON Bounty will also
                      help select the first group of featured apps in the B.O.S.
                      App Library.
                    </P2>

                    <P1>
                      <S1>👉</S1> How to Qualify and Get Your App Featured?
                    </P1>

                    <P2>
                      To ensure your dApp shines during this event, here&#39;s
                      what you need to do. All of these steps are right in the
                      B.O.S interface for those who want to participate: simply
                      go to the Metadata page of your app and follow the
                      instructions below.
                    </P2>
                    <P3>
                      1. <strong>Create a Captivating Description:</strong>
                    </P3>

                    <P2>
                      Craft a compelling introduction to your dApp. Highlight
                      its unique features and value proposition. Pro tip: Add
                      screenshots to make your dApp visually appealing and easy
                      to understand. (Description is required!)
                    </P2>

                    <P3>
                      2. <strong>Tag Your App:</strong>
                    </P3>

                    <P2>
                      First, make sure to tag the component that holds the entry
                      to your project experience as App. Then, choose the
                      category that best represents your dApp&#45;
                      <strong>Earn, Play, Develop, Engage</strong>. (Choosing
                      <strong>one of these four</strong> categories is{" "}
                      <strong>required</strong>! If you applied more than one of
                      these four tags, then we will only use the latest one you
                      applied) Add additional tags for improved discoverability.
                      Make it easy for users to find and appreciate your work.
                    </P2>

                    <P2>
                      <Em>
                        (These categories are suggested from research around
                        users&#39; needs, broken down by categories and industry
                        app store benchmarks.)
                      </Em>
                    </P2>

                    <P3>
                      3. <strong>Spread the Word:</strong>
                    </P3>

                    <P2>
                      It's time to promote! Rally your community, spread the
                      news across your networks, and encourage users to like and
                      engage with your dApp. The more upvotes your app gets, the
                      greater your chances of securing a top spot.
                    </P2>

                    <P1>
                      <S1>✨</S1> Why Participate?
                    </P1>

                    <P2>
                      The App Library isn't just a catalog; it's an interactive
                      platform that spotlights the capabilities of NEAR B.O.S.
                      It will become the most visited page on near.org and
                      serves as a gateway to the NEAR Ecosystem. By
                      participating, you have the chance to feature prominently
                      on the App Library and the NEAR homepage for the next
                      three months, gaining exposure and recognition across the
                      NEAR ecosystem and beyond.
                    </P2>

                    <P1>
                      <S1>🏆</S1> What's the Payoff?
                    </P1>

                    <P2>
                      Your active participation can lead to significant rewards:
                    </P2>

                    <P3>
                      <strong>Top 8 Featured dApps:</strong>
                    </P3>

                    <P2>
                      The dApps with the highest number of upvotes from this
                      event will be showcased prominently on the landing page of
                      the App Library for the next three months—putting your
                      creation on the most visited page on near.org.
                    </P2>

                    <P3>
                      <strong>Category Leaders:</strong>
                    </P3>

                    <P2>
                      The top 4 dApps in each category will be prominently
                      featured on category pages, such as Earn, Play, Develop,
                      and Engage. This targeted exposure aligns with the core
                      needs and use cases of the diverse NEAR user base.
                    </P2>

                    <P1>
                      <S1>👍</S1> What&#39;s Next?
                    </P1>

                    <P2>
                      <strong>
                        Upvote Button Enabled 2 days Before NEARCON
                      </strong>
                      <br></br>2 days before NEARCON, you will see an upvote
                      button appear on the details pages of your qualified Apps.
                      Any users who have an account on near.org can now send
                      their support by hitting that upvote button. This upvote
                      button will be disabled two days after NEARCON and the Top
                      8 will be announced shortly after.
                    </P2>

                    <P2>
                      <strong>
                        NEARCON attendees will be incentivized to engage with
                        App Upvoting by earning NCON
                      </strong>
                      <br></br>
                      QR code and event posters will be promoted at the NEARCON
                      venues to encourage them to complete this Bounty. In
                      addition, this Bounty will be part of the NCON product for
                      NEARCON participants to earn more NCON, so we will make
                      sure your dApps get plenty of exposure.
                    </P2>

                    <P1>
                      <S1>📅</S1> Event Timeline
                    </P1>
                    <List>
                      <ListItem>
                        October 26: Submit your App for Qualification. App
                        Upvoting Bounty Event Page available on near.org.
                        Qualified Apps will be Fetched (Qualified Apps will be
                        fetched continuously on one-hour intervals throughout
                        the NEARCON event through November 13).
                      </ListItem>
                      <ListItem>
                        November 3: Upvote button enabled + counters started
                      </ListItem>
                      <ListItem>
                        November 13: Upvote disabled + results calculated
                      </ListItem>
                      <ListItem>
                        November 17: Results display + feature apps updated on
                        main App Library page.
                      </ListItem>
                    </List>
                    <P2>
                      The primary goal of the App Library is to celebrate the
                      creativity and efforts of NEAR developers and founders. To
                      increase visibility, boost engagement, and get valuable
                      feedback from the whole NEAR community on your app, make
                      sure to register your apps as qualified and participate in
                      the App Upvoting NCON Bounty.
                    </P2>
                  </>
                )}
              </Section>
            )}
          </>
        </Sections>
      </Main>
    </Container>
  </Wrapper>
);
