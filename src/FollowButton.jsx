if (
  !props.accountId ||
  !context.accountId ||
  context.accountId === props.accountId
) {
  return "";
}

const followEdge = Social.keys(
  `${context.accountId}/graph/follow/${props.accountId}`,
  undefined,
  {
    values_only: true,
  }
);

const inverseEdge = Social.keys(
  `${props.accountId}/graph/follow/${context.accountId}`,
  undefined,
  {
    values_only: true,
  }
);

const loading = followEdge === null || inverseEdge === null;
const isFollowing = Object.keys(followEdge || {}).length > 0;
const isInverse = Object.keys(inverseEdge || {}).length > 0;

const type = follow ? "unfollow" : "follow";

const data = {
  graph: { follow: { [props.accountId]: isFollowing ? null : "" } },
  index: {
    graph: JSON.stringify({
      key: "follow",
      value: {
        type,
        accountId: props.accountId,
      },
    }),
    notify: JSON.stringify({
      key: props.accountId,
      value: {
        type,
      },
    }),
  },
};

const Wrapper = styled.div`
  .follow-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 16px;
    height: 32px;
    border-radius: 100px;
    font-weight: 600;
    font-size: 12px;
    line-height: 15px;
    text-align: center;
    cursor: pointer;
    background: #FBFCFD;
    border: 1px solid #D7DBDF;
    color: #006ADC !important;
    white-space: nowrap;

    &:hover,
    &:focus {
      background: #ECEDEE;
      text-decoration: none;
      outline: none;
    }

    i {
      color: #7E868C;
    }

    .bi-16 {
      font-size: 16px;
    }
  }
`;

return (
  <Wrapper className={props.className}>
    <CommitButton disabled={loading} className="follow-button" data={data}>
      {isFollowing && <i className="bi-16 bi bi-check"></i>}
      {isFollowing ? "Following" : isInverse ? "Follow Back" : "Follow"}
    </CommitButton>
  </Wrapper>
);
