import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

export default function FilterBar({ filters, setFilters, onClear }) {
  return (
    <div className="flex flex-wrap gap-3 p-4 bg-white rounded-xl shadow-sm">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search by city, leader, coordinator..."
          value={filters.search || ""}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <Select
        value={filters.motivation || "all"}
        onValueChange={(value) => setFilters({ ...filters, motivation: value })}
      >
        <SelectTrigger className="w-[160px] border-slate-200">
          <SelectValue placeholder="Motivation" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Motivations</SelectItem>
          <SelectItem value="community">Community</SelectItem>
          <SelectItem value="education">Education</SelectItem>
          <SelectItem value="health">Health</SelectItem>
          <SelectItem value="environment">Environment</SelectItem>
          <SelectItem value="economy">Economy</SelectItem>
          <SelectItem value="culture">Culture</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.status || "all"}
        onValueChange={(value) => setFilters({ ...filters, status: value })}
      >
        <SelectTrigger className="w-[140px] border-slate-200">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="solved">Solved</SelectItem>
        </SelectContent>
      </Select>

      {filters.status === "pending" && (
        <Select
          value={filters.pendingAge || "all"}
          onValueChange={(value) => setFilters({ ...filters, pendingAge: value })}
        >
          <SelectTrigger className="w-[170px] border-slate-200">
            <SelectValue placeholder="Pending age" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All pending</SelectItem>
            <SelectItem value="fresh">Yellow (1–5 days)</SelectItem>
            <SelectItem value="warning">Orange (6–10 days)</SelectItem>
            <SelectItem value="critical">Red (11–15 days)</SelectItem>
            <SelectItem value="darkred">Dark red (15+ days)</SelectItem>
          </SelectContent>
        </Select>
      )}

      <Input
        type="date"
        value={filters.dateFrom || ""}
        onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
        className="w-[160px] border-slate-200"
      />

      <Input
        type="date"
        value={filters.dateTo || ""}
        onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
        className="w-[160px] border-slate-200"
      />

      <Button
        variant="ghost"
        onClick={onClear}
        className="text-slate-500 hover:text-slate-700"
      >
        <X className="w-4 h-4 mr-1" /> Clear
      </Button>
    </div>
  );
}