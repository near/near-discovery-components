const ipfsImages = {
  illustrations: {
    l2: "bafkreiaqqz44yzagdcj3ubd3uteh2guh7fhbktdg26fw52bti5onu6zsxm",
    dac: "bafkreigijormam2bufufztlvs2swnjnnzj3es7lcx3snmjdvwqd7y46ulm",
  },
  logos: {
    cosmose: "bafkreifx5onoiyip7mwogdnzmv7ilirkw2fyzvegrvxbmzf6bcbzuwbmbu",
    dropt: "bafkreihjdirbdiuoiqlcmpp7gnjnvkm3bfol7mtetyaldtgnvgrprpdbba",
    icc: "bafkreibygllbcqh3e3qkcrim2noa4wwev36af34rk6gw2rpogp53lwkbg4",
    marblex: "bafkreigaqwyom4knnvjdvsgmfbef5adp5k6no4prdudiog3pypiqddoyum",
    sailgp: "bafkreifoxofuz4mkoopodvrdb44g5lva4w5p46iexccovj4c62x6ihoj2i",
    shemaroo: "bafkreigoulx5h4u43xj4332bidnkn4dzbw5qgrcar6wf7yoewnrxfyjfle",
    sweatcoin: "bafkreigztaapfbvnfzrw4oap6zi7us4drcbx2wt3broi4n3u4nzfyrtxcy",
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

const LogoLinksScroll = styled.div`
  overflow: auto;
  scroll-behavior: smooth;
  width: 100%;
  text-align: center;
  padding: 0 24px;

  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }

  @media (max-width: 1170px) {
    padding-right: 40px;
  }
`;

const LogoLinks = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 60px;

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

const web3Teams = [
  {
    url: "https://cosmose.co",
    name: "Cosmose AI",
    ipfsImage: ipfsImages.logos.cosmose,
    height: "38px",
  },
  {
    url: "https://dropt.io",
    name: "Dropt",
    ipfsImage: ipfsImages.logos.dropt,
    height: "35px",
  },
  {
    url: "https://www.icc-cricket.com",
    name: "ICC",
    ipfsImage: ipfsImages.logos.icc,
    height: "24px",
  },
  {
    url: "https://www.marblex.io",
    name: "Marblex",
    ipfsImage: ipfsImages.logos.marblex,
    height: "16px",
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
    url: "https://sweatco.in",
    name: "Sweatcoin",
    ipfsImage: ipfsImages.logos.sweatcoin,
    height: "24px",
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
            </Flex>
          </PatternContent>
        </Pattern>
      </Container>
    </Section>

    <Section>
      <Container>
        <Flex direction="column" gap="24px">
          <H2 style={{ maxWidth: "1016px" }}>A data availability layer compatible with L2 frameworks</H2>
          <Text size="text-2xl" mobileSize="text-l" style={{ maxWidth: "808px" }}>
            Plug NEAR’s DA layer into your L2 framework and start publishing transaction data on a blockchain with a
            proven trajectory of 100% uptime over its lifetime.
          </Text>
        </Flex>

        
      {/* This will be uncommented once we get the updated image from the design team */}
      {/* <Widget
        src="${REPL_MOB}/widget/Image"
        props={{
          image: {
            ipfs_cid: ipfsImages.illustrations.dac,
          },
          alt: "A data availability chart showing comparisons between NEAR, Celestia, Ethereum with proto-danksharding, and ethereum without proto-danksharding.",
        }}
      /> */}
    

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
                  <Text>NEAR readily provides an RPC to easily retrieve the on-chain data from anywhere</Text>
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

    <Section >
        {/* <Teams> */}
          <LogoText
            size="text-xs"
            fontWeight="700"
            color="sand11"
            style={{
              textTransform: "uppercase",
              letterSpacing: "2px",
              padding: "0 24px",
              textAlign: "center",
            }}
          >
            Trusted by forward thinking teams
          </LogoText>

          <LogoLinksWrapper>
            <LogoLinksScroll>
              <LogoLinks>
                {web3Teams.map((team) => {
                  return (
                    <a
                      href={team.url}
                      target="_blank"
                      title={team.name}
                      style={{ height: team.height }}
                      key={team.name}
                    >
                      <Widget
                        src="${REPL_MOB}/widget/Image"
                        props={{
                          image: returnIpfsImage(team.ipfsImage),
                          alt: team.name,
                        }}
                      />
                    </a>
                  );
                })}
              </LogoLinks>
            </LogoLinksScroll>
          </LogoLinksWrapper>
        {/* </Teams> */}
    </Section>

    <Section backgroundColor="#F2F1EA">
      <Container>
        <Flex direction="column" gap="50px" alignItems="center">
          <Flex direction="column" gap="20px" alignItems="center" style={{ textAlign: "center" }}>
            <Text size="text-3xl" fontWeight="500" style={{ maxWidth: "600px" }}>
              Get started with NEAR's data availability layer
            </Text>

            <Text size="text-l" mobileSize="text-l" style={{ maxWidth: "600px" }}>
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
          </Flex>
        </Flex>
      </Container>
    </Section>

    <Widget src="${REPL_ACCOUNT}/widget/NearOrg.Footer" />
  </Wrapper>
);
