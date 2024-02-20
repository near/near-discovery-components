const webThreeItems = [
  {
    name: "Why Web3 is needed now more than ever",
    description:
      "An article written by the Near Foundation describing the need for Web3 in the context of the world’s growing problems.",
    icon: "ph-article",
    url: "https://pages.near.org/blog/why-web3-is-needed-more-than-ever/",
    target: "_blank",
  },
  {
    name: "The Latecomers guide to crypto",
    description:
      "Author and technology columnist for The New York Times, Kevin Rose, wrote a series of essays on blockchain innovations.",
    icon: "ph-article-ny-times",
    url: "https://www.nytimes.com/interactive/2022/03/18/technology/cryptocurrency-crypto-guide.html",
    target: "_blank",
  },
  {
    name: "Intro for Web2 developers",
    description:
      "A guideline written to demonstrate how to bring a traditional Web 2 application into a Web 3 world using NEAR Protocol.",
    icon: "ph-file-doc",
    url: "https://docs.near.org/concepts/web3/intro",
    target: "_blank",
  },
  {
    name: "How to open the web",
    description: "NEAR’s co-founder Illia Polosukhin presents the core thesis for NEAR’s vision to build the open web.",
    icon: "ph-video",
    url: "https://www.youtube.com/watch?v=s3lhhyNCRwU",
    target: "_blank",
  },
  {
    name: "Web 3.0 Economics",
    description:
      "An article demonstrating that in addition to technological decentralization there also came economical decentralization.",
    icon: "ph-file-doc",
    url: "https://docs.near.org/concepts/web3/economics",
    target: "_blank",
  },
  {
    name: "Blockchain Basics",
    description:
      "A guideline that tells compares Web 1 and Web 2 development practices versus how Web 3 technology differs with blockchain at its’ core.",
    icon: "ph-file-doc",
    url: "https://docs.near.org/concepts/web3/basics",
    target: "_blank",
  },
];

const bosItems = [
  {
    name: "B.O.S Documentation",
    description: "The one-stop shop for all developer documentation related to the Blockchain Operating System.",
    icon: "ph-file-doc",
    url: "https://docs.near.org/",
    target: "_blank",
  },
  {
    name: "NEAR B.O.S Wiki",
    description:
      "NEAR’s  open-source, collaborative wiki provides valuable context and information on the Blockchain Operating System.",
    icon: "ph-file-doc",
    url: "https://wiki.near.org/overview/BOS/overall-bos",
    target: "_blank",
  },
  {
    name: "Illia Announces the B.O.S",
    description: "NEAR’s co-founder, Illia Polosukhin announces the Blockchain Operating System at ETH Denver 2023.",
    icon: "ph-video",
    url: "https://www.youtube.com/watch?v=zpkkhCESPU4",
    target: "_blank",
  },
  {
    name: "NEAR Announces the Blockchain Operating System",
    description:
      "An article written by the NEAR foundation that announces the launch of the Blockchain Operating System.",
    icon: "ph-article",
    url: "https://near.org/blog/near-announces-the-blockchain-operating-system",
    target: "_blank",
  },
  {
    name: "NEAR is the B.O.S",
    description:
      "An article written by blockchain research group, Messari, discussing the Blockchain Operating System enhancements for applications in crypto while maintaining a user-friendly experience.",
    icon: "ph-article",
    url: "https://messari.io/report/near-is-the-bos",
    target: "_blank",
  },
  {
    name: "The Blockchain Operating System Explained",
    description: "David Weinstein (Chief of Staff at NEAR Foundation) discusses NEAR's  Blockchain Operating System.",
    icon: "ph-video",
    url: "https://www.youtube.com/watch?v=eQbuS1Xb5dc",
    target: "_blank",
  },
];

const nearItems = [
  {
    name: "The NEAR White Paper",
    description: "Read the original white paper that was the origin of the NEAR Protocol.",
    icon: "ph-article",
    url: "https://near.org/papers",
  },
  {
    name: "Videos explaining NEAR",
    description:
      "Visit the NEAR Protocol YouTube channel to watch a series of videos explaining the details of the blockchain.",
    icon: "ph-video",
    url: "https://www.youtube.com/watch?v=aS_zb5Je4NI&list=PL9tzQn_TEuFWonmMVb6Ze49BfOZjE7yC5",
    target: "_blank",
  },
  {
    name: "NEAR Protocol Docs",
    description: "Read the technical documents for the NEAR Protocol.",
    icon: "ph-file-doc",
    url: "https://docs.near.org/concepts/web3/near",
    target: "_blank",
  },
  {
    name: "Deep Dive into Sharding",
    description:
      "Read the white paper on NEAR’s innovating solution to scale transaction throughput, Nightshade Sharding.",
    icon: "ph-article",
    url: "https://near.org/papers/nightshade",
    target: "_blank",
  },
  {
    name: "NEAR Whiteboard Series",
    description:
      "The Whiteboard Series with NEAR is a set of video interviews with Founders who are building scalable solutions for Blockchain.",
    icon: "ph-video",
    url: "https://www.youtube.com/watch?v=GqmEhiDX21I&list=PL9tzQn_TEuFWweVbfTbaedFdwVrvaYPq4&index=1",
    target: "_blank",
  },
  {
    name: "Smart Contracts on NEAR",
    description: "Get started with documentation for building JavaScript and Rust Smart Contracts on NEAR Protocol.",
    icon: "ph-file-doc",
    url: "https://docs.near.org/concepts/basics/accounts/smartcontract",
    target: "_blank",
  },
];

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

  @media (max-width: 900px) {
    min-height: 390px;
  }
