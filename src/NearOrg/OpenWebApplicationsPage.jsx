const ipfsImages = {
  apps: {
    bosAllStars: "bafkreicgnsizdxoc436tbln3ucqo45hdauumd7if4gltrqh3tbxgosi3q4",
    bosHacks: "bafkreicpbijnii55242f7wcs6xnjf3ocyuyuguts6r6kkfz745g3jjudam",
    nui: "bafkreiefq7qqug2f657fdb5fyuaf5uesybwn7qu3ebxvmo47dhcsxu27vm",
  },
  gateways: {
    jutsu: "bafkreidgj5ifofjgka2uw6vx4mvjy7t3vvo7cpgalsfbkdngbnmceeff5a",
    mantle: "bafkreibm257cmmv4uceo5ebn3evcsnygc36frlshkt7jzpg36os2oyjqly",
    zkevm: "bafkreiagpsnpoljzjeqgt7n74lnmt5crgrka6kuqw56vmnrldmx4ziu67y",
  },
  illustrations: {
    buildingBlocks: "bafkreicoahoojfqqowcoeipizv4ogsjgsqtwzu4yhwgq7n3q4emxfj3wrq",
    gateways: "bafkreifbr6xiittgl6f4ovubbgjtwmv3chishfzyjxjzj5ugpcyflubakm",
  },
};

const communityItems = [
  {
    name: "Validators",
    description:
      "Run your own node or chunk validator and become a part of a decentralized community safeguarding the protocol.",
    icon: "ph-tree-structure",
    url: "https://docs.near.org/concepts/basics/validators",
    target: "_blank",
  },
  {
    name: "NEAR Enhancement Proposals",
    description:
      "Engage in discussions about changes to the protocol’s specifications and standards. Share your voice in shaping NEAR’s future.",
    icon: "ph-chats-circle",
    url: "https://github.com/near/NEPs",
    target: "_blank",
  },
  {
    name: "Roadmap",
    description: "Follow the public roadmap and contribute to building the ecosystem",
    icon: "ph-map-trifold",
    url: "https://near.org/blog/near-q2-protocol-roadmap-update",
    target: "_blank",
  },
];

