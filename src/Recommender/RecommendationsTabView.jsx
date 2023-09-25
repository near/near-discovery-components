const Button = styled.button`
	display: block;
	width: 100%;
	padding: 8px;
	height: 32px;
	background: #fbfcfd;
	border: 1px solid #d7dbdf;
	border-radius: 50px;
	font-weight: 600;
	font-size: 12px;
	line-height: 15px;
	text-align: center;
	cursor: pointer;
	color: #11181c !important;
	margin: 0;

	&:hover,
	&:focus {
		background: #ecedee;
		text-decoration: none;
		outline: none;
	}

	span {
		color: #687076 !important;
	}
`;

const CategoryHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const RecommendationsTabView = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

const H1 = styled.h1`
	font-weight: 600;
	font-size: 64px;
	line-height: normal;
	color: #11181c;
	margin: 4rem 0;
`;

const H3 = styled.h3`
	font-weight: 600;
	font-size: 24px;
	line-height: normal;
	color: #11181c;
	margin: 1.8rem 0 1.5rem 0;
`;

const Profile = styled.div``;

const Profiles = styled.div`
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 24px;

	@media (max-width: 1024px) {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	@media (max-width: 800px) {
		grid-template-columns: minmax(0, 1fr);
	}
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

State.init({
	currentPage: 1,
	userData: [],
	isLoading: true,
	error: null,
	totalPages: 1,
	expandedList: "",
});

const handleToggleList = (listId) => {
	if (state.expandedList === listId) {
		State.update({ expandedList: "" });
	} else {
		State.update({ expandedList: listId });
	}
};

const STORE = "storage.googleapis.com";
const BUCKET = "databricks-near-query-runner";
const BASE_URL = `https://${STORE}/${BUCKET}/output/recommendations`;
const recommendedProfiles = "second_degree_following";
const similarProfiles = "similarity_estimation";

const recommendedProfilesURL = `${BASE_URL}/${recommendedProfiles}_${context.accountId}`;
const similarProfilesURL = `${BASE_URL}/${similarProfiles}_${context.accountId}`;

return (
	<RecommendationsTabView>
		{state.expandedList !== "list2" && (
			<>
				<CategoryHeader>
					<H3>Friends of Friends</H3>
					<RetroLinkButton onClick={() => handleToggleList("list1")}>
						{state.expandedList === "list1" ? "Back to categories" : "View all"}
					</RetroLinkButton>
				</CategoryHeader>
				{state.expandedList === "list1" ? (
					<Widget
						src={`${REPL_ACCOUNT}/widget/Recommender.RecommendedUsers`}
						props={{
							dataset: recommendedProfilesURL,
						}}
					/>
				) : (
					<Widget
						src={`${REPL_ACCOUNT}/widget/Recommender.RecommendedUsers`}
						props={{
							dataset: recommendedProfilesURL,
							returnElements: 4,
						}}
					/>
				)}
			</>
		)}

		{state.expandedList !== "list1" && (
			<>
				<CategoryHeader>
					<H3>Similar to you</H3>
					<RetroLinkButton onClick={() => handleToggleList("list2")}>
						{state.expandedList === "list2" ? "Back to categories" : "View all"}
					</RetroLinkButton>
				</CategoryHeader>{" "}
				{state.expandedList === "list2" ? (
					<Widget
						src={`${REPL_ACCOUNT}/widget/Recommender.RecommendedUsers`}
						props={{
							dataset: similarProfilesURL,
						}}
					/>
				) : (
					<Widget
						src={`${REPL_ACCOUNT}/widget/Recommender.RecommendedUsers`}
						props={{
							dataset: similarProfilesURL,
							returnElements: 4,
						}}
					/>
				)}
			</>
		)}
	</RecommendationsTabView>
);
