<template>
    <div class="headerApp">
        <div class="container-fluid">
            <div class="navbar-custom" style="min-height:63px;">
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

                    <li v-if="windowWidth > 500" class="navbar-item">
                        <img src="/images/Logodental.png" alt="" class="logo">
                        <img src="/images/chulogo.png" alt="" class="title-logo">
                    </li>
                </ul>
                <div class="d-flex align-items-center" style="gap: 6px;">
                    <el-badge :value="notificationGet.filter(e => e.status == 'new').length" class="item">
                        <el-dropdown trigger="click" @visible-change="handleDropdownChange" @command="handleCommandNotify">
                            <el-button class="btn-custom" size="medium" icon="el-icon-message-solid" circle></el-button>
                            <el-dropdown-menu slot="dropdown" v-loading="dataLoading">
                                <div style="font-weight:bold;color:#606266;padding:10px 20px 14px 20px;">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span>Thông báo</span>
                                        <el-link :underline="false" style="font-style:italic;font-size:13px;" @click="updateSeenStatusAll">
                                            Xem tất cả
                                            <i class="el-icon-view el-icon--right"></i> 
                                        </el-link>
                                    </div>
                                </div>
                                <hr style="margin:0">
                                <div 
                                    class="infinite-list-custom" 
                                    v-infinite-scroll="loadNotifications" 
                                    :infinite-scroll-disabled="isCheck && loading" 
                                    infinite-scroll-distance="350"
                                    style="max-height:350px;overflow-y:auto;width:400px;"
                                >
                                    <el-dropdown-item 
                                        class="pt-2 pb-2 infinite-list-item"
                                        style="font-size:14px;line-height:22px;max-width:400px;" 
                                        :style="{ backgroundColor: notify.status == 'new' ? 'rgba(234,255,234)' : '' }"
                                        v-for="notify in notifications" 
                                        :key="notify._id"
                                        :command="notify"
                                    >
                                        <el-badge :is-dot="notify.status == 'new'" class="item" style="width:100%">
                                            <div style="font-weight:bold;">{{ notify.title }}</div>
                                        </el-badge>
                                        <div v-html="notify.content"></div>
                                        <div style="font-style:italic;color:#98a6ad;font-size:12px;">{{ $moment(notify.createdAt).fromNow() }}</div>
                                    </el-dropdown-item>
                                    <el-dropdown-item class="mt-4" v-if="loading" v-loading="loading" element-loading-text="Loading..." element-loading-spinner="el-icon-loading" style="pointer-events:none;font-style:italic;font-size:14px;text-align:center;line-height:14px;"></el-dropdown-item>
                                </div>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-badge>
                    <el-dropdown trigger="click" @command="handleCommand">
                        <span class="el-dropdown-link">
                            <div class="navbar__nav">
                                <!-- <div class="navbar__name">{{ userInfo.data.name }}</div> -->
                                <div class="navbar__img">
                                    <img :src="userInfo.data.img ? userInfo.data.img : '/images/user.png'" alt="">
                                </div>
                            </div>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="info" style="pointer-events:none;">
                                <div style="font-weight:bold;">{{ userInfo.data.name }}</div>
                            </el-dropdown-item>
                            <hr style="margin-top:4px;margin-bottom:10px;">
                            <el-dropdown-item command="account">
                                <i class='bx bx-user-circle'></i>
                                Thông tin người dùng
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
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    props: { 
        isCollapse: Boolean,
    },
    computed: {
		...mapState({
			userInfo: (state) => state.auth.user,
		})
	},
    data() {
        return {
            notificationGet: [],
            notifications: [],
            loading: false,
            isCheck: false,
            dataLoading: false,
            windowWidth: window.innerWidth
        };
    },
    async beforeMount () {
        const _this = this;
        if (_this.$socket) {
            _this.$socket.on('notification', async(notify) => {
                if(notify){
                    _this.$notify.closeAll(); 
                    _this.$notify({
                        type: 'info',
                        title: 'Thông báo',
                        dangerouslyUseHTMLString: true,
                        message: notify.content,
                        position: 'bottom-right'
                    });
                    _this.notificationGet.unshift(notify);
                    _this.notifications.unshift(notify);
                }
            });
        }
    },
    async created() {
		const _this = this;
	},
    async mounted() {
        const _this = this;
        window.addEventListener('resize', () => {
            _this.windowWidth = window.innerWidth;
        })
        await _this.getNotify();
    },
    methods: {
        async handleCommand(command) {
            if(command == 'logout') {
			    await this.$router.push('/login');
                await this.$auth.logout();
                if (this.$socket) {
                    this.$socket.disconnect();
                }
            }
            if(command == 'account') {
			    await this.$router.push('/account');
            }
        },
        collapseSidebar(){
            var keyChange = !this.isCollapse;
            this.$emit('changeSidebar', keyChange);
        },
        loadNotifications(){
            const _this = this;
            _this.loading = true;
            if (_this.notifications.length < _this.notificationGet.length){
                setTimeout(() => {
                    var from = _this.notifications.length;
                    var size = _this.notifications.length + 5;
                    var notify = _this.notificationGet.slice(from, size);
                    _this.notifications.push(
                        ...notify
                    );
                    _this.loading = false;
                }, 1000);
            }
            else{
                _this.loading = false
            }
        },
        async handleDropdownChange(){
            const _this = this;
            if(!_this.isCheck){
                _this.notifications = [];
                await _this.getNotify();
            }
            _this.isCheck = !_this.isCheck;
        },
        async getNotify(){
            const _this = this;
            _this.dataLoading = true;
            await _this.$axios.$post('/api/user/getNotifyByQuery', { size: 30, from: 0 }).then(
                (response) => {
                    var from = _this.notifications.length;
                    var size = _this.notifications.length + 5;
					_this.notificationGet = response.data || [];
                    var notify = _this.notificationGet.slice(from, size);
                    _this.notifications.push(
                        ...notify
                    );
				},
				(error) => {
					console.log('Error: ', error);
				}
            );
            _this.dataLoading = false;
        },
        async handleCommandNotify(command){
            const _this = this;
            if(command.type == 'appointment'){
                if(command.status == 'new'){
                    await _this.$axios.$post('/api/user/updateSeenStatus', { id: command._id });
                }
                await _this.$router.push({
                    path: `/workingCalendarV2`,
                    query: { appointmentId: command.targetId }
                });
            }
            else if(command.type == 'examination'){
                // await _this.$axios.$get(`/api/customer/getExaminationById/${_this.$route.query.examinationId}`).then(
                //     async (response) => {
                //         if(response.success && response.data && response.data.customerId){
                //             await _this.$router.push({
                //                 path: `/customer/${response.data.customerId}/examinationV2/edit`,
                //                 query: { examinationId: command.targetId }
                //             });
                //         }
                //         else{
                //             console.log('Error: ', response.error);
                //             return;
                //         }
                //     },
                //     (error) => {
                //         console.log('Error: ', error);
                //         return;
                //     }
                // );
            }
            else if(command.type == 'payment'){
                if(command.status == 'new'){
                    await _this.$axios.$post('/api/user/updateSeenStatus', { id: command._id });
                }
                await _this.$axios.$get(`/api/payment/getById/${command.targetId}`).then(
                    async (response) => {
                        if(response.success && response.data && response.data.customerId && response.data.examinationId){
                            await _this.$router.push({
                                path: `/customer/${response.data.customerId}/payment`,
                                query: { examinationId: response.data.examinationId }
                            });
                        }
                        else{
                            console.log('Error: ', response.error);
                            return;
                        }
                    },
                    (error) => {
                        console.log('Error: ', error);
                        return;
                    }
                );
            }
        },
        async updateSeenStatusAll(){
            const _this = this;
            _this.dataLoading = true;
            try{
                const data = await _this.$axios.$post('/api/user/updateSeenStatusAll');
                if(data.success){
                    _this.notifications = [];
                    await _this.getNotify();
                }else {
                    _this.$message.error('Hoàn thành lịch hẹn không thành công');
                }
            }
            catch(error){
                console.log('Error: ', error);
            }
            _this.dataLoading = false;
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
    padding: 8px 0;
    padding-right: 16px;
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

/* .navbar__img:hover{
    opacity: 0.8;
    transition: all ease 0.5s;
} */

.navbar__img::after {
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

.navbar__img:hover::after {
    background-color: rgba(0, 0, 0, 0.2);
}

.infinite-list-custom::-webkit-scrollbar-track{
	background-color: #fff;
}

.infinite-list-custom::-webkit-scrollbar{
	width: 4px;
	background-color: #fff;
}

.infinite-list-custom::-webkit-scrollbar-thumb{
	background-color: #bfbebe;
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