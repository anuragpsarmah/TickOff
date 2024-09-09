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
import { passwordRegEx, emailRegEx } from "@/constants/RegEx";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

interface FormData {
    username: string;
    email: string;
    password: string;
}

export default function Register() {
    const [formData, setFormData] = useState<FormData>({
        username: "",
        email: "",
        password: "",
    });
    const [show, setShow] = useState<boolean>(false);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    const { toast } = useToast();
    const navigate = useNavigate();

    const clearFormData = () => {
        setFormData({
            username: "",
            email: "",
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

    const handleRegister = async () => {
        setIsDisabled(true);
        for (const key in formData) {
            if (!formData[key as keyof FormData]) {
                setIsDisabled(false);
                return toast({
                    description: "⚠︎ Ensure no fields are empty.",
                });
            }
        }

        if (!emailRegEx.test(formData.email)) {
            setIsDisabled(false);
            return toast({
                description: "⚠︎ Enter a valid email.",
            });
        }

        if (!passwordRegEx.test(formData.password)) {
            setIsDisabled(false);
            console.log(
                "Enter a strong password:\n- At least 8 characters long\n- Contains a lower case letter\n- Contains an upper case letter\n- Contains a number\n- Contains a special character"
            );
            return toast({
                description: "⚠︎ Enter a strong password.",
            });
        }

        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND}/api/auth/register`,
                {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                }
            );

            toast({
                description: "User registered successfully.",
            });

            navigate("/login");
        } catch (error: unknown) {
            console.log(error);
            if (error instanceof Error) {
                console.log(error);
                toast({
                    description: "❗ Error registering user.",
                });
            } else {
                console.log("An unknown error occurred.");
                toast({
                    description: "❗ Error registering user.",
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
                        Create a new account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-6">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Username</Label>
                                <Input
                                    onChange={handleChange}
                                    id="name"
                                    name="username"
                                    type="name"
                                    value={formData.username}
                                    placeholder="Enter your username"
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    onChange={handleChange}
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    placeholder="Enter your email"
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
                        onClick={handleRegister}
                        disabled={isDisabled}
                    >
                        Register
                    </Button>
                    <p>
                        Already have an account?{" "}
                        <Link to="/login">
                            <strong>Login</strong>
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
