let { placeholder } = props;
const [value, setValue] = useState("");
const [isFocused, setIsFocused] = useState(false);
const [isCursorOutside, setIsCursorOutside] = useState(false);

const showTypeAheadDropdown = isFocused && !!value;

const handleOnInput = (value) => {
  setValue(value);
  setIsFocused(!!value);
};

const handleInteractOutside = (value) => {
  setIsCursorOutside(!value);
};

const handleFocusChange = () => {
  setIsFocused(!isFocused);
};

const handleOnBlur = () => {
  setIsFocused(!isCursorOutside);
};

return (
  <HoverCard.Root openDelay={200} closeDelay={300} open={showTypeAheadDropdown} onOpenChange={handleInteractOutside}>
    <HoverCard.Trigger asChild>
      <div>
        <Widget
          src="${REPL_ACCOUNT}/widget/DIG.InputSearch"
          props={{
            onQueryChange: handleOnInput,
            placeholder: placeholder ?? "Search NEAR",
            onBlur: handleOnBlur,
            onFocus: handleFocusChange,
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
