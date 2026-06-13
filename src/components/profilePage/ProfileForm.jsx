import { ChevronDown } from "lucide-react";

const GENDER_OPTIONS = [
  { value: "", label: "Select gender" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

function InputField({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</label>
      {children}
      {error && <p className="text-[11px] text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={
        "w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 " +
        "bg-white dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 " +
        "placeholder:text-slate-400 dark:placeholder:text-slate-500 " +
        "focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 " +
        "transition-colors " +
        className
      }
      {...props}
    />
  );
}

export default function ProfileForm({ form, errors, onChange }) {
  return (
    <div className="space-y-3">
      <InputField label="Name" error={errors.fullName}>
        <Input
          name="fullName"
          value={form.fullName}
          onChange={onChange}
          placeholder="Nguyen Van A"
          className={errors.fullName ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}
        />
      </InputField>

      <InputField label="Username" error={errors.username}>
        <Input
          name="username"
          value={form.username}
          onChange={onChange}
          placeholder="nguyenvana"
          className={errors.username ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}
        />
      </InputField>

      <InputField label="Bio">
        <textarea
          name="bio"
          value={form.bio}
          onChange={onChange}
          placeholder="Tell people about yourself"
          rows={3}
          className={
            "w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 " +
            "bg-white dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 " +
            "placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none " +
            "focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 transition-colors"
          }
        />
      </InputField>

      <InputField label="Skills (comma separated)">
        <Input
          name="skills"
          value={form.skills}
          onChange={onChange}
          placeholder="React, Node.js, Design"
        />
      </InputField>

      <InputField label="Email">
        <div className="relative">
          <Input
            name="email"
            value={form.email}
            readOnly
            className="cursor-not-allowed bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 pr-20"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
            readonly
          </span>
        </div>
      </InputField>

      <InputField label="Phone" error={errors.phone}>
        <Input
          name="phone"
          value={form.phone}
          onChange={onChange}
          placeholder="+84 900 000 000"
          className={errors.phone ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}
        />
      </InputField>

      <InputField label="Date of birth">
        <Input type="date" name="dob" value={form.dob} onChange={onChange} />
      </InputField>

      <InputField label="Gender">
        <div className="relative">
          <select
            name="gender"
            value={form.gender}
            onChange={onChange}
            className={
              "w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 " +
              "bg-white dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 " +
              "focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 " +
              "transition-colors appearance-none cursor-pointer"
            }
          >
            {GENDER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        </div>
      </InputField>

      <InputField label="Avatar URL" error={errors.avatar}>
        <Input
          name="avatar"
          value={form.avatar}
          onChange={onChange}
          placeholder="https://example.com/avatar.png"
          className={errors.avatar ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}
        />
      </InputField>
    </div>
  );
}
