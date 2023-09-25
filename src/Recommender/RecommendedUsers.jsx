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
	margin: 36px 0;

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

const RecommendedUsers = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	padding-bottom: 50px;
`;

State.init({
	currentPage: 1,
	userData: [],
	isLoading: true,
	error: null,
	totalPages: 1,
});

const updateState = (data, totalPageNum) => {
	State.update({
		isLoading: false,
		userData: [...state.userData, ...data],
		totalPages: totalPageNum,
	});
};

const getRecommendedUsers = (page) => {
	try {
		const url = `${props.dataset}_${page}.json`;
		if (state.currentPage == 1) {
			const res = fetch(url);
			if (res.ok) {
				const parsedResults = JSON.parse(res.body);
				const totalPageNum = parsedResults.total_pages;
				updateState(parsedResults.data, totalPageNum);
			} else {
				console.log(
					"Error fetching data. Try reloading the page, or no data available."
				);
			}
		} else {
			asyncFetch(url).then((res) => {
				if (res.ok) {
					const parsedResults = JSON.parse(res.body);
					const totalPageNum = parsedResults.total_pages;
					updateState(parsedResults.data, totalPageNum);
				} else {
					console.log("Error fetching data. Try reloading the page.");
				}
			});
		}
	} catch (error) {
		console.log(error.message);
	}
};

const loadMore = () => {
	const nextPage = state.currentPage + 1;
	if (nextPage <= state.totalPages) {
		State.update({ currentPage: nextPage });
		getRecommendedUsers(nextPage);
	}
};

if (state.isLoading) {
	getRecommendedUsers(state.currentPage);
}

const returnElements = props.returnElements;
const displayedUsers = returnElements
	? state.userData.slice(0, returnElements)
	: state.userData;

const follows_you = "" || props.follows_you;
const because_you_follow = "" || props.because_you_follow;
const likers = "" || props.likers;
const followers = "" || props.followers;
const following = "" || props.following;
const profileImage = "" || props.profileImage;
const profileName = "" || props.profileName;
const rank = "" || props.rank;

return (
	<RecommendedUsers>
		{state.isLoading && <p>Loading...</p>}
		{state.error && <p>Error: {state.error}</p>}
		<Profiles>
			{displayedUsers.map((user, index) => (
				<Profile key={index}>
					<Widget
						src={`${REPL_ACCOUNT}/widget/Recommender.AccountProfileCard`}
						props={{
							rank: index,
							accountId: user.recommended_profile,
							showTags: true,
							showFollowerStats: true,
							showFollowButton: state.multiSelectMode === false,
							follows_you: user.follows_you,
							because_you_follow: user.because_you_follow,
							likers: user.likers,
							followers: user.followers,
							following: user.following,
							profileImage: user.profileImage,
							profileName: user.profileName,
						}}
					/>
				</Profile>
			))}
		</Profiles>
		{!props.returnElements && state.currentPage < state.totalPages ? (
			<Button type="button" onClick={() => loadMore()}>
				Load More
			</Button>
		) : null}
	</RecommendedUsers>
);
