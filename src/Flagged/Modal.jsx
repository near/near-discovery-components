let { onCancel, onConfirm, showModal } = props;

State.init({
  show: showModal ?? false,
  agreeIsChecked: false,
});

const Backdrop = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1002;
`;

const Modal = styled.div`
  width: 30rem;
  max-width: 95vw;
  max-height: 80vh;
  background-color: white;
  border-radius: 10px;
  margin: auto;
  padding: 1.5rem;
  display: flex;
  row-gap: 1rem;
  flex-direction: column;
`;

const ModalContent = styled.div`
display: flex;
flex-direction: column;
flex-grow:1
min-height 0;
overflow-y: auto;
`;

const ModalFooter = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 2rem;
`;

const AcceptSection = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 1rem;

  .continue-button {
    background: #59E692;
    color: #09342E;
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
`;

const hide = () => {
  State.update({ show: false });
};

if (!state.show) {
  return;
}

console.log(state);

return (
  <Backdrop className="d-flex">
    <Modal>
      <ModalContent>
        Do you want to hide all posts of this account?
      </ModalContent>
      <ModalFooter>
        <AcceptSection>
          <button
            className="btn btn-outline-secondary"
            style={{
              flexGrow: 1,
              flexBasis: "10rem",
              borderRadius: "1.25rem",
            }}
            onClick={() => {
              hide() && onCancel && onCancel();
            }}
          >
            No
          </button>
          <CommitButton
            style={{
              flexGrow: 1,
              flexBasis: "10rem",
              borderRadius: "1.25rem",
            }}
            className="continue-button"
          >
            Yes
          </CommitButton>
        </AcceptSection>
      </ModalFooter>
    </Modal>
  </Backdrop>
);
