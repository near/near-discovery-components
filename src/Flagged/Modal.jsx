let {
  onReport,
  reportedAccountId,
  contentModerationFlagValue,
  ...forwardedProps
} = props;

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
  socialSet({
    index: {
      moderate: {
        [reportedAccountId]: "report",
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
