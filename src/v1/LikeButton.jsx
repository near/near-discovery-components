const item = props.item;

if (!item) {
  return "";
}

const likes = Social.index("like", item);

const dataLoading = likes === null;

const likesByUsers = {};

(likes || []).forEach((like) => {
  if (like.value.type === "like") {
    likesByUsers[like.accountId] = like;
  } else if (like.value.type === "unlike") {
    delete likesByUsers[like.accountId];
  }
});
if (state.hasLike === true) {
  likesByUsers[context.accountId] = {
    accountId: context.accountId,
  };
} else if (state.hasLike === false) {
  delete likesByUsers[context.accountId];
}

const accountsWithLikes = Object.keys(likesByUsers);
const hasLike = context.accountId && !!likesByUsers[context.accountId];
const totalLikes = accountsWithLikes.length;

const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #687076;
  font-size: 14px;
  line-height: 17px;
  cursor: pointer;
  transition: color 200ms;

  &:hover, &:focus {
    outline: none;
    color: #11181C;
  }
`;

  const LikeButton = styled.button`
  border: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  padding: 6px;
  color: inherit;

  i {
    font-size: 16px;

    &.bi-heart-fill {
      color: #E5484D !important;
    }
  }
`;

const likeClick = () => {
  if (state.loading) {
    return;
  }
  State.update({
    loading: true,
  });
  const data = {
    index: {
      like: JSON.stringify({
        key: item,
        value: {
          type: hasLike ? "unlike" : "like",
        },
      }),
    },
  };

  if (!hasLike && props.notifyAccountId) {
    data.index.notify = JSON.stringify({
      key: props.notifyAccountId,
      value: {
        type: "like",
        item,
      },
    });
  }
  Social.set(data, {
    onCommit: () => State.update({ loading: false, hasLike: !hasLike }),
    onCancel: () => State.update({ loading: false }),
  });
};

const title = hasLike ? "Unlike" : "Like";

return (
  <Wrapper>
    <LikeButton
      disabled={state.loading || dataLoading || !context.accountId}
      title={title}
      onClick={likeClick}
    >
      {state.loading || dataLoading ? (
        <span
          className="spinner-grow spinner-grow-sm p-2"
          role="status"
          aria-hidden="true"
        />
      ) : (
        <i className={`bi ${hasLike ? "bi-heart-fill" : "bi-heart"}`} />
      )}
    </LikeButton>
    {totalLikes == 0 ? (
      "0"
    ) : (
      <Widget src="mob.near/widget/LikeButton.Faces" props={{ likesByUsers }} />
    )}
  </Wrapper>
);
