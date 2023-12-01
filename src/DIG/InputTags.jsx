let { onTagsChange, tags, ...forwardedProps } = props;

if (!onTagsChange) {
  return 'Missing prop: "onTagsChange"';
}
if (!tags) {
  return 'Missing prop: "tags"';
}

State.init({
  value: "",
});

function addTag(tag) {
  const values = tag.split(",");
  const sanitizedValues = values.map((value) => value.trim()).filter((value) => !!value && tags.indexOf(value) === -1);

  if (sanitizedValues.length > 0) {
    onTagsChange([...tags, ...sanitizedValues]);
  }

  State.update({
    value: "",
  });
}

function removeTag(tag) {
  const remainingTags = tags.filter((t) => t !== tag);
  onTagsChange(remainingTags);
}

function handleOnKeyUp(e) {
  if (e.code === "Enter" || e.code === "Comma" || e.target.value.indexOf(",") > -1) {
    addTag(e.target.value);
  }
}

function handleOnBlur(e) {
  addTag(e.target.value);
}

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 6px 0;
  align-items: center;
  gap: 4px;
  margin-left: -5px;
  max-width: 100%;
`;

const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  font: var(--text-xs);
  color: var(--sand12);
  height: 28px;
  line-height: 28px;
  border: 1px solid var(--sand7);
  border-radius: 5px;
  padding: 0 6px 0 10px;
  background: var(--white);
  box-shadow: 0 1px 2px hsla(0, 0%, 0%, 0.06);
`;

const TagDelete = styled.div`
  all: unset;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  padding: 0 4px;

  i {
    color: var(--sand10) !important;
    font-size: 12px !important;
  }

  &:hover {
    i {
      color: var(--red8) !important;
    }
  }
`;

return (
  <Widget
    src="${REPL_ACCOUNT}/widget/DIG.Input"
    props={{
      inputNodeLeft: (
        <>
          {tags && tags.length > 0 && (
            <Tags>
              {tags.map((tag, i) => {
                return (
                  <Tag key={tag + i}>
                    {tag}
                    <TagDelete
                      role="button"
                      tabindex="-1"
                      aria-label="Remove Tag"
                      onClick={() => {
                        removeTag(tag);
                      }}
                    >
                      <i className="ph-bold ph-x" />
                    </TagDelete>
                  </Tag>
                );
              })}
            </Tags>
          )}
        </>
      ),
      onBlur: handleOnBlur,
      onKeyUp: handleOnKeyUp,
      onInput: (e) => State.update({ value: e.target.value }),
      type: "text",
      value: state.value,
      ...forwardedProps,
    }}
  />
);
