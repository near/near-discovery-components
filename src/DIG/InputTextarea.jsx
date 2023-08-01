let { minHeight, ...forwardedProps } = props;

return (
  <Widget
    src="near/widget/DIG.Input"
    props={{
      style: {
        minHeight: props.minHeight,
        ...props.style,
      },
      textarea: true,
      ...props,
    }}
  />
);
