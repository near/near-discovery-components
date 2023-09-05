let { items, ...forwardedProps } = props;

items = items ?? [];

const Root = styled("Accordion.Root")``;

const Item = styled("Accordion.Item")`
  border-radius: 6px;
  box-shadow: 0 0 0 0px var(--violet5);
  transition: all 200ms;

  &:focus-within {
    box-shadow: 0 0 0 4px var(--violet5);
  }
`;

const Header = styled("Accordion.Header")`
  margin: 0 !important;
`;

const Trigger = styled("Accordion.Trigger")`
  all: unset;
  box-sizing: border-box;
  display: flex;
  width: 100%;
  align-items: center;
  gap: 1rem;
  font: var(--text-s);
  font-weight: 600;
  color: var(--sand12);
  padding: 16px;
  transition: all 200ms;

  i {
    margin-left: auto;
    font-size: 16px;
    transition: all 200ms;
  }

  &[data-state="open"] i {
    transform: rotate(180deg);
  }

  &:hover {
    color: var(--violet8);
  }
`;

const Content = styled("Accordion.Content")`
  padding: 0 16px 16px 16px;
  overflow: hidden;
  font: var(--text-s);

  & > *:last-child {
    margin-bottom: 0;
  }

  &[data-state="open"] {
    animation: slideDown 200ms;
  }
  &[data-state="closed"] {
    animation: slideUp 200ms;
  }

  @keyframes slideDown {
    from {
      height: 0;
      padding-bottom: 0;
    }
    to {
      height: var(--radix-accordion-content-height);
    }
  }

  @keyframes slideUp {
    from {
      height: var(--radix-accordion-content-height);
    }
    to {
      height: 0;
      padding-bottom: 0;
    }
  }
`;

return (
  <Root {...forwardedProps}>
    {items.map((item, i) => (
      <Item value={item.value} key={item.value}>
        <Header>
          <Trigger>
            {item.header}
            <i className="ph-bold ph-caret-down" />
          </Trigger>
        </Header>

        <Content>{item.content}</Content>
      </Item>
    ))}
  </Root>
);
