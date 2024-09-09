import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useRecoilState } from "recoil";
import {
    currentUser,
    activeCategory,
    todoReRender,
    popoverState,
} from "@/utils/atom";
import { DatePickerDemo } from "../ui/datepicker";

interface data {
    title: string;
    description: string;
}

const AddTask = () => {
    const [formData, setFormData] = useState<data>({
        title: "",
        description: "",
    });
    const [selectedDate, setSelectedDate] = useState<string | undefined>(
        undefined
    );
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [activeCategoryId] = useRecoilState(activeCategory);
    const [todoRender, setTodoRender] = useRecoilState(todoReRender);
    const [, setCurrentUserState] = useRecoilState(currentUser);
    const [, setIsPopoverOpen] = useRecoilState(popoverState);
    const { toast } = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name: string = e.target.name;
        const value: string = e.target.value;

        setFormData((prev) => {
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    const handleAddTask = async () => {
        setIsDisabled(true);
        if (!formData.title || !formData.description || !selectedDate) {
            toast({
                description: "⚠︎ Empty fields found.",
            });
            setIsDisabled(false);
            return;
        }
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND}/api/todo/createToDo`,
                {
                    title: formData.title,
                    description: formData.description,
                    deadline: selectedDate,
                    todoCategoryId: activeCategoryId,
                },
                {
                    withCredentials: true,
                }
            );
            toast({
                description: `${formData.title} task added.`,
            });
            setTodoRender(!todoRender);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status == 401) {
                    toast({
                        description: `⚠︎ Unable to add task. Try again.`,
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
        setIsPopoverOpen(false);
    };

    useEffect(() => {
        return () => setIsPopoverOpen(false);
    }, [setIsPopoverOpen]);

    return (
        <div className="flex justify-center items-center max-h-screen p-[0rem] m-[0rem]">
            <Card className="w-[500px] shadow-lg pt-5">
                <CardContent>
                    <form className="flex flex-col gap-5">
                        <div className="grid w-full items-center gap-6">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    type="text"
                                    placeholder="Enter task title"
                                    onChange={handleChange}
                                    value={formData.title}
                                />
                            </div>
                        </div>
                        <div className="grid w-full items-center gap-6">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Description</Label>
                                <Input
                                    id="description"
                                    name="description"
                                    type="text"
                                    placeholder="Enter task description"
                                    onChange={handleChange}
                                    value={formData.description}
                                />
                            </div>
                        </div>
                        <div className="grid w-full items-center gap-6">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Deadline</Label>
                                <DatePickerDemo
                                    selectedDate={selectedDate}
                                    setSelectedDate={setSelectedDate}
                                />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col justify-center gap-6">
                    <Button
                        className="hover:scale-105 transition ease-in-out duration-300"
                        onClick={handleAddTask}
                        disabled={isDisabled}
                    >
                        Add
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default AddTask;
