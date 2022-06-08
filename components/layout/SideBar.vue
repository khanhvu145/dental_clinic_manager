<template>
    <div class="sidebar">
        <!-- <ul class="sidebar-nav">
            <li class="sidebar-nav-item">
                <nuxt-link to="/" class="sidebar-nav-link" :class="{ 'active': isRouteActive('') }">
                    <div>
                        <i class='bx bxs-calendar-edit'></i>
                    </div>
                    <span>Đăng ký khám</span>
                </nuxt-link>
            </li>

            <li class="sidebar-nav-item">
                <nuxt-link to="/appointment" class="sidebar-nav-link" :class="{ 'active': isRouteActive('appointment') }">
                    <div>
                        <i class='bx bxs-calendar-plus'></i>
                    </div>
                    <span>Lịch hẹn</span>
                </nuxt-link>
            </li>

            <li class="sidebar-nav-item">
                <nuxt-link to="/mycalendar" class="sidebar-nav-link" :class="{ 'active': isRouteActive('mycalendar') }">
                    <div>
                        <i class='bx bxs-calendar' ></i>
                    </div>
                    <span>Lịch làm việc</span>
                </nuxt-link>
            </li>

            <li class="sidebar-nav-item">
                <nuxt-link to="/patient" class="sidebar-nav-link" :class="{ 'active': isRouteActive('patient') }">
                    <div>
                        <i class='bx bxs-group'></i>
                    </div>
                    <span>Khách hàng</span>
                </nuxt-link>
            </li>

            <li class="sidebar-nav-item">
                <nuxt-link to="" class="sidebar-nav-link">
                    <div>
                        <i class='bx bxs-check-circle'></i>
                    </div>
                    <span>Trạng thái tư vấn</span>
                </nuxt-link>
            </li>

            <li class="sidebar-nav-item">
                <nuxt-link to="" class="sidebar-nav-link">
                    <div>
                        <i class='bx bxs-credit-card'></i>
                    </div>
                    <span>Thanh toán</span>
                </nuxt-link>
            </li>

            <li class="sidebar-nav-item">
                <nuxt-link to="" class="sidebar-nav-link">
                    <div>
                        <i class='bx bxs-log-out'></i>
                    </div>
                    <span>Đăng xuất</span>
                </nuxt-link>
            </li>
        </ul> -->
        <el-menu v-bind:default-active="itemSidebarActive" class="el-menu-vertical-demo" :collapse="isCollapse">
            <nuxt-link to="/" class="sidebar-nav-link">
                <el-menu-item index="">
                    <i class='bx bxs-calendar-edit'></i>
                    <span slot="title">Đăng ký khám</span>
                </el-menu-item>
            </nuxt-link>
            <nuxt-link to="/appointment" class="sidebar-nav-link">
                <el-menu-item index="appointment">
                    <i class='bx bxs-calendar-plus'></i>
                    <span slot="title">Lịch hẹn</span>
                </el-menu-item>
            </nuxt-link>
            <nuxt-link to="/calendar" class="sidebar-nav-link">
                <el-menu-item index="calendar">
                    <i class='bx bxs-calendar' ></i>
                    <span slot="title">Lịch làm việc</span>
                </el-menu-item>
            </nuxt-link>
            <nuxt-link to="/patient" class="sidebar-nav-link">
                <el-menu-item index="patient">
                    <i class='bx bxs-group'></i>
                    <span slot="title">Khách hàng</span>
                </el-menu-item>
            </nuxt-link>
        </el-menu>
    </div>
</template>

<script>
export default {
    props: { 
        isCollapse: Boolean,
    },
    data() {
        return {
            itemSidebarActive: '',
        }
    },
    mounted() {
        this.itemSidebarActive = this.$nuxt.$route.path.split('/')[1];
    },
    methods: {
        // isRouteActive(id) {
		// 	const _this = this;
		// 	if (_this.$nuxt.$route.path.split('/')[1] === id && _this.$nuxt.$route.path.split('/')[2]) {
		// 		return this.itemSidebarActive = id;
		// 	} else {
		// 		if (_this.$nuxt.$route.path.split('/')[1] === id && _this.$nuxt.$route.query) {
		// 			return this.itemSidebarActive = id;
		// 		} else {
		// 			return false;
		// 		}
		// 	}
		// },
    }
}
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
}
.sidebar {
	margin-top: 65px;
    min-height: 100vh;
}
.sidebar .el-menu{
    box-shadow: rgba(0,0,0,0.12) 0px 1px 4px 1px;
}
.sidebar-nav-link {
	text-decoration: none !important;
}

/* .sidebar:hover {
	width: 250px;
}

.sidebar-nav {
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100vh;
}

.sidebar-nav-item {
	width: 100%;
}

.sidebar-nav-link i {
	font-size: 1.8rem;
	color: #727475 !important;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}

.sidebar-nav-link div {
	min-width: 82px;
	height: 50px;
	position: relative;
}

a.sidebar-nav-link {
    height: 77px;
}

.sidebar-nav-link:hover {
	background: #dbdbdb;
	border-radius: 10px;
}

.sidebar-nav-link.active {
	background: #f1f1f1!important;
	color: #31a315!important;
}

.sidebar-nav-link.active {
	border-left: 6px solid #31a315;
}

.sidebar-nav-link.active i {
	color: #31a315!important;
	margin-left: -5px;
}

.sidebar-expand .sidebar {
	width: 250px;
}

.sidebar-expand .wrapper {
	margin-left: 250px;
} */
</style>