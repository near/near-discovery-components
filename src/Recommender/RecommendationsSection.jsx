const H3 = styled.h3`
	font-weight: 600;
	font-size: 24px;
	line-height: normal;
	color: #11181c;
	margin: 1.8rem 0 1.5rem 0;
`;

const RetroLinkButton = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	color: blue;
	font-size: 16px;
	padding: 0;
	margin: 0;
	outline: none;
	transition: color 0.3s;

	&:hover {
		color: purple;
	}

	&:active {
		color: red;
	}
`;

const CategoryHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

return (
	<>
		<CategoryHeader>
			<H3>{title}</H3>
			<RetroLinkButton onClick={() => handleToggleList(listName)}>
				{expandedList === listName ? "Back to categories" : "View all"}
			</RetroLinkButton>
		</CategoryHeader>
		<Widget
			src={`${REPL_ACCOUNT}/widget/Recommender.RecommendedUsers`}
			props={{
				dataset,
				returnElements: expandedList === listName ? undefined : 4,
			}}
		/>
	</>
);
