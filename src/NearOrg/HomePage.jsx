let { fetchEventsList } = props;

const ipfsImages = {
  apps: {
    bosAllStars: "bafkreicgnsizdxoc436tbln3ucqo45hdauumd7if4gltrqh3tbxgosi3q4",
    bosHacks: "bafkreicpbijnii55242f7wcs6xnjf3ocyuyuguts6r6kkfz745g3jjudam",
    nui: "bafkreiefq7qqug2f657fdb5fyuaf5uesybwn7qu3ebxvmo47dhcsxu27vm",
  },
  community: {
    devHub: "bafkreifdsmtvi7mpovau5asmaabibk6cvtqvujuunjjlazqov32wng34q4",
    horizon: "bafkreiguqynoybtr6esvnyetcaayke5gsh5ex7lk4efjgunnyw6unszin4",
    ndc: "bafkreigqrtvkwu4uzjzg7nrv3ivsb2uthvcozici34loxumkpekz7weyly",
  },
  illustrations: {
    betterWayToBuild: "bafkreib6sp7aoovferwg4zfvekhxxmp6hdp4u7f2bgxupebntrfgrmjhbe",
    code: "bafkreig2anu2f6j6kh7i26k2x7z75d72bn4vtsp2dusiin5pahwbjd3rvi",
    components: "bafkreiecfsfxzubbayv27se2pr2xcz4rugp5a5kscsfz5lvjykiomt3a4u",
    dapps: "bafkreihhuffoky3qywxmnnr7z7r2gdtjfab6tbx7f7ml2xvwldx76ggrni",
    fastAuth: "bafkreib5rowa6ujusqvk6xr4qo2bnoazwvraozrl56taejqypemd5mc75y",
    gateways: "bafkreibvfggs2ea6e7fp4apfeaccjlcnpovzr73fwnxxkuvcnmpkkzqiwm",
    placeholder: "bafkreid7abzwnzk3qrniq7mnnl4blhka7k5nk62m3u7afqnqdxowmrkdu4",
  },
  logos: {
    alibaba: "bafkreibjmnm5mu5sdauregztl2bsin2a633gdfmrydviyqkyf5rpjfbg64",
    arbitrum: "bafkreibff556aanawcdwlpbelqnzns35gqmxcsll5k4acyynyrvibcljpu",
    cosmose: "bafkreifx5onoiyip7mwogdnzmv7ilirkw2fyzvegrvxbmzf6bcbzuwbmbu",
    dropt: "bafkreihjdirbdiuoiqlcmpp7gnjnvkm3bfol7mtetyaldtgnvgrprpdbba",
    eigenLayer: "bafkreid44xmemwrym532jybhwqwrvlbzchxfxyrkcivns5qtmpeym7cmbe",
    icc: "bafkreibygllbcqh3e3qkcrim2noa4wwev36af34rk6gw2rpogp53lwkbg4",
    google: "bafkreie7ewwxbvcv4hgztuj5uwk5i4siirqnxbo2c5g2nt72iaty6lnpje",
    optimism: "bafkreidwitx5hu6hivyn3exi34moyea7livf6zfqk2dcny3z62ive7fpou",
    polygon: "bafkreig5ubh27cnjindiujnmyrwa2uft24bcrmgibzwlma4nqsommrcd4u",
    marblex: "bafkreigaqwyom4knnvjdvsgmfbef5adp5k6no4prdudiog3pypiqddoyum",
    sailgp: "bafkreifoxofuz4mkoopodvrdb44g5lva4w5p46iexccovj4c62x6ihoj2i",
    shemaroo: "bafkreigoulx5h4u43xj4332bidnkn4dzbw5qgrcar6wf7yoewnrxfyjfle",
    sweatcoin: "bafkreigztaapfbvnfzrw4oap6zi7us4drcbx2wt3broi4n3u4nzfyrtxcy",
  },
};

const featuredApps = [
  {
    name: "BOS All-Stars",
    accountId: "hack.near",
    description: "Ranking starred components",
    ipfsImage: ipfsImages.apps.bosAllStars,
    url: "/near/widget/ComponentDetailsPage?src=hack.near/widget/widgets.rank",
  },
  {
    name: "BOS Hacks",
    accountId: "ndcplug.near",
    description: "The 2 week B.O.S Hackathon on B.O.S",
    ipfsImage: ipfsImages.apps.bosHacks,
    url: "/near/widget/ComponentDetailsPage?src=ndcplug.near/widget/BOSHACKS.Index",
  },
  {
    name: "NUI",
    accountId: "nearui.near",
    description: " A growing collection of beautifully designed B.O.S widgets - your building blocks for creating...",
    ipfsImage: ipfsImages.apps.nui,
    url: "/near/widget/ComponentDetailsPage?src=nearui.near/widget/index",
  },
];

