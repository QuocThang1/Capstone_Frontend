import { ClipboardList } from "lucide-react";
import ComingSoonPage from "../ComingSoonPage";

const AuditLogs = () => {
  return (
    <ComingSoonPage
      featureName="Audit Logs"
      icon={ClipboardList}
      description="Xem chi tiết về tất cả các hành động được thực hiện trong hệ thống, khi nào chúng xảy ra, và ai đã thực hiện chúng. Đảm bảo tuân thủ và bảo mật dữ liệu."
    />
  );
};

export default AuditLogs;
