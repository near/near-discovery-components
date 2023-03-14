//options: default, terms, privacy, community
State.init({ show: "default", terms: null, privacy: null, community: null });

const termsCid = "QmZ2vbq3crEb4AzaVZED85mHreccBR8r3XRy9Zjvb3gjBA";
const privacyCid = "QmZ4R87C4RS85nvXYVAC1YXWdWCszRe3WCCi3FoGvbBPkZ";
// const communityCid = "QmX8f9iiPJG6YtQQA2zZcwi7UF3PigwudnEzwfoLgArCyQ";

// using web3.storage gateway since near.social is failing to resolve
// NOTE: this gateway has a 200req/hr/ip rate limit
// https://web3.storage/docs/concepts/w3link/#rate-limits
// asyncFetch(`https://${termsCid}.ipfs.w3s.link/terms.md`).then((res) => {
//   State.update({ terms: res.body });
// });

// now using infura
asyncFetch(`https://alphanear.infura-ipfs.io/ipfs/${termsCid}`).then((res) => {
  State.update({ terms: res.body });
});
asyncFetch(`https://alphanear.infura-ipfs.io/ipfs/${privacyCid}`).then(
  (res) => {
    State.update({ privacy: res.body });
  }
);
// asyncFetch(`https://alphanear.infura-ipfs.io/ipfs/${communityCid}`).then(
//   (res) => {
//     State.update({ community: res.body });
//   }
// );

const Wrapper = styled.div`
`;

const DocBox = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  border: solid 1px lightgrey;
  border-radius: 0.75rem;
  padding: 1rem;
  cursor: pointer;
  &:hover {
    color: #26A65A;
    border-color: #26A65A;
  }
`;

const DocTitle = styled.div`
display: flex;
flex-direction: row;
column-gap: 0.5rem;
font-weight: bold;
align-items: center;
`;

const DocSummary = styled.span`
color: grey
`;

const Arrow = styled.i`
  color: #26A65A;
  font-size: 1.25rem;
`;

// const DocFullDisplay = styled.div`
//   display: flex;
//   flex
// `;

const DocContent = styled.div`
  overflow-y: scroll;
`;

return (
  <Wrapper className="d-flex flex-column gap-3 justify-content-center">
    {state.show === "default" && (
      <>
        <h3>Terms of Service and Privacy Policy</h3>
        <p>
          Please read and agree to the following terms and policies to continue
          using alpha.near.org:
        </p>
        <DocBox
          onClick={() => {
            State.update({ show: "terms" });
          }}
        >
          <DocTitle>
            Terms of Service
            <Arrow className="bi bi-arrow-right" />
          </DocTitle>
          <DocSummary>
            Details on acceptable ways to engage with our software during Alpha
            Testing
          </DocSummary>
        </DocBox>
        <DocBox
          onClick={() => {
            State.update({ show: "privacy" });
          }}
        >
          <DocTitle>
            Privacy Policy
            <Arrow className="bi bi-arrow-right" />
          </DocTitle>
          <DocSummary>
            Details on our privacy policy during Alpha Testing
          </DocSummary>
        </DocBox>
        {/*
        <DocBox
          onClick={() => {
            State.update({ show: "community" });
          }}
        >
          <DocTitle>
            Community Guidelines
            <Arrow className="bi bi-arrow-right" />
          </DocTitle>
          <DocSummary>Summary</DocSummary>
        </DocBox>
        */}
      </>
    )}
    {state.show === "terms" && (
      <>
        <button
          onClick={() => {
            State.update({ show: "default" });
            props.expand(false);
          }}
          className="btn btn-outline-success"
          style={{ width: "6rem" }}
        >
          <i className="bi bi-arrow-left" />
          Back
        </button>
        <DocContent>
          {state.terms ? <Markdown text={state.terms} /> : <p>Loading...</p>}
        </DocContent>
      </>
    )}
    {state.show === "privacy" && (
      <>
        <button
          onClick={() => {
            State.update({ show: "default" });
          }}
          className="btn btn-outline-success"
          style={{ width: "6rem" }}
        >
          <i className="bi bi-arrow-left" />
          Back
        </button>
        <DocContent>
          {state.privacy ? (
            <Markdown text={state.privacy} />
          ) : (
            <p>Loading...</p>
          )}
        </DocContent>
      </>
    )}
    {/*
    {state.show === "community" && (
      <>
        <button
          onClick={() => {
            State.update({ show: "default" });
          }}
          className="btn btn-outline-success"
          style={{ width: "6rem" }}
        >
          <i className="bi bi-arrow-left" />
          Back
        </button>
        <DocContent>
          {state.community ? (
            <Markdown text={state.community} />
          ) : (
            <p>Loading...</p>
          )}
        </DocContent>
      </>
    )}
    */}
  </Wrapper>
);
