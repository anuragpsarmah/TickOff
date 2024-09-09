import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { currentUser } from "@/utils/atom";

interface FormData {
    identifier: string;
    password: string;
}

export default function Login() {
    const [formData, setFormData] = useState<FormData>({
        identifier: "",
        password: "",
    });
    const [show, setShow] = useState<boolean>(false);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [, setCurrentUserState] = useRecoilState(currentUser);

    const { toast } = useToast();
    const navigate = useNavigate();

    const clearFormData = () => {
        setFormData({
            identifier: "",
            password: "",
        });
    };

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

    const handleLogin = async () => {
        setIsDisabled(true);
        for (const key in formData) {
            if (!formData[key as keyof FormData]) {
                setIsDisabled(false);
                return toast({
                    description: "⚠︎ Ensure no fields are empty.",
                });
            }
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND}/api/auth/login`,
                {
                    identifier: formData.identifier,
                    password: formData.password,
                },
                {
                    withCredentials: true,
                }
            );

            toast({
                description: "User logged in successfully.",
            });

            setCurrentUserState({
                userid: response.data.data.id,
                username: response.data.data.username,
                email: response.data.data.email,
            });

            navigate("/profile");
        } catch (error: unknown) {
            console.log(error);
            if (error instanceof Error) {
                console.log(error);
                toast({
                    description: "❗ Error logging user.",
                });
            } else {
                console.log("An unknown error occurred.");
                toast({
                    description: "❗ Error logging user.",
                });
            }
        }

        clearFormData();
        setIsDisabled(false);
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="w-[450px] shadow-lg">
                <CardHeader>
                    <CardTitle className="flex justify-center text-3xl">
                        TICKOFF
                    </CardTitle>
                    <CardDescription className="flex justify-center text-lg">
                        Welcome Back
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-6">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Username or Email</Label>
                                <Input
                                    onChange={handleChange}
                                    id="identifier"
                                    name="identifier"
                                    type="text"
                                    value={formData.identifier}
                                    placeholder="Enter your username or email"
                                />
                            </div>
                            <div className="relative flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        onChange={handleChange}
                                        id="password"
                                        name="password"
                                        type={show ? "text" : "password"}
                                        value={formData.password}
                                        placeholder="Enter your password"
                                        className="pr-10"
                                    />
                                    {show ? (
                                        <FaEye
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                            onClick={() => {
                                                setShow(!show);
                                            }}
                                        />
                                    ) : (
                                        <FaEyeSlash
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                            onClick={() => {
                                                setShow(!show);
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col justify-center gap-6">
                    <Button
                        className="hover:scale-105 transition ease-in-out duration-300"
                        onClick={handleLogin}
                        disabled={isDisabled}
                    >
                        Login
                    </Button>
                    <p>
                        Want to manage tasks better?{" "}
                        <Link to="/register">
                            <strong>Register</strong>
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
