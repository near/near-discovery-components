State.init({
  selectedTab: props.tab || "overview",
});

const accountId = props.accountId ?? context.accountId;
if (!accountId) {
  return "No account ID";
}

if (props.tab && props.tab !== state.selectedTab) {
  State.update({
    selectedTab: props.tab,
  });
}

const profile = props.profile ?? Social.getr(`${accountId}/profile`);
const accountUrl = `/#/calebjacob.near/widget/ProfilePage?accountId=${accountId}`;

const Wrapper = styled.div`
  padding-bottom: 48px;
`;

const Main = styled.div`
  display: grid;
  gap: 40px;
  grid-template-columns: 352px  minmax(0, 1fr);
  align-items: start;

  @media (max-width: 1200px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const BackgroundImage = styled.div`
  height: 240px;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  margin: 0 -12px;
  background: #ECEEF0;

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  @media (max-width: 1200px) {
    margin: calc(var(--body-top-padding) * -1) -12px 0;
    border-radius: 0;
  }

  @media (max-width: 900px) {
    height: 100px;
  }
`;

const SidebarWrapper = styled.div`
  position: relative;
  z-index: 5;
  margin-top: -55px;

  @media (max-width: 900px) {
    margin-top: -40px;
  }
`;

const Content = styled.div`
  .post {
    padding-left: 0;
    padding-right: 0;
  }
`;

const Title = styled.h1`
  font-weight: 600;
  font-size: ${(p) => p.size || "25px"};
  line-height: 1.2em;
  color: #11181C;
  margin: ${(p) => (p.margin ? "0 0 24px" : "0")};
  overflow-wrap: anywhere;
`;

const Tabs = styled.div`
  display: flex;
  height: 48px;
  border-bottom: 1px solid #ECEEF0;
  margin-bottom: 72px;
  overflow: auto;
  scroll-behavior: smooth;

  @media (max-width: 1200px) {
    background: #F8F9FA;
    border-top: 1px solid #ECEEF0;
    margin: 0 -12px 48px;

    > * {
      flex: 1;
    }
  }
`;

const TabsButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-weight: 600;
  font-size: 12px;
  padding: 0 12px;
  position: relative;
  color: ${(p) => (p.selected ? "#11181C" : "#687076")};
  background: none;
  border: none;
  outline: none;
  text-align: center;
  text-decoration: none !important;

  &:hover {
    color: #11181C;
  }

  &::after {
    content: '';
    display: ${(p) => (p.selected ? "block" : "none")};
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: #59E692;
  }
`;

const Bio = styled.div`
  color: #11181C;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 48px;

  > *:last-child {
    margin-bottom: 0 !important;
  }

  @media (max-width: 900px) {
    margin-bottom: 48px;
  }
`;

if (profile === null) {
  return "Loading";
}

return (
  <Wrapper>
    <BackgroundImage>
      {profile.backgroundImage && (
        <Widget
          src="mob.near/widget/Image"
          props={{
            image: profile.backgroundImage,
            alt: "profile background image",
            fallbackUrl:
              "https://ipfs.near.social/ipfs/bafkreibmiy4ozblcgv3fm3gc6q62s55em33vconbavfd2ekkuliznaq3zm",
          }}
        />
      )}
    </BackgroundImage>

    <Main>
      <SidebarWrapper>
        <Widget
          src="calebjacob.near/widget/ProfilePage.Sidebar"
          props={{
            accountId,
            profile,
          }}
        />
      </SidebarWrapper>

      <Content>
        <Tabs>
          <TabsButton
            href={`${accountUrl}&tab=overview`}
            selected={state.selectedTab === "overview"}
          >
            Overview
          </TabsButton>

          <TabsButton
            href={`${accountUrl}&tab=apps`}
            selected={state.selectedTab === "apps"}
          >
            Components
          </TabsButton>

          <TabsButton
            href={`${accountUrl}&tab=nfts`}
            selected={state.selectedTab === "nfts"}
          >
            NFTs
          </TabsButton>

          <TabsButton
            href={`${accountUrl}&tab=following`}
            selected={state.selectedTab === "following"}
          >
            Following
          </TabsButton>

          <TabsButton
            href={`${accountUrl}&tab=followers`}
            selected={state.selectedTab === "followers"}
          >
            Followers
          </TabsButton>
        </Tabs>

        {state.selectedTab === "overview" && (
          <>
            {profile.description && (
              <>
                <Title as="h2" size="19px" margin>
                  About
                </Title>

                <Bio>
                  <Widget
                    src="calebjacob.near/widget/SocialMarkdown"
                    props={{ text: profile.description }}
                  />
                </Bio>
              </>
            )}

            <Widget
              src="calebjacob.near/widget/Posts.Feed"
              props={{ accounts: [accountId] }}
            />
          </>
        )}

        {state.selectedTab === "nfts" && (
          <Widget
            src="calebjacob.near/widget/NFTCollection"
            props={{ accountId }}
          />
        )}

        {state.selectedTab === "apps" && (
          <Widget
            src="calebjacob.near/widget/ComponentCollection"
            props={{ accountId }}
          />
        )}

        {state.selectedTab === "followers" && (
          <Widget
            src="calebjacob.near/widget/FollowersList"
            props={{ accountId }}
          />
        )}

        {state.selectedTab === "following" && (
          <Widget
            src="calebjacob.near/widget/FollowingList"
            props={{ accountId }}
          />
        )}
      </Content>
    </Main>
  </Wrapper>
);
