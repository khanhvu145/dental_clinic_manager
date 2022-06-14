<template>
    <div class="login__body">
        <form @submit.prevent="userLogin" class="login-form">
            <div class="logo">
                <img src="/images/logoclinic.png" alt="">
            </div>
            <div class="input-box">
                <div class="username">
                    <svg class="svg-icon" viewBox="0 0 20 20">
                        <path d="M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z"></path>
                    </svg>
                    <input
                        class="user-input"
                        type="text"
                        id="username"
                        v-model="login.username"
                        required=""
                        placeholder="Nhập tài khoản"
                    />
                </div>
                <div class="password">
                    <svg class="svg-icon" viewBox="0 0 20 20">
                        <path d="M17.308,7.564h-1.993c0-2.929-2.385-5.314-5.314-5.314S4.686,4.635,4.686,7.564H2.693c-0.244,0-0.443,0.2-0.443,0.443v9.3c0,0.243,0.199,0.442,0.443,0.442h14.615c0.243,0,0.442-0.199,0.442-0.442v-9.3C17.75,7.764,17.551,7.564,17.308,7.564 M10,3.136c2.442,0,4.43,1.986,4.43,4.428H5.571C5.571,5.122,7.558,3.136,10,3.136 M16.865,16.864H3.136V8.45h13.729V16.864z M10,10.664c-0.854,0-1.55,0.696-1.55,1.551c0,0.699,0.467,1.292,1.107,1.485v0.95c0,0.243,0.2,0.442,0.443,0.442s0.443-0.199,0.443-0.442V13.7c0.64-0.193,1.106-0.786,1.106-1.485C11.55,11.36,10.854,10.664,10,10.664 M10,12.878c-0.366,0-0.664-0.298-0.664-0.663c0-0.366,0.298-0.665,0.664-0.665c0.365,0,0.664,0.299,0.664,0.665C10.664,12.58,10.365,12.878,10,12.878"></path>
                    </svg>
                    <input
                        type="password"
                        id="password"
                        v-model="login.password"
                        class="pass-input"
                        placeholder="Nhập mật khẩu"
                    />
                </div>
            </div>
            <div class="checkbox">
                <input type="checkbox" name="" id="remember">
                <label for="remember">Nhớ mật khẩu</label>
            </div>
            <button type="submit" class="login-button">Login</button>
        </form>
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
		};
	},
    methods: {
        async userLogin() {
			const _this = this;
			try {
				const response = await this.$auth.loginWith('local', { data: this.login });
				if (response.data.success) {
					await _this.$store.commit('role/SET_USERID', this.login.username);
                    _this.$message({
						showClose: true,
						message: 'Đăng nhập thành công',
						type: 'success',
					});
                    _this.$router.push('/');
				}
                else {
                    _this.$message({
						showClose: true,
						message: 'Tài khoản hoặc mật khẩu sai!!',
						type: 'error',
					});
                }
			} catch (err) {
				console.log(err);
			}
		},
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
    background-color: #ecf0f3;
}

.login-form{
    width: 375px;
    height: 580px;
    padding: 60px 35px 35px 35px;
    border-radius: 40px;
    background-color: #ecf0f3;
    box-shadow: 13px 13px 20px #cbced1,
    -13px -13px 20px #fff;
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
    padding: 45px 5px 1px 5px;
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

.checkbox {
    text-align: left;
    padding: 10px;
    margin-bottom: 10px;
}

.checkbox input{
    cursor: pointer;
    top: 10px;
}

.checkbox label{
    font-size: 14px;
    font-weight: 300;
    cursor: pointer;
}

.login-button {
    outline: none;
    border: none;
    cursor: pointer;
    width: 100%;
    height: 60px;
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
    background-color: rgb(75, 231, 88);
}
</style>