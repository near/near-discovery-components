const postType = props.postType ?? "post";
const externalLink = props.url;

const clickbaitPrompt =
  props.clickbaitPrompt ??
  `Check out this ${postType} on @NEARProtocol\n#NEAR #BOS\n${externalLink}`;

const twitterUrl = new URL("https://twitter.com/intent/tweet");
twitterUrl.searchParams.set("text", clickbaitPrompt);

const mailtoUrl = new URL("mailto:");
mailtoUrl.searchParams.set("subject", `Check out this ${postType} on NEAR`);
mailtoUrl.searchParams.set(
  "body",
  `Take a look this ${postType}.
${externalLink}
`,
);

const Button = styled.button`
  border: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #687076;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  cursor: pointer;
  background: none;
  padding: 6px;
  transition: color 200ms;

  i {
    font-size: 18px;
    transition: color 200ms;
  }

  &:hover,
  &:focus {
    outline: none;
    color: #11181c;
  }
`;

const DropdownMenu = styled("Popover.Content")`
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  padding: 0.5rem;
  outline: none;

  ul {
    list-style: none;
    display: block;
    margin: 0;
    padding: 0;
  }

  li {
    display: block;
  }

  a {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    padding: 0.5rem;
    font: var(--text-base);
    color: var(--sand12);
    outline: none;
    text-decoration: none;

    &:hover,
    &:focus {
      text-decoration: underline;
    }
  }

  i {
    color: var(--violet8);
  }
`;

return (
  <Popover.Root>
    <Popover.Trigger asChild>
      <Button type="button" title="Share">
        <i className="bi bi-share" />
      </Button>
    </Popover.Trigger>

    <DropdownMenu sideOffset={5}>
      <ul>
        <li>
          <Popover.Close asChild>
            <a href={mailtoUrl.toString()} target="_blank">
              <i className="bi bi-envelope" /> Share by email
            </a>
          </Popover.Close>
        </li>
        <li>
          <Popover.Close asChild>
            <a href={twitterUrl.toString()} target="_blank">
              <i className="bi bi-twitter" />
              Share on Twitter
            </a>
          </Popover.Close>
        </li>
      </ul>

      <Popover.Arrow style={{ fill: "#fff" }} />
    </DropdownMenu>
  </Popover.Root>
);
