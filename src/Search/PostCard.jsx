// Original widget: https://alpha.near.org/#/calebjacob.near/widget/Posts.Post
const accountId = props.accountId ?? context.accountId;
const blockHeight = props.blockHeight ?? "now";
const snipContent = props.snipContent ?? false;
const snippetMaxWords = props.snippetMaxWords ?? 40;
let content = props.content;
if (content?.text && snippet) {
  const text = content.text.split(" ");
  content.text = text.slice(0, snippetMaxWords);
  if (text.length >= snippetMaxWords) {
    content.text.push(props.snippedEnd ?? "...");
  }
  content.text = content.text.join(" ");
}
const key = props.key ?? JSON.stringify(content);
const postType = props.postType ?? "post";
const postBlockHeight =
  postType === "post" ? "blockHeight" : "commentBlockHeight";
const postUrl = `/near/widget/PostPage?accountId=${accountId}&${postBlockHeight}=${blockHeight}`;
const onClick =
  props.onClick ??
  (() => {
    if (props.debug) {
      console.log(`clicked on post: ${postUrl}`);
    }
  });

const highlightWordInParagraph = (paragraph, word, charLimit) => {
  paragraph = paragraph.replace(/\n/g, "");
  const words = paragraph.split(" ");
  const wordIndex = words.indexOf(word);
  if (wordIndex === -1) {
    return paragraph;
  }

  const startIndex = Math.max(wordIndex - 3, 0);
  const endIndex = Math.min(wordIndex + 2, words.length - 1);

  let newParagraph = "";
  let currentLength = 0;

  for (let i = startIndex; i <= endIndex; i++) {
    const wordToAdd = i === endIndex ? words[i] + "..." : words[i] + " ";
    const wordToAddLength = wordToAdd.length;

    if (currentLength + wordToAddLength <= charLimit) {
      newParagraph += wordToAdd;
      currentLength += wordToAddLength;
    } else {
      break;
    }
  }

  return newParagraph;
};

const Post = styled.a`
  display: flex;
  overflow: hidden;
  flex-direction: row;
  align-items: center;
  width: 95%;
  height: 45px;
  overflow: hidden;
  gap: 16px;
  margin: 10px;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  flex: 1;

  img {
    height: 24px;
  }
`;
const Body = styled.div`
  align-items: center;
  flex: 1;
  font-size: 12px;
  overflow: ${(p) => (p.ellipsis ? "hidden" : "")};
  text-overflow: ${(p) => (p.ellipsis ? "ellipsis" : "")};
`;
const Content = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2px;
`;

const ButtonLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;

  img {
    width: 24px;
    height: 24px;
  }

  &:hover,
  &:focus {
    text-decoration: none;
    outline: none;
  }
`;

const Text = styled.p`
  display: block;
  font-size: 12px;
  line-height: 20px;
  font-weight: 400;
  color: #687076;
  white-space: nowrap;
`;

return (
  <Post href={postUrl} onPointerUp={onClick}>
    <Header>
      <Widget
        src="near/widget/Search.AccountProfile"
        props={{
          accountId,
          hideAccountId: true,
        }}
      />
    </Header>

    <Body>
      {content.text && (
        <Widget
          src="near/widget/Search.Markdown"
          props={{
            text: highlightWordInParagraph(content.text, props.term, 10),
          }}
        />
      )}
      {content.image && (
        <Widget
          src="mob.near/widget/Image"
          props={{
            image: content.image,
          }}
        />
      )}
    </Body>
    <ButtonLink href={postUrl} onPointerUp={onClick}>
      <img src="https://i.imgur.com/dIDX59g.png" alt="Open" />
    </ButtonLink>
  </Post>
);
