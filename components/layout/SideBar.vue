<template>
    <div class="sidebar">
        <el-menu v-bind:default-active="isRouteActive()" class="el-menu-vertical-demo" :collapse="isCollapse">
            <nuxt-link to="/register" class="sidebar-nav-link">
                <el-menu-item index="register">
                    <i class='bx bxs-calendar-plus'></i>
                    <span slot="title">Đăng ký khám</span>
                </el-menu-item>
            </nuxt-link>
            <el-submenu index="1">
                <template slot="title">
                    <i class='bx bxs-calendar-event'></i>
                    <span>Lịch hẹn</span>
                </template>
                <nuxt-link to="/appointment" class="sidebar-nav-link">
                    <el-menu-item index="appointment">
                        <i class='bx bxs-calendar-edit' ></i>
                        <span slot="title">Quản lý lịch hẹn</span>
                    </el-menu-item>
                </nuxt-link>
                <nuxt-link to="/appointmentConfig" class="sidebar-nav-link">
                    <el-menu-item index="appointmentConfig">
                        <i class='bx bxs-cog'></i>
                        <span slot="title">Cấu hình lịch hẹn</span>
                    </el-menu-item>
                </nuxt-link>
            </el-submenu>
            <!-- <nuxt-link to="/appointment" class="sidebar-nav-link">
                <el-menu-item index="appointment">
                    <i class='bx bxs-calendar-plus'></i>
                    <span slot="title">Lịch hẹn</span>
                </el-menu-item>
            </nuxt-link> -->
            <!-- <nuxt-link to="/calendar" class="sidebar-nav-link">
                <el-menu-item index="calendar">
                    <i class='bx bxs-calendar' ></i>
                    <span slot="title">Lịch làm việc</span>
                </el-menu-item>
            </nuxt-link> -->
            <nuxt-link to="/customer" class="sidebar-nav-link">
                <el-menu-item index="customer">
                    <i class='bx bxs-user-badge'></i>
                    <span slot="title">Khách hàng</span>
                </el-menu-item>
            </nuxt-link>
            <nuxt-link to="/users" class="sidebar-nav-link">
                <el-menu-item index="users">
                    <i class='bx bxs-user'></i>
                    <span slot="title">Người dùng</span>
                </el-menu-item>
            </nuxt-link>
            <nuxt-link to="/accessgroup" class="sidebar-nav-link">
                <el-menu-item index="accessgroup">
                    <i class='bx bxs-group'></i>
                    <span slot="title">Nhóm người dùng</span>
                </el-menu-item>
            </nuxt-link>
            <nuxt-link to="/service" class="sidebar-nav-link">
                <el-menu-item index="service">
                    <i class='bx bxs-category-alt'></i>
                    <span slot="title">Loại hình dịch vụ</span>
                </el-menu-item>
            </nuxt-link>
            <el-submenu index="2">
                <template slot="title">
                    <i class='bx bxs-cog'></i>
                    <span slot="title">Cấu hình</span>
                </template>
                <nuxt-link to="/generalconfig" class="sidebar-nav-link">
                    <el-menu-item index="generalconfig">
                        <i class='bx bx-cog'></i>
                        <span slot="title">Cấu hình chung</span>
                    </el-menu-item>
                </nuxt-link>
                <nuxt-link to="/smtpConfig" class="sidebar-nav-link">
                    <el-menu-item index="smtpConfig">
                        <i class='bx bxs-envelope'></i>
                        <span slot="title">Cấu hình mail</span>
                    </el-menu-item>
                </nuxt-link>
            </el-submenu>
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
    // mounted() {
    //     this.itemSidebarActive = this.$nuxt.$route.path.split('/')[1];
    // },
    methods: {
        isRouteActive() {
			const _this = this;
			_this.itemSidebarActive = _this.$nuxt.$route.path.split('/')[1];
            return _this.itemSidebarActive;
		},
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
.sidebar-nav-link {
	text-decoration: none !important;
}
</style>