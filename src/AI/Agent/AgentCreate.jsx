const { typeMatch } = VM.require("devhub.near/widget/core.lib.struct");

if (!typeMatch) {
  return <p>Loading modules...</p>;
}

const { data, onSubmit, onCancel } = props;
const onSubmitDefault = (formValues) => {
  const { name, ...rest } = formValues;
  const agent = { [name]: rest };
  Social.set({ agent: agent }, { force: true });
};
const onSubmitFunction = onSubmit ?? onSubmitDefault;

const AgentInputsPartialSchema = {
  name: {
    inputProps: {
      min: 2,
      max: 80,
      allowCommaAndSpace: false,
      placeholder: "Choose a unique identifier for your agent. Example: travel-agent.",
      required: true,
    },
    label: "Name",
    order: 1,
  },
  displayName: {
    inputProps: {
      min: 2,
      max: 255,
      placeholder: "The name that will be displayed to users.",
      required: true,
    },
    label: "Display Name",
    order: 2,
  },
  prompt: {
    inputProps: {
      min: 2,
      max: 8192,
      placeholder: "The prompt for the agent.",
      required: true,
    },
    multiline: true,
    label: "Prompt",
    order: 3,
  },
  // preferredProvider: {
  //     inputProps: {
  //         min: 2,
  //         max: 255,
  //         placeholder: "The preferred provider for the agent.",
  //         required: false,
  //     },
  //     label: "Preferred Provider",
  //     order: 4,
  // },
  // preferredModel: {
  //   inputProps: {
  //     min: 2,
  //     max: 255,
  //     placeholder: "The preferred model for the agent.",
  //     required: false,
  //   },
  //   label: "Preferred Model",
  //   order: 5,
  // },
  // variables: {
  //     inputProps: {
  //         min: 2,
  //         max: 255,
  //         placeholder: "The variables for the agent.",
  //         required: false,
  //     },
  //     label: "A comma separated list of variables that should be passed into the prompt. Example: ['rfp', 'proposal'].",
  //     order: 6,
  // },
  // component: {
  //   inputProps: {
  //     min: 2,
  //     max: 255,
  //     placeholder: "The component used to run the agent for the agent.",
  //     required: false,
  //   },
  //   label: "Component",
  //   order: 7,
  // },
  logoUrl: {
    inputProps: {
      min: 4,
      max: 255,
      placeholder: "The logo URL for the agent.",
      required: false,
    },

    label: "Logo URL",
    order: 8,
  },
  // tools: {
  //     inputProps: {
  //         min: 2,
  //         max: 255,
  //         placeholder: "A JSON array of Tools or Functions the agent should have access to.",
  //         required: false,
  //     },
  //
  //     label: "Tools",
  //     order: 9,
  // },
  // properties: {
  //   inputProps: {
  //     min: 2,
  //     max: 1024,
  //     placeholder: "JSON properties for the agent.",
  //     required: false,
  //   },
  //
  //   label: "Properties",
  //   order: 10,
  // },
};

const agentInputsValidator = (formValues) =>
  typeMatch(formValues) && Object.values(formValues).every((value) => typeof value === "string" && value.length > 0);

return (
  <Widget
    src="devhub.near/widget/devhub.components.organism.Configurator"
    props={{
      heading: "Agent information",
      fullWidth: true,
      isActive: true,
      isUnlocked: true,
      isValid: agentInputsValidator,
      onSubmit: onSubmitFunction,
      schema: AgentInputsPartialSchema,
      submitIcon: {
        type: "bootstrap_icon",
        variant: "bi-rocket-takeoff-fill",
      },
      submitLabel: data ? "Save" : "Launch",
      onCancel: onCancel,
      externalState: data,
    }}
  />
);
