export const statusData = [
    {
      key: 1,
      label: 'Tất cả...',
      value: null,
    },
    {
      key: 2,
      label: 'Hoạt động',
      value: true,
    },
    {
      key: 3,
      label: 'Không hoạt động',
      value: false,
    },
];
  
export const genderData = [
    {
      label: 'Nam',
      value: 'male',
    },
    {
      label: 'Nữ',
      value: 'female',
    },
    {
      label: 'Khác',
      value: 'other',
    }
];

export const userPositionData = [
  {
    label: 'Nha sĩ',
    value: 'dentist',
  },
  {
    label: 'Phụ tá',
    value: 'assistant',
  },
  {
    label: 'Lễ tân',
    value: 'receptionist',
  }
];

export const generalCategory = [
  {
    key: 'customerGeneral',
    label: 'Khách hàng',
    group: [
      {
        key: 'customer_type',
        label: 'Nhóm khách hàng',
        pickColor: true,
        planHolder: 'Tên nhóm',
        active: true,
      },
      {
        key: 'customer_source',
        label: 'Nguồn khách hàng',
        pickColor: false,
        planHolder: 'Tên nguồn',
        active: true,
      }
    ]
  },
  {
    key: 'serviceGeneral',
    label: 'Loại hình dịch vụ',
    group: [
      {
        key: 'service_unit',
        label: 'Đơn vị tính',
        pickColor: false,
        planHolder: 'Đơn vị tính',
        active: true,
      }
    ]
  },
  {
    key: 'appointmentGeneral',
    label: 'Lịch hẹn',
    group: [
      {
        key: 'appointment_type',
        label: 'Loại lịch hẹn',
        pickColor: true,
        planHolder: 'Loại lịch hẹn',
        active: true,
      },
      {
        key: 'appointment_status',
        label: 'Trạng thái lịch hẹn',
        pickColor: true,
        planHolder: 'Trạng thái lịch hẹn',
        active: true,
      }
    ]
  }
];

export const appointmentStatus = [
  {
    label: 'Đặt hẹn',
    value: 'Booked',
    backgroundColor: "#ecf5ff",
    textColor: "#409eff",
    borderColor: "#d9ecff",
    apply: true,
  },
  {
    label: 'Đã đến',
    value: 'Checkin',
    backgroundColor: '#fef0f0',
    borderColor: '#fde2e2',
    textColor: '#f56c6c',
    apply: true,
  },
  {
    label: 'Đã khám',
    value: 'Examined',
    backgroundColor: "#f0f9eb",
    borderColor: '#e1f3d8',
    textColor: '#67c23a',
    apply: true,
  },
  {
    label: 'Đã hủy',
    value: 'Cancelled',
    backgroundColor: "#f4f4f5",
    borderColor: "#e9e9eb",
    textColor: "#909399",
    apply: true,
  }
];