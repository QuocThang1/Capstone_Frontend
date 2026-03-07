import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const GeneralLayout = () => (
    <div className="bg-[#F6F8F7] min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 px-4 md:px-16 py-8">
            <Outlet />
        </main>
        <Footer />
    </div>
);

export default GeneralLayout;