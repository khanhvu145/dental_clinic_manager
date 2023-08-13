export const statusData = [
    {
      key: 1,
      label: 'Tất cả',
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
  // {
  //   key: 'serviceGeneral',
  //   label: 'Loại hình dịch vụ',
  //   group: [
  //     {
  //       key: 'service_unit',
  //       label: 'Đơn vị tính',
  //       pickColor: false,
  //       planHolder: 'Đơn vị tính',
  //       active: true,
  //     }
  //   ]
  // },
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
        key: 'appointment_content',
        label: 'Nội dung lịch hẹn',
        pickColor: true,
        planHolder: 'Nội dung lịch hẹn',
        active: true,
      },
      // {
      //   key: 'appointment_status',
      //   label: 'Trạng thái lịch hẹn',
      //   pickColor: true,
      //   planHolder: 'Trạng thái lịch hẹn',
      //   active: true,
      // }
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
      {
        key: 'exam_designationType',
        label: 'Loại chỉ định',
        pickColor: false,
        planHolder: 'Loại chỉ định',
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
    label: 'Hoàn thành',
    value: 'Completed',
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

export const permanentTeeth = [
  {
    key: 1,
    note: 'Hàm trên bên trái',
    tooths: [
      {
        label: 'R18',
        value: '18',
      },
      {
        label: 'R17',
        value: '17',
      },
      {
        label: 'R16',
        value: '16',
      },
      {
        label: 'R15',
        value: '15',
      },
      {
        label: 'R14',
        value: '14',
      },
      {
        label: 'R13',
        value: '13',
      },
      {
        label: 'R12',
        value: '12',
      },
      {
        label: 'R11',
        value: '11',
      },
    ]
  },
  {
    key: 2,
    note: 'Hàm trên bên phải',
    tooths: [
      {
        label: 'R21',
        value: '21',
      },
      {
        label: 'R22',
        value: '22',
      },
      {
        label: 'R23',
        value: '23',
      },
      {
        label: 'R24',
        value: '24',
      },
      {
        label: 'R25',
        value: '25',
      },
      {
        label: 'R26',
        value: '26',
      },
      {
        label: 'R27',
        value: '27',
      },
      {
        label: 'R28',
        value: '28',
      },
    ]
  },
  {
    key: 3,
    note: 'Hàm dưới bên phải',
    tooths: [
      {
        label: 'R31',
        value: '31',
      },
      {
        label: 'R32',
        value: '32',
      },
      {
        label: 'R33',
        value: '33',
      },
      {
        label: 'R34',
        value: '34',
      },
      {
        label: 'R35',
        value: '35',
      },
      {
        label: 'R36',
        value: '36',
      },
      {
        label: 'R37',
        value: '37',
      },
      {
        label: 'R38',
        value: '38',
      },
    ]
  },
  {
    key: 4,
    note: 'Hàm dưới bên trái',
    tooths: [
      {
        label: 'R48',
        value: '48',
      },
      {
        label: 'R47',
        value: '47',
      },
      {
        label: 'R46',
        value: '46',
      },
      {
        label: 'R45',
        value: '45',
      },
      {
        label: 'R44',
        value: '44',
      },
      {
        label: 'R43',
        value: '43',
      },
      {
        label: 'R42',
        value: '42',
      },
      {
        label: 'R41',
        value: '41',
      },
    ]
  },
];

export const milkTooth = [
  {
    key: 5,
    note: 'Hàm trên bên trái',
    tooths: [
      {
        label: 'R55',
        value: '55',
      },
      {
        label: 'R54',
        value: '54',
      },
      {
        label: 'R53',
        value: '53',
      },
      {
        label: 'R52',
        value: '52',
      },
      {
        label: 'R51',
        value: '51',
      },
    ]
  },
  {
    key: 6,
    note: 'Hàm trên bên phải',
    tooths: [
      {
        label: 'R61',
        value: '61',
      },
      {
        label: 'R62',
        value: '62',
      },
      {
        label: 'R63',
        value: '63',
      },
      {
        label: 'R64',
        value: '64',
      },
      {
        label: 'R65',
        value: '65',
      },
    ]
  },
  {
    key: 7,
    note: 'Hàm dưới bên phải',
    tooths: [
      {
        label: 'R71',
        value: '71',
      },
      {
        label: 'R72',
        value: '72',
      },
      {
        label: 'R73',
        value: '73',
      },
      {
        label: 'R74',
        value: '74',
      },
      {
        label: 'R75',
        value: '75',
      },
    ]
  },
  {
    key: 8,
    note: 'Hàm dưới bên trái',
    tooths: [
      {
        label: 'R85',
        value: '85',
      },
      {
        label: 'R84',
        value: '84',
      },
      {
        label: 'R83',
        value: '83',
      },
      {
        label: 'R82',
        value: '82',
      },
      {
        label: 'R81',
        value: '81',
      },
    ]
  },
];