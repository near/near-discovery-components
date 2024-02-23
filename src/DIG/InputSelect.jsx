let { contentProps, groups, rootProps, ...forwardedProps } = props;

groups = groups ?? [];

State.init({
  value: "",
});

const value = rootProps?.value || state.value;
let inputDisplayValue = "";

if (value) {
  let allItems = [];
  groups.forEach((group) => {
    allItems = allItems.concat(group.items);
  });
  const selectedItem = allItems.find((item) => {
    return item.value === value;
  });
  if (selectedItem) {
    inputDisplayValue = selectedItem.label;
  }
}

const Content = styled("Select.Content")`
  background-color: var(--white);
  border-radius: 6px;
  box-shadow:
    0 4px 8px hsla(0, 0%, 0%, 0.06),
    0 0 0 1px var(--sand4);
  min-width: 200px;
  max-width: var(--radix-select-trigger-width);
  max-height: var(--radix-select-content-available-height);
  scroll-behavior: smooth;
  overflow: auto;
  z-index: 1000;
`;

const Viewport = styled("Select.Viewport")``;

const Group = styled("Select.Group")`
  border-bottom: 1px solid var(--sand4);
  padding: 4px;

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled("Select.Label")`
  font: var(--text-xs);
  font-weight: 600;
  color: var(--sand12);
  padding: 10px 12px;
`;

const Item = styled("Select.Item")`
  font: var(--text-xs);
  color: var(--sand12);
  padding: 10px 12px;
  cursor: pointer;
  outline: none;
  box-shadow: none;
  border: none;
  border-radius: 4px;
  transition: all 200ms;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  &[data-disabled] {
    color: var(--sand10);
    cursor: default;
  }

  &[data-highlighted] {
    background: var(--sand3);

    i {
      color: var(--violet10);
    }
  }

  &[data-state="checked"] {
    background: var(--sand4);

    i {
      color: var(--violet10);
    }
  }
`;

const ItemText = styled("Select.ItemText")``;
const ItemIndicator = styled("Select.ItemIndicator")``;

const Arrow = styled("Select.Arrow")`
  fill: var(--white);
  position: relative;
  top: -1.5px;
`;
const ArrowBorder = styled("Select.Arrow")`
  fill: var(--sand4);
`;

function onValueChange(value) {
  State.update({ value: value });

  if (rootProps.onValueChange) {
    rootProps.onValueChange(value);
  }
}

return (
  <Select.Root value={value} {...rootProps} onValueChange={onValueChange}>
    <Select.Trigger asChild>
      <Widget
        src="${REPL_ACCOUNT}/widget/DIG.Input"
        props={{
          iconRight: "ph-bold ph-caret-up-down",
          type: "button",
          select: true,
          value: inputDisplayValue,
          ...forwardedProps,
        }}
      />
    </Select.Trigger>

    <Content position="popper" align="center" sideOffset={5} {...contentProps}>
      <Viewport>
        {groups.map((group, i) => {
          return (
            <Group key={i}>
              {group.label && <Label>{group.label}</Label>}

              {group.items.map((item) => {
                return (
                  <Item value={item.value} disabled={item.disabled} key={item.value}>
                    <ItemText>{item.label}</ItemText>
                    <ItemIndicator>
                      <i className="ph-bold ph-check" />
                    </ItemIndicator>
                  </Item>
                );
              })}
            </Group>
          );
        })}
      </Viewport>

      <ArrowBorder width={12} height={6} />
      <Arrow width={12} height={6} />
    </Content>
  </Select.Root>
);
