import { useEffect } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { currentUser } from "@/utils/atom";
import { getNewAccessToken } from "@/utils/getNewAccessToken";
import { useNavigate, Outlet } from "react-router-dom";

const Home = () => {
    const [currentUserState, setCurrentUserState] = useRecoilState(currentUser);
    const navigate = useNavigate();

    const validation = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND}/api/auth/validation`,
                {
                    withCredentials: true,
                }
            );

            setCurrentUserState({
                userid: response.data.data.id,
                username: response.data.data.username,
                email: response.data.data.email,
            });

            navigate("/profile");
        } catch (error) {
            console.log("Error reached");

            if (axios.isAxiosError(error)) {
                if (error.response?.status == 401) {
                    const res = await getNewAccessToken();
                    if (res === "401") navigate("/register");
                    else {
                        setCurrentUserState({
                            userid: res.data.data.id,
                            username: res.data.data.username,
                            email: res.data.data.email,
                        });
                        navigate("/profile");
                    }
                } else {
                    navigate("/register");
                }
            } else {
                navigate("/register");
            }
        }
    };

    useEffect(() => {
        if (!currentUserState.username) validation();
    }, [currentUserState]);

    return <Outlet />;
};

export default Home;
