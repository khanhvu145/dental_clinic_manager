import Customer from '@/models/tw_Customer';

export default function() {
	this.code = '';
	this.dentistId = '';
	this.date = null;
	this.timeFrom = '';
	this.timeTo = '';
    this.type = '635dedbba3976c621f4c1d8f';
    this.status = 'new';
    this.note = '';
	this.content = '';
	this.mainCustomer = new Customer();
}