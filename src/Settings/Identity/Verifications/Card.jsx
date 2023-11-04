let { id, icon, title, text, button } = props;

const Card = styled.div`
  display: flex;
  align-items: center;
  align-self: stretch;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #eaecf0;
  background: var(--white);
  gap: 14px;
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.06),
    0px 1px 3px 0px rgba(16, 24, 40, 0.1);

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
`;

const Title = styled.h2`
  font: var(--text-base);
  font-weight: 500;
  line-height: 24px;
  margin: 0;
  color: var(--sand12);
`;

const Text = styled.span`
  font: var(--text-s);
  font-weight: 500;
  line-height: 20px;
  color: #667085;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex: 0 0 auto;
`;

return (
  <Card>
    {icon}
    <TextWrapper>
      {title && <Title>{title}</Title>}
      <Text>{text}</Text>
    </TextWrapper>
    <ButtonWrapper>
      {button}
    </ButtonWrapper>
  </Card>
);
