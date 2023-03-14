const limit = 5;
const follows =
  Social.index("graph", "follow", {
    limit,
    order: "desc",
  }) || [];

const Wrapper = styled.div`
  display: grid;
  gap: 24px;
`;

const H2 = styled.h2`
  font-size: 19px;
  line-height: 22px;
  color: #11181C;
  margin: 0;
`;

const Items = styled.div`
  display: grid;
  gap: 18px;
`;

const Item = styled.div`
  display: grid;
  grid-template-columns: 2fr 36px 2fr;
  gap: 12px;
  align-items: center;
  width: 100%;
  overflow: hidden;

  > * {
    min-width: 0
  }
`;

const Text = styled.p`
  margin: 0;
  font-size: 10px;
  line-height: 14px;
  color: #687076;
  font-weight: 400;
  flex-shrink: 0;
  white-space: nowrap;
  text-align: center;
  overflow: hidden;

  i {
    font-size: 16px;
  }
`;

return (
  <Wrapper>
    <H2>Follow Activity</H2>

    <Items>
      {follows.map((item, i) => (
        <Item key={i}>
          <Widget
            src="calebjacob.near/widget/AccountProfile"
            props={{ accountId: item.accountId, hideAccountId: true }}
          />

          <Text small bold>
            <i className="bi bi-arrow-right"></i>
            <br />
            <Widget
              src="mob.near/widget/TimeAgo"
              props={{ blockHeight: item.blockHeight }}
            />
          </Text>

          <Widget
            src="calebjacob.near/widget/AccountProfile"
            props={{ accountId: item.value.accountId, hideAccountId: true }}
          />
        </Item>
      ))}
    </Items>
  </Wrapper>
);
