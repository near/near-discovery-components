let { id, label, ...forwardedProps } = props;

const Wrapper = styled.div`
  margin: 4px;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 200ms;
`;

const Root = styled("Checkbox.Root")`
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--sand7);
  border-radius: 6px;
  width: 24px;
  height: 24px;
  box-shadow: 0 1px 2px 0 var(--blackA6);
  transition: inherit;

  &:hover, :focus-within {
      color: var(--violet8);

      & + label {
          color: var(--violet8);
      }
  }

  &[aria-checked="true"] {
      background-color: var(--violet9);
      border-color: var(--violet8);
  }

  &[disabled] {
      color: var(--sand8);
      cursor: initial;

      & + label {
          color: var(--sand8);
          cursor: initial;
      }
  }

  &:focus-within {
      border-color: var(--violet8);
      box-shadow: 0 0 0 4px var(--violet5);
  }
`;

const Indicator = styled("Checkbox.Indicator")`
  color: var(--white);
`;

const Label = styled.label`
  font: var(--text-s);
  line-height: 1;
  cursor: pointer;
  transition: inherit;
  user-select: none;
`;

return (
  <Wrapper>
    <Root id={id} {...forwardedProps}>
      <Indicator>
        <i className="ph ph-check" />
      </Indicator>
    </Root>
    <Label htmlFor={id}>{label}</Label>
  </Wrapper>
);
