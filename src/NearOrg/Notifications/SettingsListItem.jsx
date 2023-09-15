// This component will be shown to users who have enabled notifications in browser settings

const Card = styled.div`
  display: flex;
  padding: 32px 0px;
  align-items: flex-start;
  gap: 64px;
  border-top: 1px solid var(--sand-light-6, #e3e3e0);
`;

const Content = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 24px;
  flex: 1 0 0;
`;

const Icon = styled.div`
  display: flex;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 50px;
  background: var(--violet-light-3, #e3e1f9);

  & > svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  flex: 1 0 0;

  & > div:nth-of-type(1) {
    color: var(--sand-light-12, #1b1b18);
    font-weight: 600;
    line-height: 150%;
  }
  & > div:nth-of-type(2) {
    color: var(--sand-light-11, #706f6c);
    font-weight: 450;
    line-height: 150%;
  }
`;

const Switch = styled.div`
  // display: flex;
  // width: 40px;
  // height: 16px;
  // align-items: center;
  // gap: 8px;
`;

const showTurnOnModal = () => {};

return (
  <Card>
    <Content>
      <Icon>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.2"
            d="M17.5 4.6875C17.5 5.12015 17.3717 5.54308 17.1313 5.90281C16.891 6.26254 16.5493 6.54292 16.1496 6.70849C15.7499 6.87405 15.3101 6.91737 14.8857 6.83297C14.4614 6.74856 14.0716 6.54022 13.7657 6.2343C13.4598 5.92837 13.2514 5.53859 13.167 5.11426C13.0826 4.68993 13.1259 4.25009 13.2915 3.85038C13.4571 3.45067 13.7375 3.10903 14.0972 2.86866C14.4569 2.62829 14.8799 2.5 15.3125 2.5C15.8927 2.5 16.4491 2.73047 16.8593 3.1407C17.2695 3.55094 17.5 4.10734 17.5 4.6875Z"
            fill="#604CC8"
          />
          <path
            d="M16.875 10V16.25C16.875 16.5815 16.7433 16.8995 16.5089 17.1339C16.2745 17.3683 15.9565 17.5 15.625 17.5H3.75C3.41848 17.5 3.10054 17.3683 2.86612 17.1339C2.6317 16.8995 2.5 16.5815 2.5 16.25V4.375C2.5 4.04348 2.6317 3.72554 2.86612 3.49112C3.10054 3.2567 3.41848 3.125 3.75 3.125H10C10.1658 3.125 10.3247 3.19085 10.4419 3.30806C10.5592 3.42527 10.625 3.58424 10.625 3.75C10.625 3.91576 10.5592 4.07473 10.4419 4.19194C10.3247 4.30915 10.1658 4.375 10 4.375H3.75V16.25H15.625V10C15.625 9.83424 15.6908 9.67527 15.8081 9.55806C15.9253 9.44085 16.0842 9.375 16.25 9.375C16.4158 9.375 16.5747 9.44085 16.6919 9.55806C16.8092 9.67527 16.875 9.83424 16.875 10ZM18.125 4.6875C18.125 5.24376 17.96 5.78753 17.651 6.25004C17.342 6.71255 16.9027 7.07304 16.3888 7.28591C15.8749 7.49878 15.3094 7.55448 14.7638 7.44596C14.2182 7.33744 13.7171 7.06957 13.3238 6.67624C12.9304 6.2829 12.6626 5.78176 12.554 5.23619C12.4455 4.69062 12.5012 4.12512 12.7141 3.6112C12.927 3.09729 13.2874 2.65803 13.75 2.34899C14.2125 2.03995 14.7562 1.875 15.3125 1.875C16.0584 1.875 16.7738 2.17132 17.3012 2.69876C17.8287 3.22621 18.125 3.94158 18.125 4.6875ZM16.875 4.6875C16.875 4.37847 16.7834 4.07637 16.6117 3.81942C16.44 3.56247 16.196 3.3622 15.9104 3.24394C15.6249 3.12568 15.3108 3.09473 15.0077 3.15502C14.7046 3.21531 14.4262 3.36413 14.2076 3.58265C13.9891 3.80117 13.8403 4.07958 13.78 4.38267C13.7197 4.68577 13.7507 4.99993 13.8689 5.28544C13.9872 5.57095 14.1875 5.81498 14.4444 5.98667C14.7014 6.15836 15.0035 6.25 15.3125 6.25C15.7269 6.25 16.1243 6.08538 16.4174 5.79235C16.7104 5.49933 16.875 5.1019 16.875 4.6875Z"
            fill="#604CC8"
          />
        </svg>
      </Icon>
      <Text>
        <div>Push notifications</div>
        <div>
          Push notifications are delivered in real-time to your enabled browser
          or device.
        </div>
      </Text>
    </Content>
    <Switch>
      <Widget
        src="${REPL_ACCOUNT}/widget/DIG.Button"
        props={{
          label: "Turn On",
          variant: "primary",
          // fill: "",
          onClick: showTurnOnModal,
          style: { width: "100%" },
        }}
      />
    </Switch>
  </Card>
);
