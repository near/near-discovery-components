// This component will be shown to users who have enabled notifications in browser settings
let { label, handleOnClick, loading, disabled } = props;
const isSwitchChecked = label === "Turn Off";

const Card = styled.div`
  display: flex;
  padding: 32px 0px;
  align-items: flex-start;
  gap: 64px;
  border-top: 1px solid var(--sand6);
`;

const Content = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 24px;
  flex: 1 0 0;
`;

const IconWrapper = styled.div`
  display: flex;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 50px;
  background: var(--violet3);
  color: var(--violet8);
`;

const Icon = styled.i`
  font-size: 20px;
  fill: currentColor;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  flex: 1 0 0;
  font: var(--text-base);
`;

const Title = styled.div`
  color: var(--sand12);
  font-weight: 600;
  line-height: 150%;
`;

const Text = styled.div`
  color: var(--sand11);
  font-weight: 450;
  line-height: 150%;
`;

const SwitchWrapper = styled.div`
  cursor: pointer;

  .SwitchRoot {
    all: unset;
    display: flex;
    align-items: center;
    width: 40px;
    height: 15px;
    background-color: #706f6c;
    border-radius: 15px;
    position: relative;
    margin: 5px auto;

    &[data-state="checked"] {
      background-color: #37cd83;
    }
  }
  .SwitchThumb {
    all: unset;
    display: block;
    width: 21px;
    height: 21px;
    background-color: #ffffff;
    border: 2px solid #706f6c;
    border-radius: 50%;
    transition: transform 100ms;
    will-change: transform;

    &[data-state="checked"] {
      transform: translateX(19px);
      border: 2px solid #37cd83;
    }
  }
`;

return (
  <Card>
    <Content>
      <IconWrapper>
        <Icon className="ph ph-notification" />
      </IconWrapper>
      <Wrapper>
        <Title>Push notifications</Title>
        <Text>Push notifications are delivered in real-time to your enabled browser or device.</Text>
      </Wrapper>
    </Content>
    <SwitchWrapper>
      <Switch.Root
        data-state={isSwitchChecked ? "checked" : "unchecked"}
        className="SwitchRoot"
        onClick={handleOnClick}
      >
        <Switch.Thumb data-state={isSwitchChecked ? "checked" : "unchecked"} className="SwitchThumb" />
      </Switch.Root>
    </SwitchWrapper>
  </Card>
);
