function search(query) {
  if (!query) {
    State.update({
      isLoading: false,
      results: [],
    });
    return;
  }

  const body = {
    query,
    page: state.currentPage,
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
        isLoading: false,
        results: [...state.results, ...res.body.hits],
        totalPages: res.body.nbPages,
      });
    })
    .catch((error) => {
      State.update({
        isLoading: false,
      });
      console.log(error);
    });
}

function handleOnInput() {
  State.update({
    currentPage: 0,
    totalPages: 0,
    isLoading: true,
    results: [],
  });
}

function handleOnQueryChange(query) {
  State.update({
    query,
  });
  search(query);
}

function loadMore() {
  State.update({
    currentPage: state.currentPage + 1,
    isLoading: true,
  });

  search(state.query);
}

State.init({
  currentPage: 0,
  totalPages: 0,
  isLoading: false,
  query: "",
  results: [],
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
        onInput: handleOnInput,
        onQueryChange: handleOnQueryChange,
        placeholder: "Search...",
      }}
    />

    {state.query && state.results.length === 0 && !state.isLoading && (
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

    {state.currentPage + 1 < state.totalPages && (
      <Widget
        src="${REPL_ACCOUNT}/widget/DIG.Button"
        props={{
          label: "Load More",
          fill: "outline",
          variant: "secondary",
          loading: state.isLoading,
          onClick: loadMore,
        }}
      />
    )}
  </Wrapper>
);
