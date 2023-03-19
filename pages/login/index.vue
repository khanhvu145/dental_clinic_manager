<template>
    <div class="login__body">
        <form @submit.prevent="userLogin" class="login-form">
            <div class="logo">
                <img src="/images/logoclinic.png" alt="">
            </div>
            <div class="mt-4" style="opacity:0.6; font-size:14px; text-align:center;">
                Nhập tài khoản & mật khẩu để đăng nhập
            </div>
            <div class="input-box">
                <div class="usename_box">
                    <el-input placeholder="Tài khoản" v-model="login.username">
                        <i slot="prefix" class="el-input__icon el-icon-user-solid"></i>
                    </el-input>
                </div>
                <div class="password_box mt-3">
                    <el-input placeholder="Mật khẩu" v-model="login.password" show-password>
                        <i slot="prefix" class='el-input__icon bx bxs-lock' ></i>
                    </el-input>
                </div>
            </div>
            <button type="submit" class="login-button mt-4">Đăng nhập</button>
            <div class="text-center mt-4" style="opacity:0.8; font-size:14px;">
                <nuxt-link to="/forgotpassword" class="sidebar-nav-link">
                    <a href="javascript:void(0)">
                        <span>Quên mật khẩu?</span>
                    </a>
                </nuxt-link>
            </div>
        </form>
    </div>
</template>

<script>
import SocketioService from '../../services/socketio.service.js';
export default {
    layout: 'blank',
    name: 'Login',
    data() {
		return {
			login: {
				username: '',
				password: '',
			},
		};
	},
    methods: {
        async userLogin() {
			const _this = this;
			try {
				const response = await this.$auth.loginWith('local', { data: _this.login });
				if (response.data.success) {
                    await SocketioService.setupSocketConnection(_this.$store, _this.login.username);
                    _this.$message({
						showClose: true,
						message: response.data.message,
						type: 'success',
					});
                    _this.$router.push('/');
				}
                else {
                    _this.$message({
						showClose: true,
						message: response.data.error,
						type: 'error',
					});
                }
			} catch (err) {
				console.log(err);
                _this.$message({
                    showClose: true,
                    message: err,
                    type: 'error',
                });
			}
		},
    },
}
</script>

<style scoped>
.login__body{
    margin: 0;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    font-family: "Lato", sans-serif;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #555;
    /* background-color: #f0f2f5; */
    background: url('/images/login_bg.jpg');
    background-repeat: no-repeat;
    background-size: cover;
}

.login-form{
    width: 375px;
    height: 520px;
    padding: 60px 35px 35px 35px;
    border-radius: 24px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%);
    border: none;
}

.logo {
    width: 228px;
    height: 166px;
    margin: 0 auto;
    margin-top: -15px;
}

.logo img{
    height: 166px;
}

.errAlert{
    display: block;
    margin: 16px 0;
    text-align: center;
    color: #fc0202;
}

.title{
    text-align: center;
    font-size: 28px;
    padding-top: 24px;
    letter-spacing: 0.5px;
}

.input-box{
    width: 100%;
    padding: 30px 5px 1px 5px;
}

.input-box input{
    border: none;
    outline: none;
    background: none;
    font-size: 18px;
    color: #555;
    padding: 20px 10px 20px 5px;
}

.username, .password {
    border-radius: 20px;
    box-shadow: inset 8px 8px 8px #cbced1, 
    inset -8px -8px 8px #fff;
}

.username {
    margin-bottom: 30px;
}

.password {
    margin-bottom: 10px;
}

.input-box svg{
    height: 22px;
    margin: 0 10px -3px 25px;
}
.login-button {
    outline: none;
    border: none;
    cursor: pointer;
    width: 100%;
    height: 45px;
    border-radius: 30px;
    font-size: 20px;
    font-weight: 700;
    font-family: "Lato", sans-serif;
    background: rgb(40, 145, 19);
    color: #fff;
    text-align: center;
    box-shadow: 3px 3px 8px #b1b1b1, 
    -3px -3px 8px #fff;
    transition: all .3s;
}
.login-button:hover {
    background-color: rgb(33, 168, 44);
}
</style>