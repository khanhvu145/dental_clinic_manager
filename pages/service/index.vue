<template>
    <div class="wrapper">
        <div class="content" v-if="checkRight('view')">
            <div class="container-fluid">
                <div class="row mt-3">
                    <div class="col-md-12">
                        <el-tabs v-model="activeName">
                            <!-- Dịch vụ -->
                            <el-tab-pane label="Dịch vụ" name="item">
                                <ServiceItem />
                            </el-tab-pane>
                            <!-- Nhóm dịch vụ -->
                            <el-tab-pane label="Nhóm dịch vụ" name="group">
                                <ServiceGroup />
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <el-empty description="Bạn không có quyền !!"></el-empty>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { statusData } from '@/utils/masterData';
import { debounce, map, cloneDeep, intersection, filter, find, forEach } from 'lodash';
import ServiceItem from '@/components/services/serviceItem.vue';
import ServiceGroup from '@/components/services/serviceGroup.vue';
export default {
    components: {
		ServiceItem,
		ServiceGroup,
	},
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
            userInfo: (state) => state.auth.user,
		}),
	},
    data() {
        return {
            activeName: 'item'
        }
    },
    async created() {
        const _this = this;
    },
    methods: {
        checkRight(right) {
			const _this = this;
			// If user have permission below
			const values = ['service.all', 'service.' + right];
			return !!(intersection(_this.accesses || [], values).length > 0);
		},
    }
}
</script>