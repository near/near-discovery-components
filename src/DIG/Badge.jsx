let { iconLeft, iconRight, label, variant, ...forwardedProps } = props;

variant = variant ?? "primary";

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  height: 32px;
  flex-shrink: 0;
  border-radius: 6px;
  border: 1px solid;
  padding: 0 12px;
  gap: 8px;
  font: var(--text-xs);

  ${variant === "neutral" &&
  `
    background: #fff;
    border-color: var(--sand6);
    color: var(--sand12);
    i {
      color: var(--sand10);
    }
  `}

  ${variant === "primary" &&
  `
    background: var(--violet4);
    border-color: var(--violet7);
    color: var(--violet12);
    i {
      color: var(--violet10);
    }
  `}

  ${variant === "success" &&
  `
    background: var(--green4);
    border-color: var(--green8);
    color: var(--green12);
    i {
      color: var(--green8);
    }
  `}

  ${variant === "alert" &&
  `
    background: var(--red4);
    border-color: var(--red7);
    color: var(--red12);
    i {
      color: var(--red10);
    }
  `}

  ${variant === "warning" &&
  `
    background: var(--amber4);
    border-color: var(--amber7);
    color: var(--amber12);
    i {
      color: var(--amber10);
    }
  `}
`;

return (
  <Badge {...forwardedProps}>
    {iconLeft && <i className={iconLeft} />}
    {label}
    {iconRight && <i className={iconRight} />}
  </Badge>
);
