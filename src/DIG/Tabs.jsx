let { items, variant, size, ...forwardedProps } = props;

// this prop is just for preview
const previewItems = [
  {
    name: "Label with icon",
    value: 1,
    content: "Your content here for tab 1",
    count: "00",
    icon: "ph ph-browser",
  },
  {
    name: "Label with counter only",
    value: 2,
    content: "Your content here for tab 2",
    count: "111",
  },
  {
    name: "Disabled Label",
    value: 3,
    content: "Your content here for tab 3",
    disabled: true,
    count: "5",
  },
];

variant = variant ?? "line";
size = size ?? "default";
items = items ?? previewItems;

State.init({
  activeTab: 1,
});

const TabGroup = styled("Tabs.Root")``;

const TabList = styled("Tabs.List")`
  display: inline-flex;
  align-items: center;
  margin-bottom: 1rem;
  transition: inherit;
  gap: ${(p) => (p.size === "small" ? ".375rem" : ".5rem")};
  ${
    variant === "toggle" &&
    `
    border-radius: 6px;
    background-color: hsla(0, 0%, 10%, 0.05);
    gap: 2px !important;
    padding: 2px;
  `
  }
`;

const Tab = styled("Tabs.Trigger")`
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--sand11);
  transition: all 200ms;
  user-select: none;
  gap: ${(p) => (p.size === "small" ? ".375rem" : ".5rem")};
  font: ${(p) =>
    p.size === "small"
      ? "var(--text-xs)"
      : p.size === "large"
      ? "var(--text-base)"
      : "var(--text-s)"};
  font-weight: 600;

  &:hover {
    color: var(--sand12);
  }

  &:focus-within, &[data-state="active"] {
    color: var(--violet11);
  }

  &[disabled] {
    color: var(--sand8);
    pointer-events: none;
  }

  ${
    variant === "pill" &&
    `
    border-radius: 50px;

    &:hover {
      background-color: var(--sand2);
    }
    &:focus-within, &[data-state="active"] {
      background-color: var(--violet2);
    }

    ${
      size === "small"
        ? `
      padding: 8px 12px;
    `
        : size === "large"
        ? `
      padding: 12px 18px;
    `
        : `
      padding: 7px 16px;
    `
    }
  `
  }

  ${
    variant === "line" &&
    `
    border-bottom: 2px solid transparent;

    &:hover {
      border-bottom: 2px solid var(--sand4);
    }
    &:focus-within, &[data-state="active"] {
      border-color: var(--violet9);
    }

    ${
      size === "small"
        ? `
      padding: 10px 12px;
    `
        : size === "large"
        ? `
      padding: 12px 18px;
    `
        : `
      padding: 10px 16px;
    `
    }
  `
  }

  ${
    variant === "toggle" &&
    `
    border-radius: 5px;

    &:hover {
      color: var(--sand12);
    }

    &[data-state="active"] {
      background-color: var(--white);
      color: var(--sand12);
      box-shadow: 0px 1px 2px 0px var(--blackA3);
    }

    ${
      size === "small"
        ? `
      padding: 10px 12px;
    `
        : size === "large"
        ? `
      padding: 12px 20px;
    `
        : `
      padding: 10px 16px;
    `
    }
  `
  }
`;

const TabIcon = styled.i`
  font-size: ${(p) =>
    p.size === "small" ? "16px" : p.size === "large" ? "20px" : "18px"};
  color: var(--sand10);

  ${Tab}[data-state="inactive"]:hover & {
    color: var(--sand12);
  }

  ${Tab}:focus-within, [data-state="active"] & {
    color: var(--violet10);
    ${
      variant === "toggle" &&
      `
      color: var(--sand12);
    `
    }
  }

  ${Tab}[disabled] & {
    color: var(--sand8);
  }

  & > * {
    transition: all 200ms;
    color: inherit;
  }
`;

const TabCounter = styled.div`
  border-radius: 50px;
  padding: ${(p) => (p.size === "large" ? "4px 8px" : "4px 6px")};
  background-color: var(--sand3);
  line-height: 1;
  transition: all 200ms;

  ${Tab}[data-state="inactive"]:hover & {
    background-color: var(--sand6);
  }
  ${Tab}:focus-within, [data-state="active"] & {
    background-color: var(--violet4);
  }
`;

const TabContent = styled("Tabs.Content")``;

const onValueChange = (value) => {
  State.update({ activeTab: value });
};

if (items.length === 0) {
  return "No data provided";
}

return (
  <TabGroup
    onValueChange={onValueChange}
    value={state.activeTab}
    {...forwardedProps}
  >
    <TabList size={size}>
      {items.map((item) => (
        <Tab
          key={`tab_item_${item.name}`}
          value={item.value}
          disabled={item.disabled}
          size={size}
        >
          {item.icon && <TabIcon size={size} className={item.icon} />}
          {item.name}
          {item.count && variant !== "toggle" && (
            <TabCounter size={size}>{item.count}</TabCounter>
          )}
        </Tab>
      ))}
    </TabList>
    <TabContent value={items[state.activeTab - 1].value}>
      {items[state.activeTab - 1].content}
    </TabContent>
  </TabGroup>
);
