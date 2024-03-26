let { termsDomainName, compact } = props;

compact = compact ?? false;

const [terms, setTerms] = useState(null);

const fetchTerms = useCallback(() => {
  try {
    asyncFetch(termsDomainName).then((res) => {
      setTerms(res.body);
    });
  } catch (error) {
    console.error(`Error on fetching terms from ${termsDomainName}: `, error);
  }
}, [termsDomainName]);

useEffect(() => {
  fetchTerms();
}, [termsDomainName]);

if (!terms) {
  return <div>Loading...</div>;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => (p.$compact ? 0 : "18px")};
  padding-bottom: ${(p) => (p.$compact ? 0 : undefined)};
  padding-top: ${(p) => (p.$compact ? 0 : undefined)};
`;

return (
  <Wrapper className="gateway-page-container" $compact={compact}>
    <Markdown text={terms} />
  </Wrapper>
);
