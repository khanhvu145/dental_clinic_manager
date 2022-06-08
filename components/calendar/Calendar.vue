<template>
    <div>
        <FullCalendar :options="calendarOptions" ref="fullCalendar" />
    </div>
</template>

<script>
import '@fullcalendar/core/vdom';
import FullCalendar from '@fullcalendar/vue';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

export default {
    components: {
		FullCalendar,
	},
    
    props: {
		layoutCalendarType: String,
	},

    data(){
        return {
            calendarOptions: {
                plugins: [ dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin ],
                initialView: this.layoutCalendarType == 'calendar' ? 'timeGridWeek' : 'listWeek',
                headerToolbar: {
                    left: 'prev today next',
                    center: 'title',
                    right: this.layoutCalendarType == 'calendar' ? 'dayGridMonth,timeGridWeek,timeGridDay' : 'listMonth,listWeek,listDay'
                },
                buttonText: {
					today: 'Hôm nay',
					month: 'Theo tháng',
					week: 'Theo tuần',
					day: 'Theo ngày',
				},
                eventTimeFormat: {
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit',
					meridiem: false,
				},
                slotMinTime: '07:00:00',
                slotMaxTime: '22:00:00',
                selectable: true,
                selectMirror: true,
                editable:true,
                eventTextColor: '#fff',
                eventBackgroundColor: '#8fdf82',
                eventBorderColor: '#8fdf82',
                events: [],
            },
        }
    },

    methods: {
        changeViewCalendar(type){
            this.$refs.fullCalendar.getApi().changeView(type);
            if(type == 'timeGridWeek'){
                this.calendarOptions.headerToolbar.right = 'dayGridMonth,timeGridWeek,timeGridDay';
            }else{
                this.calendarOptions.headerToolbar.right = 'listMonth,listWeek,listDay';
            }
            console.log(this.$refs.fullCalendar.getApi().view.type)
        }
    }
}
</script>