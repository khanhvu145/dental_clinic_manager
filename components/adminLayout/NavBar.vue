<template>
    <div class="headerAppAdmin">
        <div class="container-fluid">
            <div class="navbar-admin">
                    <ul class="navbar-admin-list">
                        <li class="navbar-admin-item">
                            <a class="navbar-admin-link">
                                <i class='bx bx-menu' @click="collapseSidebar"></i>
                            </a>
                        </li>
                        <li class="navbar-admin-item">
                            <img src="/images/logoclinic.png" alt="" class="logo">
                        </li>
                    </ul>
                    <el-dropdown trigger="click" @command="handleCommand">
                        <span class="el-dropdown-link">
                            <div class="navbar__nav-admin">
                                <div class="navbar__name-admin">Hello, {{ formData.name }}</div>
                                <div class="navbar__img-admin">
                                    <img src="" alt="">
                                </div>
                            </div>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="account">
                                <i class='bx bxs-user-account' ></i>
                                Tài khoản
                            </el-dropdown-item>
                            <el-dropdown-item command="clinic">
                                <i class='bx bx-clinic'></i>
                                Phòng khám
                            </el-dropdown-item>
                            <el-dropdown-item command="logout">
                                <i class='bx bx-log-out'></i>
                                Đăng xuất
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script>
import User from '@/models/Employee';
export default {
    props: { 
        isCollapse: Boolean,
    },
    data() {
      return {
          formData: new User(),
        //   checkRole: false,
      };
    },
    async created() {
		const _this = this;
		setTimeout(async () => {
			const userResponse = await _this.$axios.$get('api/account/info');
			_this.formData = userResponse.data || {};
		}, 500);
	},
    methods: {
        async handleCommand(command) {
            if(command == 'logout') {
                await this.$auth.logout();
			    await this.$router.push('/login');
            }
            if(command == 'clinic') {
			    await this.$router.push('/');
            }
        },
        collapseSidebar(){
            var keyChange = !this.isCollapse;
            this.$emit('changeSidebar', keyChange);
        }
    }
}
</script>

<style>
.headerAppAdmin{
    position: fixed;
	top: 0;
	right: 0;
	left: 0;
	z-index: 101;
    background: #fff;
	color: #364d67;
    box-shadow: rgba(0,0,0,0.12) 0px 1px 4px 1px;
}
.navbar-admin {
	display: flex;
	flex-direction: row;
    justify-content: space-between;
}

.navbar-admin-list {
	list-style: none;
	display: flex;
	flex-direction: row;
	padding-left: 0;
	margin-bottom: 0;
	margin-top: 0;
}

.navbar-admin-link {
	display: flex;
    align-items: center;
    height: 100%;
	text-decoration: none;
	font-size: 17px;
	position: relative;
}

.navbar-admin-link:hover {
    cursor: pointer;
}

.navbar-admin-link i{
    font-size: 28px;
    padding: 8px 16px;
}
.navbar__img-admin{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}

.navbar__img-admin > img{
    width: 100%;
    min-width: 100%;
    min-height: 100%;
    object-fit: cover;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.logo {
    height: 60px;
}

.title-logo {
    height: 50px;
    padding: 5px 5px 5px 0px;
}
.navbar__nav-admin{
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 16px;
}

.navbar__nav-admin .navbar__name-admin {
    margin-right: 16px;
    opacity: 0.5;
    user-select: none;
    font-weight: bold;
    font-size: 16px;
}
</style>