import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import CheckBox from "../ui/checkbox";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRecoilState } from "recoil";
import { currentUser, todoReRender } from "@/utils/atom";

interface todoProps {
    todos: {
        createdAt: Date;
        deadline: Date;
        description: string;
        isComplete: boolean;
        title: string;
        todoCategoryId: string;
        updatedAt: Date;
        __v: number;
        _id: string;
    };
}

const ToDo: React.FC<todoProps> = ({ todos }) => {
    const [date, setDate] = useState<string>("");
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [todoRender, setTodoRender] = useRecoilState(todoReRender);
    const [, setCurrentUserState] = useRecoilState(currentUser);
    const { toast } = useToast();

    const handleTodoDelete = async () => {
        setIsDisabled(true);
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND}/api/todo/deleteToDo?id=${todos._id}`,
                {
                    withCredentials: true,
                }
            );
            toast({
                description: `${todos.title} task deleted.`,
            });
            setTodoRender(!todoRender);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status == 401) {
                    toast({
                        description: `⚠︎ Failed to delete category. Try again.`,
                    });
                    setCurrentUserState({
                        userid: "",
                        username: "",
                        email: "",
                    });
                } else {
                    toast({
                        description: `⚠︎ ${error.response?.data.message}.`,
                    });
                }
            } else {
                toast({
                    description: `⚠︎ An unknown error occured.`,
                });
            }
        }
        setIsDisabled(false);
    };

    useEffect(() => {
        const dateObj = new Date(todos.deadline);
        setDate(
            dateObj.toLocaleDateString("en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })
        );
    }, [todos.deadline]);

    return (
        <div className="flex justify-center items-center max-h-[calc(100vh-5rem)]">
            <Card className="w-[450px] h-[263px] shadow-lg p-6">
                <CardContent>
                    <div>
                        <div className="grid w-full items-center gap-6">
                            <div className="flex flex-col space-y-1.5">
                                <Label
                                    htmlFor="name"
                                    className="flex flex-row justify-between font-extrabold leading-none tracking-tight text-xl"
                                >
                                    <div>{todos.title}</div>
                                    <div className="flex flex-row gap-3">
                                        <CheckBox
                                            id={todos?._id}
                                            isComplete={todos?.isComplete}
                                        />
                                        <button
                                            onClick={handleTodoDelete}
                                            disabled={isDisabled}
                                        >
                                            <Trash2 className="w-5 h-5 hover:text-red-400" />
                                        </button>
                                    </div>
                                </Label>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="description">
                                    {todos.description}
                                </Label>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label
                                    htmlFor="deadline"
                                    className="flex flex-row gap-2"
                                >
                                    <p>Deadline:</p>
                                    {date}
                                </Label>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ToDo;