const exampleGateways = [
  {
    title: "Mantle Gateway",
    description:
      "Streamlines access to top Mantle apps via a single interface and enhances user experience (UX) and project visibility.",
    url: "https://bos.fusionx.finance/",
    ipfsImage: ipfsImages.gateways.mantle,
  },
  {
    title: "Jutsu.ai",
    description:
      "A gateway for developers to increase productivity and achieve cost-effective on-chain deployment, straight from their browser.",
    url: "https://jutsu.ai/",
    ipfsImage: ipfsImages.gateways.jutsu,
  },
  {
    title: "zkEVM",
    description:
      "Polygon zkEVM increases accessibility and discoverability for zkEVM developers and users on the open web.",
    url: "https://bos.quickswap.exchange/",
    ipfsImage: ipfsImages.gateways.zkevm,
  },
];

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
    description: "A growing collection of beautifully designed B.O.S widgets - your building blocks for creating...",
    ipfsImage: ipfsImages.apps.nui,
    url: "/near/widget/ComponentDetailsPage?src=nearui.near/widget/index",
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
    border-color: #fff !important;
    &:focus {
      border-color: var(--violet9) !important;
    }
    &:hover {
      color: #000 !important;
      background: #fff !important;
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

  @media (max-width: 900px) {
    min-height: 390px;
  }
`;

const PatternContent = styled.div`
  padding: 1rem;
  max-width: 808px;
  margin: 0 auto;
  background-color: var(--background-color);
  display: flex;
  align-items: center;
  min-height: 260px;

  @media (max-width: 900px) {
    min-height: 0px;
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

return (
  <Wrapper>
    <Section backgroundColor="#9797FF" style={{ padding: "72px 0" }}>
      <Container center>
        <Pattern>
          <PatternContent>
            <Flex gap="32px" direction="column" alignItems="center">
              <H1>Building an open web</H1>

              <Text size="text-l" mobileSize="text-base">
                Contribute to building a web where users own their data, voices count, and everyone can be fairly
                rewarded for their effort.
              </Text>
            </Flex>
          </PatternContent>
        </Pattern>
      </Container>
    </Section>

    <Section backgroundColor="#F2F1EA">
      <Container>
        <Flex direction="column" gap="24px">
          <H2>Gateways: the doors to an open web</H2>
          <Text size="text-2xl" mobileSize="text-l" style={{ maxWidth: "808px" }}>
            Create multi-chain open web applications that feature seamless user onboarding.
          </Text>
        </Flex>

        <Widget
          src="${REPL_ACCOUNT}/widget/NearOrg.ContentWithImage"
          key="gateways"
          props={{
            content: (
              <Flex direction="column" gap="60px">
                <Flex direction="column" gap="24px">
                  <Text size="text-xl" mobileSize="text-l" fontWeight="500">
                    Supercharge the open web
                  </Text>
                  <Text>Augment your open web applications with thousands of composable multi-chain components.</Text>
                </Flex>

                <Flex direction="column" gap="24px">
                  <Text size="text-xl" mobileSize="text-l" fontWeight="500">
                    Seamless onboarding
                  </Text>
                  <Text>
                    Empower users to login using only their email. Eliminate all onboarding friction to facilitate mass
                    adoption.
                  </Text>
                </Flex>

                <Flex direction="column" gap="24px">
                  <Text size="text-xl" mobileSize="text-l" fontWeight="500">
                    Social from the get-go
                  </Text>
                  <Text>
                    Easily add social components to your app and keep your audience engaged through web push
                    notifications.
                  </Text>
                </Flex>

                <div>
                  <Widget
                    src="${REPL_ACCOUNT}/widget/DIG.Button"
                    props={{
                      href: "https://github.com/near/create-near-app",
                      target: "_blank",
                      label: "Create Your App",
                      variant: "secondary",
                      fill: "outline",
                      size: "large",
                    }}
                  />
                </div>
              </Flex>
            ),
            image: returnIpfsImage(ipfsImages.illustrations.gateways),
            imageSide: "left",
            alt: "A browser window and a console window with the code snippet # Quick-start your own gateway npx create-near-app@latest alongside the logos for React JS, Ethereum, Polygon, and NEAR.",
          }}
        />

        <Flex direction="column" gap="60px">
          <Flex direction="column" gap="24px">
            <Text size="text-xl" mobileSize="text-l" fontWeight="500">
              Example Gateways
            </Text>

            <Flex gap="24px" alignItems="flex-end" mobileStack mobileAlignItems="flex-start">
              <Text style={{ maxWidth: "598px", marginRight: "auto" }}>
                See how developers are using gateways to create rich multi-chain, open web applications
              </Text>
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
            </Flex>
          </Flex>

          <Grid columns="1fr 1fr 1fr" gap="24px" mobileGap="48px">
            {exampleGateways.map((gateway) => (
              <Article key={gateway.title} href={gateway.url} target="_blank">
                <ArticleImage>
                  <Widget
                    src="${REPL_MOB}/widget/Image"
                    props={{
                      image: returnIpfsImage(gateway.ipfsImage),
                    }}
                  />
                </ArticleImage>
                <Text size="text-l" fontWeight="500" as="h3">
                  {gateway.title}
                </Text>
                <Text>{gateway.description}</Text>
              </Article>
            ))}
          </Grid>
        </Flex>
      </Container>
    </Section>

    <Section backgroundColor="#000000">
      <Container>
        <Flex direction="column" gap="24px">
          <H2 style={{ color: "var(--white)", maxWidth: "1015px" }}>Components: the building blocks of an open web</H2>
          <Text size="text-2xl" mobileSize="text-l" color="white" style={{ maxWidth: "808px" }}>
            Explore, use, and share the building blocks for open web applications.
          </Text>
        </Flex>

        <Widget
          src="${REPL_ACCOUNT}/widget/NearOrg.ContentWithImage"
          key="building-blocks"
          props={{
            content: (
              <Flex direction="column" gap="60px">
                <Flex direction="column" gap="24px">
                  <Text color="white" size="text-xl" mobileSize="text-l" fontWeight="500">
                    10,000 components and climbing
                  </Text>
                  <Text color="white">
                    Use an ever-growing library of components, providing functionality ranging from Social to DeFi and
                    beyond.
                  </Text>
                </Flex>

                <Flex direction="column" gap="24px">
                  <Text color="white" size="text-xl" mobileSize="text-l" fontWeight="500">
                    Decentralized frontends made simple
                  </Text>
                  <Text color="white">
                    Use JSX syntax and a React-like library to easily build decentralized frontends using composable
                    components.
                  </Text>
                </Flex>

                <Flex direction="column" gap="24px">
                  <Text color="white" size="text-xl" mobileSize="text-l" fontWeight="500">
                    Secured on-chain
                  </Text>
                  <Text color="white">
                    All components are stored on a NEAR contract, making frontends highly reliable and
                    censorship-resistant
                  </Text>
                </Flex>

                <div>
                  <Widget
                    src="${REPL_ACCOUNT}/widget/DIG.Button"
                    props={{
                      href: "https://docs.near.org/bos/tutorial/quickstart",
                      target: "_blank",
                      label: "Start Building",
                      variant: "secondary",
                      fill: "outline",
                      size: "large",
                      className: "darkButton",
                    }}
                  />
                </div>
              </Flex>
            ),
            image: returnIpfsImage(ipfsImages.illustrations.buildingBlocks),
            imageSide: "left",
            alt: "Two chat bubbles alongside two component windows from the NEAR gateway",
          }}
        />

        <Flex direction="column" gap="60px">
          <Flex direction="column" gap="24px">
            <Text color="white" size="text-xl" mobileSize="text-l" fontWeight="500">
              A new and more open web
            </Text>

            <Flex gap="24px" alignItems="flex-end" mobileStack mobileAlignItems="flex-start">
              <Text color="white" style={{ maxWidth: "598px", marginRight: "auto" }}>
                Break out of siloed, single-chain experiences and expand your reach, all while getting the best of
                NEAR's speed, low cost, and scalability.
              </Text>
              <Widget
                src="${REPL_ACCOUNT}/widget/DIG.Button"
                props={{
                  href: "/components",
                  label: "Explore Components",
                  variant: "secondary",
                  fill: "outline",
                  size: "large",
                  className: "darkButton",
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
                  dark: true,
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
                          <Text color="white" size="text-l" fontWeight="500">
                            {app.name}
                          </Text>
                          <Text color="white" size="text-s">
                            @{app.accountId}
                          </Text>
                        </div>
                      </Flex>
                      <Text color="white" size="text-s">
                        {app.description}
                      </Text>
                    </>
                  ),
                }}
              />
            ))}
          </Grid>
        </Flex>
      </Container>
    </Section>

    <Section backgroundColor="#9797FF">
      <Container>
        <Flex direction="column" gap="50px" alignItems="center">
          <Flex direction="column" gap="20px" alignItems="center" style={{ textAlign: "center" }}>
            <Text size="text-3xl" fontWeight="500" style={{ maxWidth: "600px" }}>
              Start your journey with an open web
            </Text>

            <Text size="text-l" mobileSize="text-l" style={{ maxWidth: "600px" }}>
              Build quickly with awesome resources and thousands of composable components. Join a thriving community of
              developers building an open web.
            </Text>
          </Flex>

          <Flex gap="24px" wrap="wrap" alignItems="center" justifyContent="center">
            <Widget
              src="${REPL_ACCOUNT}/widget/DIG.Button"
              props={{
                href: "https://docs.near.org/bos/overview",
                label: "Read Docs",
                variant: "secondary",
                size: "large",
                target: "_blank",
              }}
            />

            <Widget
              src="${REPL_ACCOUNT}/widget/DIG.Button"
              props={{
                href: "/components",
                label: "Explore Components",
                variant: "primary",
                size: "large",
              }}
            />
          </Flex>
        </Flex>
      </Container>
    </Section>

    <Widget src="${REPL_ACCOUNT}/widget/NearOrg.Footer" />
  </Wrapper>
);
