<template>
    <div class="login__body">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-8 col-lg-6 col-xl-5">
                    <form @submit.prevent="forgotPassword" class="login-form">
                        <div class="logo">
                            <img src="/images/logoclinic.png" alt="">
                        </div>
                        <div v-if="!done" class="mt-4" style="opacity:0.6; font-size:14px; text-align:center;">
                            Nhập tài khoản để lấy lại mật khẩu
                        </div>
                        <div v-else class="mt-4" style="opacity:0.6; font-size:14px; text-align:center;">
                            Vui lòng kiếm tra email phục hồi mật khẩu được gửi từ hệ thống
                        </div>
                        <div v-if="!done" class="input-box">
                            <div class="usename_box">
                                <el-input placeholder="Tài khoản" v-model="username">
                                    <i slot="prefix" class="el-input__icon el-icon-user-solid"></i>
                                </el-input>
                            </div>
                        </div>
                        <!-- <button v-if="!done" :loading="true" type="submit" class="login-button mt-4">Lấy lại mật khẩu</button> -->
                        <el-button v-if="!done" native-type="submit" :loading="loading" class="login-button mt-4">
                            Lấy lại mật khẩu
                        </el-button>
                        <div class="text-center mt-4" style="opacity:0.8; font-size:14px;">
                            <nuxt-link to="/login" class="sidebar-nav-link">
                                <a href="javascript:void(0)">
                                    <span>Về trang đăng nhập</span>
                                </a>
                            </nuxt-link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    auth: false,
    layout: 'blank',
    name: 'ForgotPassword',
    data() {
		return {
			username: '',
			done: false,
            loading: false,
		};
	},
    methods: {
        async forgotPassword() {
            const _this = this;
            _this.loading = true;
            try{
                const response = await _this.$axios.$post(`/api/account/forgotPassword`, {
					username: _this.username
				});
                if (response && response.success) {
					_this.done = true;
				} else {
					_this.$message.error(response.error);
				}
            }
            catch (err) {
				console.log(err);
                _this.$message({
                    showClose: true,
                    message: err,
                    type: 'error',
                });
			}
            _this.loading = false;
        }
    }
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
    width: 90%;
    margin: 0 auto;
    /* height: 520px; */
    padding: 45px 35px 35px 35px;
    border-radius: 12px;
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
    padding: 30px 0 0 0;
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
    /* height: 45px; */
    padding: 12px;
    border-radius: 4px;
    font-size: 18px;
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