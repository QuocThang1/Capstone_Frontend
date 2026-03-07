const Footer = () => (
    <footer className="bg-[#101A17] text-white py-6 px-8 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
                <span className="font-bold text-md">Capstone</span>
            </div>
            <div className="flex gap-6 text-sm">
                <a href="#" className="hover:text-[#4ADE80]">Terms</a>
                <a href="#" className="hover:text-[#4ADE80]">Privacy</a>
                <a href="#" className="hover:text-[#4ADE80]">Contact</a>
            </div>
            <div className="text-xs mt-4 md:mt-0">&copy; 2026 Capstone. All rights reserved.</div>
        </div>
    </footer>
);

export default Footer;