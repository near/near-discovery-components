const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  max-width:150px;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 15px;
  max-width: calc(90px * 3 + 4px * 2 * 3);
`;

const Row = styled.div`
  display: flex;
  width: 200%;
  justify-content: flex-start;
`;

const Title = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 19px;
  line-height: 23px;
`;

const SubRow = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 20px;
`;

const SubTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const StyledInput = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px;
  gap: 6px;
  width: 212px;
  height: 32px;
  background: #f8f9fa;
  border-radius: 50px;
  margin-top:10px;
`;

const SortBy = styled.div`
  display: flex;
  flex-direction: column;
`;

const SortOption = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: #687076;
  cursor: pointer;
  padding: 8px 12px 8px 8px;
  gap: 8px;

  &:hover {
    opacity: 0.8;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const CheckboxContainer = styled.div`
  width: 15px;
  height: 15px;
  position: relative;
`;

const Checkbox = styled.div`
  width: 100%;
  height: 100%;
  
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
`;

const Tag = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 3px 8px;
  gap: 3px;
  width: auto;
  height: 24px;
  background: #ffffff;
  border: 1px solid #e6e8eb;
  border-radius: 6px;
  flex: none;
  order: 2;
  flex-grow: 0;
  margin: 4px;
`;
const CheckboxInput = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;

  & > input[type="checkbox"] {
    width: 40px;
    height: 40px;
    margin-right: 8px;
  }
`;

const CustomCheckbox = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 1px solid black;
  margin-right: 8px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    display: none;
    left: 5px;
    top: 2px;
    width: 4px;
    height: 8px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  color: #878A8E;
  gap: 16px;
`;

const SubCheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  gap: 16px;
`;

let tags = props.selectedTags ?? [];

// Initialize the state
State.init({
  youFollow: false,
  youDontFollow: false,
  inputValue: "",
  filteredTags: tags,
  activeTags: [], // Add this line
});

const updateFilteredTags = (inputValue) => {
  State.update({
    filteredTags: tags.filter((tag) => tag.includes(inputValue)),
  });
};

// Add this function to update tags based on props.selectedTags
const updateTags = () => {
  tags = props.selectedTags ?? [];
  updateFilteredTags(state.inputValue);
};

// Call updateTags function to update tags
updateTags();

const toggleActiveTag = (tag) => {
  const newActiveTags = state.activeTags.includes(tag)
    ? state.activeTags.filter((t) => t !== tag)
    : [...state.activeTags, tag];

  State.update({ activeTags: newActiveTags });
  props.onTagClick(newActiveTags);

  // Call updateTags function to update tags
  updateTags();
};

const handleChange = (checkboxName) => {
  console.log("called", checkboxName);
  props.onCheckboxChange(checkboxName, !props[checkboxName]);
};

return (
  <Container>
    <Row>
      <Title>Filters</Title>
    </Row>

    <Row>
      <SubRow>
        <SubTitle>Tags</SubTitle>
        <StyledInput>
          <input
            placeholder="Search Tags"
            type="text"
            style={{ width: "100%", background: "transparent", border: "none" }}
            value={state.inputValue}
            onChange={(e) => {
              State.update({ inputValue: e.target.value });
              updateFilteredTags(e.target.value);
            }}
          />
        </StyledInput>
      </SubRow>
    </Row>
    <Row>
      <TagsContainer>
        {" "}
        {state.filteredTags.map((tag) => (
          <Tag
            key={tag}
            onClick={() => toggleActiveTag(tag)}
            style={{
              borderColor: state.activeTags.includes(tag) ? "blue" : "#E6E8EB",
            }}
          >
            {tag}
          </Tag>
        ))}
      </TagsContainer>
    </Row>
    <Row>
      <SubRow>
        <SubTitle>People</SubTitle>
        <SubRow>
          <CheckboxInput>
            <input
              type="checkbox"
              style={{
                backgroundColor: props.showFollowed ? "black" : "white",
                width: "40px",
                height: "40px",
              }}
              checked={props.showFollowed}
              onChange={() => handleChange("showFollowed")}
            />
            <label>Show Followed</label>
          </CheckboxInput>
        </SubRow>
        <SubRow>
          <CheckboxInput>
            <input
              type="checkbox"
              style={{
                backgroundColor: props.showNotFollowed ? "black" : "white",
                width: "40px",
                height: "40px",
              }}
              checked={props.showNotFollowed}
              onChange={() => handleChange("showNotFollowed")}
            />

            <label>Show Not Followed</label>
          </CheckboxInput>
        </SubRow>
      </SubRow>
    </Row>
    <Row></Row>
  </Container>
);
