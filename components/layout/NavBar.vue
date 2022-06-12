<template>
    <div class="headerApp">
        <div class="container-fluid">
            <div class="navbar-custom">
                    <ul class="navbar-list">
                        <li class="navbar-item">
                            <a class="navbar-link">
                                <i class='bx bx-menu' @click="collapseSidebar"></i>
                            </a>
                            <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
                                <el-radio-button :label="false">
                                    <i class='bx bx-menu'></i>
                                </el-radio-button>
                                <el-radio-button :label="true">
                                    <i class='bx bx-menu'></i>
                                </el-radio-button>
                            </el-radio-group> -->
                        </li>

                        <li class="navbar-item">
                            <img src="/images/Logodental.png" alt="" class="logo">
                            <img src="/images/chulogo.png" alt="" class="title-logo">
                        </li>
                    </ul>
                    <el-dropdown trigger="click" @command="handleCommand">
                        <span class="el-dropdown-link">
                            <!-- Dropdown List<i class="el-icon-arrow-down el-icon--right"></i> -->
                            <div class="navbar__nav">
                                <div class="navbar__name">{{ formData.name }}</div>
                                <div class="navbar__img">
                                    <img src="" alt="">
                                </div>
                            </div>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="account">
                                <i class='bx bxs-user-account' ></i>
                                Tài khoản
                            </el-dropdown-item>
                            <el-dropdown-item command="manager">
                                <i class='bx bx-book-content'></i>
                                Quản lý
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
        },
        collapseSidebar(){
            // document.getElementsByTagName('body')[0].classList.toggle('sidebar-expand');
            var keyChange = !this.isCollapse;
            this.$emit('changeSidebar', keyChange);
        }
    }
}
</script>

<style>
.headerApp{
    position: fixed;
	top: 0;
	right: 0;
	left: 0;
	z-index: 101;
    background: #208108;
	color: #909090;
    box-shadow: rgba(0,0,0,0.12) 0px 1px 4px 1px;
}
.navbar-custom {
	display: flex;
	flex-direction: row;
    justify-content: space-between;
}

.navbar-list {
	list-style: none;
	display: flex;
	flex-direction: row;
	padding-left: 0;
	margin-bottom: 0;
	margin-top: 0;
}

.navbar-link {
	display: flex;
    align-items: center;
    height: 100%;
	text-decoration: none;
	font-size: 17px;
	color: #ffffff;
	position: relative;
}

.navbar-link:hover {
    cursor: pointer;
}

.navbar-link i{
    font-size: 28px;
    color: #fff;
    padding: 8px 16px;
}
.navbar__img{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
	background-color: #fff;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}

.navbar__img > img{
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
/* .nav-right {
    margin-left: auto;
} */
.navbar__nav{
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 16px;
}

.navbar__nav .navbar__name {
    margin-right: 16px;
    color: #ffffff;
    user-select: none;
    font-weight: bold;
    font-size: 16px;
}

.navbar__nav::after {
	content: '';
	position: absolute;
	top: 50%;
	left: 50%;
	width: 100%;
	height: 100%;
	transform: translate(-50%, -50%);
	background-color: transparent;
	border-radius: 36px;
	transition: all ease 0.5s;
}

.navbar__nav:hover::after {
    background-color: rgba(0, 0, 0, 0.1);
}

/* .nav-right > a {
	display: flex;
    align-items: center;
    gap: 16px;
    position: relative;
    cursor: pointer;
	text-decoration: none;
	color: #ffffff;
	padding: 12px 16px;
}

.nav-right > a::after {
	content: '';
	position: absolute;
	top: 50%;
	left: 50%;
	width: calc(100% - 16px);
	height: calc(100% - 12px);
	transform: translate(-50%, -50%);
	background-color: transparent;
	border-radius: 36px;
	transition: all ease 0.5s;
}

.nav-right:hover > a::after{
	background-color: rgba(0, 0, 0, 0.1);
}

.navbar__name{
    margin: 0;
    user-select: none;
    font-weight: bold;
} */
</style>