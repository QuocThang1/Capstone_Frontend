import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Outlet } from "react-router-dom";

const GeneralLayout = () => (
    <div className="bg-[#F6F8F7] min-h-screen flex flex-col overflow-x-hidden">
        <Header />
        <main className="flex-1 px-0 md:px-0 py-0">
            <Outlet />
        </main>
        <Footer />
    </div>
);

export default GeneralLayout;