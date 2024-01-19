const type = props.type;
const open = props.open;
const closeModal = props.closeModal;
const submitClick = props.submitClick;

const submitAndClose = (reason) => {
  submitClick(reason);
  closeModal();
};

const buildContentReportOptions = () => {
  const reasons = {
    spam: "Spam",
    abuse: "Hate, Bullying or Harassment",
    explicit: "Nudity or Suggestive Content",
    fraud: "Frauds or Scams",
    illegal_content: "Illegal Content",
    copyright_violation: "Copyright Violation",
    other: "Other",
  };

  const descriptions = {
    spam: "Repeated, unwanted, or unsolicited actions.",
    abuse: "Discrimination, threats, or targeted intimidation.",
    explicit: "Explicit or inappropriate visuals or text.",
    fraud: "Deceptive practices or misleading offers.",
    illegal_content: "Promotion or distribution of illegal activities.",
    copyright_violation: "Unauthorized use of intellectual property.",
    other: "Content that doesn't fit the above categories.",
  };

  return buildDialog(reasons, descriptions);
};

const buildAccountReportOptions = () => {
  const reasons = {
    bot: "Bot or Automated Actions",
    impersonation: "Impersonation",
    inappropriate_profile: "Inappropriate Profile Information",
    posting_inappropriate_content: "Posting Inappropriate Content",
    other: "Other",
  };

  const descriptions = {
    bot: "Non-human activities or automated interactions.",
    impersonation: "Posing as another individual or a notable entity.",
    inappropriate_profile: "Deceptive bios, inappropriate profile visuals, or misleading details.",
    posting_inappropriate_content: "Continuous sharing of explicit, misleading, or harmful content.",
    other: "Issues not addressed by the above categories.",
  };

  return buildDialog(reasons, descriptions);
};

const buildDialog = (reasons, descriptions) => {
  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex flex-column gap-3">
        <div className="d-flex flex-row gap-2">
          <h4>Report {type}</h4>
        </div>
        <div className="d-flex flex-row gap-2">
          <span>Tell us more about why this {type} is problematic.</span>
        </div>
      </div>
      <div className="d-flex flex-column gap-3">
        {Object.keys(reasons).map((reason) => {
          return (
            <div className="d-flex flex-row gap-2">
              <Widget
                src="near/widget/DIG.Button"
                props={{
                  variant: "secondary",
                  fill: "ghost",
                  size: "large",
                  onClick: () => submitAndClose(reason),
                  label: (
                    <ButtonLabel>
                      <Reason>{reasons[reason]}</Reason>
                      <Description>{descriptions[reason]}</Description>
                    </ButtonLabel>
                  ),
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="d-flex flex-row gap-2">
        <InfoText>
          <i className="ph-bold ph-info" /> Unsure? Review our community{" "}
          <a href="https://near.org/terms" target="_blank">
            content policies.
          </a>
          .
        </InfoText>
      </div>
    </div>
  );
};

const buildContent = (type) => {
  if (type === "Account") {
    return buildAccountReportOptions();
  } else {
    return buildContentReportOptions();
  }
};

const dialogStyles = {
  maxWidth: "500px",
  borderRadius: "14px",
};

const ButtonLabel = styled.div`
  text-align: left;
  padding: 1em;
  max-width: 400px;
  margin-bottom: 0.5em;
`;
const Reason = styled.div`
  padding-bottom: 0.5em;
`;
const Description = styled.div`
  font-weight: 400;
  color: #999;
`;
const InfoText = styled.div`
  color: #555;
  padding: 1em;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin: 0.5em 0.5em 0.5em 3em;
  color: #777;
  font-size: 1em;
`;

return (
  <Widget
    src="${REPL_ACCOUNT}/widget/DIG.Dialog"
    props={{
      type: "dialog",
      description: buildContent(type),
      onCancel: closeModal,
      open,
      contentStyles: dialogStyles,
      actionButtons: <></>,
    }}
  />
);
