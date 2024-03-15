let { title, wrapperStyles, className, children } = props;
title = title ?? "[Current Page]";

const Flex = styled.div`
  display: flex;
  gap: ${(p) => p.gap};
  align-items: ${(p) => p.alignItems};
  justify-content: ${(p) => p.justifyContent};
  flex-direction: ${(p) => p.direction ?? "row"};
  flex-wrap: ${(p) => p.wrap ?? "nowrap"};
  flex: ${(p) => p.flex};

  ${(p) =>
    p.mobileStack &&
    `
    @media (max-width: 900px) {
      flex-direction: column;
    }
  `}

  @media (max-width: 900px) {
    gap: ${(p) => p.mobileGap ?? p.gap};
    align-items: ${(p) => p.mobileAlignItems ?? p.alignItems};
  }
`;

const Wrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  max-width: 1224px;
  margin: 0 auto;
`;

const Text = styled.p`
  font: var(--${(p) => p.size ?? "text-base"});
  font-weight: ${(p) => p.fontWeight} !important;
  color: var(--${(p) => p.color ?? "sand12"});
  line-height: ${(p) => p.lineHeight};
  letter-spacing: 0.3px;
  margin: 0;

  @media (max-width: 900px) {
    font: var(--${(p) => p.mobileSize ?? p.size ?? "text-base"});
  }
`;

const PageName = () => (
  <Text size="text-l" fontWeight="bold" color="sand12" lineHeight="26px">
    {title}
  </Text>
);

return (
  <Wrapper className={className} style={{ ...wrapperStyles }}>
    {title && <PageName />}
    {children}
  </Wrapper>
);
