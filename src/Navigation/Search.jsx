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
  <Popover.Root open={showTypeAheadDropdown}>
    <Popover.Trigger asChild>
      <div>
        <Widget
          src="${REPL_ACCOUNT}/widget/DIG.InputSearch"
          props={{
            onQueryChange: handleOnInput,
            placeholder: "Search NEAR",
          }}
        />
      </div>
    </Popover.Trigger>
    <Popover.Content asChild onInteractOutside={handleInteractOutside} onOpenAutoFocus={() => {}}>
      <div>
        <Widget
          src="${REPL_ACCOUNT}/widget/Search.TypeAheadDropdown"
          props={{
            term: value,
            focusChange: setIsFocused,
          }}
        />
      </div>
    </Popover.Content>
  </Popover.Root>
);
