import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/reusables/navbar";
import Sidebar from "@/components/reusables/sidebar";
import { useRecoilState } from "recoil";
import {
    currentUser,
    categoryReRender,
    todoReRender,
    activeCategory,
    popoverState,
} from "@/utils/atom";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { getNewAccessToken } from "@/utils/getNewAccessToken";
import ToDo from "@/components/reusables/todos";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import AddTask from "@/components/reusables/addTask";

interface categoryName {
    categoryName: string;
    _id: string;
    createdAt: Date;
    todos: Array<string>;
    updatedAt: Date;
    __v: number;
}

interface todos {
    createdAt: Date;
    deadline: Date;
    description: string;
    isComplete: boolean;
    title: string;
    todoCategoryId: string;
    updatedAt: Date;
    __v: number;
    _id: string;
}

const Profile = () => {
    const [categoryNames, setCategoryNames] = useState<Array<categoryName>>([]);
    const [todos, setTodos] = useState<Array<todos>>([]);
    const [currentUserState, setCurrentUserState] = useRecoilState(currentUser);
    const [categoryRender] = useRecoilState(categoryReRender);
    const [activeCategoryId, setActiveCategoryId] =
        useRecoilState(activeCategory);
    const [todoRender] = useRecoilState(todoReRender);
    const [isPopoverOpen, setIsPopoverOpen] = useRecoilState(popoverState);
    const { toast } = useToast();
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

    const getToDos = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND}/api/todo/getToDo?categoryId=${activeCategoryId}`,
                {
                    withCredentials: true,
                }
            );
            setTodos(response.data.data);
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

    const getToDoCategories = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND}/api/todo/getToDoCategory`,
                {
                    withCredentials: true,
                }
            );
            setCategoryNames(response.data.data);
            setActiveCategoryId(response.data.data[0]?._id);
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
        if (!currentUserState.username) validation();
    }, [currentUserState]);

    useEffect(() => {
        getToDoCategories();
    }, [categoryRender]);

    useEffect(() => {
        if (activeCategoryId) getToDos();
    }, [todoRender, activeCategoryId]);

    return (
        <div className="flex flex-col h-screen">
            <Navbar className="w-full z-10" />
            <div className="flex flex-1 overflow-y-auto">
                <Sidebar
                    className="flex-shrink-0 w-64"
                    categoryNames={categoryNames}
                />
                <div className="flex flex-col items-center justify-center mt-5 w-full">
                    <Popover
                        open={isPopoverOpen}
                        onOpenChange={setIsPopoverOpen}
                    >
                        <PopoverTrigger>
                            <button className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:scale-105 transition ease-in-out duration-300 disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 shadow-lg">
                                Add Task
                            </button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <AddTask />
                        </PopoverContent>
                    </Popover>
                    <main className="flex-1 flex flex-col items-center justify-center overflow-y-auto mb-5">
                        <div className="max-w-3xl w-full p-4 space-y-4 max-h-[calc(100vh-12rem)] mb-5">
                            {todos.map((todo) => (
                                <ToDo todos={todo} />
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Profile;
