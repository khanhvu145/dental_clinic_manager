<template>
    <div class="admin__sidebar">
        <el-menu v-bind:default-active="itemSidebarActive" class="el-menu-vertical-demo" :collapse="isCollapse">
            <nuxt-link to="/administration" class="sidebar-nav-link">
                <el-menu-item index="">
                    <i class='bx bx-bar-chart-alt-2'></i>
                    <span slot="title">Thống kê</span>
                </el-menu-item>
            </nuxt-link>
            <nuxt-link to="/administration/employee" class="sidebar-nav-link">
                <el-menu-item index="employee">
                    <i class='bx bx-injection'></i>
                    <span slot="title">Nhân viên</span>
                </el-menu-item>
            </nuxt-link>
            <nuxt-link to="/administration/customer" class="sidebar-nav-link">
                <el-menu-item index="customer">
                    <i class='bx bx-face'></i>
                    <span slot="title">Khách hàng</span>
                </el-menu-item>
            </nuxt-link>
            <nuxt-link to="/administration/appointment" class="sidebar-nav-link">
                <el-menu-item index="appointment">
                    <i class='bx bx-calendar-check'></i>
                    <span slot="title">Lịch hẹn</span>
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
        this.itemSidebarActive = this.$nuxt.$route.path.split('/')[2];
    },
    methods: {

    }
}
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
}
.admin__sidebar {
	margin-top: 65px;
    min-height: 100vh;
}
.admin__sidebar .el-menu{
    box-shadow: rgba(0,0,0,0.12) 0px 1px 4px 1px;
}
.sidebar-nav-link {
	text-decoration: none !important;
}
.admin__sidebar .el-menu-item.is-active {
    color: #364d67;
    opacity: 1;
    text-decoration: none;
    border-left: 6px solid #9BD168;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    background-color: unset;
}
.admin__sidebar .el-menu-item {
    color: #364d67;
    opacity: 0.5;
}
</style>