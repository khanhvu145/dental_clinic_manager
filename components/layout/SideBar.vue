<template>
    <div class="sidebar">
        <el-menu v-bind:default-active="isRouteActive()" class="el-menu-vertical-demo" :collapse="isCollapse" :unique-opened="true">
            <el-submenu
                v-if="checkAccessRight('overview') || checkAccessRight('customerProfile')"
                index="1"
            >
                <template slot="title">
                    <i class='bx bxs-dashboard'></i>
                    <span>Báo cáo</span>
                </template>
                <nuxt-link v-if="checkAccessRight('overview')" to="/report/overview" class="sidebar-nav-link">
                    <el-menu-item index="overview">
                        <i class='bx bxs-bar-chart-alt-2'></i>
                        <span slot="title">Tổng quan</span>
                    </el-menu-item>
                </nuxt-link>
                <nuxt-link v-if="checkAccessRight('customerProfile')" to="/report/customerProfile" class="sidebar-nav-link">
                    <el-menu-item index="customerProfile">
                        <i class='bx bxs-pie-chart-alt-2' ></i>
                        <span slot="title">Khách hàng</span>
                    </el-menu-item>
                </nuxt-link>
            </el-submenu>
            <nuxt-link v-if="checkAccessRight('customer')" to="/customer" class="sidebar-nav-link">
                <el-menu-item index="customer">
                    <i class='bx bxs-user-badge'></i>
                    <span slot="title">Khách hàng</span>
                </el-menu-item>
            </nuxt-link>
            <el-submenu 
                v-if="
                    checkAccessRight('register') ||
                    checkAccessRight('appointment') ||
                    checkAccessRight('workingCalendar') ||
                    checkAccessRight('appointmentConfig')
                "
                index="2"
            >
                <template slot="title">
                    <i class='bx bxs-calendar-event'></i>
                    <span>Lịch hẹn</span>
                </template>
                <nuxt-link v-if="checkAccessRight('register')" to="/register" class="sidebar-nav-link">
                    <el-menu-item index="register">
                        <i class='bx bxs-calendar-plus'></i>
                        <span slot="title">Đăng ký khám</span>
                    </el-menu-item>
                </nuxt-link>
                <nuxt-link v-if="checkAccessRight('appointment')" to="/appointment" class="sidebar-nav-link">
                    <el-menu-item index="appointment">
                        <i class='bx bxs-calendar-edit' ></i>
                        <span slot="title">Quản lý lịch hẹn</span>
                    </el-menu-item>
                </nuxt-link>
                <nuxt-link v-if="checkAccessRight('workingCalendar')" to="/workingCalendar" class="sidebar-nav-link">
                    <el-menu-item index="workingCalendar">
                        <i class='bx bxs-calendar'></i>
                        <span slot="title">Lịch làm việc</span>
                    </el-menu-item>
                </nuxt-link>
                <nuxt-link v-if="checkAccessRight('appointmentConfig')" to="/appointmentConfig" class="sidebar-nav-link">
                    <el-menu-item index="appointmentConfig">
                        <i class='bx bxs-cog'></i>
                        <span slot="title">Cấu hình lịch hẹn</span>
                    </el-menu-item>
                </nuxt-link>
            </el-submenu>

            <el-submenu 
                v-if="
                    checkAccessRight('receipts') ||
                    checkAccessRight('payment')
                "
                index="3"
            >
                <template slot="title">
                    <i class='bx bxs-food-menu'></i>
                    <span>Quản lý thu chi</span>
                </template>
                <nuxt-link v-if="checkAccessRight('receipts')" to="/receipts" class="sidebar-nav-link">
                    <el-menu-item index="receipts">
                        <i class='bx bxs-receipt'></i>
                        <span slot="title">Phiếu thu</span>
                    </el-menu-item>
                </nuxt-link>
                <nuxt-link v-if="checkAccessRight('payment')" to="/payment" class="sidebar-nav-link">
                    <el-menu-item index="payment">
                        <i class='bx bx-receipt' ></i>
                        <span slot="title">Phiếu chi</span>
                    </el-menu-item>
                </nuxt-link>
            </el-submenu>
            <el-submenu 
                v-if="
                    checkAccessRight('service')
                "
                index="4"
            >
                <template slot="title">
                    <i class='bx bxs-category-alt'></i>
                    <span>Thiết lập</span>
                </template>
                <nuxt-link v-if="checkAccessRight('service')" to="/service" class="sidebar-nav-link">
                    <el-menu-item index="service">
                        <i class='bx bxs-category-alt'></i>
                        <span slot="title">Loại hình dịch vụ</span>
                    </el-menu-item>
                </nuxt-link>
                <!-- <nuxt-link v-if="checkAccessRight('medicine')" to="/medicine" class="sidebar-nav-link">
                    <el-menu-item index="medicine">
                        <i class='bx bxs-capsule'></i>
                        <span slot="title">Thuốc men</span>
                    </el-menu-item>
                </nuxt-link> -->
            </el-submenu>
            <el-submenu 
                v-if="
                    checkAccessRight('accessgroup') ||
                    checkAccessRight('users')
                "
                index="5"
            >
                <template slot="title">
                    <i class='bx bxs-user-account'></i>
                    <span>Hệ thống</span>
                </template>
                <nuxt-link v-if="checkAccessRight('accessgroup')" to="/accessgroup" class="sidebar-nav-link">
                    <el-menu-item index="accessgroup">
                        <i class='bx bxs-group'></i>
                        <span slot="title">Nhóm quyền</span>
                    </el-menu-item>
                </nuxt-link>
                <nuxt-link v-if="checkAccessRight('users')" to="/users" class="sidebar-nav-link">
                    <el-menu-item index="users">
                        <i class='bx bxs-user'></i>
                        <span slot="title">Người dùng</span>
                    </el-menu-item>
                </nuxt-link>
            </el-submenu>
            <el-submenu 
                v-if="
                    checkAccessRight('generalconfig') ||
                    checkAccessRight('smtpConfig')
                "
                index="6"
            >
                <template slot="title">
                    <i class='bx bxs-cog'></i>
                    <span slot="title">Cấu hình</span>
                </template>
                <nuxt-link v-if="checkAccessRight('generalconfig')" to="/generalconfig" class="sidebar-nav-link">
                    <el-menu-item index="generalconfig">
                        <i class='bx bx-cog'></i>
                        <span slot="title">Cấu hình chung</span>
                    </el-menu-item>
                </nuxt-link>
                <nuxt-link v-if="checkAccessRight('informationConfig')" to="/informationConfig" class="sidebar-nav-link">
                    <el-menu-item index="informationConfig">
                        <i class='bx bxs-info-circle'></i>
                        <span slot="title">Cấu hình thông tin</span>
                    </el-menu-item>
                </nuxt-link>
                <nuxt-link v-if="checkAccessRight('smtpConfig')" to="/smtpConfig" class="sidebar-nav-link">
                    <el-menu-item index="smtpConfig">
                        <i class='bx bxs-envelope'></i>
                        <span slot="title">Cấu hình SMTP</span>
                    </el-menu-item>
                </nuxt-link>
            </el-submenu>
            <el-submenu 
                v-if="
                    checkAccessRight('register') ||
                    checkAccessRight('appointment') ||
                    checkAccessRight('workingCalendar') ||
                    checkAccessRight('appointmentConfig')
                "
                index="7"
            >
                <template slot="title">
                    <i class='bx bxs-calendar-event'></i>
                    <span>Lịch hẹn V2</span>
                </template>
                <nuxt-link v-if="checkAccessRight('appointmentConfig')" to="/appointmentConfigV2" class="sidebar-nav-link">
                    <el-menu-item index="appointmentConfigV2">
                        <i class='bx bxs-cog'></i>
                        <span slot="title">Cấu hình lịch hẹn</span>
                    </el-menu-item>
                </nuxt-link>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
import { intersection } from 'lodash';
import { mapState } from 'vuex';
export default {
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
            userInfo: (state) => state.auth.user,
		}),
	},
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
        checkAccessRight(value) {
			const _this = this;
			let values = [value + '.view', value + '.all'];
            return !!(intersection(_this.accesses || [], values).length > 0);
		},
        isRouteActive() {
			const _this = this;
            var index = _this.$nuxt.$route.path.split('/')[1];
            if(index != 'report'){
                _this.itemSidebarActive = _this.$nuxt.$route.path.split('/')[1];
            }
            else{
                _this.itemSidebarActive = _this.$nuxt.$route.path.split('/')[2];
            }
            return _this.itemSidebarActive;
		},
    }
}
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 210px;
}
.sidebar {
	margin-top: 65px;
    min-height: 100vh;
}
.sidebar-nav-link {
	text-decoration: none !important;
}
</style>