const Wrapper = styled.div`
  --section-gap: 162px;
  --large-gap: 82px;
  --medium-gap: 48px;

  @media (max-width: 900px) {
    --section-gap: 60px;
    --large-gap: 48px;
    --medium-gap: 24px;
  }
`;

const Text = styled.p`
  font: var(--${(p) => p.size ?? "text-base"});
  font-weight: ${(p) => p.fontWeight};
  color: var(--${(p) => p.color ?? "sand10"});
  margin: 0;

  [href] {
    color: var(--violet8);
    &:hover {
      color: var(--violet11);
      text-decoration: none;
    }
    &:focus {
      text-decoration: underline;
      outline: none;
    }
  }

  ${(p) =>
    p.flex &&
    `
    display: flex;
    align-items: center;
    gap: 16px;
  `}
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
      gap: ${(p) =>
        p.mobileStack === true ? "var(--section-gap)" : p.mobileStack};
    }
  `}

  ${(p) =>
    p.tabletStack &&
    `
    @media (max-width: 1050px) {
      flex-direction: column;
      gap: ${(p) =>
        p.tabletStack === true ? "var(--section-gap)" : p.tabletStack};
    }
  `}
`;

return (
  <Wrapper>
    <Flex gap="var(--section-gap)" mobileStack="var(--medium-gap)">
      <Flex
        direction="column"
        gap="var(--medium-gap)"
        style={{ width: "100%" }}
      >
        <Text size="text-2xl" fontWeight="600" color="sand12">
          Start learning
        </Text>

        <Flex gap="12px">
          <i
            className="ph-duotone ph-shapes"
            style={{ color: "var(--sand10)", fontSize: "20px" }}
          />
          <Flex gap="12px" direction="column" alignItems="flex-start">
            <Text size="text-base" fontWeight="600" color="sand12">
              Learn about Web3 and NEAR
            </Text>
            <Widget
              src="near/widget/DIG.Button"
              props={{
                href: "#todo",
                target: "_blank",
                iconRight: "ph-bold ph-arrow-up-right",
                label: "Start with the basics",
                variant: "primary",
                fill: "outline",
                size: "small",
              }}
            />
          </Flex>
        </Flex>

        <Flex gap="12px">
          <i
            className="ph-duotone ph-youtube-logo"
            style={{ color: "var(--sand10)", fontSize: "20px" }}
          />
          <Flex gap="12px" direction="column" alignItems="flex-start">
            <Text size="text-base" fontWeight="600" color="sand12">
              Watch NEAR on YouTube
            </Text>
            <Widget
              src="near/widget/DIG.Button"
              props={{
                href: "https://www.youtube.com/c/NEARProtocol",
                target: "_blank",
                iconRight: "ph-bold ph-arrow-up-right",
                label: "Subscribe to official channel",
                variant: "primary",
                fill: "outline",
                size: "small",
              }}
            />
          </Flex>
        </Flex>

        <Flex gap="12px">
          <i
            className="ph-duotone ph-chart-polar"
            style={{ color: "var(--sand10)", fontSize: "20px" }}
          />
          <Flex gap="12px" direction="column" alignItems="flex-start">
            <Text size="text-base" fontWeight="600" color="sand12">
              Dive deeper
            </Text>
            <Widget
              src="near/widget/DIG.Button"
              props={{
                href: "#todo",
                target: "_blank",
                iconRight: "ph-bold ph-arrow-up-right",
                label: "See all learning resources",
                variant: "primary",
                fill: "outline",
                size: "small",
              }}
            />
          </Flex>
        </Flex>
      </Flex>

      <Flex
        direction="column"
        gap="var(--medium-gap)"
        style={{ width: "100%" }}
      >
        <Text size="text-2xl" fontWeight="600" color="sand12">
          Start building
        </Text>

        <Flex gap="12px">
          <i
            className="ph-duotone ph-graph"
            style={{ color: "var(--sand10)", fontSize: "20px" }}
          />
          <Flex gap="12px" direction="column" alignItems="flex-start">
            <Text size="text-base" fontWeight="600" color="sand12">
              Understand why to build on NEAR
            </Text>
            <Widget
              src="near/widget/DIG.Button"
              props={{
                href: "#todo",
                target: "_blank",
                iconRight: "ph-bold ph-arrow-up-right",
                label: "Go to Developer page",
                variant: "primary",
                fill: "outline",
                size: "small",
              }}
            />
          </Flex>
        </Flex>

        <Flex gap="12px">
          <i
            className="ph-duotone ph-git-fork"
            style={{ color: "var(--sand10)", fontSize: "20px" }}
          />
          <Flex gap="12px" direction="column" alignItems="flex-start">
            <Text size="text-base" fontWeight="600" color="sand12">
              Get an example running in minutes
            </Text>
            <Widget
              src="near/widget/DIG.Button"
              props={{
                href: "https://docs.near.org/develop/quickstart-guide",
                target: "_blank",
                iconRight: "ph-bold ph-arrow-up-right",
                label: "Begin QuickStart tutorial",
                variant: "primary",
                fill: "outline",
                size: "small",
              }}
            />
          </Flex>
        </Flex>

        <Flex gap="12px">
          <i
            className="ph-duotone ph-terminal-window"
            style={{ color: "var(--sand10)", fontSize: "20px" }}
          />
          <Flex gap="12px" direction="column" alignItems="flex-start">
            <Text size="text-base" fontWeight="600" color="sand12">
              Learn to code on NEAR
            </Text>
            <Widget
              src="near/widget/DIG.Button"
              props={{
                href: "https://docs.near.org/develop/welcome",
                target: "_blank",
                iconRight: "ph-bold ph-arrow-up-right",
                label: "Go to documentation",
                variant: "primary",
                fill: "outline",
                size: "small",
              }}
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  </Wrapper>
);
