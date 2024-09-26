const ADMIN_PREFIX = '';

export const dashboardRoute = {
  dashboard: `${ADMIN_PREFIX}/`,
};

export const userRoute = {
  list: `${ADMIN_PREFIX}/users`,
  create: `${ADMIN_PREFIX}/users/create`,
  update: (id: string | number | undefined) => (id ? `${ADMIN_PREFIX}/users/${id}/edit` : ''),
};

export const studentRoute = {
  listCourse: `${ADMIN_PREFIX}/students`,
};
