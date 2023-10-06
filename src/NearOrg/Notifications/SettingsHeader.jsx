let { title, text, content } = props;

const Header = styled.div`
  display: flex;
  padding: 56px 0px 48px 0px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 24px;
`;

const Title = styled.div`
  font: var(--text-xl);
  color: var(--sand12);
  font-weight: 500;
`;

const Text = styled.div`
  font: var(--text-base);
  color: var(--sand11);
  font-weight: 450;
`;

return (
  <Header>
    <Title>{title}</Title>
    <Text>{text}</Text>
    {content}
  </Header>
);
