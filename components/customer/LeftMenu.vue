<template>
    <div class="wrapper">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-3 col-xl-2 mb-3">
                    <ul class="list-group list-group-flush mt-2 font-14 list-group-custom">
                        <nuxt-link
                            tag="li"
                            :to="`/customer/${$route.params.id}/profile`"
                            :class="{ 'submenu-active': isRouteActive('profile') }"
                            class="list-group-item list-group-item-action border-0"
                        >
                            <a href="javascript:void(0)">
                                <span>Thông tin chung</span>
                            </a>
                        </nuxt-link>
                        <nuxt-link
                            tag="li"
                            :to="`/customer/${$route.params.id}/examination`"
                            :class="{ 'submenu-active': isRouteActive('examination') }"
                            class="list-group-item list-group-item-action border-0"
                        >
                            <a href="javascript:void(0)">
                                <span>Khám và điều trị</span>
                            </a>
                        </nuxt-link>
                        <nuxt-link
                            tag="li"
                            :to="`/customer/${$route.params.id}/payment`"
                            :class="{ 'submenu-active': isRouteActive('payment') }"
                            class="list-group-item list-group-item-action border-0"
                        >
                            <a href="javascript:void(0)">
                                <span>Thanh toán</span>
                            </a>
                        </nuxt-link>
                        <nuxt-link
                            tag="li"
                            :to="`/customer/${$route.params.id}/examinationForm`"
                            :class="{ 'submenu-active': isRouteActive('examinationForm') }"
                            class="list-group-item list-group-item-action border-0"
                        >
                            <a href="javascript:void(0)">
                                <span>Phiếu khám</span>
                            </a>
                        </nuxt-link>
                        <nuxt-link
                            tag="li"
                            :to="`/customer/${$route.params.id}/diary`"
                            :class="{ 'submenu-active': isRouteActive('diary') }"
                            class="list-group-item list-group-item-action border-0"
                        >
                            <a href="javascript:void(0)">
                                <span>Nhật ký</span>
                            </a>
                        </nuxt-link>
                    </ul>
                </div>
                <div class="col-md-9 col-xl-10">
                    <div class="content">
                        <div class="container-fluid">
                            <slot></slot>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
		}),
	},
    async created() {
		const _this = this;
	},
    methods: {
		checkAccessRight(value) {
			const _this = this;
			let values = [value + '.view', value + '.admin'];
			return !!_.intersection(_this.accesses ? _this.accesses : [], values).length;
		},
		isRouteActive(id) {
			return (
				this.$nuxt.$route.path.split('/')[2] === this.$nuxt.$route.params.id &&
				this.$nuxt.$route.path.split('/')[3] === id
			);
		},
	},
}
</script>

<style scoped>
.list-group-custom{
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}
.submenu-active {
	background: #60c248;
}
.submenu-active > a {
	color: #ffffff;
}
.list-group-item{
    padding: 0;
}
.list-group-item a{
    display: block;
    width: 100%;
    height: 100%;
    padding: 16px 12px;
}
</style>