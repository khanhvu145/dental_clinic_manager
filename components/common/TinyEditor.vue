<template>
	<editor
		v-model="inputVal"
		v-validate="'required'"
		data-vv-as="Nội dung"
		api-key="z0yythnvyvbu6jbbgyh9dpg79s3ogwqrvxadb48pnimsmzoi"
		:init="configs"
	/>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
export default {
	data() {
		return {
			configs: {
				height: this.height,
				menubar: 'file edit view insert format tools table help',
				plugins:
					'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap emoticons filemanager responsivefilemanager',
				toolbar:
					'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | lineheight forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
				image_advtab: true,
				toolbar_sticky: true,
				contextmenu: 'link image imagetools table',
				quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
				content_style: this.contentStyle,
			}
		};
	},
	components: {
		editor: Editor
	},
	props: {
		value: { type: String },
		height: { type: Number, default: 500 },
		contentStyle: { type: String, default: ''}
	},
	computed: {
		inputVal: {
			get() {
				return this.value;
			},
			set(val) {
				this.$emit('input', val);
			}
		}
	},
	methods: {
	}
};
</script>
