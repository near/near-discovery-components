/*
  The following data fetching was pulled from this source code:
  https://near.org/near/widget/ComponentDetailsPage?src=nearweekapp.near/widget/nearweek-news&tab=source
*/

const fetchData = (url) => {
  return fetch(url, {
    method: "GET",
    headers: {
      Accept: "*/*",
      Authorization:
        "Bearer 15699f0723aa9fe9f655b1a94e450552476c08807f67b525b5a3c8011eecc8aee6d45923443620f17815b897858be058cd7bd89ddf23a28aabaecb178e7ebc55d380293beeb51a8ce87b40e1518ce4708e4d51a06b115f27fa64ab5cbee5a3511cec785d7ae6a155ecd05ac8196aadae3e9b8e9401b8df8d8b69904f7364f925",
    },
  });
};

const fetchDaoNews = fetchData(
  "https://nearweek.com/api/md/dao-news?populate=deep&sort=createdAt:desc&pagination[pageSize]=3"
);

const posts = [...(fetchDaoNews?.body.data ?? [])].sort(
  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
);

return props.children(posts);
