const { tosName, targetComponent, logOut } = props;
const targetProps = props?.targetProps || {};
const acceptanceKey = tosName; // may change

State.init({
  hasCommittedAcceptance: false,
  agreeIsChecked: false,
  expand: false,
});

// find all instances of the user agreeing to some version of the desired TOS
const agreementsForUser = context.accountId ? Social.index("tosAccept", acceptanceKey, {
  accountId: context.accountId, // make sure it was written by the user in question
  subscribe: true,
}) : null;

const tosVersions = Social.keys(tosName, "final", {
  return_type: "BlockHeight",
  // subscribe: true,
});

// TODO perform path validation before this
const tosPath = tosName.split("/");
const latestTosVersion = tosPath.reduce((acc, curr) => {
  return acc[curr];
}, tosVersions);

const Backdrop = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1001;
`;

const Modal = styled.div`
  width: 30rem;
  max-width: 95vw;
  max-height: 80vh;
  background-color: white;
  border-radius: 10px;
  margin: auto;
  padding: 1.5rem;
  display: flex;
  row-gap: 1rem;
  flex-direction: column;
`;

const ModalContent = styled.div`
display: flex;
flex-direction: column;
flex-grow:1
min-height 0;
overflow-y: auto;
`;

const ModalFooter = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 2rem;
`;

const AcceptSection = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 1rem;

  .continue-button {
    background: #59E692;
    color: #09342E;
    border-radius: 40px;
    height: 40px;
    padding: 0 35px;
    font-weight: 600;
    font-size: 14px;
    border: none;
    cursor: pointer;
    transition: background 200ms, opacity 200ms;

    &:hover,
    &:focus {
      background: rgb(112 242 164);
      outline: none;
    }

    &:disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }
`;

const CheckWrapper = styled.div`
display: flex;
flex-direction: row;
align-items: center;
color: ${state.agreeIsChecked ? "#26A65A" : "inherit"}
`;

const CheckButton = styled.button`
  border: none;
  --bs-btn-hover-bg: transparent;
  --bs-btn-active-bg: transparent;
  --bs-btn-color: ${state.agreeIsChecked ? "#26A65A" : "black"};
  --bs-btn-hover-color: ${state.agreeIsChecked ? "#26A65A" : "var(--bs-blue)"};
`;

const expand = (e) => {
  State.update({ expand: e });
};

if (
  agreementsForUser.length === 0 ||
  agreementsForUser[agreementsForUser.length - 1].value < latestTosVersion
) {
  const acceptJson = Near.view("social.near", "get", {
    keys: [context.accountId + "/index/tosAccept"],
  });

  const latestAccept = acceptJson
    ? JSON.parse(acceptJson[context.accountId]?.index?.tosAccept)
    : undefined;

  if (
    latestAccept &&
    latestAccept.key === acceptanceKey &&
    latestAccept.value >= latestTosVersion
  ) {
    agreementsForUser = [...agreementsForUser, latestAccept];
  }
}

// we check for existence of Index results because if no results are found
// we get an empty array. This means that when the existence check fails
// we are still loading and we do not want to potentially flash the modal
// until we know for sure that it should be displayed
const showTos =
  !state.hasCommittedAcceptance &&
  context.accountId &&
  latestTosVersion &&
  agreementsForUser &&
  (!agreementsForUser.length ||
    agreementsForUser[agreementsForUser.length - 1].value < latestTosVersion);

return (
  <div>
    {showTos && (
      <Backdrop className="d-flex">
        <Modal>
          <ModalContent>
            <Widget src={tosName} props={expand} />
          </ModalContent>
          <ModalFooter>
            <CheckWrapper>
              <CheckButton
                onClick={() => {
                  State.update({ agreeIsChecked: !state.agreeIsChecked });
                }}
                className="btn btn-outline-dark"
              >
                <div className="d-flex flex-row align-items-center gap-3">
                  <i
                    className={`bi bi-${
                      state.agreeIsChecked ? "check-square" : "square"
                    }`}
                    style={{ fontSize: "1.5rem" }}
                  />
                  <span style={{ textAlign: "left" }}>
                    I agree to the Terms of Service and Privacy Policy
                  </span>
                </div>
              </CheckButton>
            </CheckWrapper>
            <AcceptSection>
              <button
                className="btn btn-outline-secondary"
                style={{
                  flexGrow: 1,
                  flexBasis: "10rem",
                  borderRadius: "1.25rem",
                }}
                onClick={logOut}
              >
                Decline
              </button>
              <CommitButton
                style={{
                  flexGrow: 1,
                  flexBasis: "10rem",
                  borderRadius: "1.25rem",
                }}
                className="continue-button"
                disabled={!state.agreeIsChecked}
                data={{
                  index: {
                    tosAccept: JSON.stringify({
                      key: acceptanceKey,
                      value: latestTosVersion,
                    }),
                  },
                }}
                onCommit={() => {
                  State.update({ hasCommittedAcceptance: true });
                }}
              >
                Continue
              </CommitButton>
            </AcceptSection>
          </ModalFooter>
        </Modal>
      </Backdrop>
    )}

    <Widget src={targetComponent} props={targetProps} />
  </div>
);
