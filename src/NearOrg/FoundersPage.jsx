let { zendeskActivate, docs } = props;

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

  @media (max-width: 900px) {
    min-height: 390px;
  }
`;

const PatternContent = styled.div`
  padding: 2rem 4rem;
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

const Resource = ({ name, description, icon, url, target }) => (
  <Widget
    src="${REPL_ACCOUNT}/widget/NearOrg.Card"
    key={name}
    props={{
      as: "a",
      href: url,
      target,
      rel: "noopener noreferrer",
      alt: name,
      children: (
        <>
          <IconCircle>
            <i className={`ph-duotone ${icon}`} />
          </IconCircle>

          <Flex direction="column" gap="16px">
            <Text size="text-l" fontWeight="500">
              {name}
            </Text>
            <Text size="text-s">{description}</Text>
          </Flex>
        </>
      ),
    }}
  />
);

const selfServeResources = [
  {
    name: "Content Repository",
    description:
      "Here you will find the templates, guides, and additional resources essential for a founder's journey.",
    icon: "ph-article",
    url: "https://near-horizon.notion.site/NEAR-Founder-Hub-Content-Database-d69fcf11613443128fa249fe9fa069f0",
    target: "_blank",
  },
  {
    name: "Founder Co-Pilot",
    description:
      "Engage with interactive technical and business support to answer specific questions that you will likely encounter while building your product and company.",
    icon: "ph-github-logo",
    url: "https://near-cp-alpha.vercel.app",
    target: "_blank",
  },
  {
    name: "Token Launch Resources",
    description: "Discover detailed support to help you understand how to launch a token.",
    icon: "ph-file-doc",
    url: docs.tokenLaunchChecklist,
    target: "_blank",
  },
  {
    name: "Builder Perks",
    description: (
      <>
        We've curated a growing collection of curated resources and over $500K in discounts for HZN Founders.
        <br />
        <br />
        Interested in having your product listed as a perk? Send us a message at:{" "}
        <a href="mailto:Horizon@near.foundation">Horizon@near.foundation</a>
      </>
    ),
    icon: "ph-hammer",
    url: "https://www.notion.so/near-horizon/Builder-Perks-cb5e5f55870c4c5da6bf9f72fbae35a9",
    target: "_blank",
  },
];

const ecosystemCommunityResources = [
  {
    name: "HZN Accelerator Application",
    description:
      "Join the 8-week equity-free accelerator that provides multi-faceted support for early stage web3 projects.",
    icon: "ph-article",
    url: "https://www.hzn.xyz/",
    target: "_blank",
  },
  {
    name: "Funding Opportunities & Builder Communities",
    description:
      "Explore ecosystem funding opportunities and builder communities to find the right support for your projects.",
    icon: "ph-article",
    url: "https://${REPL_NEAR_URL}/ecosystem/get-funding",
  },
  {
    name: "Founder Events",
    description: "Discover the events that are revolutionizing how founders and builders find support in Web3.",
    icon: "ph-calendar-plus",
    url: "https://lu.ma/u/usr-5oZHY9dEDbDcaHY",
    target: "_blank",
  },
];

function returnIpfsImage(cfid) {
  return {
    ipfs_cid: cfid,
  };
}

return (
  <Wrapper>
    <Section backgroundColor="#00EC97" style={{ padding: "72px 0" }}>
      <Container center>
        <Pattern>
          <PatternContent>
            <Flex direction="column" alignItems="center">
              <H1>FounderHub</H1>
            </Flex>
          </PatternContent>
        </Pattern>
      </Container>
    </Section>

    <Section backgroundColor="#ffffff">
      <Container center>
        <Flex direction="column" gap="24px" alignItems="center">
          <H2>Welcome to NEAR, the best place to build Web3 projects</H2>
          <Text size="text-2xl" mobileSize="text-l" style={{ maxWidth: "808px" }}>
            From idea to launch, the NEAR FounderHub guides you every step of the way. Get the tailored resources,
            support, and community you need to launch and scale your Web3 project on NEAR.
          </Text>
        </Flex>
      </Container>
    </Section>

    <Section backgroundColor="#F2F1EA">
      <Container>
        <Flex direction="column" gap="24px">
          <H2>Self-Serve Resources</H2>
          <Text size="text-2xl" mobileSize="text-l" style={{ maxWidth: "808px" }}>
            Tap into our curated resources: proven templates, expert insights, and a vibrant founder network.
          </Text>
        </Flex>
        <Grid columns="1fr 1fr 1fr" gap="24px">
          {selfServeResources.map((item) => (
            <Resource key={`resource-${item.name}`} {...item} />
          ))}
        </Grid>
      </Container>
    </Section>

    <Section backgroundColor="#ffffff">
      <Container>
        <Flex direction="column" gap="24px">
          <H2>Ecosystem Community Resources</H2>
          <Text size="text-2xl" mobileSize="text-l" style={{ maxWidth: "808px" }}>
            Find your place within the ecosystem — your community is near.
          </Text>
        </Flex>
        <Grid columns="1fr 1fr 1fr" gap="24px">
          {ecosystemCommunityResources.map((item) => (
            <Resource key={`resource-${item.name}`} {...item} />
          ))}
        </Grid>
      </Container>
    </Section>

    <Section backgroundColor="#161615">
      <Container>
        <Flex direction="column" gap="24px">
          <H2 style={{ color: "var(--white)" }}>Accelerate your Web3 journey</H2>
        </Flex>

        <Widget
          src="${REPL_ACCOUNT}/widget/NearOrg.ContentWithImage"
          props={{
            content: (
              <Flex direction="column" gap="32px">
                <Text size="text-xl" mobileSize="text-l" fontWeight="500" color="white">
                  HZN AI Incubation Program applications are open
                </Text>
                <Text color="white" style={{ maxWidth: "496px" }}>
                  Over 50 projects have been accelerated through HZN, our AI Incubation Program and gone on to raise
                  over $10M in external capital. Get the education, mentorship, and a network to take your
                  project to the next level.
                </Text>
                <Flex>
                  <Widget
                    src="${REPL_ACCOUNT}/widget/DIG.Button"
                    props={{
                      href: "https://www.hzn.xyz/",
                      target: "_blank",
                      label: "Apply Now",
                      variant: "affirmative",
                      fill: "outline",
                      size: "large",
                      className: "darkButton",
                    }}
                  />
                </Flex>
              </Flex>
            ),
            image: returnIpfsImage("bafkreib55qq67nbthwpkzqx2upjnecwnrutpo3q26zjqt3wz3n5iw4o6da"),
            imageSide: "left",
            alt: "The HZN logo.",
          }}
        />
      </Container>
    </Section>
    <Section backgroundColor="#00EC97">
      <Container>
        <Flex direction="column" gap="24px" alignItems="center">
          <Text size="text-3xl" fontWeight="500" style={{ maxWidth: "808px", textAlign: "center" }}>
            Get in touch
          </Text>
          <Text size="text-xl" style={{ maxWidth: "658px", textAlign: "center" }}>
            Reach out to us to provide your feedback or to ask for specific support.
          </Text>

          <Widget
            src="${REPL_ACCOUNT}/widget/DIG.Button"
            props={{
              label: "Contact Us",
              variant: "primary",
              size: "large",
              onClick: () => zendeskActivate && zendeskActivate(),
            }}
          />
        </Flex>
      </Container>
    </Section>

    <Widget src="${REPL_ACCOUNT}/widget/NearOrg.Footer" />
  </Wrapper>
);
