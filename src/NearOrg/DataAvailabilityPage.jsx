const ipfsImages = {
  illustrations: {
    l2: "bafkreiaqqz44yzagdcj3ubd3uteh2guh7fhbktdg26fw52bti5onu6zsxm",
    dac: "bafkreifkselhtl5p2lwjzzpzii6xcdkywwn47gxzulhir7vtn52hv4g5oe",
  },
  logos: {
    caldera: "bafkreib4iwhvtg3hutal3sacnehne7iiispxtzxsucl6yb7j6vtfjdsmou",
    dymension: "bafkreifyazhbdnbckyieag6a4ezm7mchncln4uoxv3x7v5uvcnewtz5shu",
    fluent: "bafkreiblc2o3x5uwjm4kiywzxkhpulykfmmvulvdqhy4odh6huzlzb4pi4",
    movementLabs: "bafkreifeghlktv3jscosqr6653jky2k4ti7vgyssgzc4tsxbznhboh3pyy",
    polygon: "bafkreig5ubh27cnjindiujnmyrwa2uft24bcrmgibzwlma4nqsommrcd4u",
    arbitrum: "bafkreibff556aanawcdwlpbelqnzns35gqmxcsll5k4acyynyrvibcljpu",
    starknet: "bafkreifteo2upl2sdubzcluygnijnt46dmdegv7tbygeciwv66zzjoatcu",
    vistara: "bafkreiecvztsb3iiyhh4lfjfzgh2xdvfoacl5izgw4keowjfmff44o7fdi",
    altlayer: "bafkreig3mrzesoettretv2dhnxtgy22wubasgifzx4smybyldzbk35e3fm",
    optimism: "bafkreidwitx5hu6hivyn3exi34moyea7livf6zfqk2dcny3z62ive7fpou",
    zeeve: "bafkreigwtxjuraug4l2rltpoy4wau6gaom6e52fwgyqfpdsh2t6voe6ypm",
    web3Game: "bafkreidbmy27gngqsz5opzy5dbhd7jdrnzt5r2e5grcpiad77zgjc4e6ki",
    optimism: "bafkreih7y4fx44ky7u34l77r3gx3xfv2gai52bpgmuldgfcusozts35mn4",
    gatewayFm: "bafkreiga33qbg5c4ffckdk7d4fnwc54ydafn4o3b3oucnabcd2mcq4s5ve",
    ankr: "bafkreiaxqdtshibxuivqus3btgpx66z2mamse6idhoklp2ghwru5jxf4l4",
    fraxFinance: "bafkreihsgo2ikwgfcjt4dbj3fv5srychvyw23disz4rimp3zwgxnfchs3q",
    particleNetwork: "bafkreic7mcnt67qn4444u5zwbiuujl56vq2yomznqj2jjwcko7p3fhwiam",
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

const LogoText = styled.p`
  font: var(--${(p) => p.size ?? "text-base"});
  font-weight: ${(p) => p.fontWeight} !important;
  color: var(--${(p) => p.color ?? "sand12"});
  margin: 0;

  @media (max-width: 900px) {
    font: var(--${(p) => p.mobileSize ?? p.size ?? "text-base"});
  }
`;

const LogoLinksWrapper = styled.div`
  margin-top: 40px;
  width: 100%;
  position: relative;
  text-align: center;

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

const LinkLogo = styled.a`
  img {
    filter: ${(p) => p.$grayscale ?? "none"};
  }
`;

const web3Teams1 = [
  {
    url: "https://docs.arbitrum.io/inside-anytrust#data-availability-servers",
    name: "Arbitrum",
    ipfsImage: ipfsImages.logos.arbitrum,
    height: "29px",
  },
  {
    url: "https://polygon.technology/polygon-cdk",
    name: "Polygon",
    ipfsImage: ipfsImages.logos.polygon,
    height: "29px",
  },
  {
    url: "https://docs.starknet.io/documentation/architecture_and_concepts/Network_Architecture/on-chain-data",
    name: "Starknet",
    ipfsImage: ipfsImages.logos.starknet,
    height: "29px",
  },
  {
    url: "https://movementlabs.xyz",
    name: "Movement Labs",
    ipfsImage: ipfsImages.logos.movementLabs,
    height: "24px",
  },
  {
    url: "https://docs.optimism.io",
    name: "Optimism",
    ipfsImage: ipfsImages.logos.optimism,
    height: "19px",
  },
];

const web3Teams2 = [
  {
    url: "https://docs.altlayer.io/altlayer-documentation/core-features-of-altlayers-in-house-rollup-stack/modular",
    name: "Altlayer",
    ipfsImage: ipfsImages.logos.altlayer,
    height: "29px",
  },
  {
    url: "https://docs.caldera.xyz/about/alternative-da",
    name: "Caldera",
    ipfsImage: ipfsImages.logos.caldera,
    height: "28px",
  },
  {
    url: "https://docs.dymension.xyz/build/adv-guide/roller-adv/da-light-client",
    name: "Dymension",
    ipfsImage: ipfsImages.logos.dymension,
    height: "28px",
  },
  {
    url: "https://www.zeeve.io/blog/zeeve-raas-partners-with-near-da-to-power-ethereum-rollup-builders-with-efficient-data-availability",
    name: "Zeeve",
    ipfsImage: ipfsImages.logos.zeeve,
    height: "29px",
  },
  {
    url: "https://gateway.fm",
    name: "Gateway",
    ipfsImage: ipfsImages.logos.gatewayFm,
    height: "29px",
  },
  {
    url: "https://www.ankr.com/docs/scaling-services-rollups/data-availability/nearda",
    name: "Ankr",
    ipfsImage: ipfsImages.logos.ankr,
    height: "28px",
  },
];

const web3Teams3 = [
  {
    url: "https://web3games.com",
    name: "Web3Game",
    ipfsImage: ipfsImages.logos.web3Game,
    height: "28px",
  },
  {
    url: "https://frax.finance",
    name: "Frax Finance",
    ipfsImage: ipfsImages.logos.fraxFinance,
    height: "28px",
  },
  {
    url: "https://particle.network",
    name: "Particle Network",
    ipfsImage: ipfsImages.logos.particleNetwork,
    grayscaleImage: "grayscale(1) brightness(50%)",
    height: "29px",
  },
];

const web3TeamsSections = [
  {
    title: "Frameworks",
    teams: web3Teams1,
  },
  {
    title: "Rollups as a Service",
    teams: web3Teams2,
  },
  {
    title: "Blockchains",
    teams: web3Teams3,
  },
];

return (
  <Wrapper>
    <Section backgroundColor="#F2F1EA" style={{ padding: "72px 0" }}>
      <Container center>
        <Pattern>
          <PatternContent>
            <Flex gap="32px" direction="column" alignItems="center">
              <H1>An efficient and robust data availability layer</H1>

              <Text size="text-l" mobileSize="text-base">
                Simplify and lower costs in your rollup network by using NEAR as the Data Availability (DA) Layer in
                your Rollup Stack
              </Text>

              <Flex gap="24px" wrap="wrap" alignItems="center" justifyContent="center">
                <Widget
                  src="${REPL_ACCOUNT}/widget/DIG.Button"
                  props={{
                    href: "https://docs.near.org/data-availability/welcome",
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
                    href: "https://${REPL_NEAR_URL}/blog/why-near-data-availability",
                    target: "_blank",
                    label: "Intro to NEAR DA",
                    variant: "primary",
                    size: "large",
                  }}
                />

                <Widget
                  src="${REPL_ACCOUNT}/widget/DIG.Button"
                  props={{
                    href: "https://www.nearmodular.com",
                    target: "_blank",
                    label: "Costs Dashboard",
                    variant: "secondary",
                    fill: "outline",
                    size: "large",
                  }}
                />
              </Flex>
            </Flex>
          </PatternContent>
        </Pattern>
      </Container>
    </Section>

    <Section>
      {/* <Teams> */}

      <Flex gap="16px" direction="column" alignItems="center" style={{ textAlign: "center" }}>
        <Text size="text-3xl" fontWeight="500" style={{ maxWidth: "600px" }}>
          Trusted by forward thinking teams
        </Text>

        {/* <TeamsList> */}
        {web3TeamsSections.map((section) => (
          <Flex gap="16px" direction="column" key={section.title.replace(/ /g, "_").toLowerCase()}>
            <LogoText
              size="text-xs"
              fontWeight="700"
              color="sand11"
              style={{
                textTransform: "uppercase",
                letterSpacing: "2px",
                textAlign: "center",
                marginTop: "60px",
              }}
            >
              {section.title}
            </LogoText>
            <LogoLinksWrapper>
              <LogoLinks>
                {section.teams.map((team) => (
                  <LinkLogo
                    href={team.url}
                    target="_blank"
                    title={team.name}
                    style={{ height: team.height, display: "inline-block" }}
                    key={team.name}
                    $grayscale={team.grayscaleImage ?? false}
                  >
                    <Widget
                      src="${REPL_MOB}/widget/Image"
                      props={{
                        image: returnIpfsImage(team.ipfsImage),
                        alt: team.name,
                      }}
                    />
                  </LinkLogo>
                ))}
              </LogoLinks>
            </LogoLinksWrapper>
          </Flex>
        ))}
      </Flex>
    </Section>

    <Section>
      <Container>
        <Flex direction="column" gap="24px">
          <H2 style={{ maxWidth: "1016px" }}>A data availability layer compatible with L2 frameworks</H2>
          <Text size="text-2xl" mobileSize="text-l" style={{ maxWidth: "808px" }}>
            Plug NEAR&apos;s DA layer into your L2 framework and start publishing transaction data on a blockchain with
            a proven trajectory of 100% uptime over its lifetime.
          </Text>
        </Flex>

        <Widget
          src="${REPL_MOB}/widget/Image"
          props={{
            image: {
              ipfs_cid: ipfsImages.illustrations.dac,
            },
            alt: "A data availability chart showing comparisons between NEAR, Celestia, Ethereum with proto-danksharding, and ethereum without proto-danksharding.",
          }}
        />

        <Widget
          src="${REPL_ACCOUNT}/widget/NearOrg.ContentWithImage"
          key="l2-frameworks"
          props={{
            content: (
              <Flex direction="column" gap="60px">
                <Flex direction="column" gap="24px">
                  <Text size="text-xl" mobileSize="text-l" fontWeight="500">
                    Drastically reduce your costs
                  </Text>
                  <Text>
                    Storing calldata on NEAR Protocol is approximately 8000x cheaper than storing the same amount of
                    data on Ethereum.
                  </Text>
                </Flex>

                <Flex direction="column" gap="24px">
                  <Text size="text-xl" mobileSize="text-l" fontWeight="500">
                    Easily validate proofs
                  </Text>
                  <Text>
                    A trustless off-chain light client for NEAR provides easy access to validate that rollup data was
                    stored on-chain.
                  </Text>
                </Flex>

                <Flex direction="column" gap="24px">
                  <Text size="text-xl" mobileSize="text-l" fontWeight="500">
                    Simple to interact with
                  </Text>
                  <Text>
                    NEAR readily provides an RPC to easily retrieve the on-chain data from anywhere
                  </Text>
                </Flex>

                <div>
                  <Widget
                    src="${REPL_ACCOUNT}/widget/DIG.Button"
                    props={{
                      href: "https://docs.near.org/data-availability/welcome",
                      target: "_blank",
                      label: "Bootstrap Your L2",
                      variant: "secondary",
                      fill: "outline",
                      size: "large",
                    }}
                  />
                </div>
              </Flex>
            ),
            image: returnIpfsImage(ipfsImages.illustrations.l2),
            imageSide: "left",
            alt: "A flow chart showing the relationships between the L2 and Data Availability (DA). On the L2, the Rollup node and Batcher feed into the NEAR Protocol on Data Availability. The proposal from the L2 feeds into Ethereum in the DA when then feeds back into the Rollup Node of the L2.",
          }}
        />
      </Container>
    </Section>

    <Section backgroundColor="#F2F1EA">
      <Container>
        <Flex direction="column" gap="50px" alignItems="center">
          <Flex direction="column" gap="20px" alignItems="center" style={{ textAlign: "center" }}>
            <Text size="text-3xl" fontWeight="500" style={{ maxWidth: "600px" }}>
              Get started with NEAR's data availability layer
            </Text>

            <Text size="text-m" mobileSize="text-m" style={{ maxWidth: "600px" }}>
              Efficiently store state data and commitments on a NEAR contract for your L2 rollup.
            </Text>
          </Flex>

          <Flex gap="24px" wrap="wrap" alignItems="center" justifyContent="center">
            <Widget
              src="${REPL_ACCOUNT}/widget/DIG.Button"
              props={{
                href: "https://docs.near.org/data-availability/welcome",
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
                href: "https://forms.gle/LWJoTpTiCbSheUL26",
                target: "_blank",
                label: "Get Updates",
                variant: "primary",
                size: "large",
              }}
            />

            <Widget
              src="${REPL_ACCOUNT}/widget/DIG.Button"
              props={{
                href: "https://${REPL_NEAR_URL}/blog/why-near-data-availability",
                target: "_blank",
                label: "Intro to NEAR DA",
                variant: "secondary",
                fill: "outline",
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
