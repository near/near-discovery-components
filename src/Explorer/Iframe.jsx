const baseUrls = {
  mainnet: "https://explorer.near.org",
  testnet: "https://explorer.testnet.near.org",
};
const baseUrl =
  props.baseUrl || baseUrls[props.network || "testnet"] || baseUrls.testnet;
const query = { ...props.query, iframe: true };
const queryString = `?${Object.entries(query)
  .filter(([_key, value]) => value !== undefined && value !== null)
  .map(([key, value]) => `${key}=${value}`)
  .join("&")}`;
return (
  <iframe
    className="w-100"
    style={style}
    iframeResizer
    src={`${baseUrl}/${props.url || ""}${queryString}`}
  />
);
