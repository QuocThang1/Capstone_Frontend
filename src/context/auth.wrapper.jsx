import { useState, useEffect } from "react";
import { getAccountApi } from "../utils/Api/accountApi";
import Spinner from "../components/spinner";
import { AuthContext } from "./auth.context";
import socket from "../utils/socket";

export const AuthWrapper = (props) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: {
            _id: "",
            email: "",
            fullName: "",
            username: "",
            dob: "",
            gender: "",
            phone: "",
            role: "",
            skills: [],
        },
    });

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
                            role: res.data.role || "user",
                            skills: res.data.skills || [],
                        },
                    });
                } else {
                    localStorage.removeItem("access_token");
                    setAuth({
                        isAuthenticated: false,
                        user: {
                            _id: "",
                            email: "",
                            fullName: "",
                            username: "",
                            dob: "",
                            gender: "",
                            phone: "",
                            role: "",
                            skills: [],
                        },
                    });
                }
            } catch (error) {
                console.error("Error fetching account:", error);
                localStorage.removeItem("access_token");
                setAuth({
                    isAuthenticated: false,
                    user: {
                        _id: "",
                        email: "",
                        fullName: "",
                        username: "",
                        dob: "",
                        gender: "",
                        phone: "",
                        role: "",
                        skills: [],
                    },
                });
            } finally {
                setAppLoading(false);
            }
        };

        fetchAccount();
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