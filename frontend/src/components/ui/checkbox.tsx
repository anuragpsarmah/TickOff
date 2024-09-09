import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRecoilState } from "recoil";
import { currentUser, todoReRender } from "@/utils/atom";
import { getNewAccessToken } from "@/utils/getNewAccessToken";
import { useNavigate } from "react-router-dom";

interface CheckBoxProps {
    id: string;
    isComplete: boolean;
}

export default function CheckBox({ id, isComplete }: CheckBoxProps) {
    const [isChecked, setIsChecked] = useState<boolean>(isComplete);
    const [todoRender, setTodoRender] = useRecoilState(todoReRender);
    const [, setCurrentUserState] = useRecoilState(currentUser);
    const { toast } = useToast();
    const navigate = useNavigate();

    const toggleTodo = async () => {
        try {
            await axios.get(
                `${import.meta.env.VITE_BACKEND}/api/todo/toggleToDo?todoId=${id}`,
                {
                    withCredentials: true,
                }
            );
        } catch (error) {
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
                    }
                } else {
                    toast({
                        description: "⚠︎ Error fetching data.",
                    });
                }
            } else {
                toast({
                    description: `⚠︎ An unknown error occured.`,
                });
            }
        }
    };

    useEffect(() => {
        setIsChecked(isComplete);
    }, [isComplete]);

    const handleToggle = async () => {
        const newCheckedState = !isChecked;
        setIsChecked(newCheckedState);
        await toggleTodo();
        setTodoRender(!todoRender);
    };

    return (
        <div className="flex items-center space-x-3">
            <div
                className={`w-5 h-[1.2rem] mt-[0.15rem] border-2 rounded-sm flex items-center justify-center cursor-pointer transition-colors duration-200 ${
                    isChecked
                        ? "bg-black border-black"
                        : "border-gray-400 hover:border-gray-600"
                }`}
                onClick={handleToggle}
                role="checkbox"
                aria-checked={isChecked}
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                        e.preventDefault();
                        handleToggle();
                    }
                }}
            >
                {isChecked && (
                    <motion.svg
                        className="w-7 h-7 text-white"
                        viewBox="0 0 28 28"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                        }}
                    >
                        <motion.path
                            d="M5 15L10 20L23 7"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        />
                    </motion.svg>
                )}
            </div>
        </div>
    );
}
