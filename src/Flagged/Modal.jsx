let {
  onReport,
  onReportCancel,
  reportedAccountId,
  contentModerationFlagValue,
  ...forwardedProps
} = props;

const socialSet = (index) =>
  Social.set(index, {
    onCommit: () => {
      onReport && onReport();
    },
    onCancel: () => {
      onReportCancel && onReportCancel();
    },
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
      moderation: JSON.stringify({
        key: "reported",
        value: {
          path: reportedAccountId,
          label: "report",
        },
      }),
    },
    moderation: {
      [reportedAccountId]: "report",
    },
  });
};

if (!forwardedProps.open) return <></>;

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
      onOpenChange: onReportCancel,
    }}
  />
);
