const { buildData, title, onCommit } = props;
const isSet = props.isSet ?? false;
const disabled = props.disabled ?? false;
const type = props.type ?? "content";

if (!buildData || !title) {
  return "";
}

State.init({
  loading: false,
  isSetOptimistic: isSet,
});

const submitClick = (event, reason) => {
  if (state.loading) {
    return;
  }

  State.update({
    loading: true,
    isSetOptimistic: !isSet,
  });

  Social.set(buildData(reason), {
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
    },
  });
  if (event) event.preventDefault();
};

const [showModal, setShowModal] = useState(false);
const showReportModal = (e) => {
  setShowModal(true);
  if (e) e.preventDefault();
};
const closeModal = (e) => {
  setShowModal(false);
  if (e) e.preventDefault();
};

const renderButton = () => (
  <>
    <Widget
      src="near/widget/DIG.Button"
      props={{
        label: title,
        disabled: !context.accountId || state.loading || disabled,
        onClick: showReportModal,
        iconLeft: state.loading ? "bi-arrow-clockwise" : props.iconLeft,
        iconRight: state.loading ? "" : props.iconRight,
        variant: props.variant ?? "secondary",
        fill: props.fill ?? "solid",
        size: props.size ?? "small",
      }}
    />
    <Widget
      src="${REPL_ACCOUNT}/widget/Moderation.ReasonDialog"
      props={{
        closeModal,
        open: showModal,
        submitClick,
        type,
      }}
    />
  </>
);

if (props.tooltip) {
  return (
    <Widget
      src="near/widget/DIG.Tooltip"
      props={{
        content: <span style={{ whiteSpace: "pre-line" }}>{props.tooltip}</span>,
        trigger: renderButton(),
      }}
    />
  );
} else {
  return renderButton();
}
