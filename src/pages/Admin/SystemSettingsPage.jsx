import { useState } from "react";
import SectionCard from "@/components/adminPage/SectionCard";
import { Button, Input, message, Select, Switch } from "antd";

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState({
    platformName: "TASKA",
    supportEmail: "support@taska.com",
    allowSignups: true,
    requireEmailVerification: true,
    maxUploadSize: "50",
    defaultPlan: "Free",
    maintenanceMode: false
  });

  const handleSave = (section) => {
    message.success(`${section} settings saved successfully`);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">System Settings</h2>
      </div>

      <SectionCard 
        title="General Settings" 
        description="Basic platform information and branding"
        actions={<Button onClick={() => handleSave('General')}>Save Changes</Button>}
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium" htmlFor="platformName">Platform Name</label>
            <Input 
              id="platformName" 
              value={settings.platformName} 
              onChange={e => setSettings({...settings, platformName: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium" htmlFor="supportEmail">Support Email</label>
            <Input 
              id="supportEmail" 
              type="email" 
              value={settings.supportEmail} 
              onChange={e => setSettings({...settings, supportEmail: e.target.value})} 
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard 
        title="User & Registration" 
        description="Control how users sign up and access the platform"
        actions={<Button onClick={() => handleSave('User')}>Save Changes</Button>}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Allow Public Signups</div>
              <p className="text-sm text-slate-500">Anyone can create a new organization</p>
            </div>
            <Switch 
              checked={settings.allowSignups} 
              onChange={v => setSettings({...settings, allowSignups: v})} 
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Require Email Verification</div>
              <p className="text-sm text-slate-500">Users must verify their email before logging in</p>
            </div>
            <Switch 
              checked={settings.requireEmailVerification} 
              onChange={v => setSettings({...settings, requireEmailVerification: v})} 
            />
          </div>
          <div className="space-y-2 max-w-xs">
            <label className="block text-sm font-medium" htmlFor="defaultPlan">Default Plan for New Signups</label>
            <Select
              id="defaultPlan"
              className="w-full"
              value={settings.defaultPlan}
              onChange={v => setSettings({...settings, defaultPlan: v})}
              options={[
                { value: "Free", label: "Free Plan" },
                { value: "Trial", label: "14-Day Pro Trial" },
              ]}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard 
        title="Storage & Limits" 
        description="Configure file limits and storage quotas"
        actions={<Button onClick={() => handleSave('Storage')}>Save Changes</Button>}
      >
        <div className="space-y-2 max-w-xs">
          <label className="block text-sm font-medium" htmlFor="maxUploadSize">Max File Upload Size (MB)</label>
          <Input 
            id="maxUploadSize" 
            type="number" 
            value={settings.maxUploadSize} 
            onChange={e => setSettings({...settings, maxUploadSize: e.target.value})} 
          />
        </div>
      </SectionCard>

      <SectionCard 
        title="Advanced" 
        description="System-level controls and dangerous actions"
        className="border-amber-200 dark:border-amber-900/50"
        actions={<Button onClick={() => handleSave('Advanced')}>Apply</Button>}
      >
        <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-900/30">
          <div className="space-y-0.5">
            <div className="text-sm font-medium text-amber-900 dark:text-amber-500">Maintenance Mode</div>
            <p className="text-sm text-amber-700 dark:text-amber-400/80">Disables access for all non-super admins and shows a maintenance screen.</p>
          </div>
          <Switch 
            checked={settings.maintenanceMode} 
            onChange={v => setSettings({...settings, maintenanceMode: v})} 
            className="data-[state=checked]:bg-amber-600"
          />
        </div>
      </SectionCard>
    </div>
  );
}
