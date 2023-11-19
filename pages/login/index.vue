<template>
    <div class='auth-fluid'>
        <!-- Auth fluid right content -->
        <div class='auth-fluid-right'>
        </div>
        <!--Auth fluid left content -->
        <div class='auth-fluid-form-box'>
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-12">
                        <form @submit.prevent="userLogin" class="login-form-v2">
                            <div class="logo-v2">
                                <img src="/images/logoclinic.png" alt="">
                            </div>
                            <div class="mt-4" style="opacity:0.6; font-size:14px; text-align:center;">
                                Nhập tài khoản & mật khẩu để đăng nhập hệ thống
                            </div>
                            <div class="input-box mt-3 pt-3" style="color:#a09898;">
                                <div class="usename_box">
                                    <div class="col-form-label">Tài khoản</div>
                                    <el-input placeholder="Tài khoản" v-model="login.username">
                                        <i slot="prefix" class="el-input__icon el-icon-user-solid"></i>
                                    </el-input>
                                </div>
                                <div class="password_box">
                                    <div class="col-form-label">Mật khẩu</div>
                                    <el-input placeholder="Mật khẩu" v-model="login.password" show-password>
                                        <i slot="prefix" class='el-input__icon bx bxs-lock' ></i>
                                    </el-input>
                                </div>
                            </div>
                            <el-button native-type="submit" :loading="loading" class="login-button mt-4">
                                Đăng nhập
                            </el-button>
                            <div class="text-center mt-4" style="opacity:0.8; font-size:14px;">
                                <nuxt-link to="/forgotpassword" class="sidebar-nav-link">
                                    <a href="javascript:void(0)">
                                        <span>Quên mật khẩu?</span>
                                    </a>
                                </nuxt-link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    layout: 'blank',
    name: 'Login',
    data() {
		return {
			login: {
				username: '',
				password: '',
			},
            loading: false,
		};
	},
    methods: {
        async userLogin() {
			const _this = this;
            _this.loading = true;
			try {
				const response = await this.$auth.loginWith('local', { data: _this.login });
				if (response.data.success) {
                    _this.$message({
						showClose: true,
						message: response.data.message,
						type: 'success',
					});
                    _this.$router.go();
                    // _this.$router.push('/');
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
            _this.loading = false;
		},
    },
}
</script>

<style scoped>
.auth-fluid {
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    min-height: 100vh;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    -webkit-box-align: stretch;
    -ms-flex-align: stretch;
    align-items: stretch;
    background: url('/images/login_bg_2.jpg') center;
    background-size: cover;
}
.auth-fluid .auth-fluid-right {
    padding: 6rem 3rem;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    position: relative;
    color: #fff;
    background-color: rgba(0,0,0,.5);
}
.auth-fluid .auth-fluid-form-box {
    max-width: 480px;
    border-radius: 0;
    z-index: 2;
    padding: 2rem 2rem;
    background-color: #fff;
    position: relative;
    width: 100%;
}
@media (max-width: 700px){
    .auth-fluid .auth-fluid-form-box {
        max-width: 100%;
        min-height: 100vh;
    }
    .auth-fluid .auth-fluid-right {
        display: none;
    }
}
.logo-v2{
    width: 100%;
    height: 180px;
    overflow: hidden;
    position: relative;
}

.logo-v2 > img{
    height: 100%;
    width: auto;
    -o-object-fit: cover;
    object-fit: cover;
    position: absolute;
    top: 50%;
    left: 51%;
    transform: translate(-51% , -50%);
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