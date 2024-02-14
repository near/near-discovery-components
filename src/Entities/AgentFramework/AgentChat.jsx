const [accountId, agentType, agentName] = props.src.split("/") ?? [null, null, null];
const blockHeight = props.blockHeight ?? "final";

const data = Social.getr(`${accountId}/agent/${agentName}`, blockHeight);

if (!data) return "Loading...";

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
`;

return (
  <Wrapper>
    <div>
      <div>Name: {data.displayName}</div>
      <div>
        Prompt: <pre>{data.prompt}</pre>
      </div>

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
