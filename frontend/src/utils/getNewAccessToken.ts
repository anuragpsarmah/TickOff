import axios from "axios";

export async function getNewAccessToken() {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND}/api/token/newToken`,
            {
                withCredentials: true,
            }
        );
        return response;
    } catch (error) {
        console.log(error);
        return "401";
    }
}
