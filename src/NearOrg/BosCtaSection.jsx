const { backgroundColor } = props;

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
  text-align: center;

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

const Section = styled.div`
  background-color: ${backgroundColor};
  position: relative;
  padding: 160px 24px;
  overflow: hidden;

  @media (max-width: 900px) {
    padding: var(--section-gap) 24px;
  }
`;

const Container = styled.div`
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  gap: ${(p) => p.gap ?? "var(--section-gap)"};
  flex-direction: column;
  align-items: ${(p) => (p.center ? "center" : undefined)};
  justify-content: ${(p) => (p.center ? "center" : undefined)};
  text-align: ${(p) => (p.center ? "center" : undefined)};
`;

return (
  <Section>
    <Container>
      <Flex direction="column" gap="50px" alignItems="center">
        <Flex direction="column" gap="20px" alignItems="center">
          <Text size="text-3xl" fontWeight="500">
            The OS for an open web
          </Text>

          <Text size="text-l" mobileSize="text-l" style={{ maxWidth: "808px" }}>
            Effortlessly create and distribute decentralized apps on any blockchain with the Blockchain Operating
            System.
          </Text>
        </Flex>

        <Flex gap="24px" wrap="wrap" alignItems="center" justifyContent="center">
          <Widget
            src="${REPL_ACCOUNT}/widget/DIG.Button"
            props={{
              href: "https://docs.near.org",
              target: "_blank",
              label: "Read Docs",
              variant: "secondary",
              size: "large",
            }}
          />

          <Widget
            src="${REPL_ACCOUNT}/widget/DIG.Button"
            props={{
              href: "/onboarding",
              label: "Get Started",
              variant: "primary",
              size: "large",
            }}
          />
        </Flex>
      </Flex>
    </Container>
  </Section>
);
