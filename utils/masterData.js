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
  },
  {
    key: 'examinationGeneral',
    label: 'Khám và điều trị',
    group: [
      {
        key: 'exam_anamnesis',
        label: 'Tiền sử bệnh',
        pickColor: false,
        planHolder: 'Tiền sử bệnh',
        active: true,
      },
      {
        key: 'exam_allergy',
        label: 'Loại dị ứng',
        pickColor: false,
        planHolder: 'Loại dị ứng',
        active: true,
      },
      {
        key: 'exam_xquang',
        label: 'Loại X-Quang',
        pickColor: false,
        planHolder: 'Loại X-Quang',
        active: true,
      },
      {
        key: 'exam_test',
        label: 'Loại xét nghiệm',
        pickColor: false,
        planHolder: 'Loại xét nghiệm',
        active: true,
      },
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

export const anamnesisList = [
  {
    label: 'Chảy máu lâu',
    value: 1,
    note: '',
    isCheck: false,
  },
  {
    label: 'Dị ứng thấp khớp',
    value: 2,
    note: '',
    isCheck: false,
  },
  {
    label: 'Cao huyết áp',
    value: 3,
    note: '',
    isCheck: false,
  },
  {
    label: 'Tim mạch',
    value: 4,
    note: '',
    isCheck: false,
  },
  {
    label: 'Tiểu đường',
    value: 5,
    note: '',
    isCheck: false,
  },
  {
    label: 'Bệnh phổi (lao, hen)',
    value: 6,
    note: '',
    isCheck: false,
  },
  {
    label: 'Bệnh truyền nhiễm (HIV, viêm gan siêu vi,...)',
    value: 7,
    note: '',
    isCheck: false,
  },
  {
    label: 'Bệnh cấp tính',
    value: 8,
    note: '',
    isCheck: false,
  },
  {
    label: 'Khác',
    value: 9,
    note: '',
    isCheck: false,
  },
];

export const xquangList = [
  {
    label: 'Panorex',
    value: 1,
    isCheck: false,
  },
  {
    label: 'Cephalo',
    value: 2,
    isCheck: false,
  },
  {
    label: 'Periapical',
    value: 3,
    isCheck: false,
  },
  {
    label: 'Occlusal',
    value: 4,
    isCheck: false,
  },
  {
    label: 'Face',
    value: 5,
    isCheck: false,
  },
  {
    label: 'CT conebeam',
    value: 6,
    isCheck: false,
  },
  {
    label: 'CT scan',
    value: 7,
    isCheck: false,
  },
  {
    label: 'Hirtz',
    value: 8,
    isCheck: false,
  },
];

export const testList = [
  {
    label: 'Máu',
    value: 1,
    isCheck: false,
  },
  {
    label: 'Nước tiểu',
    value: 2,
    isCheck: false,
  },
  {
    label: 'TS',
    value: 3,
    isCheck: false,
  },
  {
    label: 'TC',
    value: 4,
    isCheck: false,
  },
  {
    label: 'NGFL',
    value: 5,
    isCheck: false,
  },
  {
    label: 'TQ',
    value: 6,
    isCheck: false,
  },
  {
    label: 'TCK',
    value: 7,
    isCheck: false,
  },
];

export const allergyList = [
  {
    label: 'Máu',
    value: 1,
    isCheck: false,
  },
];