// forked from devhub.near/widget/devhub.components.organism.Configurator
const Struct = VM.require("devhub.near/widget/core.lib.struct");

if (!Struct) {
  return <p>Loading modules...</p>;
}

const { namespace, entityType } = props;
const passthroughFieldUpdate = ({ input, lastKnownValue, params }) => {
  return input;
};

const useForm = ({ initialValues, onUpdate, stateKey }) => {
  const initialFormState = {
    hasUnsubmittedChanges: false,
    values: initialValues ?? {},
  };

  const formState = state[stateKey] ?? null;

  const formReset = () =>
    State.update((lastKnownComponentState) => ({
      ...lastKnownComponentState,
      [stateKey]: initialFormState,
      hasUnsubmittedChanges: false,
    }));

  const formUpdate =
    ({ path, via: customFieldUpdate, ...params }) =>
    (fieldInput) => {
      const transformFn = (node) => {
        if (typeof customFieldUpdate === "function") {
          return customFieldUpdate({
            input: fieldInput?.target?.value ?? fieldInput,
            lastKnownValue: node,
            params,
          });
        } else {
          return Struct.defaultFieldUpdate({
            input: fieldInput?.target?.value ?? fieldInput,
            lastKnownValue: node,
            params,
          });
        }
      };
      const updatedValues = Struct.deepFieldUpdate(formState?.values ?? {}, path, (node) => transformFn(node));
      State.update((lastKnownComponentState) => ({
        ...lastKnownComponentState,
        [stateKey]: {
          hasUnsubmittedChanges: !Struct.isEqual(updatedValues, initialFormState.values),
          values: updatedValues,
        },
      }));

      if (typeof onUpdate === "function") {
        onUpdate(updatedValues);
      }
    };

  return {
    hasUnsubmittedChanges: formState?.hasUnsubmittedChanges ?? false,
    values: {
      ...(initialValues ?? {}),
      ...(formState?.values ?? {}),
    },
    reset: formReset,
    stateKey,
    update: formUpdate,
  };
};

const ValueView = styled.div`
  & > p {
    margin: 0;
  }
`;

const fieldParamsByType = {
  array: {
    name: "devhub.near/widget/devhub.components.molecule.Input",
    inputProps: { type: "text" },
  },

  boolean: {
    name: "devhub.near/widget/devhub.components.atom.Toggle",
  },

  string: {
    name: "devhub.near/widget/devhub.components.molecule.Input",
    inputProps: { type: "text" },
  },
  tags: {
    name: "mob.near/widget/TagsEditor",
    inputProps: { type: "text" },
  },
};

const renderInput = (
  key,
  form,
  { label, fieldProps, fieldKey, noop, style, order, format, inputProps },
  fieldType,
  fieldValue,
  isEditable,
) => {
  const isDisabled = noop ?? inputProps.disabled ?? false;
  if (fieldType === "tags") {
    return (
      <div
        className="d-flex flex-column align-items-start justify-content-evenly"
        style={{ order: order, width: "100%" }}
      >
        <span className="d-inline-flex gap-1 text-wrap">
          <span>{label}</span>
          {inputProps.required ? <span className="text-danger">*</span> : null}
        </span>
        <Widget
          src="${REPL_ACCOUNT}/widget/Entities.Template.Forms.TagsEditor"
          props={{
            value: fieldValue,
            placeholder: "training, foundation, supervised",
            setValue: form.update({ path: [key], via: passthroughFieldUpdate }),
            namespace,
            entityType,
          }}
        />
      </div>
    );
  }

  return (
    <Widget
      src={`${fieldParamsByType[fieldType].name}`}
      props={{
        ...fieldProps,
        className: ["w-100", fieldProps.className ?? "", isEditable && !noop ? "" : "d-none"].join(" "),

        disabled: isDisabled,
        format,
        key: `${fieldKey}--editable`,
        label,
        onChange: form.update({ path: [key] }),
        style: { ...style, order },

        value: fieldType === "array" && format === "comma-separated" ? fieldValue.join(", ") : fieldValue,

        inputProps: {
          ...(inputProps ?? {}),
          disabled: isDisabled,

          title: noop ?? false ? "Temporarily disabled due to technical reasons." : inputProps.title,

          ...(fieldParamsByType[fieldType].inputProps ?? {}),
          tabIndex: order,
        },
      }}
    />
  );
};

