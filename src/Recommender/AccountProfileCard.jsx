const Avatar = styled.a`
	width: 60px;
	height: 60px;
	flex-shrink: 0;
	border: 1px solid #eceef0;
	overflow: hidden;
	border-radius: 56px;
	transition: border-color 200ms;

	img {
		object-fit: cover;
		width: 100%;
		height: 100%;
	}

	&:hover,
	&:focus {
		border-color: #d0d5dd;
	}
`;

const Button = styled.div`
	div > .follow-button {
		color: #000 !important;
	}
`;

const LargeCard = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	gap: 12px;
	width: 100%;
	border-radius: 12px;
	z-index: 1070;
	background: #fff;
	border: 1px solid #eceef0;
	box-shadow: 0px 1px 3px rgba(16, 24, 40, 0.1),
		0px 1px 2px rgba(16, 24, 40, 0.06);
	overflow: hidden;
	padding: 24px 0px 13px;
`;

const CenteredLinksWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 14px;
`;

const CurrentUserProfile = styled.div`
	height: 32px;
`;

const NoTags = styled.div`
	height: 20px;
`;

const Score = styled.li`
	font-size: 12px;
	font-weight: 500;
	color: #90908c;
	padding: 0;
`;

const Scores = styled.ul`
	display: flex;
	justify-content: space-around;
	align-items: left;
	width: 100%;
	margin-bottom: 0px;
	padding: 0px 40px 14px;
	border-bottom: 1px solid #eceef0;
	color: #90908c;
	list-style-type: none;
`;

const TagsWrapper = styled.div`
	max-width: 80%;
	margin-top: -5px;
`;

const TextLink = styled.a`
	display: block;
	margin: 0;
	font-size: 14px;
	line-height: 18px;
	color: ${(p) => (p.bold ? "#11181C !important" : "#687076 !important")};
	font-weight: ${(p) => (p.bold ? "600" : "400")};
	font-size: ${(p) => (p.small ? "12px" : "14px")};
	overflow: ${(p) => (p.ellipsis ? "hidden" : "visible")};
	text-overflow: ${(p) => (p.ellipsis ? "ellipsis" : "unset")};
	white-space: nowrap;
	outline: none;
	max-width: 230px;

	&:focus,
	&:hover {
		text-decoration: underline;
	}
`;

const ProfileListContainer = styled.div`
	width: auto;
	position: relative;
	font-size: 14px;
	color: #90908c;
`;

const ProfileList = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0;
	height: 100%;
	font-size: 14px;
	color: #90908c;
`;

const Profile = styled.li`
	padding: 0px;
`;

const FollowsYouBadge = styled.p`
	display: inline-block;
	margin: 0px;
	font-size: 10px;
	line-height: 1.1rem;
	background: rgb(104, 112, 118);
	color: rgb(255, 255, 255);
	font-weight: 600;
	white-space: nowrap;
	padding: 2px 6px;
	border-radius: 3px;
