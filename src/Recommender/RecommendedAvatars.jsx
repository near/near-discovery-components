const Avatar = styled.div`
	width: ${props.avatarSize || "40px"};
	height: ${props.avatarSize || "40px"};
	flex-shrink: 0;
	border: 1px solid #eceef0;
	overflow: hidden;
	border-radius: 40px;

	img {
		object-fit: cover;
		width: 100%;
		height: 100%;
	}
`;

const profiles = props.becauseYouFollow;

return <Avatar>{profiles}</Avatar>;
