const [value, setValue] = useState("");
const [isFocused, setIsFocused] = useState(false);

const showTypeAheadDropdown = isFocused && !!value;

const handleOnInput = (value) => {
  setValue(value);
  setIsFocused(!!value);
};

const handleInteractOutside = (e) => {
  setIsFocused(false);
};

return (
  <HoverCard.Root openDelay={200} closeDelay={300} open={showTypeAheadDropdown}>
    <HoverCard.Trigger asChild>
      <div>
        <Widget
          src="${REPL_ACCOUNT}/widget/DIG.InputSearch"
          props={{
            onQueryChange: handleOnInput,
            placeholder: "Search NEAR",
            onBlur: () => setIsFocused(false),
            onFocus: () => setIsFocused(true),
          }}
        />
      </div>
    </HoverCard.Trigger>
    <HoverCard.Content asChild side="bottom" sideOffset={10} hideWhenDetached={true}>
      <div>
        <Widget
          src="${REPL_ACCOUNT}/widget/Search.TypeAheadDropdown"
          props={{
            term: value,
            focusChange: setIsFocused,
          }}
        />
      </div>
    </HoverCard.Content>
  </HoverCard.Root>
);
