let { as, imgSrc, title, description, date, location, loading, ...forwardedProps } = props;
let { startAt, endAt } = date;

const isClickable = as === "a" || as === "button";

const Wrapper = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: 2fr 1fr;
  align-items: center;
  border: 4px solid transparent;
  transition: all 200ms;

  &:hover {
    text-decoration: none;

    & > p {
      text-decoration: underline;
    }
  }

  &:focus-within {
    border: 4px solid var(--violet4);
    border-radius: 12px;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: ${(p) => p.mobileGap ?? p.gap};
  }
`;

const CoverImageWrapper = styled.div`
  width: 100%;
  height: 471px;
  border-radius: 8px;
  overflow: hidden;
`;

const CoverImage = styled.div`
  width: 100%;
  height: 100%;
  background: ${(p) => `url(${p.src})`};
  background-size: cover;
  background-position: center;
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
    isClickable &&
    `
      filter: brightness(1);
      transform: scale(1.02);
    `}
  }

  ${Wrapper}:focus-within & {
    filter: brightness(1);
    transform: scale(1);
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

  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: ${(p) => p.overflowLines ?? "2"};
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  word-break: break-word;

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
    <CoverImageWrapper>
      <CoverImage src={imgSrc} />
    </CoverImageWrapper>
    <Flex direction="column" gap="24px">
      <Text size="text-2xl" fontWeight="bold" style={{ minHeight: loading && "31px" }} title={title}>
        {title}
      </Text>
      <Text size="text-lg" color="sand10" overflowLines={7} style={{ minHeight: loading && "31px" }} title={title}>
        {description}
      </Text>
      <Flex gap="24px" alignItems="center">
        <Flex gap="8px" alignItems={startAt !== endAt ? "start" : "center"} style={{ width: "100%" }}>
          <Icon className="ph ph-calendar-blank" />
          <Flex direction="column" alignItems="start">
            <Text size="text-s" color="sand10">
              {startAt}
              {startAt !== endAt && " -"}
            </Text>
            {endAt && startAt !== endAt && (
              <Text size="text-s" color="sand10">
                {endAt}
              </Text>
            )}
          </Flex>
        </Flex>
        <Flex gap="8px" alignItems="center" style={{ width: "100%" }} title={location}>
          <Icon className="ph ph-map-pin" />
          <Text size="text-s" color="sand10">
            {location}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  </Wrapper>
);
