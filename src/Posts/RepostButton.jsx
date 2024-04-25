const item = props.item;

if (!item) {
  return "";
}

const reposts = Social.index("repost", item);

const dataLoading = reposts === null;

const repostsByUsers = Object.fromEntries(
  (reposts || []).filter((repost) => repost.value.type === "repost").map((repost) => [repost.accountId, repost]),
);

if (state.hasRepost === true) {
  repostsByUsers[context.accountId] = {
    accountId: context.accountId,
  };
}

const accountsWithReposts = Object.keys(repostsByUsers);
const hasRepost = context.accountId && !!repostsByUsers[context.accountId];

const repostClick = () => {
  if (state.loading) {
    return;
  }
  State.update({
    loading: true,
  });
  const reposts = [
    {
      key: "main",
      value: {
        type: "repost",
        item,
      },
    },
  ];
  if (!hasRepost) {
    reposts.push({
      key: item,
      value: {
        type: "repost",
      },
    });
  }
  const data = {
    index: {
      repost: JSON.stringify(reposts),
    },
  };

  if (!hasRepost && props.notifyAccountId) {
    data.index.notify = JSON.stringify({
      key: props.notifyAccountId,
      value: {
        type: "repost",
        item,
      },
    });
  }
  Social.set(data, {
    onCommit: () => State.update({ loading: false, hasRepost: true }),
    onCancel: () => State.update({ loading: false }),
  });
};

const Button = styled.button`
  border: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #687076;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  cursor: pointer;
  background: none;
  padding: 6px;
  transition: color 200ms;

  i {
    font-size: 18px;
    transition: color 200ms;
  }

  &:hover,
  &:focus {
    outline: none;
    color: #11181c;
  }
`;

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
  // Hiding repost until dataplatform indexers are ready
  const menu = [
    // {
    //   name: "Activity Feed",
    //   disabled: !context.accountId,
    //   onSelect: () => repostClick(),
    // },
  ];

  if (item.path && item?.path?.includes("post/main")) {
    menu.unshift({
      name: "My Blog",
      disabled: !context.accountId,
      onSelect: () => promoteToBlog(accountId, blockHeight),
    });
  }

  return menu;
};

return (
  <>
    <OverlayTrigger placement="top" overlay={<Tooltip>{!state.hasRepost ? "Repost" : "You've reposted"}</Tooltip>}>
      <Widget
        src="${REPL_ACCOUNT}/widget/DIG.DropdownMenu"
        props={{
          trigger: !state.hasRepost ? <i className="bi bi-repeat" /> : <i className="bi bi-check2" />,
          items: buildMenu(accountId, blockHeight),
        }}
      />
      <Button type="button" title="Repost" aria-label="Repost" onClick={repostClick}>
        {!state.hasRepost ? <i className="bi bi-repeat" /> : <i className="bi bi-check2" />}
      </Button>
    </OverlayTrigger>
  </>
);
