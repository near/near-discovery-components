let {
  rootProps,
  contentProps,
  triggerProps,
  disabled,
  inline,
  children,
  viewMoreBtn,
  viewMoreHref,
  ...forwardedProps
} = props;

viewMoreHref = viewMoreHref ?? "/notifications";

const TriggerWrapper = styled.span`
  display: ${inline ? "inline-flex" : "flex"};
  vertical-align: ${inline ? "baseline" : ""};
  max-width: 100%;
  white-space: normal;
`;

const PreviewWrapper = styled.div`
  border-radius: 6px;
  background: var(--white);
  box-shadow:
    0px 4px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 0px 1px rgba(0, 0, 0, 0.06);
  width: 460px;
  max-height: 80vh;
  overflow: hidden auto;
`;

const PreviewContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const SeeAll = styled.div`
  padding: 16px;

  div {
    width: 100%;
  }
`;

const DefaultViewMoreBtn = () => (
  <SeeAll>
    <Widget
      src="${REPL_ACCOUNT}/widget/DIG.Button"
      props={{
        href: viewMoreHref,
        variant: "primary",
        fill: "outline",
        label: "See all",
        size: "small",
        style: {
          width: "100%",
        },
      }}
    />
  </SeeAll>
);

return (
  <HoverCard.Root openDelay={200} closeDelay={300} {...rootProps}>
    <HoverCard.Trigger asChild>
      <TriggerWrapper {...triggerProps}>{children || "Hover Me"}</TriggerWrapper>
    </HoverCard.Trigger>
    {!disabled && (
      <HoverCard.Content asChild {...contentProps} side="bottom" sideOffset={10} hideWhenDetached={true}>
        <PreviewWrapper>
          <PreviewContent>
            <Widget src="${REPL_ACCOUNT}/widget/NearOrg.Notifications.Notifications" props={{ ...forwardedProps }} />
            {!viewMoreBtn && <DefaultViewMoreBtn />}
          </PreviewContent>
        </PreviewWrapper>
      </HoverCard.Content>
    )}
  </HoverCard.Root>
);
