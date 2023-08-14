let { onQueryChange, placeholder, ...forwardedProps } = props;

State.init({
  value: "",
});

function handleOnInput(e) {
  const value = e.target.value;

  State.update({ value });

  if (onQueryChange) {
    onQueryChange(value);
  }
}

function reset() {
  State.update({ value: "" });
  onQueryChange("");
}

const ResetButton = styled.button`
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 100%;
  background: var(--sand5);
  text-align: center;
  transition: all 200ms;
  margin-right: -0.25rem;

  i {
    font-size: 12px !important;
    color: var(--sand12) !important;
  }

  &:hover {
    background: var(--sand6);
  }

  input:placeholder-shown + & {
    display: none;
  }
`;

return (
  <Widget
    src="${REPL_ACCOUNT}/widget/DIG.Input"
    props={{
      iconLeft: "ph-bold ph-magnifying-glass",
      inputNodeRight: (
        <ResetButton
          type="button"
          tabIndex={-1}
          onClick={reset}
          aria-label="Reset Input"
        >
          <i className="ph-bold ph-x" />
        </ResetButton>
      ),
      onInput: handleOnInput,
      placeholder: placeholder ?? "Search...",
      search: true,
      type: "text",
      value: state.value,
      ...forwardedProps,
    }}
  />
);
