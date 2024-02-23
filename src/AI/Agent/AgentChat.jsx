const { href } = VM.require("devhub.near/widget/core.lib.url");
const storedModel = Storage.get("agent-model");
const storedLocalModel = Storage.get("agent-local-model");
const storedCredentialType = Storage.get("agent-credential-type");
const storedCredential = Storage.get("agent-credential");
if (
  !href ||
  storedCredential === null ||
  storedModel === null ||
  storedLocalModel === null ||
  storedCredentialType === null
) {
  return "Loading config...";
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

const [settingsOpen, setSettingsOpen] = useState(false);
const [question, setQuestion] = useState("");
const [loading, setLoading] = useState(false);
const [messages, setMessages] = useState([]);

const [model, setModel] = useState(storedModel ?? "gpt-3.5-turbo");
const [localModel, setLocalModel] = useState(storedLocalModel ?? "http://localhost:11434/api/generate");
const [credentialType, setCredentailType] = useState(storedCredentialType ?? "openai");
const [credential, setCredential] = useState(storedCredential ?? "");

useEffect(() => {
  Storage.set("agent-model", model);
}, [model]);
useEffect(() => {
  Storage.set("agent-local-model", localModel);
}, [localModel]);
useEffect(() => {
  Storage.set("agent-credential-type", credentialType);
}, [credentialType]);
useEffect(() => {
  Storage.set("agent-credential", credential);
}, [credential]);

const toggleSettings = () => {
  setSettingsOpen(!settingsOpen);
};

const routeApi = async (question) => {
  switch (model) {
    case "local":
      return localAI(question);
    default:
      return openAI(question);
  }
};
const localAI = async (question) => {
  return asyncFetch(localModel, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    responseType: "json",
    body: JSON.stringify([{ role: "system", content: data.prompt }, question]),
  });
};
const openAI = async (question) => {
  return asyncFetch(`https://api.openai.com/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${credential}`,
    },
    responseType: "json",
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: data.prompt },
        {
          role: "user",
          content: question.content,
        },
      ],
      // max_tokens: 2048,
      // temperature: 0.7,
      // top_p: 1,
      // n: 1,
      // stop: ["\n"],
    }),
  }).then((response) => {
    const answer = response.body.choices[0].message.content;
    return answer;
  });
};

useEffect(() => {
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return;
  }
  setLoading(true);
  routeApi(...messages.slice(-1))
    .then((answer) => {
      setMessages([...messages, { role: "system", content: answer }]);
    })
    .finally(() => {
      setLoading(false);
    });
}, [messages]);

