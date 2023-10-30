const {
  tosDomainName,
  termsCid,
  privacyCid,
  tosName,
  logOut,
  recordToC,
} = props;

const acceptanceKey = tosName; // may change
const [agreeIsChecked, setAgreeIsChecked] = useState(false);
const [hasCommittedAcceptance, setCommittedAcceptance] = useState(false);

// find all instances of the user agreeing to some version of the desired TOS
const agreementsForUser = context.accountId
  ? Social.index("tosAccept", acceptanceKey, {
      accountId: context.accountId, // make sure it was written by the user in question
      subscribe: true,
    })
  : null;

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
  background-color: var(--blackA3);
  backdrop-filter: blur(4px);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1001;
  animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes overlayShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
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
  box-shadow: 0px 4px 8px 0px var(--blackA3), 0px 0px 0px 1px var(--blackA4);
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1 min-height 0;
  overflow-y: auto;
`;

const TosFooter = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 2rem;
`;

const TosButtons = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 1rem;
  justify-content: space-between;
  align-items: center;
`;

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

const handleTermsAndPrivacyCheck = useCallback(
  (value) => {
    setAgreeIsChecked(value);
  }, []);

const handleConfirm = useCallback(() => {
  Social.set(
    {
      index: {
        tosAccept: JSON.stringify({
          key: acceptanceKey,
          value: latestTosVersion,
        }),
      },
    },
    {
      onCommit: () => {
        setCommittedAcceptance(true);
      },
    }
  );
}, []);

// we check for existence of Index results because if no results are found
// we get an empty array. This means that when the existence check fails
// we are still loading and we do not want to potentially flash the modal
// until we know for sure that it should be displayed

const showTos =
  !hasCommittedAcceptance &&
  context.accountId &&
  latestTosVersion &&
  agreementsForUser &&
  (!agreementsForUser.length ||
    agreementsForUser[agreementsForUser.length - 1].value < latestTosVersion);

if (agreementsForUser && recordToC) {
  recordToC({
    showTos,
    agreementsForUser,
    latestTosVersion,
  });
}

const TosContent = () => (
  <ContentWrapper>
    <Widget
      src={tosName}
      props={{
        tosDomainName,
        termsCid,
        privacyCid,
      }}
    />
  </ContentWrapper>
);

const TosActions = () => (
  <TosFooter>
    <Widget
      src="${REPL_ACCOUNT}/widget/DIG.Checkbox"
      props={{
        id: "agree-terms-and-privacy",
        label: "I agree to the Terms of Service and Privacy Policy",
        checked: agreeIsChecked,
        onCheckedChange: handleTermsAndPrivacyCheck,
      }}
    />
    <TosButtons>
      <Widget
        src="${REPL_ACCOUNT}/widget/DIG.Button"
        props={{
          label: "Decline",
          variant: "secondary",
          onClick: logOut,
        }}
      />
      <Widget
        src="${REPL_ACCOUNT}/widget/DIG.Button"
        props={{
          label: "Continue",
          variant: "affirmative",
          disabled: !agreeIsChecked,
          onClick: handleConfirm,
        }}
      />
    </TosButtons>
  </TosFooter>
);

return (
  <>
    {showTos && (
      <Backdrop className="d-flex">
        <Modal>
          <TosContent />
          <TosActions />
        </Modal>
      </Backdrop>
    )}

    {/* The following code is only needed to remain backwards compatible for the short term: */}
    {props.targetComponent && (
      <Widget src={props.targetComponent} props={props.targetProps} />
    )}
  </>
);
