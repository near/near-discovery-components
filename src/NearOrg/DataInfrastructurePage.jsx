const ipfsImages = {
  illustrations: {
    bigQuery: "bafkreidvzhed5xtbswgzrcu4woho5jwql53wzagfmkafjcpxivmxv6tkcm",
    queryApi: "bafkreie5lvklwktdgvxyachxn4zkwb4pzkroqfopsu4zcb4ffyu5urcm6a",
    nearLake: "bafkreial6oat5r6howyc42xqgvwuicgs6yiaczywxm2t3reiclotww7slu",
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
    <Section backgroundColor="#F77A69" style={{ padding: "72px 0" }}>
      <Container center>
        <Pattern>
          <PatternContent>
            <Flex gap="32px" direction="column" alignItems="center">
              <H1>Effortless data indexing & management</H1>

              <Text size="text-l" mobileSize="text-base">
                Choose the data solution that fits your needs. Access and monitor on-chain data through public datasets,
                or scaffold your own infrastructure.
              </Text>
            </Flex>
          </PatternContent>
        </Pattern>
      </Container>
    </Section>

    <Section backgroundColor="#F2F1EA">
      <Container>
        <Flex direction="column" gap="24px">
          <H2 style={{ maxWidth: "1016px" }}>BigQuery public dataset: all the data, zero setup</H2>
          <Text size="text-2xl" mobileSize="text-l" style={{ maxWidth: "808px" }}>
            A large dataset with on-chain data publicly available on Google Cloud Platform. Obtain near real-time
            blockchain data using simple SQL queries.
          </Text>
        </Flex>

        <Widget
          src="${REPL_ACCOUNT}/widget/NearOrg.ContentWithImage"
          key="big-query"
          props={{
            content: (
              <Flex direction="column" gap="60px">
                <Flex direction="column" gap="24px">
                  <Text size="text-xl" mobileSize="text-l" fontWeight="500">
                    Instant insights
                  </Text>
                  <Text>Historic on-chain data queried at scale. No need to run your own infrastructure.</Text>
                </Flex>

                <Flex direction="column" gap="24px">
                  <Text size="text-xl" mobileSize="text-l" fontWeight="500">
                    Cost-effective
                  </Text>
                  <Text>
                    Eliminate the need to store and process bulk NEAR Protocol data. Query as little or as much data as
                    you like.
                  </Text>
                </Flex>

                <Flex direction="column" gap="24px">
                  <Text size="text-xl" mobileSize="text-l" fontWeight="500">
                    As easy as SQL
                  </Text>
                  <Text>
                    No prior experience with blockchain technology is required. Just bring a general knowledge of SQL to
                    unlock insights.
                  </Text>
                </Flex>

                <div>
                  <Widget
                    src="${REPL_ACCOUNT}/widget/DIG.Button"
                    props={{
                      href: "https://docs.near.org/bos/queryapi/big-query",
                      target: "_blank",
                      label: "Read BigQuery Docs",
                      variant: "secondary",
                      fill: "outline",
                      size: "large",
                    }}
                  />
                </div>
              </Flex>
            ),
            image: returnIpfsImage(ipfsImages.illustrations.bigQuery),
            imageSide: "left",
            alt: "A line drawing of the BigQuery logo, a magnifying glass inside a hexagon with a bar graph inside the glass, set behind a console window with a code snippet",
          }}
        />

        <Flex direction="column" gap="24px">
          <H2 style={{ maxWidth: "1016px" }}>QueryAPI: indexers made simple</H2>
          <Text size="text-2xl" mobileSize="text-l" style={{ maxWidth: "808px" }}>
            A fully managed solution to build indexer functions, extract on-chain data, and easily query it using
            GraphQL endpoints and subscriptions.
          </Text>
        </Flex>

        <Widget
          src="${REPL_ACCOUNT}/widget/NearOrg.ContentWithImage"
          key="query-api"
          props={{
            content: (
              <Flex direction="column" gap="60px">
                <Flex direction="column" gap="24px">
                  <Text size="text-xl" mobileSize="text-l" fontWeight="500">
                    Your data, your way
                  </Text>
                  <Text>
                    Decide how you want to store data. Design the tables and databases that better suit your needs.
                  </Text>
                </Flex>

                <Flex direction="column" gap="24px">
                  <Text size="text-xl" mobileSize="text-l" fontWeight="500">
                    Indexers made simple
                  </Text>
                  <Text>
                    Create the logic of your indexer and we will execute it for you. Forget about infrastructure—focus
                    on solutions.
                  </Text>
                </Flex>

                <Flex direction="column" gap="24px">
                  <Text size="text-xl" mobileSize="text-l" fontWeight="500">
                    Plug & play to your app
                  </Text>
                  <Text>
                    Fetch your data from any application through our API. Leverage GraphQL to query exactly what you
                    need.
                  </Text>
                </Flex>

                <div>
                  <Widget
                    src="${REPL_ACCOUNT}/widget/DIG.Button"
                    props={{
                      href: "https://docs.near.org/bos/queryapi/intro",
                      target: "_blank",
                      label: "Read QueryAPI Docs",
                      variant: "secondary",
                      fill: "outline",
                      size: "large",
                    }}
                  />
                </div>
              </Flex>
            ),
            image: returnIpfsImage(ipfsImages.illustrations.queryApi),
            imageSide: "right",
            alt: "A console window with a code snippet",
          }}
        />
      </Container>
    </Section>

    <Section backgroundColor="#000000">
      <Container>
        <Flex direction="column" gap="24px">
          <H2 style={{ color: "var(--white)" }}>NEAR Lake</H2>
          <Text size="text-2xl" mobileSize="text-l" color="white" style={{ maxWidth: "808px" }}>
            A solution that watches over the NEAR network and stores all the events for your easy access.
          </Text>
        </Flex>

        <Widget
          src="${REPL_ACCOUNT}/widget/NearOrg.ContentWithImage"
          key="developers"
          props={{
            content: (
              <Flex direction="column" gap="60px">
                <Flex direction="column" gap="24px">
                  <Text color="white" size="text-xl" mobileSize="text-l" fontWeight="500">
                    Cost-efficient solution
                  </Text>
                  <Text color="white">
                    Cost-efficient solution for building self-hosted indexers in Rust, JavaScript, Python, Go and other
                    languages
                  </Text>
                </Flex>

                <Flex direction="column" gap="24px">
                  <Text color="white" size="text-xl" mobileSize="text-l" fontWeight="500">
                    Streamlined data management
                  </Text>
                  <Text color="white">
                    Use NEAR Lake Framework to stream blocks to your server directly from NEAR Lake
                  </Text>
                </Flex>

                <div>
                  <Widget
                    src="${REPL_ACCOUNT}/widget/DIG.Button"
                    props={{
                      href: "https://docs.near.org/concepts/advanced/near-lake-framework",
                      target: "_blank",
                      label: "Read NEAR Lake Docs",
                      variant: "secondary",
                      fill: "outline",
                      size: "large",
                      className: "darkButton",
                    }}
                  />
                </div>
              </Flex>
            ),
            image: returnIpfsImage(ipfsImages.illustrations.nearLake),
            imageSide: "left",
            alt: "Three squares each with a line drawing inside: a data tower, code brackets, and three wiggling lines representing water",
          }}
        />
      </Container>
    </Section>

    <Section backgroundColor="#F77A69">
      <Container>
        <Flex direction="column" gap="50px" alignItems="center">
          <Flex direction="column" gap="20px" alignItems="center" style={{ textAlign: "center" }}>
            <Text size="text-3xl" fontWeight="500" style={{ maxWidth: "600px" }}>
              Unlock data for your App
            </Text>

            <Text size="text-l" mobileSize="text-l" style={{ maxWidth: "600px" }}>
              Use the solution that best fits your needs. Access data through open databases, create and execute indexer
              logic, or run your own infrastructure.
            </Text>
          </Flex>

          <Flex gap="24px" wrap="wrap" alignItems="center" justifyContent="center">
            <Widget
              src="${REPL_ACCOUNT}/widget/DIG.Button"
              props={{
                href: "https://docs.near.org/bos/queryapi/big-query",
                target: "_blank",
                label: "BigQuery Docs",
                variant: "secondary",
                size: "large",
              }}
            />

            <Widget
              src="${REPL_ACCOUNT}/widget/DIG.Button"
              props={{
                href: "https://docs.near.org/bos/queryapi/intro",
                target: "_blank",
                label: "QueryAPI Docs",
                variant: "primary",
                size: "large",
              }}
            />

            <Widget
              src="${REPL_ACCOUNT}/widget/DIG.Button"
              props={{
                href: "https://docs.near.org/tools/indexing",
                target: "_blank",
                label: "Indexing Docs",
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
