const { data, onSubmit, onCancel, cancelLabel, schema } = props;
const entityType = schema.entityType;
const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const capitalizedEntityType = capitalize(entityType);
if (!schema) {
  return <>Missing properties schema or entityType</>;
}
const displayedSchema = Object.keys(schema)
  .filter((key) => typeof schema[key] === "object" && schema[key]?.displayType !== "hidden")
  .reduce((acc, key) => {
    if (key) acc[key] = schema[key];
    return acc;
  }, {});
const namespace = schema.namespace;
const onSubmitDefault = (formValues) => {
  const { name, ...rest } = formValues;
  const entity = { [name]: rest };
  const data = namespace ? { [namespace]: { [entityType]: entity } } : { [entityType]: entity };
  Social.set(data, { force: true });
};
const onSubmitFunction = onSubmit ?? onSubmitDefault;

const inputsValidator = (formValues) =>
  formValues !== null &&
  typeof formValues === "object" &&
  !Array.isArray(formValues) &&
  Object.keys(schema).every((key) => {
    const val = schema[key];
    const required = val?.inputProps?.required;
    return !required || typeof formValues[key] === "string";
  });

const actionType = data ? (data.accountId === context.accountId ? "Edit" : "Fork") : "Create";

const initialValues = (schema, data) => {
  const initial = data ?? {};
  Object.keys(schema).forEach((key) => {
    const fieldProps = schema[key];
    if (!data[key] && fieldProps.displayType !== "hidden" && fieldProps.type === "string") {
      initial[key] = "";
    }
  });
  return initial;
};

return (
  <Widget
    src="${REPL_DEVHUB}/widget/devhub.components.organism.Configurator"
    props={{
      heading: `${actionType} ${capitalizedEntityType}`,
      fullWidth: true,
      isActive: true,
      isUnlocked: true,
      isValid: inputsValidator,
      onSubmit: onSubmitFunction,
      schema: displayedSchema,
      submitIcon: {
        type: "bootstrap_icon",
        variant: "bi-rocket-takeoff-fill",
      },
      submitLabel: data ? "Save" : "Launch",
      onCancel: onCancel,
      cancelLabel: cancelLabel,
      externalState: initialValues(schema, data),
    }}
  />
);
