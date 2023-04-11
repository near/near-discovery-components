const profiles =
  Social.get(["*/profile/name", "*/profile/tags/*"], "final") || {};

const computeResults = (term) => {
  const terms = (term || "")
    .toLowerCase()
    .split(/[^\w._-]/)
    .filter((s) => !!s.trim());
  const matchedAccountIds = [];

  const limit = props.limit ?? 30;

  const MaxSingleScore = 20;
  const MaxScore = MaxSingleScore * 3;

  const computeScore = (s) => {
    s = s.toLowerCase();
    return (
      terms
        .map((term) => {
          const pos = s.indexOf(term);
          return pos >= 0 ? Math.max(1, 20 - pos) : 0;
        })
        .reduce((s, v) => s + v, 0) / terms.length
    );
  };

  Object.entries(profiles).forEach(([accountId, data]) => {
    const accountIdScore = computeScore(accountId);
    const name = data.profile.name || "";
    const tags = Object.keys(data.profile.tags || {}).slice(0, 10);
    const nameScore = computeScore(name);
    const tagsScore = Math.min(
      20,
      tags.map(computeScore).reduce((s, v) => s + v, 0)
    );
    const score = (accountIdScore + nameScore + tagsScore) / MaxScore;
    if (score > 0) {
      matchedAccountIds.push({ score, accountId, name, tags });
    }
  });

  matchedAccountIds.sort((a, b) => b.score - a.score);
  const result = matchedAccountIds.slice(0, limit);

  State.update({
    term,
    result,
  });

  if (props.onChange) {
    props.onChange({ term, result });
  }
};

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
      border: 1px solid #D0D5DD !important;
      background: #FFFFFF;
      border-radius: 100px;
  }

  button {
      border-color: #D0D5DD !important;
      border-radius: 0 100px 100px 0 !important;
      border-left: none !important;
      background: #fff !important;
      color: #687076 !important;

      &:hover, &:focus {
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
        onChange={(e) => computeResults(e.target.value)}
        placeholder={props.placeholder || "Search people"}
      />
      {state.term && (
        <button
          className="btn btn-outline-secondary border border-start-0"
          type="button"
          onClick={() => computeResults("")}
        >
          <i className="bi bi-x"></i>
        </button>
      )}
    </div>
    {props.debug && <pre>{JSON.stringify(state.result, undefined, 2)}</pre>}
  </Wrapper>
);
