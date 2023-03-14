const accountId = props.accountId;
const profile = props.profile || Social.get(`${accountId}/profile/**`, "final");
const tags = Object.keys(profile.tags || {});

const handleOnMouseEnter = () => {
  State.update({ show: true });
};
const handleOnMouseLeave = () => {
  State.update({ show: false });
};

State.init({
  show: false,
});

const CardWrapper = styled.div`
  z-index: 100;
  padding: 6px;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  gap: 12px;
  width: 275px;
  border-radius: 12px;
  z-index: 1070;
  background: #fff;
  border: 1px solid #ECEEF0;
  box-shadow: 0 0 20px rgba(0,0,0,0.2);
  padding: 12px;
`;

const FollowButtonWrapper = styled.div`
  width: 100%;
  
  div, button {
    width: 100%;
  }
`;

const overlay = (
  <CardWrapper>
    <Card onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave}>
      <Widget
        src="calebjacob.near/widget/AccountProfile"
        props={{ accountId: props.accountId, profile, noOverlay: true }}
      />

      <Widget
        src="calebjacob.near/widget/Tags"
        props={{ tags, scroll: true }}
      />

      {!!context.accountId && context.accountId !== props.accountId && (
        <FollowButtonWrapper>
          <Widget
            src="calebjacob.near/widget/FollowButton"
            props={{ accountId: props.accountId }}
          />
        </FollowButtonWrapper>
      )}
    </Card>
  </CardWrapper>
);

return (
  <OverlayTrigger
    show={state.show}
    trigger={["hover", "focus"]}
    delay={{ show: 250, hide: 300 }}
    placement={props.placement || "auto"}
    overlay={overlay}
  >
    <div
      className={props.inline ? "d-inline-flex" : ""}
      style={{ verticalAlign: props.inline ? "baseline" : "" }}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
    >
      {props.children || "Hover Me"}
    </div>
  </OverlayTrigger>
);
