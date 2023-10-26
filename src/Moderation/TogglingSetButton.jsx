const data = props.data;
const title = props.title;
const onCommit = props.onCommit;
const onCancel = props.onCancel;
const isSet = props.isSet ?? false;

if (!data || !title) {
  return "";
}

State.init({
  loading: false,
  isSetOptimistic: isSet,
});

const buttonClick = () => {
  if (state.loading) {
    return;
  }

  State.update({
    loading: true,
    isSetOptimistic: !isSet,
  });

  Social.set(data, {
    force: true,
    onCommit: () => {
      State.update({ loading: false, isSet: !isSet });
      onCommit();
    },
    onCancel: () => {
      State.update({
        loading: false,
        isSetOptimistic: !state.isSetOptimistic,
      });
      onCancel();
    },
  });
};

const renderButton = () => (
  <Widget
    src="near/widget/DIG.Button"
    props={{
      label: title,
      disabled: !context.accountId || state.loading,
      onClick: buttonClick,
      iconLeft: state.loading ? "bi-arrow-clockwise" : props.iconLeft,
      iconRight: state.loading ? "" : props.iconRight,
      variant: props.variant ?? "secondary",
      fill: props.fill ?? "solid",
      size: props.size ?? "small",
    }}
  />
);

if (props.tooltip) {
  return (
    <Widget
      src="near/widget/DIG.Tooltip"
      props={{
        content: (
          <span style={{ whiteSpace: "pre-line" }}>{props.tooltip}</span>
        ),
        trigger: renderButton(),
      }}
    />
  );
} else {
  return renderButton();
}
