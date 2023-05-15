// link without `gateway` won't work. You can pass "https://near.social/#" or "https://near.org"
const gateway = props.gateway ?? "https://near.org";
// passing `context.accountId` just for preview example.
const accountId = props.accountId || context.accountId || "near";
const name = props.name ?? "NotRealComponentName";

const Card = styled.a`
  border: 1px solid #d0d7de;

  gap: 5px;
  padding: 15px 20px 20px 20px;
  border-radius: 5px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #e9eaec;
    text-decoration: none;
  }
`;
const Text = styled.p`
  margin: 0;
  line-height: 20px;
  color: ${(p) => p.color ?? "#687076"};
  font-weight: ${(p) => (p.bold ? "600" : "400")};
  font-size: ${(p) => p.size ?? "14px"};
  overflow: ${(p) => (p.ellipsis ? "hidden" : "")};
  text-overflow: ${(p) => (p.ellipsis ? "ellipsis" : "")};
  white-space: nowrap;

  i {
    margin-right: 5px;
  }
`;

return (
  <Card href={`${gateway}/${accountId}/widget/${name}`} target="_blank">
    <Text as="h3" size="18px" color="#58a6ff" ellipsis bold>
      {name}
    </Text>
    <Text>{`${accountId}/widget/${name}`}</Text>

    <div className="d-flex align-items-center g-3 mt-3">
      <Text
        as="div"
        className="d-flex align-items-center"
        title={`${props.commits.length || 0} commits`}
      >
        <i className="ph ph-git-commit" style={{ fontSize: "20px" }} />
        <span>{props.commits.length || 0}</span>
      </Text>

      <Text as="div" className="d-flex align-items-center">
        <i
          className="ph ph-dot"
          style={{ fontSize: "20px", marginRight: 0, fontWeight: 600 }}
        />
      </Text>

      <Text as="div" className="d-flex align-items-center">
        <i className="ph ph-clock" style={{ fontSize: "20px" }} />
        <Widget
          src={`mob.near/widget/TimeAgo`}
          props={{
            blockHeight: props.commits[props.commits.length - 1],
            className: "description",
          }}
        />
      </Text>
    </div>
  </Card>
);
