// const dataplane = "https://neardanieossax.dataplane.rudderstack.com"; //test
const dataplane = "https://near.dataplane.rudderstack.com"; //prod
const uri = "/v1/track";
const api_url = `${dataplane}${uri}`;
// const auth = "Basic MlVvMlBYSE9UdzJjUWRucThJUWJQTG9DOG5mOg=="; //test
const auth = "Basic MlVub3dMd2lXRnc3YzM1QU11RUVkREVJa2RvOg=="; //prod

const generateAnonId = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};

const trackEngagement = () => {
  const payload = {
    anonymousId: generateAnonId(24),
    channel: "web",
    context: props.fromContext,
    type: "track",
    originalTimestamp: new Date().toISOString(),
    sentAt: new Date().toISOString(),
    event: props.event,
    properties: {
      accountId: props.accountId,
      accountIdRank: props.accountIdRank,
    },
  };

  asyncFetch(api_url, {
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      Authorization: auth,
    },
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
};

props.onClick ? trackEngagement(props) : null;

return <>{props.children}</>;
