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
  gap: ${(p) => !p.compact && "18px"};
  padding-bottom: ${(p) => !p.compact && "48px"};
  padding-top: ${(p) => !p.compact && "48px"};
`;

return (
  <Wrapper className="container-xl" compact={compact}>
    <Markdown text={terms} />
  </Wrapper>
);
