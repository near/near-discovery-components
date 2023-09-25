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

const H1 = styled.h1`
	font-weight: 600;
	font-size: 64px;
	line-height: normal;
	color: #11181c;
	margin: 4rem 0;
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

const TrendingUsersTabView = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

const STORE = "storage.googleapis.com";
const BUCKET = "databricks-near-query-runner";
const BASE_URL = `https://${STORE}/${BUCKET}/output/recommendations`;
const algorithm = "trending_users";
const trendingProfilesURL = `${BASE_URL}/${algorithm}_page`;

return (
	<TrendingUsersTabView>
		<Widget
			src={`${REPL_ACCOUNT}/widget/Recommender.RecommendedUsers`}
			props={{
				dataset: trendingProfilesURL,
			}}
		/>
	</TrendingUsersTabView>
);
