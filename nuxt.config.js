export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'dental_clinic_manager',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', type: 'text/css', href: '/css/bootstrap-red.min.css' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap'
      }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/reset.css',
    '~/assets/base.css',
    'boxicons/css/boxicons.min.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/axios',
		'@/plugins/element-ui',
  ],

  router: {
		middleware: ['auth'],
	},

  // Auto import components: https://go.nuxtjs.dev/config-components
  // components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/dotenv',
		'@nuxtjs/moment',
  ],

  moment: {
		locales: ['vi'],
	},

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
  ],

  bootstrapVue: {
		bootstrapCSS: true, // Or `css: false`
		bootstrapVueCSS: true, // Or `bvCSS: false`
		icons: true
	},

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.API_ENDPOINT,
  },

  auth: {
		strategies: {
			local: {
				token: {
					property: 'data.token',
				},
				user: {
					property: 'data',
				},
				endpoints: {
					login: { url: 'api/account/login', method: 'post' },
					logout: false,
					user: { url: 'api/account/info', method: 'get' },
				},
			},
		},
	},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
