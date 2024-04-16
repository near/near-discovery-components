const { genSchema: genericGenSchema } = VM.require("${REPL_ACCOUNT}/widget/Entities.Template.GenericSchema");

const genSchema = (namespace, entityType) => {
  const title = "Favorite Car";

  const genericSchema = genericGenSchema(namespace, entityType, title);
  return {
    ...genericSchema,
    make: {
      type: "string",
      inputProps: {
        min: 2,
        max: 80,
        placeholder: `Make of your ${title}.`,
        required: true,
      },
      label: "Make",
      order: 6,
    },
    model: {
      type: "string",
      inputProps: {
        min: 2,
        max: 80,
        placeholder: `Model of your ${title}.`,
        required: true,
      },
      label: "Model",
      order: 7,
    },
    color: {
      type: "string",
      inputProps: {
        min: 2,
        max: 80,
        placeholder: `Blue, red, dragon wrap?`,
      },
      label: "Color",
      order: 8,
    },
  };
};

return { genSchema };
