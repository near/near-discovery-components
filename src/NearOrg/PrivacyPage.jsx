let { privacyDomainName, compact } = props;

compact = compact ?? false;

const [privacy, setPrivacy] = useState(null);

const fetchPrivacy = useCallback(() => {
  try {
    asyncFetch(privacyDomainName).then((res) => {
      setPrivacy(res.body);
    });
  } catch (error) {
    console.error(`Error on fetching privacy from ${privacyDomainName}: `, error);
  }
}, [privacyDomainName]);

useEffect(() => {
  fetchPrivacy();
}, [privacyDomainName]);

if (!privacy) {
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
    <Markdown text={privacy} />
  </Wrapper>
);
