let { tosDomainName, termsCid, privacyCid, expand } = props;

const [terms, setTerms] = useState(null);
const [privacy, setPrivacy] = useState(null);
const [viewMode, setViewMode] = useState("default"); // one of: "default", "terms", "privacy", "community"

const fetchTerms = useCallback(() => {
  try {
    asyncFetch(`${tosDomainName}/ipfs/${termsCid}`).then((res) => {
      setTerms(res.body);
    });
  } catch (error) {
    console.error(`Error on fetching terms from ${tosDomainName}: `, error);
  }
}, [tosDomainName, termsCid]);

const fetchPrivacy = useCallback(() => {
  try {
    asyncFetch(`${tosDomainName}/ipfs/${privacyCid}`).then((res) => {
      setPrivacy(res.body);
    });
  } catch (error) {
    console.error(`Error on fetching privacy from ${tosDomainName}: `, error);
  }
}, [tosDomainName, privacyCid]);

useEffect(() => {
  fetchTerms();
  fetchPrivacy();
}, [tosDomainName, termsCid, privacyCid]);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.gap};
  justify-content: center;
`;

const Title = styled.h3`
  font: var(--text-l);
  font-weight: 700;
  color: var(--sand12);
  margin-bottom: 0;
`;

const Description = styled.p`
  font: var(--text-base);
  color: var(--sand11);
  margin-bottom: 0;

  span {
    font-weight: 600;
  }
`;

const DocBox = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  border: 1px solid var(--sand6);
  border-radius: 0.75rem;
  padding: 1rem;
  cursor: pointer;
  transition: all .2s ease-in-out;

  &:hover {
    color: var(--violet8);
    border-color: var(--violet9);
  }
`;

const DocTitle = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 0.5rem;
  align-items: center;
  font: var(--text-base);
  color: var(--sand12);
  font-weight: 700;

  &:hover {
    color: inherit;
  }
`;

const DocSummary = styled.span`
  color: var(--sand10);
`;

const Arrow = styled.i`
  color: var(--green11);
  font-size: 1.25rem;
  transition: all .2s ease-in-out;

  ${DocBox}:hover & {
    color: var(--violet8);
  }
`;

const DocContent = styled.div`
  overflow-y: scroll;
`;

const BackWrapper = styled.div`
  display: inline-block;
  position: sticky;
  top: 0;
  padding-bottom: 1.5rem;
  background-color: var(--white);
`;

const DocumentSelector = ({ name, title, description }) => (
  <DocBox
    onClick={() => {
      setViewMode(name);
    }}
  >
    <DocTitle>
      {title}
      <Arrow className="ph ph-arrow-right" />
    </DocTitle>
    <DocSummary>
      {description}
    </DocSummary>
  </DocBox>
);

const ViewDocument = () => {
  if (viewMode === "default") return <></>
  return (
    <>
      <BackWrapper>
        <Widget
          src="${REPL_ACCOUNT}/widget/DIG.Chip"
          props={{
            label: 'Back',
            iconLeft: "ph ph-arrow-left",
            onClick: () => setViewMode("default"),
          }}
        />
      </BackWrapper>
      {viewMode === "terms" && (
        <DocContent>
          {terms ? <Markdown text={terms} /> : <p>Loading...</p>}
        </DocContent>
      )}
      {viewMode === "privacy" && (
        <DocContent>
          {privacy ? <Markdown text={privacy} /> : <p>Loading...</p>}
        </DocContent>
      )}
    </>
  )
};

return (
  <Wrapper gap={viewMode === "default" ? "1rem" : 0}>
    {viewMode === "default" && (
      <>
        <Title>Terms of Service and Privacy Policy</Title>
        <Description>
          Please read and agree to the following terms and policies to continue
          using <span>{`${REPL_NEAR_URL}`}</span>:
        </Description>

        <DocumentSelector
          name="terms"
          title="Terms of Service"
          description="Details on acceptable ways to engage with our software"
        />

        <DocumentSelector
          name="privacy"
          title="Privacy Policy"
          description="Details on our privacy policy"
        />
      </>
    )}
    <ViewDocument />
  </Wrapper>
);
