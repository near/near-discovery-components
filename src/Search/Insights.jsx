const USER_TOKEN = props.userToken ?? "anonymous";
const SEARCH_API_KEY = props.searchApiKey;
const APPLICATION_ID = props.appId;
const INDEX = props.index;
const onChange =
  props.onChange ??
  ((resp) => {
    if (props.debug) {
      console.log("resp", resp);
    }
  });

const code = `
<script>
var ALGOLIA_INSIGHTS_SRC = "https://cdn.jsdelivr.net/npm/search-insights@2.4.0/dist/search-insights.min.js";
!function(e,a,t,n,s,v,i,c){e.AlgoliaAnalyticsObject=s,e[s]=e[s]||function(){
(e[s].queue=e[s].queue||[]).push(arguments)},e[s].version=(n.match("/@([^\/]+)\/?/") || [])[1],i=a.createElement(t),c=a.getElementsByTagName(t)[0],
i.async=1,i.src=n,c.parentNode.insertBefore(i,c)
}(window,document,"script",ALGOLIA_INSIGHTS_SRC,"aa");
aa('init', {
  appId: '${APPLICATION_ID}',
  apiKey: '${SEARCH_API_KEY}',
});

window.top.postMessage("loaded", "*");
window.addEventListener("message", (message) => {
  if (!message.data.event) {
    return;
  }

  const { type, data } = message.data.event;
  data["index"] = "${INDEX}";
  const result = aa(type, data);
  message.source.postMessage({
    result,
    eventType: type,
    eventData: data,
  }, "*");
}, false);
</script>
`;

return (
  <iframe
    srcDoc={code}
    style={{ position: absolute, width: 0, height: 0, border: 0 }}
    message={{ event: props.event }}
    onMessage={(resp) => onChange(resp)}
  />
);
