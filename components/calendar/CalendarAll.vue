<template>
    <div id="calendar">
        <FullCalendar :options="calendarOptions" />
    </div>
</template>

<script>
import '@fullcalendar/core/vdom';
import FullCalendar from '@fullcalendar/vue';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';

export default {
    components: {
		FullCalendar,
	},
    data(){
        return {
            calendarOptions: {
                plugins: [ resourceTimeGridPlugin, resourceTimelinePlugin ],
                initialView: 'resourceTimeline',
                resources: [
                    { id: 'a', title: 'Room A' },
                    { id: 'b', title: 'Room B'},
                    { id: 'c', title: 'Room C' },
                    { id: 'd', title: 'Room D' },
                    { id: 'e', title: 'Room E' },
                    { id: 'f', title: 'Room F' },
                ],
                headerToolbar: {
                    right: 'prev today next',
                    left: 'title'
                },
                buttonText: {
					today: 'Hôm nay',
				},
                eventTimeFormat: {
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit',
					meridiem: false,
				},
                resourceAreaHeaderContent: 'Nha sĩ',
                height: 'auto',
                slotMinTime: '07:00:00',
                slotMaxTime: '22:00:00',
                selectable: true,
                selectMirror: true,
                selectOverlap: false,
                eventTextColor: '#fff',
                eventBackgroundColor: '#8fdf82',
                eventBorderColor: '#8fdf82',
                events: 'https://fullcalendar.io/api/demo-feeds/events.json?single-day&for-resource-timeline'
            },
        }
    },
    methods: {
        
    }
}
</script>

<style>
/* #calendar {
  max-width: 100%;
  margin: 0 auto;
}

.fc-view-container {
  width: auto;
}

#calendar .fc .fc-view-harness-active > .fc-view {
  overflow-x: scroll;
}

#calendar .fc .fc-view-harness-active > .fc-view > table {
  width: 900px;
} */
</style>