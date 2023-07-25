let { content, contentProps, rootProps, trigger, wrapperStyle } = props;

const delayDuration = rootProps?.delayDuration ?? 300;

const Root = styled("Tooltip.Root")``;

const Content = styled("Tooltip.Content")`
  border-radius: 8px;
  padding: 12px 16px;
  font: var(--text-xs);
  background: var(--white);
  border: 1px solid var(--sand6);

  &[data-state="delayed-open"] {
    animation: show 200ms;
  }

  @keyframes show {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Arrow = styled("Tooltip.Arrow")`
  fill: white;
  position: relative;
  top: -1.5px;
`;

const ArrowBorder = styled("Tooltip.Arrow")`
  fill: var(--sand6);
`;

const TriggerWrapper = styled.span`
  display: inline-block;
`;

return (
  <Tooltip.Provider>
    <Root delayDuration={delayDuration} {...rootProps}>
      <Tooltip.Trigger asChild>
        <TriggerWrapper style={wrapperStyle}>{trigger}</TriggerWrapper>
      </Tooltip.Trigger>

      <Content sideOffset={6} {...contentProps}>
        {content}
        <ArrowBorder width={12} height={6} />
        <Arrow width={12} height={6} />
      </Content>
    </Root>
  </Tooltip.Provider>
);