const web3Teams2 = [
  {
    url: "https://dropt.io",
    name: "Dropt",
    ipfsImage: ipfsImages.logos.dropt,
    height: "35px",
  },
  {
    url: "https://sailgp.com",
    name: "Sail GP",
    ipfsImage: ipfsImages.logos.sailgp,
    height: "16px",
  },
  {
    url: "https://www.shemarooent.com",
    name: "Shemaroo",
    ipfsImage: ipfsImages.logos.shemaroo,
    height: "38px",
  },
  {
    url: "https://www.marblex.io",
    name: "Marblex",
    ipfsImage: ipfsImages.logos.marblex,
    height: "16px",
  },
  {
    url: "https://polygon.technology/polygon-cdk",
    name: "Polygon",
    ipfsImage: ipfsImages.logos.polygon,
    height: "38px",
  },
  {
    url: "https://sweatco.in",
    name: "Sweatcoin",
    ipfsImage: ipfsImages.logos.sweatcoin,
    height: "24px",
  },
];

const web3Teams = [
  {
    url: "https://alibabacloud.com/",
    name: "Alibaba",
    ipfsImage: ipfsImages.logos.alibaba,
    height: "38px",
  },
  {
    url: "https://docs.arbitrum.io/inside-anytrust#data-availability-servers",
    name: "Arbitrum",
    ipfsImage: ipfsImages.logos.arbitrum,
    height: "38px",
  },
  {
    url: "https://cosmose.co",
    name: "Cosmose AI",
    ipfsImage: ipfsImages.logos.cosmose,
    height: "38px",
  },
  {
    url: "https://docs.eigenlayer.xyz/eigenda-guides/eigenda-overview",
    name: "EigenLayer",
    ipfsImage: ipfsImages.logos.eigenLayer,
    height: "38px",
  },
  {
    url: "https://google.com",
    name: "Google",
    ipfsImage: ipfsImages.logos.google,
    height: "38px",
  },
  {
    url: "https://www.icc-cricket.com",
    name: "ICC",
    ipfsImage: ipfsImages.logos.icc,
    height: "24px",
  },
  //{
  //  url: "https://docs.optimism.io/builders/chain-operators/hacks/data-availability#overview",
  //  name: "Optimism",
  //  ipfsImage: ipfsImages.logos.optimism,
  //  height: "38px",
  //},
];

const web3TeamsCombined = [...web3Teams, ...web3Teams2];

const learnItems = [
  {
    name: "Docs",
    description: "Read the NEAR documentation and learn to build and publish blockchain applications.",
    icon: "ph-file-doc",
    url: "https://docs.near.org",
    target: "_blank",
  },
  {
    name: "Blog",
    description: "The latest news about the NEAR protocol and innovations from the community.",
    icon: "ph-newspaper-clipping",
    url: "/blog",
  },
  {
    name: "Learn Center",
    description: "Starter kit to learn about blockchain technology, web3, and the NEAR protocol.",
    icon: "ph-book-open-text",
    url: "/learn",
  },
];

const communityItems = [
  {
    name: "DevHub",
    description:
      "DevHub is a decentralized community where NEAR developers can share ideas, match solutions, and access support and funding.",
    ipfsImage: ipfsImages.community.devHub,
    url: "/devgovgigs.near/widget/Ideas",
  },
  {
    name: "Horizon",
    description: "Horizons is an early stage accelerator for Web3 founders to build, connect, and grow.",
    ipfsImage: ipfsImages.community.horizon,
    url: "/horizon",
  },
  {
    name: "Near Digital Collective (NDC)",
    description: "The NDC is a grassroots, community-led movement to build decentralized governance on NEAR.",
    ipfsImage: ipfsImages.community.ndc,
    url: "https://app.neardc.org/",
    target: "_blank",
  },
];

function returnIpfsImage(cfid) {
  return {
    ipfs_cid: cfid,
  };
}

const Wrapper = styled.div`
  --section-gap: 120px;
  --text-hero: 500 72px/1 "FK Grotesk", "Mona Sans", sans-serif;
  margin-top: calc(var(--body-top-padding) * -1);

  .darkButton {
    color: #fff !important;
    background: transparent !important;
    border-color: #00ec97 !important;
    &:focus {
      border-color: var(--violet9) !important;
    }
    &:hover {
      color: #000 !important;
      background: #00ec97 !important;
    }
    &:active {
      color: #000 !important;
      background: var(--sand3) !important;
      border-color: var(--sand3) !important;
    }
  }

  @media (max-width: 900px) {
    --section-gap: 80px;
  }
`;

