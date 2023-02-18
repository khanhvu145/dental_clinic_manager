export default function() {
	this.workingTime = {
        apply: true,
        timeAM: {
            timeFrom: '07:00',
            timeTo: '12:00'
        },
        timePM: {
            timeFrom: '14:00',
            timeTo: '20:00'
        },
        dayOfWeek: [
            {
                key: 1,
                label: 'Thứ hai',
                value: true
            },
            {
                key: 2,
                label: 'Thứ ba',
                value: true
            },
            {
                key: 3,
                label: 'Thứ tư',
                value: true
            },
            {
                key: 4,
                label: 'Thứ năm',
                value: true
            },
            {
                key: 5,
                label: 'Thứ sáu',
                value: true
            },
            {
                key: 6,
                label: 'Thứ bảy',
                value: true
            },
            {
                key: 0,
                label: 'Chủ nhật',
                value: false
            },
        ]
    };
    this.autoRemind = {
        apply: true,
        repeat: true,
        duration: 1,
        time: '08:00',
        type: 'type3'
    };
    this.other = {
        autoCancelDuration: 30,
        autoCancelApply: false,
        autoCancelType: 'minutes', 
        notifyIsBooked: true,
        notifyIsCheckin: true,
        notifyIsCancelled: true,
        notifyIsTranfer: true,
    };
}