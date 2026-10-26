import type { Id } from '../types/models';

export const ROUTES = {
  HOME: 'Home',
  COURSES: 'Courses',
  COURSE_DETAIL: 'CourseDetail',
  SCHEDULE: 'Schedule',
  SESSION_DETAIL: 'SessionDetail',
  ASSIGNMENTS: 'Assignments',
  ASSIGNMENT_DETAIL: 'AssignmentDetail',
  ASSIGNMENT_FORM: 'AssignmentForm',
  PROFILE: 'Profile',
  EDIT_PROFILE: 'EditProfile',
  GRADES: 'Grades',
  GRADE_DETAIL: 'GradeDetail',
} as const;

export const TAB_ROUTES = {
  OVERVIEW: 'TongQuan',
  COURSES: 'MonHoc',
  SCHEDULE: 'LichHoc',
  ASSIGNMENTS: 'BaiTap',
  PROFILE: 'CaNhan',
} as const;

export type RouteName = (typeof ROUTES)[keyof typeof ROUTES];
export type TabRouteName = (typeof TAB_ROUTES)[keyof typeof TAB_ROUTES];

// Stack Param Lists
export type HomeStackParamList = {
  [ROUTES.HOME]: undefined;
  [ROUTES.COURSE_DETAIL]: { id: Id };
  [ROUTES.ASSIGNMENT_DETAIL]: { id: Id };
};

export type CourseStackParamList = {
  [ROUTES.COURSES]: undefined;
  [ROUTES.COURSE_DETAIL]: { id: Id };
};

export type ScheduleStackParamList = {
  [ROUTES.SCHEDULE]: undefined;
  [ROUTES.SESSION_DETAIL]: { id: Id };
};

export type AssignmentStackParamList = {
  [ROUTES.ASSIGNMENTS]: undefined;
  [ROUTES.ASSIGNMENT_DETAIL]: { id: Id };
  [ROUTES.ASSIGNMENT_FORM]: undefined;
};

export type ProfileStackParamList = {
  [ROUTES.PROFILE]: undefined;
  [ROUTES.EDIT_PROFILE]: undefined;
  [ROUTES.GRADES]: undefined;
  [ROUTES.GRADE_DETAIL]: { id: Id };
};
