import { Search } from "lucide-react";
import { Input, Select } from "antd";
import { cn } from "@/lib/utils";

export default function SearchFilterBar({ searchValue, onSearch, filters = [], onFilter, className }) {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-4 mb-6", className)}>
      <div className="relative flex-1">
        <Input 
          value={searchValue}
          onChange={(e) => onSearch?.(e.target.value)}
          placeholder="Search..." 
          prefix={<Search size={16} />}
        />
      </div>
      
      {filters.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {filters.map((filter, i) => (
            <Select 
              key={i} 
              value={filter.value} 
              onChange={(val) => onFilter?.(filter.name, val)} 
              style={{width: 160}}
              placeholder={filter.label}
            >
              <Select.Option value="all">All {filter.label}</Select.Option>
              {filter.options.map(opt => (
                <Select.Option key={opt.value || opt} value={opt.value || opt}>
                  {opt.label || opt}
                </Select.Option>
              ))}
            </Select>
          ))}
        </div>
      )}
    </div>
  );
}
