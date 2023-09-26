let {
  onReport,
  reportedAccountId,
  contentModerationFlagValue,
  ...forwardedProps
} = props;

const profileUrl = `#/${REPL_ACCOUNT}/widget/ProfilePage?accountId=${reportedAccountId}`;

let getFlaggedAccountsList;

// copied from Moderate.jsx so maybe it's wrong
if (forwardedProps.open) {
  getFlaggedAccountsList = Social.get(
    `${context.accountId}/moderate/users`,
    "optimistic"
  );
}

const socialSet = (index) =>
  Social.set(index, {
    onCommit: () => {
      onReport && onReport();
    },
    onCancel: () => onOpenChange(false),
  });

const reportAccount = () => {
  socialSet({
    index: {
      flag: JSON.stringify({
        key: "main",
        value: contentModerationFlagValue,
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

return (
  <Widget
    src="${REPL_ACCOUNT}/widget/DIG.Dialog"
    props={{
      ...forwardedProps,
      type: "alert",
      title: "Do you want to hide all posts of this account?",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
      onCancel: reportAccount,
      onConfirm: reportAccountWithPosts,
      enableCloseButton: true,
    }}
  />
);
