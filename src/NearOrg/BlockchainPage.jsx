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
    description:
      "Follow the public roadmap and contribute to building the ecosystem",
    icon: "ph-map-trifold",
    url: "https://near.org/blog/near-q2-protocol-roadmap-update",
    target: "_blank",
  },
];

const ipfsImages = {
  illustrations: {
    developers: "bafkreiaccoujoiwowiypzjyobdqyfeqweu32htcswc3ojvnesvtwfs5acm",
    endUsers: "bafkreifew3ibskmcxicoa7bffleekg6kn3cwswyg5ht5shifbii6elwp2a",
    technicalMarvel:
      "bafkreieqsmwsffgrodbek3gbtjvxtwspkenesl6fivzrblxzojclba6dfa",
  },
};

function returnIpfsImage(cfid) {
  return {
    ipfs_cid: cfid,
  };
}

const Wrapper = styled.div`
  --section-gap: 120px;
  --text-hero: 500 72px/1 "FK Grotesk", "Mona Sans", sans-serif;
  margin-top: calc(var(--body-top-padding) * -1);

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

return (
  <Wrapper>
    <Section backgroundColor="#00EC97" style={{ padding: "72px 0" }}>
      <Container center>
        <Pattern>
          <PatternContent>
            <Flex gap="32px" direction="column" alignItems="center">
              <H1>The blockchain built for an open web</H1>

              <Text size="text-l" mobileSize="text-base">
                Created with simplicity in mind. NEAR is built from the ground
                up to be performant, secure, scalable, and eco-friendly.
              </Text>
            </Flex>
          </PatternContent>
        </Pattern>
      </Container>
    </Section>

    <Section backgroundColor="#F2F1EA">
      <Container>
        <Flex direction="column" gap="24px">
          <H2>NEAR, the blockchain for end-users</H2>
          <Text
            size="text-2xl"
            mobileSize="text-l"
            style={{ maxWidth: "808px" }}
          >
            NEAR brings users to the main stage, setting up Web3 for mass
            adoption.
          </Text>
        </Flex>

        <Widget
          src="${REPL_ACCOUNT}/widget/NearOrg.ContentWithImage"
          key="end-users"
          props={{
            content: (
              <Flex direction="column" gap="60px">
                <Flex direction="column" gap="24px">
                  <Text size="text-xl" mobileSize="text-l" fontWeight="500">
                    Named addresses
                  </Text>
                  <Text>
                    Ditch the random numbers and embrace user-friendly addresses
                    that are easy to recall. Become 'yourself.near'.
                  </Text>
                </Flex>

                <Flex direction="column" gap="24px">
                  <Text size="text-xl" mobileSize="text-l" fontWeight="500">
                    Unique key stream
                  </Text>
                  <Text>
                    Accounts support multiple keys, each with distinct
                    permissions. Give apps access to your account, ensuring your
                    funds remain secure.
                  </Text>
                </Flex>

                <Flex direction="column" gap="24px">
                  <Text size="text-xl" mobileSize="text-l" fontWeight="500">
                    Inexpensive, blazing fast, and reliable
                  </Text>
                  <Text>
                    Every day more than 1M transactions are completed, with an
                    avg. block time of 1.2 second and an avg. fee of $0.0001.
                  </Text>
                </Flex>

                <div>
                  <Widget
                    src="${REPL_ACCOUNT}/widget/DIG.Button"
                    props={{
                      href: "/signup",
                      label: "Create Account",
                      variant: "secondary",
                      fill: "outline",
                      size: "large",
                    }}
                  />
                </div>
              </Flex>
            ),
            image: returnIpfsImage(ipfsImages.illustrations.endUsers),
            imageSide: "left",
            alt: "A line drawing of a user avatar and the NEAR logo set behind the Create Account screen from FastAuth",
          }}
        />

        <Flex direction="column" gap="24px">
          <H2>NEAR, the blockchain for developers</H2>
          <Text
            size="text-2xl"
            mobileSize="text-l"
            style={{ maxWidth: "808px" }}
          >
            NEAR empowers developers to build open web apps and onboard users to
            Web3.
          </Text>
        </Flex>

        <Widget
          src="${REPL_ACCOUNT}/widget/NearOrg.ContentWithImage"
          key="developers"
          props={{
            content: (
              <Flex direction="column" gap="60px">
                <Flex direction="column" gap="24px">
                  <Text size="text-xl" mobileSize="text-l" fontWeight="500">
                    Smart contracts
                  </Text>
                  <Text>
                    NEAR's WebAssembly runtime lets you craft smart contracts
                    using well-known languages such as Javascript and Rust.
                  </Text>
                </Flex>

                <Flex direction="column" gap="24px">
                  <Text size="text-xl" mobileSize="text-l" fontWeight="500">
                    Built-in account abstraction
                  </Text>
                  <Text>
                    Cover gas fees for your users using built-in
                    meta-transactions.
                  </Text>
                </Flex>

                <Flex direction="column" gap="24px">
                  <Text size="text-xl" mobileSize="text-l" fontWeight="500">
                    Built-in developer incentive
                  </Text>
                  <Text>
                    Every time code runs on a smart contract, the contract
                    developer earns 30% of the burned gas.
                  </Text>
                </Flex>

                <div>
                  <Widget
                    src="${REPL_ACCOUNT}/widget/DIG.Button"
                    props={{
                      href: "https://docs.near.org/concepts/welcome",
                      target: "_blank",
                      label: "Start Building",
                      variant: "secondary",
                      fill: "outline",
                      size: "large",
                    }}
                  />
                </div>
              </Flex>
            ),
            image: returnIpfsImage(ipfsImages.illustrations.developers),
            imageSide: "right",
            alt: "A line drawing of two diamonds with arrows pointing toward each other set behind a console window with a code snippet",
          }}
        />
      </Container>
    </Section>

    <Section backgroundColor="#000000">
      <Container>
        <Flex direction="column" gap="24px">
          <H2 style={{ color: "var(--white)" }}>NEAR, a technical marvel</H2>
          <Text
            size="text-2xl"
            mobileSize="text-l"
            color="white"
            style={{ maxWidth: "808px" }}
          >
            Built on years of research, NEAR’s efficient and robust protocol
            stands as a true marvel of modern technology.
          </Text>
        </Flex>

        <Widget
          src="${REPL_ACCOUNT}/widget/NearOrg.ContentWithImage"
          key="technical-marvel"
          props={{
            content: (
              <Flex direction="column" gap="60px">
                <Flex direction="column" gap="24px">
                  <Text
                    color="white"
                    size="text-xl"
                    mobileSize="text-l"
                    fontWeight="500"
                  >
                    Horizontal scaling with sharding
                  </Text>
                  <Text color="white">
                    NEAR's sharded design enables limitless scaling and robust
                    resistance to traffic spikes.
                  </Text>
                </Flex>

                <Flex direction="column" gap="24px">
                  <Text
                    color="white"
                    size="text-xl"
                    mobileSize="text-l"
                    fontWeight="500"
                  >
                    Environmentally friendly
                  </Text>
                  <Text color="white">
                    Thanks to its proof-of-stake nature, NEAR consumes in a year
                    the same energy that Bitcoin consumes in 3 minutes.
                  </Text>
                </Flex>

                <Flex direction="column" gap="24px">
                  <Text
                    color="white"
                    size="text-xl"
                    mobileSize="text-l"
                    fontWeight="500"
                  >
                    A chain you can trust
                  </Text>
                  <Text color="white">
                    10 million blocks created in a span of two years with 100%
                    uptime.
                  </Text>
                </Flex>
              </Flex>
            ),
            image: returnIpfsImage(ipfsImages.illustrations.technicalMarvel),
            imageSide: "left",
            alt: "A line drawing of a leaf, a flower, and two data towers all interconnected",
          }}
        />

        <Flex direction="column" gap="24px">
          <H2 style={{ color: "var(--white)", maxWidth: "600px" }}>
            Built for and by the community
          </H2>
          <Text
            size="text-2xl"
            mobileSize="text-l"
            color="white"
            style={{ maxWidth: "808px" }}
          >
            An ever evolving protocol with an active community of contributors.
            Join us and help shape the future of the web.
          </Text>
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
      </Container>
    </Section>

    <Section backgroundColor="#00EC97">
      <Container>
        <Flex direction="column" gap="50px" alignItems="center">
          <Flex
            direction="column"
            gap="20px"
            alignItems="center"
            style={{ textAlign: "center" }}
          >
            <Text size="text-3xl" fontWeight="500">
              The blockchain for everyone
            </Text>

            <Text
              size="text-l"
              mobileSize="text-l"
              style={{ maxWidth: "592px" }}
            >
              Blockchain has never been easier. Create your account and join a
              thriving community of visionaries. Help build a new Internet,
              where everyone counts.
            </Text>
          </Flex>

          <Flex
            gap="24px"
            wrap="wrap"
            alignItems="center"
            justifyContent="center"
          >
            <Widget
              src="${REPL_ACCOUNT}/widget/DIG.Button"
              props={{
                href: "/signup",
                label: "Create Account",
                variant: "secondary",
                size: "large",
              }}
            />

            <Widget
              src="${REPL_ACCOUNT}/widget/DIG.Button"
              props={{
                href: "https://docs.near.org/concepts/welcome",
                target: "_blank",
                label: "Read Docs",
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
