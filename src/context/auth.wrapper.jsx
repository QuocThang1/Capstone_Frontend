import { useState, useEffect } from "react";
import { getAccountApi } from "../utils/Api/accountApi";
import Spinner from "../components/spinner";
import { AuthContext } from "./auth.context";
import socket from "../utils/socket";

const emptyAuth = {
    isAuthenticated: false,
    user: {
        _id: "",
        email: "",
        fullName: "",
        username: "",
        dob: "",
        gender: "",
        phone: "",
        avatar: "",
        bio: "",
        role: "",
        skills: [],
    },
};

export const AuthWrapper = (props) => {
    const [auth, setAuth] = useState(emptyAuth);

    const [appLoading, setAppLoading] = useState(true);

    useEffect(() => {
        const fetchAccount = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) {
                setAppLoading(false);
                return;
            }

            try {
                const res = await getAccountApi();
                console.log("Account response:", res);
                if (res && res.data) {
                    setAuth({
                        isAuthenticated: true,
                        user: {
                            _id: res.data._id || "",
                            email: res.data.email || "",
                            fullName: res.data.fullName || "",
                            username: res.data.username || "",
                            dob: res.data.dob || "",
                            gender: res.data.gender || "",
                            phone: res.data.phone || "",
                            avatar: res.data.avatar || "",
                            bio: res.data.bio || "",
                            role: res.data.role || "user",
                            skills: res.data.skills || [],
                        },
                    });
                } else {
                    localStorage.removeItem("access_token");
                    setAuth(emptyAuth);
                }
            } catch (error) {
                console.error("Error fetching account:", error);
                localStorage.removeItem("access_token");
                setAuth(emptyAuth);
            } finally {
                setAppLoading(false);
            }
        };

        fetchAccount();
    }, []);

    useEffect(() => {
        const handleUnauthorized = () => {
            setAuth(emptyAuth);
        };

        window.addEventListener("auth:unauthorized", handleUnauthorized);
        return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
    }, []);

    useEffect(() => {
        // Nếu user đã đăng nhập -> Mở kết nối
        if (auth.isAuthenticated) {
            if (!socket.connected) {
                socket.connect();
            }
        }
        // Nếu user chưa đăng nhập hoặc vừa đăng xuất -> Ngắt kết nối
        else {
            if (socket.connected) {
                socket.disconnect();
            }
        }

        // Cleanup: Ngắt kết nối khi component sập (hoặc khi lưu code HMR)
        return () => {
            if (socket.connected) {
                socket.disconnect();
            }
        };
    }, [auth.isAuthenticated]);

    return (
        <>
            {appLoading ? (
                <div className="loading">
                    <Spinner fullScreen text="Loading..." />
                </div>
            ) : (
                <AuthContext.Provider value={{
                    ...auth,
                    auth,
                    setAuth,
                    appLoading,
                    setAppLoading: async () => {
                        try {
                            const res = await getAccountApi();
                            if (res && res.data) {
                                setAuth({
                                    isAuthenticated: true,
                                    user: {
                                        _id: res.data._id || "",
                                        email: res.data.email || "",
                                        fullName: res.data.fullName || "",
                                        username: res.data.username || "",
                                        dob: res.data.dob || "",
                                        gender: res.data.gender || "",
                                        phone: res.data.phone || "",
                                        avatar: res.data.avatar || "",
                                        bio: res.data.bio || "",
                                        role: res.data.role || "user",
                                        skills: res.data.skills || [],
                                    },
                                });
                            }
                        } catch (err) {
                            console.error('Failed to refresh account:', err);
                        }
                    }
                }}>
                    {props.children}
                </AuthContext.Provider>
            )}
        </>
    );
};
