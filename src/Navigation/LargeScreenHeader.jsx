let { title, wrapperStyles, className, rightSideChildren } = props;

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
  width: 100%;
  height: 64px;
  gap: 12px;
  align-items: center;
  padding: 12px 16px;
  margin: 0 auto;
  position: relative;
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

const RightSide = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
`;

const Search = styled.div`
  width: min-content;
  position: absolute;
  top: 12px;
  left: 0;
  right: 0;
  bottom: 12px;
  margin: 0 auto;

  > div,
  > div > label,
  > div > label > div {
    height: 100%;
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

    <Search>
      <Widget src="${REPL_ACCOUNT}/widget/Navigation.Search" />
    </Search>

    <RightSide>{rightSideChildren}</RightSide>
  </Wrapper>
);
