export default function() {
	this.anamnesis = [];
    this.allergy = {
        allergies: [],
        other: ''
    };
    this.clinicalExam = '';
    this.preclinicalExam = {
        xquang: [],
        test: [],
        other: ''
    };
    this.attachFiles = [];
    this.diagnosisTreatment = [];
    this.treatmentAmount = 0;
    this.totalDiscountAmount = 0;
    this.totalAmount = 0;
}