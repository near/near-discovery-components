let { open, onClick } = props;

const Wrapper = styled.div`
  display: ${(p) => (p.open ? "flex" : "none")};
  align-items: start;
  gap: 30px;
  user-select: none;
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
  animation-name: slideUpAndFade;

  @keyframes slideUpAndFade {
    from {
      opacity: 0;
      transform: translateY(2px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Card = styled.div`
  display: flex;
  align-items: start;
  gap: 14px;
  padding: 16px 26px;
  border-radius: 12px;
  background: #ededed;
  margin-bottom: 24px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

const Icon = styled.i`
  color: #697177;
  font-size: 20px;
  margin-top: 2px;

  [type="button"] {
    cursor: pointer;
  }
`;

const Text = styled.span`
  font: var(--text-s);
  color: #1d1412;
`;

const TextLink = styled.a`
  color: inherit;
  text-decoration: underline;
`;

return (
  <Wrapper open={open}>
    <Card>
      <Icon className="ph ph-info" />
      <Content>
        <Text>To begin using and displaying identity data in your settings, completed the onboarding steps below.</Text>
      </Content>
      <Icon className="ph ph-x" type="button" onClick={onClick} />
    </Card>
  </Wrapper>
);