const defaultFieldsRender = ({ schema, form, isEditable }) => (
  <>
    {Object.entries(schema).map(([key, fieldSchema], idx) => {
      const { type, format, noop, label, order } = fieldSchema;
      const fieldKey = `${idx}-${key}`,
        fieldValue = form.values[key];

      const fieldType = type ?? (Array.isArray(fieldValue) ? "array" : typeof (fieldValue ?? ""));

      const viewClassName = [(fieldValue?.length ?? 0) > 0 ? "" : "text-muted", "m-0"].join(" ");

      return (
        <>
          <div
            className={["d-flex gap-3", isEditable || noop ? "d-none" : ""].join(" ")}
            key={fieldKey}
            style={{ order }}
          >
            <label className="fw-bold w-25">{label}</label>

            <ValueView className={[viewClassName, "w-75"].join(" ")}>
              {format !== "markdown" ? (
                <span>
                  {(fieldType === "array" && format === "comma-separated"
                    ? fieldValue.filter((string) => string.length > 0).join(", ")
                    : fieldValue
                  )?.toString?.() || "none"}
                </span>
              ) : (fieldValue?.length ?? 0) > 0 ? (
                <Widget
                  src={"devhub.near/widget/devhub.components.molecule.MarkdownViewer"}
                  props={{
                    text: fieldValue,
                  }}
                />
              ) : (
                <span>none</span>
              )}
            </ValueView>
          </div>

          {renderInput(key, form, fieldSchema, fieldType, fieldValue, isEditable)}
        </>
      );
    })}
  </>
);

const Configurator = ({
  actionsAdditional,
  cancelLabel,
  classNames,
  externalState,
  fieldsRender: customFieldsRender,
  formatter: toFormatted,
  isValid,
  isActive,
  onCancel,
  onChange,
  onSubmit,
  schema,
  submitIcon,
  submitLabel,
  hideSubmitBtn,
}) => {
  const fieldsRender = customFieldsRender || defaultFieldsRender;

  const initialValues = Struct.typeMatch(schema) ? Struct.pick(externalState ?? {}, Object.keys(schema)) : {};

  const form = useForm({ initialValues, onUpdate: onChange, stateKey: "form" });

  const formFormattedValues = toFormatted ? toFormatted(form.values) : form.values;

  const internalValidation = () =>
    Object.keys(schema).every((key) => {
      const fieldDefinition = schema[key];
      const value = form.values[key];
      if (!value || value.length === 0) {
        return !fieldDefinition.inputProps.required;
      } else if (fieldDefinition.inputProps.min && fieldDefinition.inputProps.min > value?.length) {
        return false;
      } else if (fieldDefinition.inputProps.max && fieldDefinition.inputProps.max < value?.length) {
        return false;
      } else if (fieldDefinition.inputProps.allowCommaAndSpace === false && /^[^,\s]*$/.test(value) === false) {
        return false;
      } else if (
        fieldDefinition.inputProps.validUrl === true &&
        /^(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(value) === false
      ) {
        return false;
      }
      return true;
    });

  const isFormValid = () => {
    return internalValidation() && (!isValid || isValid(formFormattedValues));
  };

  const onCancelClick = () => {
    form.reset();
    if (onCancel) onCancel();
  };

  const onSubmitClick = () => {
    if (onSubmit && isFormValid()) {
      onSubmit(formFormattedValues);
    }
  };

  return (
    <div className="flex-grow-1 d-flex flex-column gap-4">
      <div className={`d-flex flex-column gap-${isActive ? 1 : 4}`}>
        {fieldsRender({
          form,
          isEditable: isActive,
          schema,
        })}
      </div>
      {isActive && !hideSubmitBtn && (
        <div className="d-flex align-items-center justify-content-end gap-3 mt-auto">
          {actionsAdditional ? <div className="me-auto">{actionsAdditional}</div> : null}

          <Widget
            src={"devhub.near/widget/devhub.components.molecule.Button"}
            props={{
              classNames: { root: "btn-outline-danger shadow-none border-0" },
              label: cancelLabel || "Cancel",
              onClick: onCancelClick,
            }}
          />
          <Widget
            src={"devhub.near/widget/devhub.components.molecule.Button"}
            props={{
              classNames: { root: classNames.submit || "btn-success" },
              disabled: !form.hasUnsubmittedChanges || !isFormValid(),
              icon: submitIcon || {
                type: "bootstrap_icon",
                variant: "bi-check-circle-fill",
              },
              label: submitLabel || "Submit",
              onClick: onSubmitClick,
            }}
          />
        </div>
      )}
    </div>
  );
};

return Configurator(props);
