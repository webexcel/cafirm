import { getUserDetails } from "../service/authServices"


const getUserData = async () => {
    try {
        const response = await getUserDetails()
        return response.data?.data || {}
    }
    catch (error) {
        console.log("Error occurs while getting user data : ", error.stack)
        return {}
    }

}

export { getUserData }