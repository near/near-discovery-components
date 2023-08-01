let { minHeight, style, ...forwardedProps } = props;

return (
  <Widget
    src="near/widget/DIG.Input"
    props={{
      style: {
        minHeight,
        ...style,
      },
      textarea: true,
      ...forwardedProps,
    }}
  />
);