const H1 = styled.h1`
  font: var(--text-hero);
  letter-spacing: -3px;
  text-align: center;
  color: var(--black);
  margin: 0;
  max-width: 600px;

  @media (max-width: 900px) {
    font-size: 48px;
  }
`;

const H2 = styled.h2`
  font: var(--text-hero);
  font-size: 56px;
  line-height: 1.3;
  color: var(--black);
  margin: 0;

  @media (max-width: 900px) {
    font-size: 36px;
  }
`;

const Text = styled.p`
  font: var(--${(p) => p.size ?? "text-base"});
  font-weight: ${(p) => p.fontWeight} !important;
  color: var(--${(p) => p.color ?? "sand12"});
  margin: 0;

  @media (max-width: 900px) {
    font: var(--${(p) => p.mobileSize ?? p.size ?? "text-base"});
  }
`;

const Flex = styled.div`
  display: flex;
  gap: ${(p) => p.gap};
  align-items: ${(p) => p.alignItems};
  justify-content: ${(p) => p.justifyContent};
  flex-direction: ${(p) => p.direction ?? "row"};
  flex-wrap: ${(p) => p.wrap ?? "nowrap"};

  ${(p) =>
    p.mobileStack &&
    `
    @media (max-width: 900px) {
      flex-direction: column;
    }
  `}

  @media (max-width: 900px) {
    gap: ${(p) => p.mobileGap ?? p.gap};
    align-items: ${(p) => p.mobileAlignItems ?? p.alignItems};
  }
`;

const Grid = styled.div`
  display: grid;
  gap: ${(p) => p.gap};
  grid-template-columns: ${(p) => p.columns};
  align-items: ${(p) => p.alignItems};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: ${(p) => p.mobileGap ?? p.gap};
  }
`;

const Section = styled.div`
  --background-color: ${(p) => p.backgroundColor};
  background-color: var(--background-color);
  position: relative;
  padding: 160px 24px;
  overflow: hidden;

  @media (max-width: 900px) {
    padding: var(--section-gap) 24px;
  }
`;

const Container = styled.div`
  display: flex;
  max-width: 1224px;
  margin: 0 auto;
  gap: ${(p) => p.gap ?? "var(--section-gap)"};
  flex-direction: column;
  align-items: ${(p) => (p.center ? "center" : undefined)};
  justify-content: ${(p) => (p.center ? "center" : undefined)};
  text-align: ${(p) => (p.center ? "center" : undefined)};
`;

const Pattern = styled.div`
  width: 100%;
  min-height: 540px;
  display: flex;
  align-items: center;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGeSURBVHgB7doxTisxEAbgeY/mvQro6NiSDo6QkpJbcA2OwjWooKQMJ2DpKENJBV7FEYoBeQSIZr9PGk2cItWvsdfZnSBjKHVf6rnUbdD1N8g4K7VX6jhIEaycofaTIEWwcoam0yFYOYe179WiQ7Byhk8+8wnB6munlHNWgmD1tUGyFSYIVl8bJFcOCYLV106s/aBrJ2hNE+qo1GmpRanz2J5aB6X+x/oQv/l+FWz5E/O1iHU4pom0W/u0/uoZahnrgN2VGuv6Jpidl1+o2T5BznkrfKj9MdZT6l9836r+3k2pq1KXMVNz3gpbU7hOmj49AQ7x/lJ0WWsK5xhv2+AYkHQR29vbddDluqFvbNZPQZdg9S07az4gWH3tHZVgJQhW3xjb4XIZyo+Z3nffHN79CZ1gYuXc1b4KEytFsHLGptMhWDlj7Q9BimDlbJ4Ex4AftggHdwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIpXoUVLSWulnzoAAAAASUVORK5CYII=");
  background-size: 75px 75px;
  background-repeat: repeat;
  background-position: center top;
`;

const PatternContent = styled.div`
  padding: 1rem;
  max-width: 648px;
  margin: 0 auto;
  background-color: var(--background-color);
  display: flex;
  align-items: center;
  min-height: 260px;
`;

const Teams = styled.div`
  width: 100%;
`;

const LogoLinksWrapper = styled.div`
  margin-top: 40px;
  width: 100%;
  position: relative;

  @media (max-width: 1170px) {
    &::before {
      content: "";
      display: block;
      position: absolute;
      right: 0;
      top: 0;
      width: 40px;
      height: 100%;
      background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
    }
  }
`;

