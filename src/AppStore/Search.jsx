function debounce(func, wait) {
  const pause = wait || 350;
  let timeout;

  return (args) => {
    const later = () => {
      clearTimeout(timeout);
      func(args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, pause);
  };
}

function search(query) {
  State.update({
    query,
  });

  if (!query) {
    State.update({
      results: [],
    });
    return;
  }

  const body = {
    query,
    page: 0,
    filters: "categories:widget AND tags:app AND NOT _tags:hidden",
  };

  asyncFetch("/api/search", {
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  })
    .then((res) => {
      State.update({
        results: res.body.hits ?? [],
      });
    })
    .catch((error) => console.log(error));
}

function handleQueryChange(query) {
  state.searchDebounced(query);
}

State.init({
  query: "",
  results: [],
  searchDebounced: debounce(search, 200),
});

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 3rem;
`;

const H2 = styled.h2`
  font: var(--text-l);
  color: var(--sand12);
  margin: 0;
  font-weight: 600;
`;

const Text = styled.p`
  font: var(--${(p) => p.size ?? "text-base"});
  font-weight: ${(p) => p.fontWeight};
  color: var(--${(p) => p.color ?? "sand12"});
  margin: 0;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

return (
  <Wrapper>
    <Widget
      src="${REPL_ACCOUNT}/widget/DIG.InputSearch"
      props={{
        onQueryChange: handleQueryChange,
        placeholder: "Search...",
      }}
    />

    {state.query && state.results.length === 0 && (
      <Text>No apps matched your search: "{state.query}"</Text>
    )}

    {state.results.length > 0 && (
      <>
        <H2>All apps</H2>

        <ContentGrid>
          {state.results.map((result) => {
            return (
              <Widget
                key={`${result.author}/widget/${result.widget_name}`}
                src="${REPL_ACCOUNT}/widget/ComponentCard"
                props={{
                  src: `${result.author}/widget/${result.widget_name}`,
                  tags: result.tags,
                  metadata: {
                    image: result.image,
                    name: result.name,
                  },
                  blockHeight: result.receipt_block_height,
                }}
              />
            );
          })}
        </ContentGrid>
      </>
    )}
  </Wrapper>
);
