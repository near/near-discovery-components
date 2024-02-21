const setPostToShow = props.setPostToShow;
const markdownTemplate =
  props.markdownPost ||
  `
![header image alt text](https://picsum.photos/400/400)

# Title
=================================================

## Section header


// content 


![embedded image alt](https://picsum.photos/400/400)


### Section label
`;

return (
  <>
    <p
      style={{ marginBottom: "4em" }}
      onClick={() => {
        setPostToShow(null);
      }}
    >
      back
    </p>
    <Markdown text={markdownTemplate} />
  </>
);