const LogoLinks = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 60px;
  padding: 16px 24px;

  a {
    display: block;
    height: 24px;
    color: var(--sand10);

    img {
      display: block;
      margin: 0 auto;
      height: 100%;
    }
  }

  @media (max-width: 800px) {
    gap: 40px;
  }
`;

const CardThumbnail = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 8px;
  overflow: hidden;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 80px;

  div {
    p:first-child {
      font-family: "FK Grotesk";
      font-size: 100px;
      font-weight: 500;
      line-height: 100%;
      letter-spacing: -1.5px;
    }
    p:last-child {
      font-size: 20px;
      font-weight: 400;
      line-height: 130%;
      letter-spacing: 0.3px;
    }
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 80px;
  }
`;

const IconCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 100%;
  border: 1px solid var(--sand11);

  i {
    color: var(--sand11);
    font-size: 32px;
  }
`;

const Article = styled("Link")`
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-decoration: none !important;
  outline: none;
  box-shadow: 0 0 0 0px var(--violet4);

  &:hover {
    h3 {
      text-decoration: underline;
    }

    div:first-child {
      &::before {
        opacity: 1;
      }
    }
  }

  &:focus {
    div:first-child {
      box-shadow: 0 0 0 4px var(--violet4);
    }
  }
`;

const ArticleImage = styled.div`
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  height: 220px;
  transition: all 200ms;
  margin-bottom: 10px;
  position: relative;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: relative;
    z-index: 5;
  }

  &::before {
    content: "";
    display: block;
    inset: 0;
    background: var(--whiteA6);
    z-index: 10;
    position: absolute;
    opacity: 0;
    transition: all 200ms;
  }
