function textareaInputHandler(value, mentionsArray) {
  const words = value.split(/\s+/);
  const allMentiones = words.filter((word) => word.startsWith("@")).map((mention) => mention.slice(1));
  const newMentiones = allMentiones.filter((item) => !mentionsArray.includes(item));
  return {
    text: value,
    showAccountAutocomplete: newMentiones?.length > 0,
    mentionsArray: allMentiones,
    mentionInput: newMentiones?.[0] ?? "",
  };
}

function autoCompleteAccountId(id, text, mentionsArray, mentionInput) {
  // to make sure we update the @ at correct index
  let currentIndex = 0;
  const updatedDescription = text.replace(/(?:^|\s)(@[^\s]*)/g, (match) => {
    if (currentIndex === mentionsArray.indexOf(mentionInput)) {
      currentIndex++;
      return ` @${id}`;
    } else {
      currentIndex++;
      return match;
    }
  });
  return { text: updatedDescription, showAccountAutocomplete: false };
}

return { textareaInputHandler, autoCompleteAccountId };
