let { open, onClick } = props;

const idOSLearnLink = "https://idos-1.gitbook.io/idos-docs";

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

const Icon = styled.i`
  color: #697177;
  font-size: 20px;
  margin-top: 2px;

  [type="button"] {
    cursor: pointer;
  }
`;

const Text = styled.span`
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
      <Text>
        To ensure the privacy of your data, all credentials and preferences you
        enter on this settings page will be securely stored in a decentralized
        identity operating system (idOS). Learn more about idOS{" "}
        <TextLink href={idOSLearnLink} target="_blank">
          here
        </TextLink>
        .
      </Text>
      <Icon className="ph ph-x" type="button" onClick={onClick} />
    </Card>
  </Wrapper>
);
