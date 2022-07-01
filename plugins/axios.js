export default function ({ $axios, app, store, redirect }) {
	$axios.onRequest((config) => {
		// if (store.state.oidc && store.state.oidc.access_token) {
		// 	config.headers.common['Authorization'] = `Bearer ${store.state.oidc.access_token}`;
		// 	config.headers.common['CompanyId'] = process.env.OIDC_CLIENTID;
		// }
	});
	$axios.onError((error) => {
		const code = parseInt(error.response && error.response.status);
		console.log(code);
	});
}
