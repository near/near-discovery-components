const Cookies = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  box-shadow: 0 8px 48px rgba(0, 0, 0, 0.15);
  background-color: white;
  border-radius: 4px;
  margin: 8px auto;
  max-width: 50%;
  padding: 12px;
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 12px;
  line-height: 18px;
  font-weight: 400;

  p {
    margin-bottom: 0;
  }

  .buttons {
    display: flex;
    gap: 10px;
  }

  @media only screen and (max-width: 800px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const CustomizeDialogContent = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 50px;
  font-size: 12px;
  line-height: 18px;
  font-weight: 400;

  .info {
    display: flex;
    flex-direction: column;
    gap: 20px;

    h2 {
      font-size: 16px;
    }
  }
`;

const { cookiesAcknowleged } = props;

State.init({
  cookieAcceptance: cookiesAcknowleged,
  isDialogOpen: false,
});

if (state.cookieAcceptance) {
  return "";
}

const onAccept = ({ all, onlyRequired }) => {
  State.update({ cookieAcceptance: true });
  State.update({ isDialogOpen: false });
  return <AnalyticsCookieConsent all onlyRequired />;
};

const onCustomize = () => {
  State.update({ isDialogOpen: true });
};

return (
  <Cookies>
    <Widget
      src="near/widget/DIG.Dialog"
      props={{
        content: (
          <CustomizeDialogContent>
            <div class="info">
              <div>
                <h2>Necessary Cookies</h2>
                <p>
                  These cookies are required for website functionality such as storing your settings and preferences, as
                  detailed{" "}
                  <a href="/near/widget/NearOrg.CookieDetails" target="_blank">
                    here
                  </a>
                  .
                </p>
              </div>
              <div>
                <h2>Marketing & Analytics Cookies</h2>
                <p>
                  We recommend accepting these cookies, which include third-party cookies, for the improvement of user
                  experience and discoverability on the B.O.S. These cookies contribute to anonymized statistics which
                  are analyzed in aggregate.
                </p>
              </div>
            </div>
          </CustomizeDialogContent>
        ),
        open: state.isDialogOpen,
        enableCloseButton: false,
        actionButtons: (
          <div className="buttons">
            <Widget
              src="${REPL_ACCOUNT}/widget/DIG.Button"
              props={{
                label: "Accept All",
                variant: "primary",
                size: "small",
                onClick: () => onAccept({ all: true }),
              }}
            />
            <Widget
              src="${REPL_ACCOUNT}/widget/DIG.Button"
              props={{
                label: "Required Only",
                variant: "secondary",
                size: "small",
                onClick: () => onAccept({ onlyRequired: true }),
              }}
            />
          </div>
        ),
        contentStyles: "max-width: 750px;",
        onOpenChange: (value) => State.update({ isDialogOpen: value }),
      }}
    />
    <p>
      We use our own and third-party cookies on our website to enhance your experience, analyze traffic, and for
      marketing. For more information see our{" "}
      <Link href="/cookies" target="_blank">
        Cookie Policy
      </Link>
      .{" "}
    </p>
    <div class="buttons">
      <Widget
        src="${REPL_ACCOUNT}/widget/DIG.Button"
        props={{
          label: "Customize",
          variant: "secondary",
          size: "small",
          onClick: onCustomize,
        }}
      />
      <Widget
        src="${REPL_ACCOUNT}/widget/DIG.Button"
        props={{
          label: "Accept",
          variant: "primary",
          size: "small",
          onClick: () => onAccept({ all: true }),
        }}
      />
    </div>
  </Cookies>
);
