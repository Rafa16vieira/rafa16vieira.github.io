import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, CheckCircle } from "lucide-react";
import { format, differenceInDays } from "date-fns";

const motivationColors = {
  community: "bg-blue-100 text-blue-800",
  education: "bg-purple-100 text-purple-800",
  health: "bg-rose-100 text-rose-800",
  environment: "bg-green-100 text-green-800",
  economy: "bg-orange-100 text-orange-800",
  culture: "bg-pink-100 text-pink-800",
  other: "bg-slate-100 text-slate-700"
};

function getPendingAge(insertionDate) {
  const days = differenceInDays(new Date(), new Date(insertionDate));
  if (days <= 5)  return { label: `${days}d`, color: "bg-yellow-100 text-yellow-800 border-yellow-300" };
  if (days <= 10) return { label: `${days}d`, color: "bg-orange-100 text-orange-800 border-orange-300" };
  if (days <= 15) return { label: `${days}d`, color: "bg-red-100 text-red-700 border-red-300" };
  return { label: `${days}d`, color: "bg-red-900 text-white border-red-900" };
}

export default function DataTable({ records, onEdit, onDelete, onStatusChange, isAdmin }) {
  if (!records?.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <p className="text-slate-500">No records found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="font-semibold text-slate-700">City</TableHead>
            <TableHead className="font-semibold text-slate-700">Leader</TableHead>
            <TableHead className="font-semibold text-slate-700">Coordinator</TableHead>
            <TableHead className="font-semibold text-slate-700">Motivation</TableHead>
            <TableHead className="font-semibold text-slate-700">Inserted</TableHead>
            <TableHead className="font-semibold text-slate-700">Status</TableHead>
            <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => {
            const isPending = record.status === "pending";
            const pendingAge = isPending && record.insertion_date ? getPendingAge(record.insertion_date) : null;

            return (
              <TableRow key={record.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-medium text-slate-900">{record.city}</TableCell>
                <TableCell className="text-slate-700">{record.leader}</TableCell>
                <TableCell className="text-slate-700">{record.coordinator}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={motivationColors[record.motivation]}>
                    {record.motivation}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-600">
                  {record.insertion_date && format(new Date(record.insertion_date), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        isPending
                          ? pendingAge?.color
                          : "bg-green-100 text-green-800 border-green-300"
                      }
                    >
                      {isPending ? "Pending" : "Solved"}
                    </Badge>
                    {isPending && pendingAge && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${pendingAge.color}`}>
                        {pendingAge.label}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(record)}>
                        <Pencil className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      {isPending && (
                        <DropdownMenuItem onClick={() => onStatusChange(record.id, "solved")}>
                          <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" /> Mark as Solved
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => onDelete(record.id)}
                        className="text-rose-600 focus:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 px-4 py-3 border-t bg-slate-50 text-xs text-slate-500">
        <span className="font-medium">Pending age:</span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-yellow-400"></span> 1–5 days
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-orange-400"></span> 6–10 days
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span> 11–15 days
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-red-900"></span> 15+ days
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span> Solved
        </span>
      </div>
    </div>
  );
}