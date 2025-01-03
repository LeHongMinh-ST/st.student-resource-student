const STUDENT_PREFIX = '';
export const dashboardRoute = {
  dashboard: `${STUDENT_PREFIX}/`,
};
export const requestRoute = {
  list: `${STUDENT_PREFIX}/request-update`,
  myRequest: `${STUDENT_PREFIX}/my-request`,
  create: `${STUDENT_PREFIX}/request-update/create`,
  update: (id: string | number) => `${STUDENT_PREFIX}/request-update/${id}/edit`,
};
