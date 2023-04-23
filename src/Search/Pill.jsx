const updateSearch = (term) => {
  State.update({
    term,
  });

  if (props.onChange) {
    props.onChange({ term });
  }
};

if (props.term && props.term !== state.lastSyncedTerm) {
  State.update({
    lastSyncedTerm: props.term,
  });
  updateSearch(props.term);
}

const Wrapper = styled.div`
  width: 100%;
  height: 40px;
  position: relative;

  .bi-search {
    position: absolute;
    top: 0;
    left: 18px;
    z-index: 100;
    font-size: 14px;
    line-height: 40px;
    color: #687076;
  }

  .input-group {
    height: 100%;
  }

  input {
    padding: 0 14px 0 42px;
    border: 1px solid #d0d5dd !important;
    background: #ffffff;
    border-radius: 100px;
  }

  button {
    border-color: #d0d5dd !important;
    border-radius: 0 100px 100px 0 !important;
    border-left: none !important;
    background: #fff !important;
    color: #687076 !important;

    &:hover,
    &:focus {
      color: #000 !important;
    }
  }

  @media (max-width: 500px) {
    width: 100%;
  }
`;

return (
  <Wrapper>
    <i className="bi bi-search"></i>
    <div className="input-group">
      <input
        type="text"
        className={`form-control ${state.term ? "border-end-0" : ""}`}
        value={state.term ?? ""}
        onChange={(e) => updateSearch(e.target.value)}
        placeholder={props.placeholder ?? `Search`}
      />

      {state.term && (
        <button
          className="btn btn-outline-secondary border border-start-0"
          type="button"
          onClick={() => updateSearch("")}
        >
          <i className="bi bi-x"></i>
        </button>
      )}
    </div>

    {props.debug && <pre>{JSON.stringify(state.result, undefined, 2)}</pre>}
  </Wrapper>
);
