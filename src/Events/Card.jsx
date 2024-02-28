let { imgSrc, title, date, location } = props;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const CoverImage = styled.div`
  width: 100%;
  height: 221px;
  background: url(${(p) => p.src});
  background-size: cover;
  background-position: center;
  border-radius: 8px;
`;

const Text = styled.p`
  font: var(--${(p) => p.size ?? "text-base"});
  font-weight: ${(p) => p.fontWeight} !important;
  color: var(--${(p) => p.color ?? "sand12"});
  margin: 0;

  @media (max-width: 900px) {
    font: var(--${(p) => p.mobileSize ?? p.size ?? "text-base"});
  }
`;

const Flex = styled.div`
  display: flex;
  gap: ${(p) => p.gap};
  align-items: ${(p) => p.alignItems};
  justify-content: ${(p) => p.justifyContent};
  flex-direction: ${(p) => p.direction ?? "row"};
  flex-wrap: ${(p) => p.wrap ?? "nowrap"};

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

return (
  <Wrapper>
    <CoverImage src={imgSrc} />
    <Text size="text-lg" fontWeight="bold">
      {title}
    </Text>
    <Flex gap="24px" alignItems="center">
      <Text size="text-sm" color="sand10">
        {date}
      </Text>
      <Text size="text-sm" color="sand10">
        {location}
      </Text>
    </Flex>
  </Wrapper>
);
