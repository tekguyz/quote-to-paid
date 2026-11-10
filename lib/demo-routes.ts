export const demoRoutes = {
  board: "/demo",
  activity: "/demo/activity",
  rules: "/demo/rules",
  newQuote: "/demo/new",
  job: (id: string) => `/demo/jobs/${id}`,
  customer: (id: string) => `/demo/jobs/${id}/customer`,
};
