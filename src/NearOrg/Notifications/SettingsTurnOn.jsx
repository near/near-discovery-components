// This component will be shown to users who have disabled notifications in browser settings
let { iOSDevice } = props;

const iOSLearnLink = "https://support.google.com/chrome/answer/3220216?co=GENIE.Platform%3DiOS&oco=1";
const androidLearnLink = "https://support.google.com/chrome/answer/3220216?co=GENIE.Platform%3DAndroid&oco=1";

const Card = styled.div`
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  align-self: stretch;
  border-radius: 6px;
  border: 1px solid var(--sand6);
  background: var(--sand-1);
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
`;

const Title = styled.div`
  font: var(--text-base);
  font-weight: 600;
  line-height: 130%;
`;

const Text = styled.div`
  color: var(--sand-11);
  font: var(--text-s);
  ont-weight: 450;
  line-height: 150%;
`;

const ButtonWrapper = styled.div``;

const learnMoreHref = iOSDevice ? iOSLearnLink : androidLearnLink;

return (
  <Card>
    <Header>
      <Title>Enable push notifications</Title>
      <Text>To receive push notifications, you'll first need to enable them in your browser settings.</Text>
    </Header>
    <ButtonWrapper>
      <Widget
        src="${REPL_ACCOUNT}/widget/DIG.Button"
        props={{
          label: "Learn More",
          variant: "secondary",
          style: { width: "100%" },
          href: learnMoreHref,
          target: "_blank",
        }}
      />
    </ButtonWrapper>
  </Card>
);
