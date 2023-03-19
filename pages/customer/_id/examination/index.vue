<template>
    <LeftMenu>
        <form class="row mt-4 mb-5">
            <div class="col-md-12" style="text-align: right;">
                <button type="button" class="control-btn gray" @click="$router.push('/customer')">
                    <i class='bx bx-arrow-back'></i>
                    <span>Quay lại</span>
                </button>
            </div>
        </form>
    </LeftMenu>
</template>

<script>
import { mapState } from 'vuex';
import Customer from '@/models/tw_Customer';
import LeftMenu from '@/components/customer/LeftMenu';
import ImageUpload from '@/components/common/ImageUpload.vue';
import { cloneDeep, debounce, intersection } from 'lodash';
import { genderData } from '@/utils/masterData';
import buildFormData from '@/utils/buildFormData';
export default {
    components: {
		LeftMenu,
        ImageUpload
	},
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
            userInfo: (state) => state.auth.user,
		}),
	},
}
</script>