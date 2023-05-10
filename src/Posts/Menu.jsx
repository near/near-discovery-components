const Item = styled.div`
  padding: 0;
  .btn {
    width: 100%;
    border:0;
    text-align: left;
    &:hover,
    &:focus {
      background-color: #ECEDEE;
      text-decoration: none;
      outline: none;
    }

    i {
      color: #7E868C;
    }

    span {
      font-weight: 500;
    }
  }
`;

return (
  <div class="dropdown ms-auto">
    <button
      class="btn border-0 p-0"
      type="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <i class="bi bi-three-dots" />
    </button>
    <ul class="dropdown-menu">

      {props.elements.map(e => {
        return (<li>
          <Item>
            {e}
          </Item>
        </li>)
      })}
    </ul>
  </div>
)