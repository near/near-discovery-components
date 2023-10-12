const accountId = props.accountId;
const blockHeight = props.blockHeight;
const parentFunctions = props.parentFunctions;

const confirmationMessages = {
  hidePost: {
    header: "Post Hidden",
    detail: "This post will no longer be shown to you.",
  },
  hideAccount: {
    header: "Account Muted",
    detail: "All posts from this account will be no longer be shown to you.",
  },
  reportPost: {
    header: "Post Reported for Moderation",
    detail:
      "The item will no longer be shown to you and will be reviewed. Thanks for helping our Content Moderators.",
  },
  reportAccount: {
    header: "Account Reported for Moderation",
    detail:
      "All posts from this account will no longer be shown to you and will be reviewed. Thanks for helping our Content Moderators.",
  },
};
const moderatePost = (account, block, action, messageKey) => {
  const data = {
    moderate: {
      [account]: {
        ".post.main": {
          [block]: action,
        },
      },
    },
  };
  if (action === "report") {
    data.index = {
      moderation: JSON.stringify({
        key: "reported",
        value: {
          path: `${account}/post/main`,
          blockHeight: block,
          label: action,
        },
      }),
    };
  }
  Social.set(data, {
    onCommit: () => {
      parentFunctions.resolveHidePost(confirmationMessages[messageKey]);
    },
  });
};

const moderateAccount = (account, action, message) => {
  const data = {
    moderate: {
      [account]: action,
    },
  };
  if (action === "report") {
    data.index = {
      moderation: JSON.stringify({
        key: "reported",
        value: {
          path: account,
          label: action,
        },
      }),
    };
  }
  Social.set(data, {
    onCommit: () => {
      alert(message);
    },
  });
};
return (
  <Widget
    src="near/widget/DIG.DropdownMenu"
    props={{
      trigger: <i className="ph-bold ph-dots-three-vertical" />,
      items: [
        {
          name: "Hide",
          iconLeft: "ph ph-eye-slash",
          disabled: !context.accountId || context.accountId === accountId,
          subMenuProps: {
            items: [
              {
                name: "Hide this Post",
                iconLeft: "ph ph-eye-slash",
                onSelect: () =>
                  moderatePost(accountId, blockHeight, "hide", "hidePost"),
              },
              {
                name: "Mute " + accountId,
                iconLeft: "ph ph-ear-slash",
                onSelect: () =>
                  moderateAccount(accountId, "hide", "hideAccount"),
              },
            ],
          },
        },
        {
          name: (
            <>
              <i className="ph ph-prohibit" style={{ color: "var(--red11)" }} />
              <span style={{ color: "red" }}>Report</span>
            </>
          ),
          disabled: !context.accountId || context.accountId === accountId,
          subMenuProps: {
            items: [
              {
                name: "Report this Post",
                iconLeft: "ph ph-warning-circle",
                onSelect: () =>
                  moderatePost(accountId, blockHeight, "report", "reportPost"),
              },
              {
                name: "Report " + accountId,
                iconLeft: "ph ph-prohibit",
                onSelect: () =>
                  moderateAccount(accountId, "report", "reportAccount"),
              },
            ],
          },
        },
        // {
        //   name: "Edit",
        //   iconLeft: "ph ph-pencil me-1",
        //   onSelect: parentFunctions.toggleEdit,
        //  },
      ],
    }}
  />
);
