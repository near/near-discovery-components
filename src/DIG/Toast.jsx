let { title, description, type, trigger, action, open, onOpenChange, providerProps, ...forwardedRootProps } = props;

type = type ?? "info";

const Root = styled("Toast.Root")`
  background-color: white;
  border-radius: 6px;
  box-shadow: 0px 4px 8px 0px var(--blackA4), 0px 0px 0px 1px var(--blackA4);
  padding: 16px;
  display: grid;
  grid-template-areas: "icon title action" "icon description action" "icon description action";
  grid-template-columns: auto 1fr max-content;
  column-gap: 16px;
  align-items: center;

  &[data-state="open"] {
    animation: slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  &[data-state="closed"] {
    animation: hide 100ms ease-in;
  }
  &[data-swipe="move"] {
    transform: translateX(var(--radix-toast-swipe-move-x));
  }
  &[data-swipe="cancel"] {
    transform: translateX(0);
    transition: transform 200ms ease-out;
  }
  &[data-swipe="end"] {
    animation: swipeOut 100ms ease-out;
  }

  @keyframes slideIn {
    from {
      transform: translateX(calc(100% + var(--viewport-padding)));
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes swipeOut {
    from {
      transform: translateX(var(--radix-toast-swipe-end-x));
    }
    to {
      transform: translateX(calc(100% + var(--viewport-padding)));
    }
  }

  .toast-action {
    grid-area: action;
  }
`;

const Title = styled("Toast.Title")`
  grid-area: title;
  font: var(text-xs);
  font-weight: 600;
  color: var(--sand12);
  margin-bottom: 5px;
`;

const Description = styled("Toast.Description")`
  grid-area: description;
  margin: 0;
  font: var(--text-xs);
  color: var(--sand11);
`;

const Viewport = styled("Toast.Viewport")`
  --viewport-padding: 25px;
  position: fixed;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  padding: var(--viewport-padding);
  gap: 10px;
  width: 319px;
  max-width: 100vw;
  margin: 0;
  list-style: none;
  z-index: 2147483647;
  outline: none;
`;

const Icon = styled.i`
  grid-area: icon;
  font-size: 20px;
  color: ${(p) => p.color ?? "var(--violet8)"};
`;

const IconByType = ({ type, icon, color }) => {
  let iconClassName, iconColor;
  switch (type) {
    case "success":
      iconClassName = "ph-bold ph-check-circle";
      iconColor = "var(--green8)";
      break;
    case "error":
      iconClassName = "ph-bold ph-warning";
      iconColor = "var(--red8)";
      break;
    case "custom":
      iconClassName = icon;
      iconColor = color;
    case "info":
    default:
      iconClassName = "ph-bold ph-info";
      iconColor = "var(--violet8)";
      break;
  }
  return <Icon className={iconClassName} color={iconColor} />;
};

return (
  <Toast.Provider {...providerProps}>
    {trigger}
    <Root open={open} onOpenChange={onOpenChange} {...forwardedRootProps}>
      {type && <IconByType type={type} icon={iconClassName} color={iconColor} />}
      {title && <Title>{title}</Title>}
      {description && <Description>{description}</Description>}
      {action && (
        <Toast.Action className="toast-action" asChild altText="Action">
          {action}
        </Toast.Action>
      )}
    </Root>
    <Viewport />
  </Toast.Provider>
);