`;

const Tracker = styled.div``;

///////////////
//const dataplane = "https://neardanieossax.dataplane.rudderstack.com"; //test
const dataplane = "https://near.dataplane.rudderstack.com"; //prod
const uri = "/v1/track";
const api_url = `${dataplane}${uri}`;
//const auth = "Basic MlVvMlBYSE9UdzJjUWRucThJUWJQTG9DOG5mOg=="; //test
const auth = "Basic MlVub3dMd2lXRnc3YzM1QU11RUVkREVJa2RvOg=="; //prod
const currentTimeStamp = new Date().toISOString();

const trackEngagement = (targetSigner, eventType, rank) => {
	const payload = {
		userId: context.accountId,
		event: eventType,
		properties: {
			targetSignerId: targetSigner,
			rank: rank,
		},
		timestamp: new Date().toISOString(),
	};

	asyncFetch(api_url, {
		body: JSON.stringify({ payload }),
		headers: {
			"Content-Type": "application/json",
			Authorization: auth,
		},
		method: "POST",
	})
		.then((response) => response.json())
		.then((data) => console.log(data))
		.catch((error) => console.log("Error:", error));
};
////////////

const accountId = props.accountId;
const profile = props.profile || Social.get(`${accountId}/profile/**`, "final");
const tags = Object.keys(profile.tags || {});
const profileUrl = `#/near/widget/ProfilePage?accountId=${accountId}`;

const following = props.following || 33200;
const followers = props.followers || 103320;
const likers = props.likers || 145540;

const abbreviateNumber = (value) => {
	let newValue = value;
	if (value >= 1000) {
		const suffixes = ["", "k", "M", "B", "T"];
		const suffixNum = Math.floor(("" + value).length / 3);
		let shortValue = "";
		for (let precision = 2; precision >= 1; precision--) {
			shortValue = parseFloat(
				(suffixNum !== 0
					? value / Math.pow(1000, suffixNum)
					: value
				).toPrecision(precision)
			);
			const dotLessShortValue = (shortValue + "").replace(
				/[^a-zA-Z 0-9]+/g,
				""
			);
			if (dotLessShortValue.length <= 2) {
				break;
			}
		}
		newValue = shortValue + suffixes[suffixNum];
	}
	return newValue;
};

return (
	<>
		{props.sidebar ? (
			<>
				<Widget
					src="${REPL_ACCOUNT}/widget/Recommender.AccountProfile"
					props={{
						accountId: props.accountId,
						sidebar: props.sidebar || null,
						followsYou: props.followsYou || null,
						becauseYouFollow: props.becauseYouFollow || null,
						likers: props.likers || null,
						followers: props.followers || null,
						following: props.following || null,
						profileImage: props.profileImage || null,
						profileName: props.profileName || null,
					}}
				/>
			</>
		) : (
			<LargeCard>
				<Avatar
					onClick={() => {
						trackEngagement({
							targetSigner: props.accountId,
							rank: props.rank,
							eventType: "people page avatar profile entry",
						});
					}}
					href={profileUrl}
				>
					<Widget
						src="${REPL_MOB}/widget/Image"
						props={{
							image: props.profileImage || profile.image,
							alt: props.profileName || profile.name,
							fallbackUrl:
								"https://ipfs.near.social/ipfs/bafkreibiyqabm3kl24gcb2oegb7pmwdi6wwrpui62iwb44l7uomnn3lhbi",
						}}
					/>
				</Avatar>
				<CenteredLinksWrapper
					onClick={() => {
						trackEngagement({
							targetSigner: props.accountId,
							rank: props.rank,
							eventType: "people page profile entry",
						});
					}}
				>
					<TextLink href={profileUrl} ellipsis bold>
						{props.profileName || profile.name || accountId.split(".near")[0]}
					</TextLink>
					<TextLink href={profileUrl} ellipsis>
						@{accountId}
					</TextLink>
				</CenteredLinksWrapper>
				{tags.length > 0 ? (
					<TagsWrapper>
						<Widget src="near/widget/Tags" props={{ tags, scroll: true }} />
					</TagsWrapper>
				) : (
					<TagsWrapper>
						<NoTags></NoTags>
					</TagsWrapper>
				)}

				{following !== null && followers !== null && likers !== null && (
					<Scores>
						<Score>
							{abbreviateNumber(followers)}
							<i class="bi bi-person"></i>
						</Score>
						<Score>
							{abbreviateNumber(following)}
							<i class="bi bi-list"></i>
						</Score>
						<Score>
							{abbreviateNumber(likers)}
							<i class="bi bi-heart"></i>
						</Score>
					</Scores>
				)}

				{context.accountId && context.accountId !== props.accountId ? (
					<Button
						onClick={() => {
							trackEngagement({
								targetSigner: props.accountId,
								rank: props.rank,
								eventType: "people page follow click engagement",
							});
						}}
					>
						<Widget
							src="${REPL_ACCOUNT}/widget/Recommender.FollowButtonTracker"
							props={{
								accountId: props.accountId,
								rank: props.rank,
							}}
						/>
					</Button>
				) : (
					<Button>
						<CurrentUserProfile></CurrentUserProfile>
					</Button>
				)}
			</LargeCard>
		)}
	</>
);