`;

const PatternContent = styled.div`
  padding: 1rem;
  max-width: 496px;
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
    <Section backgroundColor="#61E5E2" style={{ padding: "72px 0" }}>
      <Container center>
        <Pattern>
          <PatternContent>
            <Flex gap="32px" direction="column" alignItems="center">
              <H1>Learn</H1>

              <Text size="text-l" mobileSize="text-base">
                Gain an understanding of the open web and the role of NEAR in that vision.
              </Text>
            </Flex>
          </PatternContent>
        </Pattern>
      </Container>
    </Section>

    <Section backgroundColor="#F2F1EA">
      <Container>
        <Flex direction="column" gap="80px" mobileGap="40px">
          <Text>What is Web3?</Text>

          <Flex direction="column" gap="24px">
            <H2>Users have all the power in Web3</H2>
            <Text size="text-2xl" mobileSize="text-l" style={{ maxWidth: "808px" }}>
              The next iteration of the internet will give users more autonomy over their data, assets, and creative
              license.
            </Text>
          </Flex>
        </Flex>

        <Grid columns="1fr 1fr 1fr" gap="24px">
          {webThreeItems.map((item) => (
            <Widget
              src="${REPL_ACCOUNT}/widget/NearOrg.Card"
              key={item.name}
              props={{
                as: "a",
                href: item.url,
                target: item.target,
                children: (
                  <>
                    <IconCircle>
                      <i className={`ph-duotone ${item.icon}`} />
                    </IconCircle>

                    <Flex direction="column" gap="16px">
                      <Text size="text-l" fontWeight="500">
                        {item.name}
                      </Text>
                      <Text size="text-s">{item.description}</Text>
                    </Flex>
                  </>
                ),
              }}
            />
          ))}
        </Grid>
      </Container>
    </Section>

    <Section backgroundColor="#161615">
      <Container>
        <Flex direction="column" gap="80px" mobileGap="40px">
          <Text color="sand1">What is the Blockchain Operating System (B.O.S)?</Text>

          <Flex direction="column" gap="24px">
            <H2 style={{ color: "var(--white)", maxWidth: "600px" }}>The operating system for an open web</H2>
            <Text size="text-2xl" mobileSize="text-l" color="white" style={{ maxWidth: "808px" }}>
              The B.O.S is an open-source platform that gives developers the ability to build on any blockchain using
              familiar languages and a broad set of components.
            </Text>
          </Flex>
        </Flex>

        <Grid columns="1fr 1fr 1fr" gap="24px">
          {bosItems.map((item) => (
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

    <Section backgroundColor="#ADF5F3">
      <Container>
        <Flex direction="column" gap="80px" mobileGap="40px">
          <Text>What is NEAR?</Text>

          <Flex direction="column" gap="24px">
            <H2 style={{ maxWidth: "1015px" }}>NEAR is the next generation of blockchains</H2>
            <Text size="text-2xl" mobileSize="text-l" style={{ maxWidth: "808px" }}>
              NEAR is a a layer 1 blockchain that uses a Proof-of-Stake (PoS) consensus mechanism and sharded
              architecture to scale transaction throughput.
            </Text>
          </Flex>
        </Flex>

        <Grid columns="1fr 1fr 1fr" gap="24px">
          {nearItems.map((item) => (
            <Widget
              src="${REPL_ACCOUNT}/widget/NearOrg.Card"
              key={item.name}
              props={{
                as: "a",
                href: item.url,
                target: item.target,
                children: (
                  <>
                    <IconCircle>
                      <i className={`ph-duotone ${item.icon}`} />
                    </IconCircle>

                    <Flex direction="column" gap="16px">
                      <Text size="text-l" fontWeight="500">
                        {item.name}
                      </Text>
                      <Text size="text-s">{item.description}</Text>
                    </Flex>
                  </>
                ),
              }}
            />
          ))}
        </Grid>
      </Container>
    </Section>

    <Widget
      src="${REPL_ACCOUNT}/widget/NearOrg.BosCtaSection"
      props={{
        backgroundColor: "#61E5E2",
      }}
    />

    <Widget src="${REPL_ACCOUNT}/widget/NearOrg.Footer" />
  </Wrapper>
);
