const buildData = props.buildData;
const title = props.title;
const onCommit = props.onCommit;
const onCancel = props.onCancel;
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

const submitClick = (reason) => {
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
      onCancel();
    },
  });
};

const [showModal, setShowModal] = useState(false);
const showReportModal = () => {
  setShowModal(true);
};
const closeModal = () => {
  setShowModal(false);
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
