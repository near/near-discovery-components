let { fetchEventsList } = props;

const dummyData = {
  href: "#",
  imgSrc: "",
  title: "",
  date: "",
  location: "",
};

const [eventsList, setEventsList] = useState(Array(3).fill(dummyData));
const [moreEvents, setMoreEvents] = useState(false);
const [dataLoaded, setDataLoaded] = useState(false);

const fetchEvents = () => {
  fetchEventsList().then((eventsData) => {
    const { entries: events, hasMore } = eventsData;
    const sortEvents = events.sort((a, b) => new Date(a.event.start_at) - new Date(b.event.start_at));
    setEventsList(sortEvents);
    setMoreEvents(hasMore);
    setDataLoaded(true);
  });
};

const convertData = (data) => {
  if (!data) return null;
  const createDate = new Date(data);
  return createDate.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatLocation = (location) =>
  location.city && location.country
    ? `${location.city}, ${location.country}`
    : location.address
      ? location.address
      : null;

useEffect(() => {
  fetchEvents();
}, []);

const backgroundAsset1 = "https://ipfs.near.social/ipfs/bafkreibocppns3yi7yakmhgsj53qdgw74kzs25dulfbrrif5g3gtzm45zy";
const backgroundAsset2 = "https://ipfs.near.social/ipfs/bafkreibupkdrjsmnxcmcu4yvtlex3rmioj3eoqlb2jlccdkeujzfwmvzhy";
const backgroundAsset3 = "https://ipfs.near.social/ipfs/bafkreidovdxkcy6f3rb5xm3ack7tdujxngx6xn6bnkl7t72u7fds4vt53i";
const backgroundAsset4 = "https://ipfs.near.social/ipfs/bafkreic632ok3wpcjcqjem43e7y3er4pxtt457akiw6coevu43aksy4ctu";

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

  @media (min-width: 690px) and (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
    gap: ${(p) => p.mobileGap ?? p.gap};
  }

  @media (max-width: 689px) {
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
  background-image: url("${backgroundAsset1}"), url("${backgroundAsset2}"), url("${backgroundAsset3}"),
    url("${backgroundAsset4}"),
    url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGeSURBVHgB7doxTisxEAbgeY/mvQro6NiSDo6QkpJbcA2OwjWooKQMJ2DpKENJBV7FEYoBeQSIZr9PGk2cItWvsdfZnSBjKHVf6rnUbdD1N8g4K7VX6jhIEaycofaTIEWwcoam0yFYOYe179WiQ7Byhk8+8wnB6munlHNWgmD1tUGyFSYIVl8bJFcOCYLV106s/aBrJ2hNE+qo1GmpRanz2J5aB6X+x/oQv/l+FWz5E/O1iHU4pom0W/u0/uoZahnrgN2VGuv6Jpidl1+o2T5BznkrfKj9MdZT6l9836r+3k2pq1KXMVNz3gpbU7hOmj49AQ7x/lJ0WWsK5xhv2+AYkHQR29vbddDluqFvbNZPQZdg9S07az4gWH3tHZVgJQhW3xjb4XIZyo+Z3nffHN79CZ1gYuXc1b4KEytFsHLGptMhWDlj7Q9BimDlbJ4Ex4AftggHdwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIpXoUVLSWulnzoAAAAASUVORK5CYII=");
  background-size:
    13%,
    14%,
    14%,
    25%,
    75px 75px;
  background-repeat: no-repeat, no-repeat, no-repeat, no-repeat, repeat;
  background-position:
    top left,
    top right 7%,
    bottom left 14%,
    bottom right,
    center top;

  @media (min-width: 576px) and (max-width: 1020px) {
    min-height: 570px;
  }

  @media (max-width: 575px) {
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

const featuredEvent = eventsList.lenght > 0 && [...eventsList].sort(
  (a, b) => Math.abs(new Date(a.event.start_at) - new Date()) - Math.abs(new Date(b.event.start_at) - new Date()),
)[0].event;

return (
  <Wrapper>
    <Section backgroundColor="#fff" style={{ padding: "72px 0" }}>
      <Container center>
        <Pattern>
          <PatternContent>
            <Flex gap="32px" direction="column" alignItems="center">
              <H1>Events</H1>

              <Text size="text-l" mobileSize="text-base">
                Come together IRL and online, and be part of building the Open Web together.
              </Text>
            </Flex>
          </PatternContent>
        </Pattern>
      </Container>
    </Section>

    {featuredEvent && (
      <Section backgroundColor="#fff" style={{ padding: "72px 24px" }}>
        <Container>
          <Flex direction="column" gap="80px" mobileGap="40px">
            <Text size="text-3xl" mobileSize="text-2xl" fontWeight="500">
              Upcoming Event
            </Text>
          </Flex>

          <Widget
            src="${REPL_ACCOUNT}/widget/Events.CardLarge"
            props={{
              as: "a",
              href: featuredEvent.url,
              imgSrc: featuredEvent.cover_url,
              title: featuredEvent.name,
              description: featuredEvent.description,
              date: { startAt: convertData(featuredEvent.start_at), endAt: convertData(featuredEvent.end_at) },
              location: formatLocation(featuredEvent?.geo_address_json),
              target: "_blank",
              rel: "noopener noreferrer",
              loading: !dataLoaded,
              variant: "large",
            }}
          />
        </Container>
      </Section>
    )}


    <Section backgroundColor="#fff" style={{ padding: "72px 24px" }}>
      <Container>
        <Flex gap="80px" mobileGap="40px" alignItems="center" justifyContent="space-between">
          <Text size="text-3xl" mobileSize="text-2xl" fontWeight="500">
            Our Events
          </Text>
          {moreEvents && (
            <Widget
              src="${REPL_ACCOUNT}/widget/DIG.Button"
              props={{
                href: "https://lu.ma/NEAR-community",
                target: "_blank",
                label: "View All",
                variant: "secondary",
                size: "small",
              }}
            />
          )}
        </Flex>

        {eventsList.lenght > 0 ? (
          <Grid columns="1fr 1fr 1fr" gap="20px">
            {eventsList.map(({ event }) => {
              const startAt = convertData(event?.start_at);
              const endAt = convertData(event?.end_at);
              const location = formatLocation(event.geo_address_json);
              return (
                <Widget
                  src="${REPL_ACCOUNT}/widget/Events.Card"
                  key={event.api_id}
                  props={{
                    as: "a",
                    href: event.url,
                    imgSrc: event.cover_url,
                    title: event.name,
                    date: { startAt, endAt },
                    location,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    loading: !dataLoaded,
                  }}
                />
              );
            })}
          </Grid>

        ) : (
          <Flex direction="column" gap="24px" alignItems="center">
            <Text size="text-2xl" mobileSize="text-lg" style={{ textAlign: "center" }}>
              There are no upcoming events at the moment.
            </Text>
            <Text size="text-xl" mobileSize="text-lg" style={{ maxWidth: "808px", textAlign: "center" }}>
              Subscribe to our Luma calendar to stay up to date with our events.
            </Text>
            <Widget
              src="${REPL_ACCOUNT}/widget/DIG.Button"
              props={{
                label: "Submit Event",
                variant: "primary",
                size: "large",
                href: "https://lu.ma/NEAR-community",
                target: "_blank",
              }}
            />
          </Flex>
        )}
      </Container>
    </Section>

    <Section backgroundColor="var(--violet6)">
      <Container>
        <Flex direction="column" gap="24px" alignItems="center">
          <Text
            size="text-3xl"
            mobileSize="text-2xl"
            fontWeight="500"
            style={{ maxWidth: "808px", textAlign: "center" }}
          >
            Hosting an event?
          </Text>

          <Text size="text-xl" mobileSize="text-lg" style={{ maxWidth: "808px", textAlign: "center" }}>
            Do you want your NEAR community event posted here? Submit your event details via Luma to be considered.
          </Text>

          <Widget
            src="${REPL_ACCOUNT}/widget/DIG.Button"
            props={{
              label: "Submit Event",
              variant: "primary",
              size: "large",
              href: "https://lu.ma/NEAR-community",
              target: "_blank",
            }}
          />
        </Flex>
      </Container>
    </Section>

    <Widget src="${REPL_ACCOUNT}/widget/NearOrg.Footer" />
  </Wrapper>
);
