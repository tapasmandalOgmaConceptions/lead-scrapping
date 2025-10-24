const endpoints =  {
    auth: {
        login: "auth/login",
        googleLogin: "",
        verifyOtp:""
    },
    user: {
        getUsers: "user",
        getUserDetails: (userId: string) => `user/${userId}`,
        createUser: "user/create",
        updateUser: (userId: string) => `user/update/${userId}`,
        deleteUser: (userId: string) => `user/delete/${userId}`,
        assignUserLead: "assign-user/leads",
        assignUser: "assign-user"
    },
    leadScrape: {
        createLeadScrape: "leads/scrape",
        leadList: "leads",
        getCityList: "leads/cities"
    },

    
    profile: {
        getProfileInfo: "user/profile",
        updateProfile: "user/update-profile"
    },
    product: {
        getProducts: "product/list",
        getProductSkuList: "product/sku-list",
        getCountries: "location/countries",
        getStates: (countryId: string) => `location/states?country_id=${countryId}`,
        placeOrder: "order/purchase",
        extractOrder: "chatgpt/extract-order",
        extractOrderUsingText: "chatgpt/extract-order-from-text"
    }
}
export default endpoints;