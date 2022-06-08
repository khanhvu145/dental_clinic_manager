<template>
  <div id="wrapper">
		<NavBar v-bind:isCollapse="isCollapse" v-on:changeSidebar="changeSidebar"/>
    <div style="display: flex;">
      <SideBar v-bind:isCollapse="isCollapse"/>
      <nuxt/>
    </div>
  </div>
</template>

<script>
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import NavBar from '@/components/layout/NavBar';
import SideBar from '@/components/layout/SideBar';
export default {
  components: {
		NavBar,
		SideBar,
	},
  data() {
    return { 
      isCollapse: true
    }
  },
  methods: {
    changeSidebar(keyChange) {
      this.isCollapse = keyChange;
    }
  }
}
</script>

<style>

</style>
