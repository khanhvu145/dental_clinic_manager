<template>
  <div id="admin">
    <div v-if="checkRole">
        <NavBar v-bind:isCollapse="isCollapse" v-on:changeSidebar="changeSidebar"/>
        <div class="admin__body" style="display: flex;">
            <SideBar v-bind:isCollapse="isCollapse"/>
            <nuxt/>
        </div>
    </div>
    <div v-else style="text-align: center; margin-top: calc(100vh/2);">
      <span>Bạn không có quyền vào trang này!!</span>
    </div>
  </div>
</template>

<script>
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import NavBar from '@/components/adminLayout/NavBar';
import SideBar from '@/components/adminLayout/SideBar';
export default {
  components: {
		NavBar,
		SideBar,
	},
  data() {
    return { 
      isCollapse: true,
      checkRole: false,
    }
  },
  async created() {
		const _this = this;
		setTimeout(async () => {
            const userResponse = await _this.$axios.$get('api/account/info');
            await _this.$store.commit('role/SET_ROLE_USER', userResponse.role);
            if(this.$store.state.role.role == 'administration') _this.checkRole = true;
            else _this.checkRole = false;
		}, 500);
	},
  methods: {
    changeSidebar(keyChange) {
      this.isCollapse = keyChange;
      console.log(this.$store.state.role.role)
    }
  }
}
</script>

<style>

</style>
