const accountId = props.accountId;
const blockHeight = props.blockHeight;
const parentFunctions = props.parentFunctions;
const contentType = props.contentType || "post";
const contentPath = props.contentPath || "/post/main";
const capitalizedContentType = contentType.charAt(0).toUpperCase() + contentType.slice(1);

const confirmationMessages = {
  savingData: {
    header: "Saving Data",
    detail: "Storing your action.",
  },
  hideItem: {
    header: capitalizedContentType + " Hidden",
    detail: `This ${contentType} will no longer be shown to you.`,
  },
  hideAccount: {
    header: "Account Muted",
    detail: `All content from this account will be no longer be shown to you.`,
  },
  reportItem: {
    header: capitalizedContentType + " Reported for Moderation",
    detail: "The item will no longer be shown to you and will be reviewed. Thanks for helping our Content Moderators.",
  },
  reportAccount: {
    header: "Account Reported for Moderation",
    detail:
      "All content from this account will no longer be shown to you and will be reviewed. Thanks for helping our Content Moderators.",
  },
};
const moderateItem = (account, block, action, messageKey) => {
  const modifiedContentPath = contentPath.replace(/\//g, ".");
  const data = {
    moderate: {
      [account]: {
        [modifiedContentPath]: {
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
          path: `${account}${contentPath}`,
          blockHeight: block,
          label: action,
        },
      }),
    };
  }
  if (parentFunctions.optimisticallyHideItem) {
    parentFunctions.optimisticallyHideItem(confirmationMessages["savingData"]);
  }
  Social.set(data, {
    onCommit: () => {
      parentFunctions.resolveHideItem(confirmationMessages[messageKey]);
    },
    onCancel: () => {
      parentFunctions.cancelHideItem();
    },
  });
};

const moderateAccount = (account, action, messageKey) => {
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
  if (parentFunctions.optimisticallyHideItem) {
    parentFunctions.optimisticallyHideItem(confirmationMessages["savingData"]);
  }
  Social.set(data, {
    onCommit: () => {
      parentFunctions.resolveHideItem(confirmationMessages[messageKey]);
    },
    onCancel: () => {
      parentFunctions.cancelHideItem();
    },
  });
};

const buildMenu = (accountId, blockHeight, parentFunctions) => {
  const hideSubmenu = [
    {
      name: "Mute " + accountId,
      iconLeft: "ph-bold ph-ear-slash",
      onSelect: () => moderateAccount(accountId, "hide", "hideAccount"),
    },
  ];

  const reportSubmenu = [
    {
      name: "Report " + accountId,
      iconLeft: "ph-bold ph-warning-octagon",
      onSelect: () => moderateAccount(accountId, "report", "reportAccount"),
    },
  ];

  if (blockHeight) {
    hideSubmenu.unshift({
      name: "Hide this " + capitalizedContentType,
      iconLeft: "ph-bold ph-eye-slash",
      onSelect: () => moderateItem(accountId, blockHeight, "hide", "hideItem"),
    });
    reportSubmenu.unshift({
      name: "Report this " + capitalizedContentType,
      iconLeft: "ph-bold ph-warning-octagon",
      onSelect: () => moderateItem(accountId, blockHeight, "report", "reportItem"),
    });
  }
  return [
    {
      name: "Hide",
      iconLeft: "ph-bold ph-eye-slash",
      disabled: !context.accountId || context.accountId === accountId,
      subMenuProps: {
        items: hideSubmenu,
      },
    },
    {
      name: (
        <>
          <i className="ph-bold ph-warning-octagon" style={{ color: "#D95C4A" }} />
          <span style={{ color: "#D95C4A" }}>Report</span>
        </>
      ),
      disabled: !context.accountId || context.accountId === accountId,
      subMenuProps: {
        items: reportSubmenu,
      },
    },
    // {
    //   name: "Edit",
    //   iconLeft: "ph-bold ph-pencil me-1",
    //   onSelect: parentFunctions.toggleEdit,
    //  },
  ];
};

return (
  <Widget
    src="${REPL_ACCOUNT}/widget/DIG.DropdownMenu"
    props={{
      trigger: <i className="ph-bold ph-dots-three" />,
      items: buildMenu(accountId, blockHeight, parentFunctions),
    }}
  />
);
