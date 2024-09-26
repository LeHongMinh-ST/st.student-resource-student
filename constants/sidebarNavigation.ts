import {
  IconAlertTriangle,
  IconBan,
  IconBook,
  IconBookmark,
  IconBuilding,
  IconDashboard,
  IconListNumbers,
  IconListDetails,
  IconUserEdit,
  IconUsers,
  IconChartDots,
  IconChartBar,
  IconSettings,
  IconBellRinging2,
  IconUser,
  IconMessageQuestion,
  IconSchool,
} from '@tabler/icons-react';
import { SidebarNavigationProps } from '@/types';
import { dashboardRoute, studentRoute, userRoute } from '@/routes';

const sidebarNavigationAdmin: SidebarNavigationProps[] = [
  {
    title: 'Quản lý chung',
    links: [
      { label: 'Bảng điều khiển', icon: IconDashboard, link: dashboardRoute.dashboard },
      { label: 'Bộ môn', icon: IconBuilding, link: '/departments' },
      { label: 'Ngành học', icon: IconBookmark, link: '/majors' },
      { label: 'Lớp học', icon: IconBook, link: '/classes' },
    ],
  },
  {
    title: 'Sinh viên',
    links: [
      { label: 'Danh sách sinh viên', icon: IconUsers, link: studentRoute.listCourse },
      { label: 'Đợt tốt nghiệp', icon: IconSchool, link: '/students-graduation' },
      { label: 'Cảnh báo', icon: IconAlertTriangle, link: '/students-absent' },
      { label: 'Buộc thôi học', icon: IconBan, link: '/students-leave' },
      { label: 'Xác nhận thông tin', icon: IconUserEdit, link: '/students-request' },
      { label: 'Phản ánh', icon: IconMessageQuestion, link: '/students-report' },
    ],
  },
  {
    title: 'Khảo sát',
    links: [
      { label: 'Khảo sát viêc làm', icon: IconListDetails, link: '/form-job' },
      { label: 'Đánh giá rèn luyện', icon: IconListNumbers, link: '/form-point' },
    ],
  },
  {
    title: 'Báo cáo - thống kê',
    links: [
      { label: 'Tình hình việc làm', icon: IconChartDots, link: '/statistics-job' },
      { label: 'Báo cáo tổng hợp', icon: IconChartBar, link: '/statistics' },
    ],
  },
  {
    title: 'Hệ thống',
    links: [
      { label: 'Tài khoản', icon: IconUser, link: userRoute.list },
      { label: 'Thông báo', icon: IconBellRinging2, link: '/notification' },
      { label: 'Cài đặt', icon: IconSettings, link: '/settings' },
    ],
  },
];

export default sidebarNavigationAdmin;
