let { as, children, dark, ...props } = props;

const isClickable = as === "a" || as === "button";

const Wrapper = styled.div`
  padding: 32px;
  border-radius: 8px;
  border: 1px solid var(--sand12);
  display: flex;
  flex-direction: column;
  gap: 32px;
  transition: all 200ms;
  outline: none;
  box-shadow: 0 0 0 0px var(--violet4);

  &[data-dark="true"] {
    border-color: var(--sand9);
  }

  &[data-clickable="true"] {
    &:hover {
      text-decoration: none;
      background: var(--blackA6);

      &[data-dark="true"] {
        background: var(--whiteA6);
      }
    }

    &:focus {
      text-decoration: none;
      background: var(--blackA6);
      box-shadow: 0 0 0 4px var(--violet4);

      &[data-dark="true"] {
        background: var(--whiteA6);
      }
    }
  }

  @media (max-width: 1000px) {
    padding: 24px;
    gap: 24px;
  }
`;

return (
  <Wrapper as={as} data-clickable={isClickable} data-dark={dark} {...props}>
    {children}
  </Wrapper>
);
