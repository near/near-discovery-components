const ipfsImages = {
  illustrations: {
    devHub: "bafkreia5igkmp2pjnnxddpyz5sp6et7uowm6r3fk2ycxwca3aflzop2odq",
    horizon: "bafkreihcolnwvwigzerbvweyg5ygeuxgo5fngfrowogytjst2v3qchujne",
    ndc: "bafkreidx3swoxdm5t2gmibpheg5fuhjkgezacpn6u7iehkim3gcgemnsqi",
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
    <Section backgroundColor="#00EC97" style={{ padding: "72px 0" }}>
      <Container center>
        <Pattern>
          <PatternContent>
            <Flex gap="32px" direction="column" alignItems="center">
              <H1>Ecosystem</H1>

              <Text size="text-l" mobileSize="text-base">
                Explore a vibrant ecosystem that supports developers, founders, and contributors.
              </Text>
            </Flex>
          </PatternContent>
        </Pattern>
      </Container>
    </Section>

    <Section backgroundColor="#F2F1EA">
      <Container>
        <Flex direction="column" gap="24px">
          <H2>Building the open web together</H2>
          <Text size="text-2xl" mobileSize="text-l" style={{ maxWidth: "808px" }}>
            Developers and Founders building on the B.O.S are at the center. The Ecosystem is supporting them with
            everything they need to succeed.
          </Text>
        </Flex>

        <Widget
          src="${REPL_ACCOUNT}/widget/NearOrg.ContentWithImage"
          key="dev-hub"
          props={{
            content: (
              <>
                <Text size="text-xl" mobileSize="text-l" fontWeight="500">
                  DevHub: The community for developers.
                </Text>
                <Text>
                  DevHub is a decentralized community where NEAR developers can share ideas, match solutions, and access
                  support and funding.
                </Text>
                <div>
                  <Widget
                    src="${REPL_ACCOUNT}/widget/DIG.Button"
                    props={{
                      href: "/devgovgigs.near/widget/Ideas",
                      label: "Explore DevHub",
                      variant: "secondary",
                      fill: "outline",
                      size: "large",
                    }}
                  />
                </div>
              </>
            ),
            image: returnIpfsImage(ipfsImages.illustrations.devHub),
            imageSide: "right",
            alt: "The DevHub logo, the characters / d / h .",
          }}
        />

        <Widget
          src="${REPL_ACCOUNT}/widget/NearOrg.ContentWithImage"
          key="horizon"
          props={{
            content: (
              <>
                <Text size="text-xl" mobileSize="text-l" fontWeight="500">
                  Horizon: The launchpad for founders.
                </Text>
                <Text>Horizons is an early stage accelerator for Web3 founders to build, connect, and grow.</Text>
                <div>
                  <Widget
                    src="${REPL_ACCOUNT}/widget/DIG.Button"
                    props={{
                      href: "/horizon",
                      label: "Explore Horizon",
                      variant: "secondary",
                      fill: "outline",
                      size: "large",
                    }}
                  />
                </div>
              </>
            ),
            image: returnIpfsImage(ipfsImages.illustrations.horizon),
            imageSide: "left",
            alt: "The Near Horizon logo, a blue sunrise and the wordmark for Horizon",
          }}
        />

        <Widget
          src="${REPL_ACCOUNT}/widget/NearOrg.ContentWithImage"
          key="ndc"
          props={{
            content: (
              <>
                <Text size="text-xl" mobileSize="text-l" fontWeight="500">
                  NEAR Digital Collective (NDC): Decentralized Grassroots Governance
                </Text>
                <Text>The NDC is a grassroots, community-led movement to build decentralized governance on NEAR.</Text>
                <div>
                  <Widget
                    src="${REPL_ACCOUNT}/widget/DIG.Button"
                    props={{
                      href: "https://app.neardc.org/",
                      target: "_blank",
                      label: "Explore the NDC",
                      variant: "secondary",
                      fill: "outline",
                      size: "large",
                    }}
                  />
                </div>
              </>
            ),
            image: returnIpfsImage(ipfsImages.illustrations.ndc),
            imageSide: "right",
            alt: "The NDC logo, the letters N, D, and C interconnected",
          }}
        />
      </Container>
    </Section>

    <Widget
      src="${REPL_ACCOUNT}/widget/NearOrg.BosCtaSection"
      props={{
        backgroundColor: "#00EC97",
      }}
    />

    <Widget src="${REPL_ACCOUNT}/widget/NearOrg.Footer" />
  </Wrapper>
);
