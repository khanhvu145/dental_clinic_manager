<template>
  <div class="wrapper">
	  <div class="content">
		  	<el-tabs type="card" v-model="activeName">
				<el-tab-pane label="THÔNG TIN KHÁCH HÀNG" name="customerInfo">
					<form id="home__form" class="home__form container-fluid">
						<div class="tab__header">
							<div class="row">
								<div class="col-md-6">
									<div class="title">Thông tin bệnh nhân</div>
								</div>
								<div class="col-md-6">
									<div class="tab__header-control" style="float: right;">
										<button type="button" class="control-btn blue select-btn">
											<i class='bx bx-search'></i>
											<span>Chọn</span>
										</button>
										<button type="submit" class="control-btn green">
											<i class='bx bxs-user-plus'></i>
											<span>Thêm</span>
										</button>
									</div>
								</div>
							</div>
						</div>
						<div class="tab-content">
							<div class="row">
								<div class="col-md-3">
									<div class="avatar">
										<div class="row">
											<div class="col-md-12">
												<div class="avatar__content m-auto">
													<img src="/images/user.png" alt="" class="avatar__content-img">
												</div>
											</div>
											<div class="col-md-12">
												<button type="button" class="avatar__btn mr-auto ml-auto" v-on:click="choose_img">
													<i class='bx bxs-camera-plus'></i>
													<span>Thêm ảnh</span>
												</button>
											</div>
											<div class="col-md-12">
												<button v-if="isAvatar" type="button" class="avatar__btn-clear mr-auto ml-auto" v-on:click="clear_img">
													<i class='bx bx-x'></i>
												</button>
											</div>
										</div>
										<input type="file" class="upload__file-img" id="image" name="image">
									</div>
								</div>
								<div class="col-md-7">
									<div class="information">
										<div class="row">
											<div class="col-md-6">
												<div class="col-form-label">Mã hồ sơ</div>
												<el-input 
													name="id"
													v-model="input"
													:disabled="true"
												></el-input>
											</div>
											<div class="col-md-6">
												<div class="col-form-label">Họ và tên</div>
												<el-input 
													name="fullname"
													v-validate="'required'"
													data-vv-as="Họ và tên"
													placeholder="Họ và tên"
													v-model="input"
													clearable
												></el-input>
											</div>
										</div>
										<div class="row mt-3">
											<div class="col-md-6">
												<div class="col-form-label">Ngày sinh</div>
												<el-date-picker
													v-model="input"
													type="date"
													name="dateofbirth"
													format="dd/MM/yyyy"
													value-format="dd/MM/yyyy"
													placeholder="Ngày/tháng/năm"
													v-validate="'required'"
												></el-date-picker>
											</div>
											<div class="col-md-6">
												<div class="col-form-label">Giới tính</div>
												<el-select v-model="input" clearable placeholder="Giới tính" name="gender" v-validate="'required'">
													<el-option
														v-for="item in options"
														:key="item.value"
														:label="item.label"
														:value="item.value"
													></el-option>
												</el-select>
											</div>
										</div>
										<div class="row mt-3">
											<div class="col-md-6">
												<div class="col-form-label">Số điện thoại</div>
												<el-input
													name="phone"
													v-validate="{
														required: true,
													}"
													data-vv-as="Số điện thoại"
													placeholder="Số điện thoại"
													v-model="input"
												></el-input>
											</div>
											<div class="col-md-6">
												<div class="col-form-label">Email</div>
												<el-input
													name="email"
													v-validate="{
														required: true,
														email: true,
													}"
													data-vv-as="Email"
													placeholder="Email"
													v-model="input"
												></el-input>
											</div>
										</div>
										<div class="row mt-3">
											<div class="col-md-12">
												<div class="col-form-label">Địa chỉ</div>
											</div>
											<div class="col-md-6">
												<el-input
													name="building"
													v-validate="{
														required: true,
													}"
													data-vv-as="Số nhà, đường, khu phố"
													placeholder="Số nhà, đường, khu phố"
													v-model="input"
												></el-input>
											</div>
											<div class="col-md-6">
												<el-select v-model="input" clearable filterable placeholder="Tỉnh/Thành phố" name="city" v-validate="'required'">
													<el-option
														v-for="item in options"
														:key="item.value"
														:label="item.label"
														:value="item.value"
													></el-option>
												</el-select>
											</div>
											<div class="col-md-6 mt-4">
												<el-select v-model="input" clearable filterable placeholder="Quận/Huyện" name="district" v-validate="'required'">
													<el-option
														v-for="item in options"
														:key="item.value"
														:label="item.label"
														:value="item.value"
													></el-option>
												</el-select>
											</div>
											<div class="col-md-6 mt-4">
												<el-select v-model="input" clearable filterable placeholder="Phường/Xã/Ấp" name="ward" v-validate="'required'">
													<el-option
														v-for="item in options"
														:key="item.value"
														:label="item.label"
														:value="item.value"
													></el-option>
												</el-select>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="tab__footer mt-4" style="text-align: right;">
							<button type="button" class="control-btn yellow update-btn">
								<i class='bx bxs-save' ></i>
								<span>Cập nhật</span>
							</button>
							<a href="" class="control-btn red">
								<i class='bx bx-x'></i>
								<span>Đóng</span>
							</a>
						</div>
					</form>
				</el-tab-pane>
				<el-tab-pane label="ĐĂNG KÝ KHÁM" name="medicalRegister">
					<div class="container-fluid">
						<div class="tab__header">
							<div class="row">
								<div class="col-md-12">
									<div class="title">Đăng ký khám</div>
								</div>
							</div>
						</div>
						<div class="tab-content">
							<div class="row">
								<div class="col-md-6">
									<div class="row mb-3">
										<div class="col-md-8">
											<div class="row">
												<div class="col-md-12">
													<div class="col-form-label">Nha sĩ</div>
													<el-select v-model="input" clearable filterable placeholder="Mã, tên nha sĩ" name="dentistId">
														<el-option
															v-for="item in options"
															:key="item.value"
															:label="item.label"
															:value="item.value"
														></el-option>
													</el-select>
												</div>
												<div class="col-md-12">
													<div class="col-form-label">Ngày hẹn</div>
													<div class="block">
														<el-date-picker
															v-model="value1"
															type="date"
															format="dd/MM/yyyy"
															value-format="yyyy-MM-dd"
															placeholder="Ngày hẹn">
														</el-date-picker>
													</div>
												</div>
											</div>
										</div>
										<div class="col-md-4 mt-4">
											<div style="display: flex; height: 100%; align-items: start; gap: 8px; margin-top: 11px;">
												<button type="submit" class="control-btn green">
													<i class='bx bx-search'></i>
													Tìm
												</button>
												<a href="" class="control-btn gray appointment__heading-refresh">
													<i class='bx bx-refresh'></i>
												</a>
											</div>
										</div>
									</div>
									<div class="row pt-3">
										<div class="col-md-12">
											<FullCalendarAll
												v-if="activeName == 'medicalRegister'"
												ref="calendarAll"
											/>
										</div>
									</div>
								</div>
								<div class="col-md-6">
									<div class="row">
										<div class="col-md-4">
											<span style="color:#909090;">Mã hồ sơ: </span>
											<span style="color:#3c763d; font-weight: bold; font-size: 18px;">123456789</span>
										</div>
										<div class="col-md-4">
											<span style="color:#909090;">Họ tên: </span>
											<span style="color:#3c763d; font-weight: bold; font-size: 18px;">Vũ Nhật Khanh</span>
										</div>
									</div>
									<div class="row mt-3">
										<div class="col-md-4">
											<span style="color:#909090;">Ngày sinh: </span>
											<span style="color:#3c763d; font-weight: bold; font-size: 18px;">14/05/2000</span>
										</div>
										<div class="col-md-4">
											<span style="color:#909090;">Giới tính: </span>
											<span style="color:#3c763d; font-weight: bold; font-size: 18px;">Nam</span>
										</div>
									</div>
									<div class="row mt-3 mb-4">
										<div class="col-md-12">
											<form id="register__form" class="register__form" style="width: 100%;">
												<div class="row">
													<div class="col-md-6">
														<div class="col-form-label">Nha sĩ phụ trách</div>
														<el-select v-model="input" clearable filterable placeholder="Nha sĩ phụ trách" name="dentist_id" v-validate="'required'">
															<el-option
																v-for="item in options"
																:key="item.value"
																:label="item.label"
																:value="item.value"
															></el-option>
														</el-select>
													</div>
													<div class="col-md-6">
														<div class="col-form-label">Dịch vụ sử dụng</div>
														<el-select v-model="input" clearable filterable placeholder="Dịch vụ" name="service_id" v-validate="'required'">
															<el-option
																v-for="item in options"
																:key="item.value"
																:label="item.label"
																:value="item.value"
															></el-option>
														</el-select>
													</div>
												</div>
												<div class="row mt-3">
													<div class="col-md-12">
														<div class="col-form-label">Thời gian</div>
													</div>
													<div class="col-md-4">
														<el-date-picker
															v-model="input"
															type="date"
															name="date"
															placeholder="Ngày hẹn"
															format="dd/MM/yyyy"
															value-format="yyyy-MM-dd"
														></el-date-picker>
													</div>
													<div class="col-md-4">
														<el-time-select
															v-model="input"
															:picker-options="{
																start: '07:00',
																step: '00:15',
																end: '22:00'
															}"
															placeholder="Giờ hẹn">
														</el-time-select>
													</div>
													<div class="col-md-4">
														<el-select v-model="input" name="period" placeholder="Khoảng thời gian" v-validate="'required'">
															<el-option
																v-for="item in options"
																:key="item.value"
																:label="item.label"
																:value="item.value"
															></el-option>
														</el-select>
													</div>
												</div>
												<div class="row mt-3">
													<div class="col-md-12">
														<div class="col-form-label">Triệu chứng</div>
														<el-input
															type="textarea"
															name="symptom"
															:autosize="{ minRows: 6 }"
															placeholder="Triệu chứng..."
															v-model="input">
														</el-input>
													</div>
												</div>
												<div class="row mt-3">
													<div class="col-md-12">
														<div class="col-form-label">Ghi chú</div>
														<el-input
															type="textarea"
															name="note"
															:autosize="{ minRows: 6 }"
															placeholder="Ghi chú..."
															v-model="input">
														</el-input>
													</div>
												</div>
												<div class="row mt-3">
													<div class="col-md-12">
														<div class="col-form-label">Trạng thái hẹn</div>
														<el-radio-group v-model="radio">
															<el-radio :label="1" border>Chưa đến</el-radio>
															<el-radio :label="2" border>Đã đến</el-radio>
															<el-radio :label="3" border>Đã hủy</el-radio>
														</el-radio-group>
													</div>
												</div>
												<div class="row mt-4">
													<div class="col-md-12" style="text-align: right;">
														<a href="/" class="control-btn red">
															<i class='bx bx-x'></i>
															<span>Hủy</span>
														</a>
														<button type="submit" class="control-btn green">
															<i class='bx bxs-calendar-plus'></i>
															<span>Đặt hẹn</span>
														</button>
													</div>
												</div>
											</form>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</el-tab-pane>
				<el-tab-pane label="ĐĂNG KÝ KHÁM ONLINE" name="medicalRegisterOnline">
					<div class="container-fluid">
						<div class="tab__header">
							<div class="row">
								<div class="col-md-12">
									<div class="title">Đăng ký khám online</div>
								</div>
							</div>
						</div>
					</div>
				</el-tab-pane>
			</el-tabs>
	  </div>
	</div>
</template>

<script>
import FullCalendarAll from '@/components/calendar/CalendarAll';
export default {
	components: {
		FullCalendarAll,
	},
	data() {
      return {
        activeName: 'customerInfo',
		isAvatar: false,
		input: '',
		radio: 1,
		value1: ''
      };
    },
	methods: {
		choose_img(){
			var _this = this;
			const FILE_INPUT = document.querySelector(".upload__file-img");
			const AVATAR = document.querySelector(".avatar__content-img");
			FILE_INPUT.click()
			FILE_INPUT.addEventListener("change", function (e) {
				const file = e.target.files[0];
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onloadend = () => {
					AVATAR.setAttribute("src", reader.result);
				};
				_this.isAvatar = true;
			});
		},
		clear_img(){
			var _this = this;
			const FILE_INPUT = document.querySelector(".upload__file-img");
			const AVATAR = document.querySelector(".avatar__content-img");
			FILE_INPUT.value = "";
			AVATAR.setAttribute("src", '/images/user.png');
			_this.isAvatar = false;
		}
	}
}
</script>

<style>
.home__form{
	padding: 5px 20px 20px 20px;
}

</style>
