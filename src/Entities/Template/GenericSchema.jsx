const humanize = (str) => {
  if (!str) return "";
  return str.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
};

const genSchema = (namespace, entityType, entityTitle) => {
  const title = entityTitle || humanize(entityType);
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
    displayName: {
      type: "string",
      inputProps: {
        min: 2,
        max: 255,
        placeholder: "The name that will be displayed to users.",
        required: true,
      },
      label: "Display Name",
      order: 1,
    },
    name: {
      type: "string",
      inputProps: {
        min: 2,
        max: 80,
        allowCommaAndSpace: false,
        placeholder: `A unique identifier. No spaces or commas.`,
        required: true,
      },
      label: "Unique System Name",
      order: 2,
    },
    tags: {
      type: "tags",
      inputProps: {
        min: 1,
        max: 255,
        placeholder: `Tags: training, foundation, supervised, etc.`,
        required: false,
      },
      label: "Tags",
      order: 4,
    },
    logoUrl: {
      type: "image",
      inputProps: {
        min: 4,
        max: 255,
        placeholder: `A representative image. Enter a http URL or upload a file.`,
        required: false,
      },

      label: "Image",
      order: 5,
    },
  };
};

return { genSchema };
