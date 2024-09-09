import { RecoilRoot } from "recoil";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Profile from "./pages/profile/Profile";
import Error404 from "./pages/404/404";

export default function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home />,
            errorElement: <Error404 />,
            children: [
                {
                    path: "/register",
                    element: <Register />,
                },
                {
                    path: "/login",
                    element: <Login />,
                },
                {
                    path: "/profile",
                    element: <Profile />,
                },
            ],
        },
    ]);

    return (
        <RecoilRoot>
            <div className="min-h-screen bg-gradient-to-br from-[hsl(0,0%,100%)] via-[hsl(210,40%,98%)] to-[hsl(0,0%,100%)]">
                <RouterProvider router={router} />
                <Toaster />
            </div>
        </RecoilRoot>
    );
}
