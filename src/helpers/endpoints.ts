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
  technician: {
    getTechniciansLead: "technician/leads",
  },
  leadScrape: {
    createLeadScrape: "leads/scrape",
    leadList: "leads",
    getCityList: "leads/cities",
    changeLeadStatus: (leadId: string) => `assign-user/lead/${leadId}/status`,
    getSectors: "leads/sectors",
    addNote: "lead-notes/add-notes",
    getLead: (leadId: string) => `/leads/${leadId}`,
    getLeadNote: (leadId: string) => `/lead-notes/${leadId}/notes`,
  },
  templateNote: {
    deals: {
      getDealSectorPackages: "deals/sector-package",
      saveDeals: "deals/save",
      getDeals: (leadId: string) => `deals/${leadId}`,
    },
    technicalContext: {
      saveTechnicalContext: "technical_context/save",
      getTechnicalContext: (dealId: string) => `technical_context/${dealId}`,
    },
    internalNote: {
      saveInternalNote: "internal-note/save",
      getInternalNote: (dealId: string) => `internal-note/${dealId}`,
    },
    communication: {
      saveCommunication: "communication/save",
      getCommunication: (dealId: string) => `communication/${dealId}`,
    },
    workPackage: {
      getPackageTypes: "work-package/get-package-types",
      getSkills: "work-package/get-skills",
      getTools: "work-package/get-tools",
      saveWorkPackage: "work-package/save",
      getWorkPackage: (dealId: string) => `work-package/${dealId}`,
      deleteWorkPackage: (packageId: string) => `work-package/${packageId}`,
    }
  },
};
export default endpoints;
