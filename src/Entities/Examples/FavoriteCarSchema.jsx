const genSchema = (namespace, entityType) => {
  const title = "Favorite Car";
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
        placeholder: `An image of your ${title}.`,
        required: false,
      },

      label: "Logo URL",
      order: 5,
    },
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
