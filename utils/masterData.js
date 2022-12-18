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
  },
  {
    label: 'Đã đến',
    value: 'Came',
  },
  {
    label: 'Đã khám',
    value: 'Examined',
  },
  {
    label: 'Đã hủy',
    value: 'Cancelled',
  }
];