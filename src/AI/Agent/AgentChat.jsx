const { href } = VM.require("devhub.near/widget/core.lib.url");
if (!href) {
  return <></>;
}
const { src, embedded } = props;

const [accountId, agentType, agentName] = src.split("/") ?? [null, null, null];
const blockHeight = blockHeight ?? "final";

const data = Social.getr(`${accountId}/agent/${agentName}`, blockHeight);
const agent = { accountId, name: agentName, ...data };

if (!data) return "Loading...";

const listLink = href({
  widgetSrc: `${REPL_ACCOUNT}/widget/AI.Nexus`,
});

const [question, setQuestion] = useState("");
const [prompt, setPrompt] = useState("");
const [loading, setLoading] = useState(false);
const [response, setResponse] = useState("");
const [messages, setMessages] = useState([]);

useEffect(() => {
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return;
  }
  console.log(messages);
  setLoading(true);
  asyncFetch(`https://ai.near.social/api`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    responseType: "json",
    body: JSON.stringify([{ role: "system", content: data.prompt }, ...messages.slice(-1)]),
  })
    .then(({ body }) => {
      setMessages([...messages, { role: "system", content: body.response }]);
    })
    .finally(() => {
      setLoading(false);
    });
}, [messages]);

const submitQuestion = () => {
  setMessages([...messages, { role: "user", content: question }]);
  setQuestion("");
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding: 48px;
`;

const Overview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Header = styled.h1`
  font-size: 24px;
  line-height: 39px;
  color: #11181c;
  margin: 0;
  font-weight: 600;
`;
const Text = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: ${(p) => (p.bold ? "#11181C" : "#687076")};
  font-weight: ${(p) => (p.bold ? "600" : "400")};
  font-size: ${(p) => (p.small ? "12px" : "14px")};

  i {
    margin-right: 4px;
  }
`;

return (
  <Wrapper>
    <div>
      {!embedded && (
        <Overview>
          <Link to={listLink}>
            <Header>
              <i className="ph ph-arrow-left" />
              Agent List
            </Header>
          </Link>
          <Widget
            src="${REPL_ACCOUNT}/widget/AI.Agent.AgentSummary"
            props={{
              size: "small",
              showTags: true,
              agent: agent,
            }}
          />
          <Text>
            Prompt: <pre>{data.prompt}</pre>
          </Text>
        </Overview>
      )}
      <div className="mb-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            style={{
              borderTopLeftRadius: "2rem",
              borderBottomLeftRadius: "2rem",
            }}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                submitQuestion();
              }
            }}
            placeholder="What's your question?"
            autoFocus
          />
          <button
            className="btn btn-primary"
            style={{
              borderTopRightRadius: "2rem",
              borderBottomRightRadius: "2rem",
            }}
            onClick={() => submitQuestion()}
          >
            Submit
          </button>
        </div>
      </div>
      <div className="d-flex flex-column-reverse">
        {messages.map(({ role, content }, i) => {
          return (
            <div key={i} className={`message ${role}`}>
              {role === "user" && (
                <Widget src="mob.near/widget/N.ProfileLine" props={{ accountId: context.accountId }} />
              )}
              <Markdown text={content} />
            </div>
          );
        })}
        {loading && (
          <div key="loading" className={`message system`}>
            <div>
              <span className="spinner-grow spinner-grow-sm me-1" role="status" aria-hidden="true" />
            </div>
          </div>
        )}
      </div>
    </div>
  </Wrapper>
);
