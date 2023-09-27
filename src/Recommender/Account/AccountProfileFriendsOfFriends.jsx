const accountId = props.accountId || context.accountId;
const profile = props.profile || Social.get(`${accountId}/profile/**`, "final");
const profileUrl = `#/${REPL_ACCOUNT}/widget/ProfilePage?accountId=${accountId}`;
const friendsOfFriendsAvatars = props.becauseYouFollow;

State.init({ isHovered: false });

const AvatarCount = styled.div`
	font-size: 14px;
	font-weight: 300;
`;

const Wrapper = styled.a`
	display: inline-grid;
	width: 100%;
	align-items: center;
	gap: 12px;
	grid-template-columns: auto 1fr;
	cursor: pointer;
	margin: 0;
	color: #687076 !important;
	outline: none;
	text-decoration: none !important;
	background: none !important;
	border: none;
	text-align: left;
	padding: 0;

	> * {
		min-width: 0;
	}

	&:hover,
	&:focus {
		div:first-child {
			border-color: #d0d5dd;
		}
	}
`;

const Text = styled.p`
	margin: 0;
	font-size: 14px;
	line-height: 20px;
	color: ${(p) => (p.bold ? "#11181C" : "#687076")};
	font-weight: ${(p) => (p.bold ? "600" : "400")};
	font-size: ${(p) => (p.small ? "10px" : "14px")};
	overflow: ${(p) => (p.ellipsis ? "hidden" : "")};
	text-overflow: ${(p) => (p.ellipsis ? "ellipsis" : "")};
	white-space: nowrap;
`;

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

const Container = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	width: 100%;
`;

const LeftContainer = styled.div`
	display: flex;
	align-items: flex-start;
	flex-direction: column;
`;

const Name = styled.div`
	display: flex;
	gap: 6px;
	align-items: center;
`;

const AccountProfile = (
	<Wrapper
		as={props.onClick ? "button" : "a"}
		href={!props.onClick && profileUrl}
		onClick={props.onClick && (() => props.onClick(accountId))}
		onMouseEnter={() => State.update({ isHovered: true })}
		onMouseLeave={() => State.update({ isHovered: false })}
	>
		<Avatar>
			<Widget
				src="mob.near/widget/Image"
				props={{
					image: profile.image,
					alt: profile.name,
					fallbackUrl:
						"https://ipfs.near.social/ipfs/bafkreibiyqabm3kl24gcb2oegb7pmwdi6wwrpui62iwb44l7uomnn3lhbi",
				}}
			/>
		</Avatar>
		<div>
			<Container>
				<LeftContainer>
					<Name>
						<Text ellipsis bold>
							{profile.name || accountId.split(".near")[0]}
						</Text>

						{props.inlineContent}

						{props.blockHeight && (
							<Text small style={{ marginLeft: "auto" }}>
								Joined{" "}
								<Widget
									src="mob.near/widget/TimeAgo"
									props={{ blockHeight: props.blockHeight }}
								/>{" "}
								ago
							</Text>
						)}
					</Name>
					{!props.hideAccountId && <Text ellipsis>@{accountId}</Text>}
				</LeftContainer>
				{props.scope == "friends" && state.isHovered ? (
					<>
						<Widget
							src={"${REPL_ACCOUNT}/widget/Recommender.RecommendedAvatars"}
							props={{
								avatarSize: "20px",
								becauseYouFollow: props.becauseYouFollow || null,
							}}
						/>
					</>
				) : (
					<>
						{props.scope == "friends" && (
							<AvatarCount>
								{friendsOfFriendsAvatars.length} friends follow
							</AvatarCount>
						)}
						{props.scope == "similar" && (
							<AvatarCount>Shared interests</AvatarCount>
						)}
					</>
				)}
			</Container>
		</div>
	</Wrapper>
);

if (props.noOverlay) return AccountProfile;

return (
	<Widget
		src="${REPL_ACCOUNT}/widget/Recommender.Account.AccountProfileOverlay"
		props={{
			accountId: props.accountId,
			profile,
			children: AccountProfile,
			placement: props.overlayPlacement,
			becauseYouFollow: props.becauseYouFollow || null,
			scope: props.scope || null,
		}}
	/>
);
