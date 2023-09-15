let { onReport, open, reportedAccountId, onOpenChange } = props;

const profileUrl = `#/${REPL_ACCOUNT}/widget/ProfilePage?accountId=${reportedAccountId}`;

// copied from Moderate.jsx so maybe it's wrong
const getFlaggedAccountsList = Social.get(
  `${context.accountId}/moderate/users`,
  "optimistic"
);

const socialSet = (index) =>
  Social.set(index, {
    onCommit: () => {
      onReport && onReport();
    },
    onCancel: () => onOpenChange(false),
  });

const reportAccount = () => {
  const contentModerationItem = {
    type: "social",
    path: profileUrl,
    reportedBy: context.accountId,
  };

  socialSet({
    index: {
      flag: JSON.stringify({
        key: "main",
        value: contentModerationItem,
      }),
    },
  });
};

const reportAccountWithPosts = () => {
  const flaggedAccountsList = getFlaggedAccountsList
    ? JSON.parse(getFlaggedAccountsList)
    : [];
  const flaggedAccountsListSet = new Set(flaggedAccountsList);
  const filterFlaggedAccounts = [
    ...flaggedAccountsListSet.add(reportedAccountId),
  ];

  socialSet({
    index: {
      moderate: {
        [filterFlaggedAccounts]: "",
      },
    },
  });
};

const Cancel = () => (
  <Widget
    src="${REPL_ACCOUNT}/widget/DIG.Button"
    props={{
      label: "No",
      variant: "secondary",
      onClick: reportAccount,
    }}
  />
);

const Confirm = () => (
  <Widget
    src="${REPL_ACCOUNT}/widget/DIG.Button"
    props={{
      label: "Yes",
      variant: "primary",
      onClick: reportAccountWithPosts,
    }}
  />
);

return (
  <Widget
    src="${REPL_ACCOUNT}/widget/DIG.Dialog"
    props={{
      type: "alert",
      title: "Do you want to hide all posts of this account?",
      cancelButton: <Cancel />,
      confirmButton: <Confirm />,
      open,
    }}
  />
);
