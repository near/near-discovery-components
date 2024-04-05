const { accountId, blockHeight, parentFunctions, item } = props;
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

const moderate = (account, block, messageKey, action) => {
  const modifiedContentPath = contentPath.replace(/\//g, ".");

  const dataValue = block
    ? {
        [modifiedContentPath]: {
          [block]: action,
        },
      }
    : action;

  const data = {
    moderate: {
      [account]: dataValue,
    },
  };

  if (action !== "hide") {
    const indexValue = block
      ? {
          path: `${account}${contentPath}`,
          blockHeight: block,
          label: action,
        }
      : {
          path: account,
          label: action,
        };

    data.index = {
      moderation: JSON.stringify({
        key: "reported",
        value: indexValue,
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

const promoteToBlog = () => {
  if (state.loading) {
    return;
  }

  if (!context.accountId && props.requestAuthentication) {
    props.requestAuthentication();
    return;
  } else if (!context.accountId) {
    return;
  }

  State.update({
    loading: true,
  });

  const data = {
    index: {
      promote: JSON.stringify({
        key: context.accountId,
        value: {
          operation: "add",
          type: "blog",
          post: item,
          blockHeight,
        },
      }),
    },
  };

  Social.set(data, {
    onCommit: () => State.update({ loading: false }),
    onCancel: () =>
      State.update({
        loading: false,
      }),
  });
};

const buildMenu = (accountId, blockHeight) => {
  const hideSubmenu = [
    {
      name: "Mute " + accountId,
      iconLeft: "ph-bold ph-ear-slash",
      onSelect: () => moderate(accountId, null, "hideAccount", "hide"),
    },
  ];

  const reportSubmenu = [
    {
      name: "Report " + accountId,
      iconLeft: "ph-bold ph-warning-octagon",
      onSelect: () => showReportModal("Account"),
    },
  ];

  const promoteToBlogSubmenu = [];

  if (blockHeight) {
    promoteToBlogSubmenu.unshift({
      name: `Promote this ${capitalizedContentType} to Blog`,
      iconLeft: "ph-bold ph-article",
      onSelect: () => promoteToBlog(accountId, blockHeight),
    });

    hideSubmenu.unshift({
      name: "Hide this " + capitalizedContentType,
      iconLeft: "ph-bold ph-eye-slash",
      onSelect: () => moderate(accountId, blockHeight, "hideItem", "hide"),
    });
    reportSubmenu.unshift({
      name: "Report this " + capitalizedContentType,
      iconLeft: "ph-bold ph-warning-octagon",
      onSelect: () => showReportModal(capitalizedContentType),
    });
  }
  const menu = [
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

  if (item.path && item?.path?.includes("post/main")) {
    menu.unshift({
      name: "Promote",
      iconLeft: "ph-bold ph-arrow-up",
      disabled: !context.accountId,
      subMenuProps: {
        items: promoteToBlogSubmenu,
      },
    });
  }

  return menu;
};

// when set, value is the type of content to moderate (Account, Post or Comment)
const [showModal, setShowModal] = useState(null);
const showReportModal = (type) => {
  setShowModal(type);
};
const closeModal = () => {
  setShowModal(false);
};
const submitClick = (type, event, reason) => {
  if (type === "Account") {
    moderate(accountId, null, "reportAccount", reason);
  } else {
    moderate(accountId, blockHeight, "reportItem", reason);
  }
};

return (
  <>
    <Widget
      src="${REPL_ACCOUNT}/widget/DIG.DropdownMenu"
      props={{
        trigger: <i className="ph-bold ph-dots-three" />,
        items: buildMenu(accountId, blockHeight),
      }}
    />
    <Widget
      src="${REPL_ACCOUNT}/widget/Moderation.ReasonDialog"
      props={{
        closeModal,
        open: showModal,
        submitClick: submitClick.bind(null, showModal),
        type: showModal,
      }}
    />
  </>
);