`;

return (
  <Wrapper>
    <Section style={{ padding: "72px 0" }} backgroundColor="var(--white)">
      <Container center>
        <Pattern>
          <PatternContent>
            <Flex gap="32px" direction="column" alignItems="center">
              <H1>Blockchains, Abstracted.</H1>

              <Text size="text-l" mobileSize="text-base">
                NEAR is the chain abstraction stack, empowering builders to create apps that scale to billions of users
                and across all blockchains.
              </Text>

              <Flex gap="24px">
                <Widget
                  src="${REPL_ACCOUNT}/widget/DIG.Button"
                  props={{
                    href: "https://docs.near.org",
                    target: "_blank",
                    label: "Read Docs",
                    variant: "secondary",
                    fill: "outline",
                    size: "large",
                  }}
                />
                <Widget
                  src="${REPL_ACCOUNT}/widget/DIG.Button"
                  props={{
                    href: "/signup",
                    label: "Create Account",
                    variant: "affirmative",
                    size: "large",
                  }}
                />
              </Flex>
            </Flex>
          </PatternContent>
        </Pattern>

        <Teams>
          <Text
            size="text-xs"
            fontWeight="700"
            color="sand11"
            style={{
              textTransform: "uppercase",
              letterSpacing: "2px",
              padding: "0 24px",
            }}
          >
            Trusted by forward thinking teams
          </Text>

          <LogoLinksWrapper>
            <LogoLinks>
              {web3TeamsCombined.map((team) => (
                <Link href={team.url} target="_blank" title={team.name} style={{ height: team.height }} key={team.name}>
                  <Widget
                    src="${REPL_MOB}/widget/Image"
                    props={{
                      image: returnIpfsImage(team.ipfsImage),
                      alt: team.name,
                    }}
                  />
                </Link>
              ))}
            </LogoLinks>
          </LogoLinksWrapper>
        </Teams>
      </Container>
    </Section>

    <Section backgroundColor="#00EC97">
      <Container>
        <Flex direction="column" gap="24px">
          <H2>There's a better way to build.</H2>
          <Text size="text-2xl" mobileSize="text-l" style={{ maxWidth: "808px" }}>
            Imagine if the online experiences we use every day were more transparent and resilient – shaped and
            controlled by their creators and users.
          </Text>
        </Flex>

        <Grid columns="1fr 1fr" gap="var(--section-gap)">
          <Widget
            src="${REPL_MOB}/widget/Image"
            props={{
              image: returnIpfsImage(ipfsImages.illustrations.betterWayToBuild),
              alt: "There's a better way to build",
              style: {
                width: "100%",
                maxWidth: "600px",
                margin: "0 auto",
              },
            }}
          />

          <Flex direction="column" gap="var(--section-gap)">
            <Flex direction="column" gap="24px">
              <Text size="text-xl" mobileSize="text-l" fontWeight="500">
                Truly developer owned.
              </Text>
              <Text>
                Today, developers access web services through centralized providers in exchange for control of their
                data and assets. In contrast, Web3 services are public and open source, and you alone hold the keys to
                your data.
              </Text>
              <div>
                <Widget
                  src="${REPL_ACCOUNT}/widget/DIG.Button"
                  props={{
                    href: "/signup",
                    label: "Create an Account",
                    variant: "secondary",
                    fill: "outline",
                    size: "large",
                  }}
                />
              </div>
            </Flex>

            <Flex direction="column" gap="24px">
              <Text size="text-xl" mobileSize="text-l" fontWeight="500">
                Application hosting with zero setup, fewer costs, & less headaches.
              </Text>
              <Text>
                No more jumping through hoops to reach your audience. Near's Blockchain Operating System (B.O.S) enables
                you to host and serve your applications entirely on the blockchain, eliminating reliance on traditional
                web hosting services.
              </Text>
              <div>
                <Widget
                  src="${REPL_ACCOUNT}/widget/DIG.Button"
                  props={{
                    href: "https://docs.near.org",
                    target: "_blank",
                    label: "Read Docs",
                    variant: "secondary",
                    fill: "outline",
                    size: "large",
                  }}
                />
              </div>
            </Flex>
          </Flex>
        </Grid>

        <Flex direction="column" gap="60px">
          <Flex direction="column" gap="24px">
            <Text size="text-xl" mobileSize="text-l" fontWeight="500">
              A new & more open digital economy.
            </Text>

            <Flex gap="24px" alignItems="flex-end" mobileStack mobileAlignItems="flex-start">
              <Text style={{ maxWidth: "598px", marginRight: "auto" }}>
                Develop unique and powerful ways to earn, transact, and exercise digital ownership through online
                experiences accessible to anyone with an internet connection.
              </Text>
              <Widget
                src="${REPL_ACCOUNT}/widget/DIG.Button"
                props={{
                  href: "/applications",
                  label: "Explore Applications",
                  variant: "secondary",
                  fill: "outline",
                  size: "large",
                }}
              />
            </Flex>
          </Flex>

          <Grid columns="1fr 1fr 1fr" gap="24px">
            {featuredApps.map((app) => (
              <Widget
                src="${REPL_ACCOUNT}/widget/NearOrg.Card"
                key={app.name}
                props={{
                  as: "a",
                  href: app.url,
                  style: { borderColor: "var(--sand12)" },
                  children: (
                    <>
                      <Flex alignItems="center" gap="24px">
                        <CardThumbnail>
                          <Widget
                            src="${REPL_MOB}/widget/Image"
                            props={{
                              image: returnIpfsImage(app.ipfsImage),
                              alt: app.name,
                            }}
                          />
                        </CardThumbnail>
                        <div>
                          <Text size="text-l" fontWeight="500">
                            {app.name}
                          </Text>
                          <Text size="text-s">@{app.accountId}</Text>
                        </div>
                      </Flex>
                      <Text size="text-s">{app.description}</Text>
                    </>
                  ),
                }}
              />
            ))}
          </Grid>
        </Flex>
      </Container>
    </Section>

    <Section backgroundColor="#000000">
      <Container>
        <Flex direction="column" gap="24px">
          <H2 style={{ color: "var(--white)" }}>Web3 development made easy</H2>
          <Text size="text-2xl" mobileSize="text-l" color="white" style={{ maxWidth: "808px" }}>
            Build great applications without the hassle of deciding between platforms, finding the right tools, or
            learning new programming languages.
          </Text>
        </Flex>

        <Widget
          src="${REPL_ACCOUNT}/widget/NearOrg.ContentWithImage"
          key="build-faster"
          props={{
            content: (
              <>
                <Text size="text-xl" mobileSize="text-l" fontWeight="500" color="white">
                  Build faster with <span style={{ color: "#00EC97" }}>Javascript</span> & familiar developer tools.
                </Text>
                <Text color="white">
                  Spend less time learning and more time building with the tools you already know and love.
                </Text>
                <div>
                  <Widget
                    src="${REPL_ACCOUNT}/widget/DIG.Button"
                    props={{
                      href: "https://docs.near.org",
                      target: "_blank",
                      label: "Explore Docs",
                      variant: "affirmative",
                      fill: "outline",
                      size: "large",
                      className: "darkButton",
                    }}
                  />
                </div>
              </>
            ),
            image: returnIpfsImage(ipfsImages.illustrations.code),
            imageSide: "left",
            alt: "Illustration of a console with javascript code above the Javascript and Rust logos, surrounded by brackets",
          }}
        />

        <Widget
          src="${REPL_ACCOUNT}/widget/NearOrg.ContentWithImage"
          key="web3-components"
          props={{
            content: (
              <>
                <Text size="text-xl" mobileSize="text-l" fontWeight="500" color="white">
                  Stop reinventing the wheel and leverage over{" "}
                  <Widget
                    src="${REPL_ACCOUNT}/widget/NearOrg.TotalStats"
                    props={{
                      children: (stats) => <span style={{ color: "#00EC97" }}>{stats.totalComponents}</span>,
                    }}
                  />
                  Web3 components.
                </Text>
                <Text color="white">
                  Open-source components built with public blockchain data allow you to create rich user experiences
                  without wasting time on backend configuration.
                </Text>
                <div>
                  <Widget
                    src="${REPL_ACCOUNT}/widget/DIG.Button"
                    props={{
                      href: "/components",
                      label: "Explore Components",
                      variant: "affirmative",
                      size: "large",
                      className: "darkButton",
                    }}
                  />
                </div>
              </>
            ),
            image: returnIpfsImage(ipfsImages.illustrations.components),
            imageSide: "right",
            alt: "Illustration of the UI listing of a component with buttons to view details or open. Below it are images of checkboxes",
          }}
        />

        <Widget
          src="${REPL_ACCOUNT}/widget/NearOrg.ContentWithImage"
          key="web3-open-source"
          props={{
            content: (
              <>
                <Text size="text-xl" mobileSize="text-l" fontWeight="500" color="white">
                  Discover Web3 Open Source
                </Text>
                <Text color="white">
                  Everything on B.O.S. is easy to discover and open source by default. See what others have built, learn
                  faster, and gain inspiration.
                </Text>
                <div>
                  <Widget
                    src="${REPL_ACCOUNT}/widget/DIG.Button"
                    props={{
                      href: "/applications",
                      label: "Explore Applications",
                      variant: "affirmative",
                      size: "large",
                      className: "darkButton",
                    }}
                  />
                </div>
              </>
            ),
            image: returnIpfsImage(ipfsImages.illustrations.dapps),
            imageSide: "left",
            alt: "Illustration of the UI listing of an application with buttons to open, fork, view source, or discuss. Behind it there are images of code brackets and a git-fork icon. ",
          }}
        />
      </Container>
    </Section>

    <Section backgroundColor="#F2F1EA">
      <Container>
        <Flex direction="column" gap="24px">
          <H2>Greater discoverability. Easier onboarding.</H2>
          <Text size="text-2xl" mobileSize="text-l" style={{ maxWidth: "808px" }}>
            Current Web3 experiences are siloed & inaccessible. They don’t have to be.
          </Text>
        </Flex>

        <Widget
          src="${REPL_ACCOUNT}/widget/NearOrg.ContentWithImage"
          key="deploy-anywhere"
          props={{
            content: (
              <>
                <Text size="text-xl" mobileSize="text-l" fontWeight="500">
                  Deploy anywhere, get discovered everywhere.
                </Text>
                <Text>
                  Move beyond siloed, single-chain experiences and stop compromising your reach, all while getting the
                  best of NEAR's speed, low cost, and scalability.
                </Text>
                <div>
                  <Widget
                    src="${REPL_ACCOUNT}/widget/DIG.Button"
                    props={{
                      href: "/gateways",
                      label: "Explore Gateways",
                      variant: "secondary",
                      fill: "outline",
                      size: "large",
                    }}
                  />
                </div>
              </>
            ),
            image: returnIpfsImage(ipfsImages.illustrations.gateways),
            imageSide: "left",
            alt: "Illustration of a search bar above two buttons for GitHub and Deploy",
          }}
        />

        <Widget
          src="${REPL_ACCOUNT}/widget/NearOrg.ContentWithImage"
          key="fast-auth"
          props={{
            content: (
              <>
                <Text size="text-xl" mobileSize="text-l" fontWeight="500">
                  Onboard new users in seconds, no crypto required.
                </Text>
                <Text>
                  With FastAuth, onboarding to your decentralized application is even faster and easier than traditional
                  web authentication.
                </Text>
                <div>
                  <Widget
                    src="${REPL_ACCOUNT}/widget/DIG.Button"
                    props={{
                      href: "https://docs.near.org/tools/fastauth-sdk",
                      label: "Try FastAuth",
                      variant: "secondary",
                      fill: "outline",
                      size: "large",
                    }}
                  />
                </div>
              </>
            ),
            image: returnIpfsImage(ipfsImages.illustrations.fastAuth),
            imageSide: "right",
            alt: "Illustration of the FastAuth UI showing the stage allowing user to connect their account to a dApp.",
          }}
        />
      </Container>
    </Section>

    <Section backgroundColor="#00EC97">
      <Container>
        <H2 style={{ maxWidth: "1000px" }}>Be part of a global open source community.</H2>

        <Widget
          src="${REPL_ACCOUNT}/widget/NearOrg.TotalStats"
          props={{
            children: (stats) => (
              <Stats>
                <div>
                  <Text>{stats.totalDevelopers}</Text>
                  <Text>Developers</Text>
                </div>

                <div>
                  <Text>{stats.totalComponents}</Text>
                  <Text>OSS Components</Text>
                </div>

                <div>
                  <Text>{stats.totalApps}</Text>
                  <Text>Applications</Text>
                </div>
              </Stats>
            ),
          }}
        />
      </Container>
    </Section>

    <Section backgroundColor="#161615" style={{ "--sand11": "#A1A09A" }}>
      <Container>
        <Flex direction="column" gap="24px">
          <H2 style={{ color: "var(--white)" }}>Learn, connect, & collaborate.</H2>
          <Text size="text-2xl" mobileSize="text-l" color="white" style={{ maxWidth: "808px" }}>
            Join a vibrant community of innovators and builders creating a more open web.
          </Text>
        </Flex>

        <Flex direction="column" gap="24px" mobileGap="48px">
          <Flex direction="column" gap="24px">
            <Flex alignItems="center" gap="12px">
              <i className="ph-duotone ph-book-open-text" style={{ color: "var(--white)", fontSize: "32px" }} />
              <Text size="text-xl" fontWeight="600" color="white">
                Learn
              </Text>
            </Flex>

            <Flex gap="24px" alignItems="flex-end" mobileStack mobileAlignItems="flex-start">
              <Text style={{ maxWidth: "393px", marginRight: "auto" }} color="white">
                Everything you need to know about NEAR from ongoing developments to the latest updates.
              </Text>
            </Flex>
          </Flex>

          <Grid columns="1fr 1fr 1fr" gap="24px">
            {learnItems.map((item) => (
              <Widget
                src="${REPL_ACCOUNT}/widget/NearOrg.Card"
                key={item.name}
                props={{
                  as: "a",
                  href: item.url,
                  target: item.target,
                  dark: true,
                  children: (
                    <>
                      <IconCircle>
                        <i className={`ph-duotone ${item.icon}`} />
                      </IconCircle>

                      <Flex direction="column" gap="16px">
                        <Text size="text-l" fontWeight="500" color="white">
                          {item.name}
                        </Text>
                        <Text size="text-s" color="white">
                          {item.description}
                        </Text>
                      </Flex>
                    </>
                  ),
                }}
              />
            ))}
          </Grid>
        </Flex>

        <Flex direction="column" gap="24px" mobileGap="48px">
          <Flex direction="column" gap="24px">
            <Flex alignItems="center" gap="12px">
              <i className="ph-duotone ph-users-three" style={{ color: "var(--white)", fontSize: "32px" }} />
              <Text size="text-xl" fontWeight="600" color="white">
                Community
              </Text>
            </Flex>

            <Flex gap="24px" alignItems="flex-end" mobileStack mobileAlignItems="flex-start">
              <Text style={{ maxWidth: "393px", marginRight: "auto" }} color="white">
                Connect with people to help you on your journey across the open web.
              </Text>

              <Widget
                src="${REPL_ACCOUNT}/widget/DIG.Button"
                props={{
                  href: "/ecosystem",
                  label: "Explore the Ecosystem",
                  variant: "affirmative",
                  size: "large",
                  className: "darkButton",
                }}
              />
            </Flex>
          </Flex>

          <Grid columns="1fr 1fr 1fr" gap="24px">
            {communityItems.map((item) => (
              <Widget
                src="${REPL_ACCOUNT}/widget/NearOrg.Card"
                key={item.name}
                props={{
                  as: "a",
                  href: item.url,
                  target: item.target,
                  dark: true,
                  children: (
                    <>
                      <CardThumbnail>
                        <Widget
                          src="${REPL_MOB}/widget/Image"
                          props={{
                            image: returnIpfsImage(item.ipfsImage),
                            alt: item.name,
                          }}
                        />
                      </CardThumbnail>

                      <Flex direction="column" gap="16px">
                        <Text size="text-l" fontWeight="500" color="white">
                          {item.name}
                        </Text>
                        <Text size="text-s" color="white">
                          {item.description}
                        </Text>
                      </Flex>
                    </>
                  ),
                }}
              />
            ))}
          </Grid>
        </Flex>

        <Flex direction="column" gap="24px" mobileGap="48px">
          <Flex direction="column" gap="24px">
            <Flex alignItems="center" gap="12px">
              <i className="ph-duotone ph-newspaper" style={{ color: "var(--white)", fontSize: "32px" }} />
              <Text size="text-xl" fontWeight="600" color="white">
                News
              </Text>
            </Flex>

            <Flex gap="24px" alignItems="flex-end" mobileStack mobileAlignItems="flex-start">
              <Text style={{ maxWidth: "393px", marginRight: "auto" }} color="white">
                Catch up on the latest news and announcements from around the ecosystem.
              </Text>

              <Widget
                src="${REPL_ACCOUNT}/widget/DIG.Button"
                props={{
                  href: "/nearweekapp.near/widget/nearweek.com",
                  label: "All News",
                  variant: "affirmative",
                  size: "large",
                  className: "darkButton",
                }}
              />
            </Flex>
          </Flex>

          <Grid columns="1fr 1fr 1fr" gap="24px" mobileGap="48px">
            <Widget
              src="${REPL_ACCOUNT}/widget/NearOrg.LatestNews"
              props={{
                children: (posts) => (
                  <>
                    {posts.map((post) => (
                      <Article key={post.title} href={post.url} target="_blank">
                        <ArticleImage>
                          <img src={post.thumbnail} />
                        </ArticleImage>
                        <Text color="sand11" size="text-s">
                          {new Date(post.createdAt).toLocaleString(undefined, {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </Text>
                        <Text
                          color="white"
                          size="text-l"
                          fontWeight="500"
                          as="h3"
                          style={{
                            display: "-webkit-box",
                            maxWidth: "100%",
                            WebkitLineClamp: "2",
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {post.title}
                        </Text>
                      </Article>
                    ))}
                  </>
                ),
              }}
            />
          </Grid>
        </Flex>

        <Flex direction="column" gap="24px" mobileGap="48px">
          <Flex direction="column" gap="24px">
            <Flex alignItems="center" gap="12px">
              <i className="ph-duotone ph-calendar-blank" style={{ color: "var(--white)", fontSize: "32px" }} />
              <Text size="text-xl" fontWeight="600" color="white">
                Events
              </Text>
            </Flex>

            <Flex gap="24px" alignItems="flex-end" mobileStack mobileAlignItems="flex-start">
              <Text style={{ maxWidth: "393px", marginRight: "auto" }} color="white">
                Join us at conferences, meetups, and more as we gather across the globe.
              </Text>

              <Widget
                src="${REPL_ACCOUNT}/widget/DIG.Button"
                props={{
                  href: "/events",
                  label: "All Events",
                  variant: "affirmative",
                  size: "large",
                  className: "darkButton",
                }}
              />
            </Flex>
          </Flex>

          <Grid columns="1fr 1fr 1fr" gap="24px" mobileGap="48px">
            <Widget
              src="${REPL_ACCOUNT}/widget/NearOrg.LatestEvents"
              props={{
                children: (events) => (
                  <>
                    {events.map((event) => (
                      <Article key={event.title} href={event.url} target="_blank" style={{ minWidth: 0 }}>
                        <ArticleImage>
                          <img src={event.thumbnail} />
                        </ArticleImage>
                        <Text color="white" size="text-l" fontWeight="500" as="h3">
                          {event.title}
                        </Text>
                        <Flex alignItems="center" gap="32px" style={{ minWidth: 0 }}>
                          <Flex alignItems="center" gap="8px">
                            <i className="ph-bold ph-calendar-blank" style={{ color: "var(--white)" }} />
                            <Text color="sand11" size="text-s" style={{ whiteSpace: "nowrap" }}>
                              {event.date}
                            </Text>
                          </Flex>
                          <Flex alignItems="center" gap="8px" style={{ minWidth: 0 }}>
                            <i className="ph-bold ph-map-pin-line" style={{ color: "var(--white)" }} />
                            <Text
                              color="sand11"
                              size="text-s"
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: 0,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {event.location}
                            </Text>
                          </Flex>
                        </Flex>
                      </Article>
                    ))}
                  </>
                ),
                fetchEventsList,
              }}
            />
          </Grid>
        </Flex>
      </Container>
    </Section>

    <Widget src="${REPL_ACCOUNT}/widget/NearOrg.Footer" />
  </Wrapper>
);