const submitQuestion = () => {
  setMessages([...messages, { role: "user", content: question }]);
  setQuestion("");
};
const requiresCredentials = (model) => {
  return model === "gpt-4" || model === "gpt-3.5-turbo";
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
  margin-bottom: 1em;
`;

const Header = styled.h1`
  font-size: 24px;
  line-height: 39px;
  color: #11181c;
  margin-bottom: 20px;
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
const Prompt = styled.p`
  font-family: monospace;
  font-size: 14px;
  overflow-y: auto;
  height: 100px;
`;
const Label = styled.span`
  font-weight: 600;
`;
const Settings = styled.div`
  margin-bottom: 1em;
  z-index: 1000;
`;
const Controls = styled.div`
  margin-bottom: 1em;
`;
const CardControl = styled.div`
  cursor: pointer;
  color: var(--violet8);
  margin-bottom: 1em;
`;
const AllSettings = styled.div``;
const InputWrapper = styled.div`
  padding-bottom: 1em;
`;
const Question = styled.input`
  border-top-left-radius: 2rem;
  border-bottom-left-radius: 2rem;
`;
const UserMessage = styled.div``;
const AgentMessage = styled.div`
  background-color: #f9f9f9;
`;

const renderSettings = () => {
  return (
    <Settings>
      <CardControl bold onClick={toggleSettings}>
        <i className={settingsOpen ? "ph ph-caret-up" : "ph ph-caret-down"} /> Settings
      </CardControl>
      {settingsOpen && (
        <AllSettings>
          <InputWrapper>
            <Widget
              src="near/widget/DIG.InputSelect"
              props={{
                groups: [
                  {
                    label: "OpenAI",
                    items: [
                      {
                        label: "GPT-4",
                        value: "gpt-4",
                      },
                      {
                        label: "GPT-3",
                        value: "gpt-3.5-turbo",
                      },
                    ],
                  },
                  {
                    label: "Local",
                    items: [
                      {
                        label: "Local",
                        value: "local",
                      },
                    ],
                  },
                ],
                label: "Choose Model",
                placeholder: "OpenAI GPT-3",
                rootProps: {
                  value: model,
                  onValueChange: setModel,
                },
              }}
            />
          </InputWrapper>
          {model === "local" && (
            <InputWrapper>
              <Widget
                src="near/widget/DIG.Input"
                props={{
                  label: "Local Model URL",
                  assistiveText: "Any url that accepts messages in OpenAI format",
                  iconLeft: "ph-bold ph-horse",
                  onInput: (e) => setLocalModel(e.target.value),
                  value: localModel,
                }}
              />
            </InputWrapper>
          )}
          <InputWrapper>
            <div className="row">
              <div className="col-3">
                <Widget
                  src="near/widget/DIG.InputSelect"
                  props={{
                    groups: [
                      {
                        label: "Bearer Token",
                        items: [
                          {
                            label: "OpenAI API Key",
                            value: "openai",
                          },
                        ],
                      },
                    ],
                    label: "Credential Type",
                    rootProps: {
                      value: credentialType,
                      onValueChange: setCredentailType,
                    },
                  }}
                />
              </div>
              <div className="col">
                <Widget
                  src="near/widget/DIG.Input"
                  props={{
                    label: "Credentials",
                    assistiveText: "Your OpenAI API Key or other credentials. Will be stored in your browser.",
                    iconLeft: "ph-bold ph-identification-card",
                    onInput: (e) => setCredential(e.target.value),
                    value: credential,
                    type: "password",
                  }}
                />
              </div>
            </div>
          </InputWrapper>
        </AllSettings>
      )}
    </Settings>
  );
};

return (
  <Wrapper>
    <div>
      {!embedded && (
        <div>
          <Link to={listLink}>
            <Header>
              <i className="ph ph-arrow-left" />
              Agent List
            </Header>
          </Link>
          <Overview>
            <div className="row">
              <div className="col-5">
                <Widget
                  src="${REPL_ACCOUNT}/widget/AI.Agent.AgentSummary"
                  props={{
                    size: "small",
                    showTags: true,
                    agent: agent,
                  }}
                />
              </div>
              <div className="col-7">
                <Prompt>
                  <Label>Prompt:</Label> {data.prompt}
                </Prompt>
              </div>
            </div>
          </Overview>
        </div>
      )}
      <Controls>
        {renderSettings()}
        {requiresCredentials(model) && credential === "" && (
          <div className="alert alert-danger mx-3" role="alert">
            <i className="ph ph-alert-circle" /> To use an OpenAI model enter your OpenAI API Key in Settings or change
            to another provider.
          </div>
        )}
        <div className="input-group">
          <Question
            type="text"
            className="form-control"
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
          <Widget
            src="near/widget/DIG.Button"
            props={{
              onClick: submitQuestion,
              iconLeft: editIcon,
              variant: "affirmative",
              fill: "solid",
              size: "large",
              label: "Submit",
              disabled: (requiresCredentials(model) && credential === "") || question === "",
              style: {
                borderTopLeftRadius: "0rem",
                borderBottomLeftRadius: "0rem",
              },
            }}
          />
        </div>
      </Controls>
      <div className="d-flex flex-column-reverse">
        {messages.map(({ role, content }, i) => {
          return (
            <div key={i} className={`message ${role}`}>
              {role === "user" && (
                <UserMessage>
                  <Widget src="mob.near/widget/N.ProfileLine" props={{ accountId: context.accountId }} />
                  <Markdown text={content} />
                </UserMessage>
              )}
              {role !== "user" && (
                <AgentMessage>
                  <Markdown text={content} />
                </AgentMessage>
              )}
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
