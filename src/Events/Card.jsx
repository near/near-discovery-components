let { as, imgSrc, title, date, location, loading, ...forwardedProps } = props;

const isClickable = as === "a" || as === "button";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  &:hover {
    text-decoration: none;

    & > p {
      text-decoration: underline;
    }
  }
`;

const CoverImage = styled.div`
  width: 100%;
  height: 221px;
  background: ${(p) => `url(${p.src})`};
  background-size: cover;
  border-radius: 8px;
  transition: all 200ms;
  filter: brightness(0.9);

  ${loading &&
  `
    background: linear-gradient(to right, var(--sand10) 33%, var(--sand9) 66%, var(--sand10) 99%);
    background-position: center;
    animation: waveAnimation 5s linear infinite;
  `}

  ${Wrapper}:hover & {
    ${!loading &&
    `
      filter: brightness(1);
      transform: scale(1.02);
    `}
  }

  @keyframes waveAnimation {
    0% {
      background-position: 0px 0;
    }
    100% {
      background-position: 100em 0;
    }
  }
`;

const Text = styled.p`
  font: var(--${(p) => p.size ?? "text-base"});
  font-weight: ${(p) => p.fontWeight} !important;
  color: var(--${(p) => p.color ?? "sand12"});
  margin: 0;

  ${loading &&
  `
    border-radius: 2px;
    background: linear-gradient(to right, var(--sand10) 33%, var(--sand9) 66%, var(--sand10) 99%);
    animation: waveAnimation 5s linear infinite;
    min-width: 75%;
    min-height: 12px;
  `}

  @media (max-width: 900px) {
    font: var(--${(p) => p.mobileSize ?? p.size ?? "text-base"});
  }

  @keyframes waveAnimation {
    0% {
      background-position: 0px 0;
    }
    100% {
      background-position: 100em 0;
    }
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

const Icon = styled.i`
  color: var(--sand12);
  font-size: 24px;

  ${loading &&
  `
  background: linear-gradient(to right, var(--sand10) 33%, var(--sand9) 66%, var(--sand10) 99%);
  animation: waveAnimation 5s linear infinite;
  width: 24px;
  height: 24px;
  border-radius: 2px;

  &::before {
    visibility: hidden;
  }
  `}

  @keyframes waveAnimation {
    0% {
      background-position: 0px 0;
    }
    100% {
      background-position: 100em 0;
    }
  }
`;

return (
  <Wrapper as={as} data-clickable={isClickable} {...forwardedProps}>
    <CoverImage src={imgSrc} />
    <Text size="text-lg" fontWeight="bold" style={{ minHeight: loading && "31px" }}>
      {title}
    </Text>
    <Flex gap="24px" alignItems="center">
      <Flex gap="8px" alignItems="center" style={{ width: "100%" }}>
        <Icon className="ph ph-calendar-blank" />
        <Text size="text-s" color="sand10">
          {date}
        </Text>
      </Flex>
      <Flex gap="8px" alignItems="center" style={{ width: "100%" }}>
        <Icon className="ph ph-map-pin" />
        <Text size="text-s" color="sand10">
          {location}
        </Text>
      </Flex>
    </Flex>
  </Wrapper>
);
