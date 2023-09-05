let {
  type,
  title,
  description,
  onCancel,
  onConfirm,
  cancelButtonText,
  confirmButtonText,
  cancelButton,
  confirmButton,
  trigger,
  ...forwardedProps
} = props;

type = type ?? "dialog";

if (["alert", "dialog"].indexOf(type) < 0) {
  return "Unsupported type of component. `type` could be only 'alert' or 'dialog'";
}

const variant = type === "alert" ? "AlertDialog" : "Dialog";

const Root = styled(`${variant}.Root`)``;

const Overlay = styled(`${variant}.Overlay`)`
  background-color: var(--blackA3);
  position: fixed;
  inset: 0;
  animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 10000;

  @keyframes overlayShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Content = styled(`${variant}.Content`)`
  background-color: white;
  border-radius: 6px;
  box-shadow: 0px 4px 8px 0px var(--blackA3), 0px 0px 0px 1px var(--blackA4);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 409px;
  max-height: 85vh;
  padding: 24px;
  animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 10005;

  @keyframes contentShow {
    from {
      opacity: 0;
      transform: translate(-50%, -48%) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;

const Title = styled(`${variant}.Title`)`
  font: var(--text-base);
  font-weight: 700;
  color: var(--sand12);
`;

const Description = styled(`${variant}.Description`)`
  font: var(--text-s);
  color: var(--sand11);
`;

const ActionWrapper = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Close = styled.button`
  all: unset;
  font-family: inherit;
  border-radius: 100%;
  height: 25px;
  width: 25px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--violet11);
  position: absolute;
  top: 10px;
  right: 10px;
  transition: all 200ms;
  cursor: pointer;
  border: 1px solid transparent;

  &:hover {
    border-color: var(--violet6);
    color: var(--violet8);
  }

  &:focus-within {
    box-shadow: 0 0 0 4px var(--violet4);
  }
`;

cancelButton = cancelButton ?? (
  <Widget
    src="${REPL_ACCOUNT}/widget/DIG.Button"
    props={{
      label: cancelButtonText ?? "Cancel",
      variant: "secondary",
      onClick: onCancel,
    }}
  />
);

confirmButton = confirmButton ?? (
  <Widget
    src="${REPL_ACCOUNT}/widget/DIG.Button"
    props={{
      label: confirmButtonText ?? "Confirm",
      variant: "primary",
      onClick: onConfirm,
    }}
  />
);

return (
  <Root {...forwardedProps}>
    {trigger && (
      <>
        {type === "alert" ? (
          <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>
        ) : (
          <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
        )}
      </>
    )}
    <Overlay />
    <Content>
      {title && <Title>{title}</Title>}
      {description && <Description>{description}</Description>}
      <ActionWrapper>
        {type === "alert" ? (
          <AlertDialog.Cancel asChild>
            <div className="d-inline-block">{cancelButton}</div>
          </AlertDialog.Cancel>
        ) : (
          <Dialog.Close asChild>
            <div className="d-inline-block">{confirmButton}</div>
          </Dialog.Close>
        )}

        {type === "alert" && (
          <AlertDialog.Action asChild>
            <div className="d-inline-block">{confirmButton}</div>
          </AlertDialog.Action>
        )}
      </ActionWrapper>
      {type === "dialog" && (
        <Dialog.Close asChild>
          <Close>
            <i className="ph ph-x" />
          </Close>
        </Dialog.Close>
      )}
    </Content>
  </Root>
);
