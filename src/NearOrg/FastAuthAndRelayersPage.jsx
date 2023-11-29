const ipfsImages = {
  illustrations: {
    fastAuth: "bafkreidkr2s4fdnnm4f3xduwgnywyfwes3p6rtmpzac5l6xufpdivdvrva",
    relayers: "bafkreibtzosgikkencpjv35bjdc2iyz4mwxo7qcb6irnsb4gwiljvshhne",
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

return (
  <Wrapper>
    <Section backgroundColor="#61E5E2" style={{ padding: "72px 0" }}>
      <Container center>
        <Pattern>
          <PatternContent>
            <Flex gap="32px" direction="column" alignItems="center">
              <H1>Secure & simple onboarding</H1>

              <Text size="text-l" mobileSize="text-base">
                No seed phrase, no gas, no friction. Bring users on chain in seconds
                with FastAuth and Relayers.
              </Text>
            </Flex>
          </PatternContent>
        </Pattern>
      </Container>
    </Section>

    <Section backgroundColor="#F2F1EA">
      <Container>
        <Flex direction="column" gap="24px">
          <H2 style={{ maxWidth: "1016px" }}>
            FastAuth: Web3 applications, familiar login
          </H2>
          <Text size="text-2xl" mobileSize="text-l" style={{ maxWidth: "808px" }}>
            Creating a crypto wallet is not for everyone. With FastAuth, leverage the
            power of Web3 without compromising on user experience.
          </Text>
        </Flex>

        <Widget
          src="${REPL_ACCOUNT}/widget/NearOrg.ContentWithImage"
          key="fast-auth"
          props={{
            content: (
              <Flex direction="column" gap="60px">
                <Flex direction="column" gap="24px">
                  <Text size="text-xl" mobileSize="text-l" fontWeight="500">
                    Familiar login
                  </Text>
                  <Text>
                    Forget recovery phrases, FastAuth seamlessly links your users’
                    emails directly to NEAR accounts.
                  </Text>
                </Flex>

                <Flex direction="column" gap="24px">
                  <Text size="text-xl" mobileSize="text-l" fontWeight="500">
                    One Digital ID
                  </Text>
                  <Text>
                    Your users only need one email for FastAuth account login or
                    recovery across all devices and applications.
                  </Text>
                </Flex>

                <Flex direction="column" gap="24px">
                  <Text size="text-xl" mobileSize="text-l" fontWeight="500">
                    Simple & secure
                  </Text>
                  <Text>
                    FastAuth accounts are kept safe through multi-party computation
                    (MPC) on a decentralized network.
                  </Text>
                </Flex>

                <div>
                  <Widget
                    src="${REPL_ACCOUNT}/widget/DIG.Button"
                    props={{
                      href: "https://docs.near.org/tools/fastauth-sdk",
                      target: "_blank",
                      label: "Read FastAuth Docs",
                      variant: "secondary",
                      fill: "outline",
                      size: "large",
                    }}
                  />
                </div>
              </Flex>
            ),
            image: returnIpfsImage(ipfsImages.illustrations.fastAuth),
            imageSide: "left",
            alt: "A line drawing of a key hole and the near logo set behind the FastAuth sign-in window",
          }}
        />
      </Container>
    </Section>

    <Section backgroundColor="#000000">
      <Container>
        <Flex direction="column" gap="24px">
          <H2 style={{ color: "var(--white)" }}>Relayers: no crypto, no problem</H2>
          <Text
            size="text-2xl"
            mobileSize="text-l"
            color="white"
            style={{ maxWidth: "808px" }}
          >
            Obtaining cryptocurrencies to pay for transactions is the main hurdle to
            Web3 adoption. Use relayers to cover costs for your users.
          </Text>
        </Flex>

        <Widget
          src="${REPL_ACCOUNT}/widget/NearOrg.ContentWithImage"
          key="relayers"
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
                    Cover gas for your users
                  </Text>
                  <Text color="white">
                    Let your users make transactions in NEAR without crypto by
                    covering for their gas.
                  </Text>
                </Flex>

                <Flex direction="column" gap="24px">
                  <Text
                    color="white"
                    size="text-xl"
                    mobileSize="text-l"
                    fontWeight="500"
                  >
                    Set your limits
                  </Text>
                  <Text color="white">
                    Easily configure a wide array of permissions and expenditure
                    rules to keep your budget in line.
                  </Text>
                </Flex>

                <Flex direction="column" gap="24px">
                  <Text
                    color="white"
                    size="text-xl"
                    mobileSize="text-l"
                    fontWeight="500"
                  >
                    Native support
                  </Text>
                  <Text color="white">
                    Relayers are based on meta-transactions, which are built-in at
                    the protocol level.
                  </Text>
                </Flex>

                <div>
                  <Widget
                    src="${REPL_ACCOUNT}/widget/DIG.Button"
                    props={{
                      href: "https://github.com/near/pagoda-relayer-rs/tree/main#pagoda-relayer",
                      target: "_blank",
                      label: "Read Relayer Docs",
                      variant: "secondary",
                      fill: "outline",
                      size: "large",
                      className: "darkButton",
                    }}
                  />
                </div>
              </Flex>
            ),
            image: returnIpfsImage(ipfsImages.illustrations.relayers),
            imageSide: "right",
            alt: "A line drawing of the Relayer pathway starting at the user, to the transaction with the developer, and the developer paying the gas fee to NEAR",
          }}
        />
      </Container>
    </Section>

    <Section backgroundColor="#61E5E2">
      <Container>
        <Flex direction="column" gap="50px" alignItems="center">
          <Flex
            direction="column"
            gap="20px"
            alignItems="center"
            style={{ textAlign: "center" }}
          >
            <Text size="text-3xl" fontWeight="500" style={{ maxWidth: "600px" }}>
              Get ready to embrace mass adoption
            </Text>

            <Text size="text-l" mobileSize="text-l" style={{ maxWidth: "600px" }}>
              No seed phrase, no gas. Bring users on chain in seconds with FastAuth
              and Relayers.
            </Text>
          </Flex>

          <Flex gap="24px" wrap="wrap" alignItems="center" justifyContent="center">
            <Widget
              src="${REPL_ACCOUNT}/widget/DIG.Button"
              props={{
                href: "https://docs.near.org/tools/fastauth-sdk",
                target: "_blank",
                label: "FastAuth",
                variant: "secondary",
                size: "large",
              }}
            />

            <Widget
              src="${REPL_ACCOUNT}/widget/DIG.Button"
              props={{
                href: "https://github.com/near/pagoda-relayer-rs/tree/main#pagoda-relayer",
                target: "_blank",
                label: "Relayers",
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
