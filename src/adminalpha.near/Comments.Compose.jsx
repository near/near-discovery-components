if (!context.accountId) {
  return "";
}

const autocompleteEnabled = true;
const item = props.item;

State.init({
  image: {},
  text: props.initialText || "",
});

function extractMentions(text) {
  const mentionRegex =
    /@((?:(?:[a-z\d]+[-_])*[a-z\d]+\.)*(?:[a-z\d]+[-_])*[a-z\d]+)/gi;
  mentionRegex.lastIndex = 0;
  const accountIds = new Set();
  for (const match of text.matchAll(mentionRegex)) {
    if (
      !/[\w`]/.test(match.input.charAt(match.index - 1)) &&
      !/[/\w`]/.test(match.input.charAt(match.index + match[0].length)) &&
      match[1].length >= 2 &&
      match[1].length <= 64
    ) {
      accountIds.add(match[1].toLowerCase());
    }
  }
  return [...accountIds];
}

function extractTagNotifications(text, item) {
  return extractMentions(text || "")
    .filter((accountId) => accountId !== context.accountId)
    .map((accountId) => ({
      key: accountId,
      value: {
        type: "mention",
        item,
      },
    }));
}

function composeData() {
  const data = {
    post: {
      comment: JSON.stringify({
        type: "md",
        text: state.text,
        image: state.image.cid ? { ipfs_cid: state.image.cid } : undefined,
        item,
      }),
    },
    index: {
      comment: JSON.stringify({
        key: item,
        value: {
          type: "md",
        },
      }),
    },
  };

  const notifications = extractTagNotifications(state.text, {
    type: "social",
    path: `${context.accountId}/post/comment`,
  });

  if (props.notifyAccountId && props.notifyAccountId !== context.accountId) {
    notifications.push({
      key: props.notifyAccountId,
      value: {
        type: "comment",
        item,
      },
    });
  }

  if (notifications.length) {
    data.index.notify = JSON.stringify(
      notifications.length > 1 ? notifications : notifications[0]
    );
  }

  return data;
}

function onCommit() {
  State.update({
    image: {},
    text: "",
  });

  if (props.onComment) {
    props.onComment();
  }
}

function textareaInputHandler(value) {
  const showAccountAutocomplete = /@[\w][^\s]*$/.test(value);
  State.update({ text: value, showAccountAutocomplete });
}

function autoCompleteAccountId(id) {
  let text = state.text.replace(/[\s]{0,1}@[^\s]*$/, "");
  text = `${text} @${id}`.trim() + " ";
  State.update({ text, showAccountAutocomplete: false });
}

const Wrapper = styled.div`
  --padding: 12px;
  position: relative;
  margin-left: -12px;
  border-radius: 8px;
  overflow: hidden;
  transition: all 200ms;
  border: 1px solid #ECEEF0;
  border-radius: 8px;

  &:focus-within {
    box-shadow: inset 0 0 30px rgba(0,0,0,0.05);
    border-color: #687076;
  }
`;

const Textarea = styled.div`
  display: grid;
  vertical-align: top;
  align-items: center;
  position: relative;
  align-items: stretch;
  
  &::after,
  textarea {
    width: 100%;
    min-width: 1em;
    height: unset;
    min-height: 124px;
    font: inherit;
    padding: var(--padding) var(--padding) calc(40px + (var(--padding) * 2))  var(--padding);
    margin: 0;
    resize: none;
    background: none;
    appearance: none;
    border: none;
    grid-area: 1 / 1;
    overflow: hidden;
    outline: none;
  }
  
  &::after {
    content: attr(data-value) ' ';
    visibility: hidden;
    white-space: pre-wrap;
  }
`;

const Actions = styled.div`
  display: inline-flex;
  gap: 12px;
  position: absolute;
  bottom: var(--padding);
  right: var(--padding);

  .commit-post-button {
    background: #59E692;
    color: #11181C;
    border-radius: 40px;
    height: 40px;
    padding: 0 35px;
    font-weight: 600;
    font-size: 14px;
    border: none;
    cursor: pointer;
    transition: background 200ms, opacity 200ms;

    &:hover,
    &:focus {
      background: rgb(112 242 164);
      outline: none;
    }

    &:disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  .upload-image-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #F1F3F5;
    color: #11181C;
    border-radius: 40px;
    height: 40px;
    min-width: 40px;
    font-size: 0;
    border: none;
    cursor: pointer;
    transition: background 200ms, opacity 200ms;

    &::before {
      font-size: 16px;
    }

    &:hover,
    &:focus {
      background: #d7dbde;
      outline: none;
    }

    &:disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    span {
      margin-left: 12px;
    }
  }

  .d-inline-block {
    display: flex !important;
    gap: 12px;
    margin: 0 !important;

    .overflow-hidden {
      width: 40px !important;
      height: 40px !important;
    }
  }
`;

const AutoComplete = styled.div`
  position: absolute;
  z-index: 5;
  bottom: 0;
  left: 0;
  right: 0;

  > div > div {
    padding: calc(var(--padding) / 2);
  }
`;

return (
  <Wrapper>
    <Textarea data-value={state.text}>
      <textarea
        placeholder="Write your reply..."
        onInput={(event) => textareaInputHandler(event.target.value)}
        onKeyUp={(event) => {
          if (event.key === "Escape") {
            State.update({ showAccountAutocomplete: false });
          }
        }}
        value={state.text}
      />
    </Textarea>

    {autocompleteEnabled && state.showAccountAutocomplete && (
      <AutoComplete>
        <Widget
          src="calebjacob.near/widget/AccountAutocomplete"
          props={{
            term: state.text.split("@").pop(),
            onSelect: autoCompleteAccountId,
            onClose: () => State.update({ showAccountAutocomplete: false }),
          }}
        />
      </AutoComplete>
    )}

    <Actions>
      <IpfsImageUpload
        image={state.image}
        className="upload-image-button bi bi-image"
      />

      <CommitButton
        disabled={!state.text}
        force
        data={composeData}
        onCommit={onCommit}
        className="commit-post-button"
      >
        Reply
      </CommitButton>
    </Actions>
  </Wrapper>
);
