let { active, disabled, href, iconLeft, iconRight, label, type, ...forwardedProps } = props;

active = active ?? false;
type = type ?? "button";

const conditionalAttributes = href
  ? {
      as: "a",
      href,
    }
  : {
      type,
      disabled,
    };

const Chip = styled.button`
  all: unset;
  box-sizing: border-box;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-shrink: 0;
  width: auto;
  height: 25px;
  padding: 0 12px;
  font: var(--text-xs);
  font-weight: 450;
  line-height: 1;
  border-radius: 100px;
  background: var(--white);
  color: var(--sand12) !important;
  border: 1px solid var(--sand6);
  box-shadow: 0 1px 2px var(--blackA4);
  cursor: pointer;
  transition: all 200ms;
  text-decoration: none !important;

  i {
    color: var(--sand10) !important;
  }

  &:hover {
    background: var(--sand2);
    border-color: var(--sand7);
  }
  &:focus {
    background: var(--white);
    border-color: var(--violet8);
    box-shadow: 0 0 0 4px var(--violet4);
  }
  &:active {
    background: var(--sand3);
    border-color: var(--sand8);
  }

  ${active &&
  `
    color: var(--violet11) !important;
    background: var(--violet3);
    border-color: var(--violet7);

    i {
      color: var(--violet10) !important;
    }

    &:hover {
      background: var(--violet4);
      border-color: var(--violet8);
    }
    &:focus {
      background: var(--violet4);
      border-color: var(--violet8);
      box-shadow: 0 0 0 4px var(--violet4);
    }
    &:active {
      background: var(--violet5);
      border-color: var(--violet8);
    }
  `}

  ${disabled &&
  `
    opacity: 1;
    background: var(--sand3);
    border-color: var(--sand3);
    color: var(--sand8) !important;
    pointer-events: none;

    i {
      color: var(--sand8) !important;
    }
  `}
`;

return (
  <Chip ref="forwardedRef" {...conditionalAttributes} {...forwardedProps}>
    {iconLeft && <i className={iconLeft} />}
    {label}
    {iconRight && <i className={iconRight} />}
  </Chip>
);
