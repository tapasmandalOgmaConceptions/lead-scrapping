const endpoints = {
  auth: {
    login: "auth/login",
  },
  user: {
    getUsers: "user",
    getUserDetails: (userId: string) => `user/${userId}`,
    createUser: "user/create",
    updateUser: (userId: string) => `user/update/${userId}`,
    deleteUser: (userId: string) => `user/delete/${userId}`,
    assignUserLead: "assign-user/leads",
    assignUser: "assign-user",
  },
  leadScrape: {
    createLeadScrape: "leads/scrape",
    leadList: "leads",
    getCityList: "leads/cities",
    changeLeadStatus: (leadId: string) => `assign-user/lead/${leadId}/status`,
    getSectors: "leads/sectors"
  },
};
export default endpoints;