export default function() {
	this.workingTime = {
        apply: true,
        timeAM: {
            timeFrom: '',
            timeTo: ''
        },
        timePM: {
            timeFrom: '',
            timeTo: ''
        },
        dayOfWeek: [
            {
                key: 'monday',
                label: 'Thứ hai',
                value: true
            },
            {
                key: 'tuesday',
                label: 'Thứ ba',
                value: true
            },
            {
                key: 'wednesday',
                label: 'Thứ tư',
                value: true
            },
            {
                key: 'thursday',
                label: 'Thứ năm',
                value: true
            },
            {
                key: 'friday',
                label: 'Thứ sáu',
                value: true
            },
            {
                key: 'saturday',
                label: 'Thứ bảy',
                value: true
            },
            {
                key: 'sunday',
                label: 'Chủ nhật',
                value: false
            },
        ]
    };
    this.autoRemind = {
        apply: true,
        repeat: true,
        duration: 1,
        time: '',
        type: 'type3'
    };
    this.autoCancel = {
        apply: true,
        duration: 30, 
        type: 'minutes', 
        notification: true,
        notificationType: 'type3'
    };
}