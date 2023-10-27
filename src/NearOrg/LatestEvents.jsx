/*
  There's currently no way of dynamically fetching events due to the data being stored in WordPress.
  So for now we have to hard code the data from this page:
  https://near.org/events
*/

const events = [
  {
    title: "ETHGlobal Paris",
    date: "Jul 21 - Jul 23, 2023",
    location: "Paris, France",
    thumbnail:
      "https://pages.near.org/wp-content/uploads/2022/11/roadmap22-23-social-600x333.png",
    url: "https://ethglobal.com/events/paris2023",
  },
  {
    title: "NEAR APAC",
    date: "Sep 8 – Sep 12, 2023",
    location: "Ho Chi Minh, Vietnam",
    thumbnail:
      "https://pages.near.org/wp-content/uploads/2023/06/Screenshot-2023-06-06-at-4.06.38-PM-600x333.png",
    url: "https://nearapac.org/",
  },
  {
    title: "Nearcon 2023",
    date: "Nov 7 – Nov 10, 2023",
    location: "Lisbon, Portugal",
    thumbnail:
      "https://pages.near.org/wp-content/uploads/2023/06/Screenshot-2023-06-06-at-4.11.07-PM-600x333.png",
    url: "https://nearcon.org/",
  },
];

return props.children(events);
