import { useEffect, useState } from "react";
import { Alert, App, Button, Input, Select, Spin, Switch } from "antd";
import SectionCard from "@/components/adminPage/SectionCard";
import SelectDropdown from "@/components/selectDropdown";
import {
  getSystemSettingsApi,
  sendSystemSettingsTestEmailApi,
  updateSystemSettingsApi,
} from "@/utils/Api/adminApi";

const defaultSettings = {
  platformName: "TASKA",
  supportEmail: "nextgen1811.hrms@gmail.com",
  defaultLanguage: "English",
  defaultTimezone: "Asia/Ho_Chi_Minh",
  allowPublicSignups: true,
  requireEmailVerification: true,
  allowThirdPartyLogin: false,
  allowPasswordLogin: true,
  emailProvider: "Gmail SMTP",
  senderName: "TASKA",
  senderEmail: "nextgen1811.hrms@gmail.com",
  enableEmailNotifications: true,
  enableOtpEmail: true,
  enablePasswordResetEmail: true,
  enableInviteMemberEmail: true,
  enableAuditLogging: true,
  maxLoginAttempts: 5,
  lockAccountDurationMinutes: 15,
  sessionTimeoutMinutes: 60,
  requireStrongPassword: true,
  draftCleanupTime: "03:00",
  maintenanceMode: false,
  maintenanceMessage: "TASKA is currently under maintenance. Please try again later.",
  allowAdminAccessDuringMaintenance: true,
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SettingSwitch({ title, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-6 py-1">
      <div>
        <div className="text-sm font-medium text-slate-800 dark:text-slate-100">{title}</div>
        {description && <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
      <Switch checked={checked} onChange={onChange} />
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</label>
      {children}
    </div>
  );
}

export default function SystemSettingsPage() {
  const { message, modal } = App.useApp();
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingTestEmail, setSendingTestEmail] = useState(false);
  const [testRecipient, setTestRecipient] = useState(defaultSettings.supportEmail);

  const updateSetting = (field, value) => setSettings((current) => ({ ...current, [field]: value }));

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      const res = await getSystemSettingsApi();
      if (res?.EC === 0) {
        setSettings({ ...defaultSettings, ...res.data });
        setTestRecipient(res.data?.supportEmail || defaultSettings.supportEmail);
      } else {
        message.error(res?.EM || "Failed to load system settings");
      }
      setLoading(false);
    };

    fetchSettings();
  }, [message]);

  const validate = () => {
    if (!settings.platformName.trim()) return "Platform name is required";
    if (!emailPattern.test(settings.supportEmail)) return "Support email is invalid";
    if (!emailPattern.test(settings.senderEmail)) return "Sender email is invalid";
    if (!settings.allowPasswordLogin && !settings.allowThirdPartyLogin) return "At least one login method must remain enabled";
    if (settings.maxLoginAttempts < 1 || settings.maxLoginAttempts > 20) return "Max login attempts must be between 1 and 20";
    if (settings.lockAccountDurationMinutes < 1 || settings.lockAccountDurationMinutes > 1440) return "Lock duration must be between 1 and 1440 minutes";
    if (settings.sessionTimeoutMinutes < 5 || settings.sessionTimeoutMinutes > 1440) return "Session timeout must be between 5 and 1440 minutes";
    if (settings.draftCleanupTime && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(settings.draftCleanupTime)) return "Draft cleanup time must be in HH:MM format";
    return null;
  };

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      message.error(validationError);
      return;
    }

    setSaving(true);
    const res = await updateSystemSettingsApi(settings);
    if (res?.EC === 0) {
      setSettings({ ...defaultSettings, ...res.data });
      message.success("System settings updated successfully");
    } else {
      message.error(res?.EM || "Failed to update system settings");
    }
    setSaving(false);
  };

  const handleMaintenanceToggle = (enabled) => {
    if (!enabled) {
      updateSetting("maintenanceMode", false);
      return;
    }

    modal.confirm({
      title: "Enable Maintenance Mode?",
      content: "Regular users will be blocked from platform APIs until maintenance mode is disabled.",
      okText: "Enable Maintenance",
      okButtonProps: { danger: true },
      onOk: () => updateSetting("maintenanceMode", true),
    });
  };

  const handleSendTestEmail = async () => {
    if (!emailPattern.test(testRecipient)) {
      message.error("Test recipient email is invalid");
      return;
    }

    setSendingTestEmail(true);
    const res = await sendSystemSettingsTestEmailApi({
      to: testRecipient,
      subject: "TASKA Test Email",
      message: "This is a test email from TASKA system settings.",
    });
    if (res?.EC === 0) {
      message.success("Test email sent successfully");
    } else {
      message.error(res?.EM || "Failed to send test email");
    }
    setSendingTestEmail(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">System Settings</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage platform-wide defaults and operational controls.</p>
        </div>
        <Button type="primary" loading={saving} onClick={handleSave} className="bg-indigo-600">
          Save Changes
        </Button>
      </div>

      <div className="mx-auto max-w-4xl space-y-6">
        <SectionCard title="Platform Information" description="Core TASKA platform identity and localization defaults">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Platform Name"><Input value={settings.platformName} onChange={(e) => updateSetting("platformName", e.target.value)} /></Field>
            <Field label="Support Email"><Input type="email" value={settings.supportEmail} onChange={(e) => updateSetting("supportEmail", e.target.value)} /></Field>
            <Field label="Default Language">
              <Select className="w-full" value={settings.defaultLanguage} onChange={(value) => updateSetting("defaultLanguage", value)} options={[{ value: "English" }, { value: "Vietnamese" }]} />
            </Field>
            <Field label="Default Timezone">
              <Select className="w-full" value={settings.defaultTimezone} onChange={(value) => updateSetting("defaultTimezone", value)} options={[{ value: "Asia/Ho_Chi_Minh" }, { value: "UTC" }, { value: "Asia/Singapore" }]} />
            </Field>
          </div>
        </SectionCard>

        <SectionCard title="User & Registration" description="Control how users create accounts and sign in">
          <div className="space-y-5">
            <SettingSwitch title="Allow Public Signups" description="Allow new users to create TASKA accounts." checked={settings.allowPublicSignups} onChange={(value) => updateSetting("allowPublicSignups", value)} />
            <SettingSwitch title="Require Email Verification" description="Require OTP verification during registration." checked={settings.requireEmailVerification} onChange={(value) => updateSetting("requireEmailVerification", value)} />
            <SettingSwitch title="Allow Third-party Platform Login" description="Allow users to authenticate with Google or GitHub." checked={settings.allowThirdPartyLogin} onChange={(value) => updateSetting("allowThirdPartyLogin", value)} />
            <SettingSwitch title="Allow Password Login" description="Allow username or email and password authentication." checked={settings.allowPasswordLogin} onChange={(value) => updateSetting("allowPasswordLogin", value)} />
          </div>
        </SectionCard>

        <SectionCard title="Email & Notifications" description="Configure sender identity and platform email features">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Email Provider"><Input value={settings.emailProvider} onChange={(e) => updateSetting("emailProvider", e.target.value)} /></Field>
            <Field label="Sender Name"><Input value={settings.senderName} onChange={(e) => updateSetting("senderName", e.target.value)} /></Field>
            <Field label="Sender Email"><Input type="email" value={settings.senderEmail} onChange={(e) => updateSetting("senderEmail", e.target.value)} /></Field>
            <Field label="Test Recipient"><Input type="email" value={testRecipient} onChange={(e) => setTestRecipient(e.target.value)} /></Field>
          </div>
          <div className="mt-6 space-y-5">
            <SettingSwitch title="Enable Email Notifications" checked={settings.enableEmailNotifications} onChange={(value) => updateSetting("enableEmailNotifications", value)} />
            <SettingSwitch title="Enable OTP Email" checked={settings.enableOtpEmail} onChange={(value) => updateSetting("enableOtpEmail", value)} />
            <SettingSwitch title="Enable Password Reset Email" checked={settings.enablePasswordResetEmail} onChange={(value) => updateSetting("enablePasswordResetEmail", value)} />
            <SettingSwitch title="Enable Invite Member Email" checked={settings.enableInviteMemberEmail} onChange={(value) => updateSetting("enableInviteMemberEmail", value)} />
          </div>
          <Button className="mt-6" loading={sendingTestEmail} onClick={handleSendTestEmail}>Send Test Email</Button>
        </SectionCard>

        <SectionCard title="Security Settings" description="Authentication safeguards and session controls">
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Max Login Attempts"><Input type="number" min={1} max={20} value={settings.maxLoginAttempts} onChange={(e) => updateSetting("maxLoginAttempts", Number(e.target.value))} /></Field>
            <Field label="Lock Duration (minutes)"><Input type="number" min={1} max={1440} value={settings.lockAccountDurationMinutes} onChange={(e) => updateSetting("lockAccountDurationMinutes", Number(e.target.value))} /></Field>
            <Field label="Session Timeout (minutes)"><Input type="number" min={5} max={1440} value={settings.sessionTimeoutMinutes} onChange={(e) => updateSetting("sessionTimeoutMinutes", Number(e.target.value))} /></Field>
          </div>
          <div className="mt-6 space-y-5">
            <SettingSwitch title="Enable Audit Logging" checked={settings.enableAuditLogging} onChange={(value) => updateSetting("enableAuditLogging", value)} />
            <SettingSwitch title="Require Strong Password" checked={settings.requireStrongPassword} onChange={(value) => updateSetting("requireStrongPassword", value)} />
          </div>
        </SectionCard>

        <SectionCard title="System Automation" description="Configure platform background tasks and automatic cleanup" className="overflow-visible">
          <div className="space-y-5">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">AI Draft Cleanup</h4>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Cleanup Time (HH:MM)">
                  <div className="flex items-center gap-2">
                    <SelectDropdown
                      value={settings.draftCleanupTime?.split(":")[0] || "03"}
                      onChange={(val) => updateSetting("draftCleanupTime", `${val}:${settings.draftCleanupTime?.split(":")[1] || "00"}`)}
                      options={Array.from({ length: 24 }, (_, i) => {
                        const h = i.toString().padStart(2, "0");
                        return { label: h, value: h };
                      })}
                      placeholder="HH"
                      width="w-24"
                    />
                    <span className="font-bold text-slate-500 dark:text-slate-400">:</span>
                    <SelectDropdown
                      value={settings.draftCleanupTime?.split(":")[1] || "00"}
                      onChange={(val) => updateSetting("draftCleanupTime", `${settings.draftCleanupTime?.split(":")[0] || "03"}:${val}`)}
                      options={Array.from({ length: 60 }, (_, i) => {
                        const m = i.toString().padStart(2, "0");
                        return { label: m, value: m };
                      })}
                      placeholder="MM"
                      width="w-24"
                    />
                  </div>
                </Field>
                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 self-end pb-2">
                  * Runs based on the system's default time zone: {settings.defaultTimezone || "Asia/Ho_Chi_Minh"}
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Maintenance Mode" description="Temporarily restrict platform access during operational work" className="border-amber-200 dark:border-amber-900/60">
          {settings.maintenanceMode && <Alert className="mb-5" type="warning" showIcon message="Maintenance mode is enabled" description={settings.maintenanceMessage} />}
          <div className="space-y-5">
            <SettingSwitch title="Enable Maintenance Mode" description="Block regular users from platform APIs." checked={settings.maintenanceMode} onChange={handleMaintenanceToggle} />
            <Field label="Maintenance Message">
              <Input.TextArea rows={3} value={settings.maintenanceMessage} onChange={(e) => updateSetting("maintenanceMessage", e.target.value)} />
            </Field>
            <SettingSwitch title="Allow Admin Access During Maintenance" checked={settings.allowAdminAccessDuringMaintenance} onChange={(value) => updateSetting("allowAdminAccessDuringMaintenance", value)} />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
