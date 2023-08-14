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
  display: block;

  input:placeholder-shown + & {
    display: none;
  }
`;

return (
  <Widget
    src="${REPL_ACCOUNT}/widget/DIG.Input"
    props={{
      iconLeft: "ph-bold ph-search",
      inputNodeRight: (
        <ResetButton type="button" tabindex={-1} onClick={reset}>
          <span className="ph-bold ph-x" />
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
