let { fetchEventsList } = props;

const LIMIT = 3;
const [events, setEvents] = useState([]);

const fetchEvents = () => {
  fetchEventsList()
    .then((eventsData) => {
      const { entries: events } = eventsData;
      const sortedEvents = [...events]
        .sort((a, b) => new Date(a.event.start_at) - new Date(b.event.start_at))
        .slice(0, LIMIT);
      const mappedEvents = sortedEvents.map((item) => {
        return {
          date: formatDate(item.event.start_at, item.event.end_at),
          location: formatLocation(item.event.geo_address_json),
          thumbnail: item.event.cover_url,
          title: item.event.name,
          url: item.event.url,
        };
      });
      setEvents(mappedEvents);
    })
    .catch((error) => {
      console.error(error);
    });
};

const formatDate = (startAt, endAt) => {
  // Example Format: "Jul 21 - Jul 23, 2023"

  const startAtDate = new Date(startAt);
  const endAtDate = new Date(endAt);

  const startAtDateFormatted = startAtDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  const endAtDateFormatted = endAtDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${startAtDateFormatted} - ${endAtDateFormatted}`;
};

const formatLocation = (location) => {
  if (location.city || location.city_state) {
    return `${location.city ?? location.city_state}, ${location.country}`;
  }
  return location.address;
};

useEffect(() => {
  fetchEvents();
}, []);

return props.children(events);
