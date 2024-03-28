const genSchema = (namespace, entityType) => {
  const title = "Component";
  return {
    namespace: namespace,
    entityType: entityType,
    entityTitle: title,
    id: {
      type: "integer",
      displayType: "hidden",
    },
    accountId: {
      type: "text",
      displayType: "hidden",
    },
    name: {
      type: "string",
      inputProps: {
        min: 2,
        max: 80,
        allowCommaAndSpace: false,
        placeholder: `Choose a unique identifier for your ${title}.`,
        required: true,
      },
      label: "Name",
      order: 1,
    },
    displayName: {
      type: "string",
      inputProps: {
        min: 2,
        max: 255,
        placeholder: "The name that will be displayed to users.",
        required: true,
      },
      label: "Display Name",
      order: 2,
    },
    logoUrl: {
      type: "string",
      inputProps: {
        min: 4,
        max: 255,
        placeholder: `The logo URL for the ${title}.`,
        required: false,
      },

      label: "Logo URL",
      order: 5,
    },
  };
};

return { genSchema };
