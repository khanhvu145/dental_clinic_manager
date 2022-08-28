export default function() {
    this.code = '';
    this.username = '';
	this.password = '';
	this.name = '';
	this.physicalId = '';
	this.dateOfIssue = null;
	this.placeOfIssue = '';
	this.email = '';
	this.phone = '';
	this.birthday = null;
	this.gender = '';
	this.address = {
		building: '',
		wardId: null,
		districtId: null,
		provinceId: null,
	};
	this.isActive = true;
	this.img = '';
	this.imageFile = null;
    this.accessId = '';
}