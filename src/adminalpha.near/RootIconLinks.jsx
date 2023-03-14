const IconButtonLink = styled.a`
  display: block;
  padding: 0;
  height: 32px;
  border-radius: 6px;
  font-size: 16px;
  line-height: 32px;
  text-align: center;
  cursor: pointer;
  border: none;
  background: #F1F3F5;
  color: #006ADC !important;

  &:hover,
  &:focus {
    background: #ECEDEE;
    text-decoration: none;
    outline: none;
  }
`;

const IconButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
`;

return (
  <>
    <IconButtons>
      <IconButtonLink href="/#/calebjacob.near/widget/ProfilePage?accountId=self.social.near">
        <i className="bi bi-person-circle"></i>
      </IconButtonLink>
      <IconButtonLink href="https://t.me/NearSocial">
        <i className="bi bi-telegram"></i>
      </IconButtonLink>
      <IconButtonLink href="https://github.com/NearSocial">
        <i className="bi bi-github"></i>
      </IconButtonLink>
      <IconButtonLink href="https://twitter.com/NearSocial_">
        <i className="bi bi-twitter"></i>
      </IconButtonLink>
      <IconButtonLink href="https://thewiki.near.page/near.social">
        <i className="bi bi-wikipedia"></i>
      </IconButtonLink>
    </IconButtons>
  </>
);
