import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { differenceInDays } from "date-fns";
import FilterBar from "@/components/data/FilterBar";
import DataTable from "@/components/data/DataTable";
import DataForm from "@/components/data/DataForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

function getPendingAgeCategory(insertionDate) {
  const days = differenceInDays(new Date(), new Date(insertionDate));
  if (days <= 5)  return "fresh";
  if (days <= 10) return "warning";
  if (days <= 15) return "critical";
  return "darkred";
}

export default function DataList() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    search: "",
    motivation: "all",
    status: "all",
    pendingAge: "all",
    dateFrom: "",
    dateTo: ""
  });
  const [editingRecord, setEditingRecord] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: records = [], isLoading } = useQuery({
    queryKey: ["records"],
    queryFn: () => base44.entities.DataRecord.list("-created_date")
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.DataRecord.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records"] });
      setEditingRecord(null);
      toast.success("Record updated");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.DataRecord.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records"] });
      toast.success("Record deleted");
    }
  });

  const filteredRecords = records.filter((record) => {
    const search = filters.search.toLowerCase();
    if (
      search &&
      !record.city?.toLowerCase().includes(search) &&
      !record.leader?.toLowerCase().includes(search) &&
      !record.coordinator?.toLowerCase().includes(search)
    ) return false;

    if (filters.motivation !== "all" && record.motivation !== filters.motivation) return false;
    if (filters.status !== "all" && record.status !== filters.status) return false;

    if (filters.status === "pending" && filters.pendingAge !== "all" && record.insertion_date) {
      const ageCategory = getPendingAgeCategory(record.insertion_date);
      if (ageCategory !== filters.pendingAge) return false;
    }

    if (filters.dateFrom && record.insertion_date < filters.dateFrom) return false;
    if (filters.dateTo && record.insertion_date > filters.dateTo) return false;

    return true;
  });

  const handleStatusChange = (id, status) => {
    updateMutation.mutate({ id, data: { status } });
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this record?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleUpdate = (data) => {
    updateMutation.mutate({ id: editingRecord.id, data });
  };

  const clearFilters = () => {
    setFilters({ search: "", motivation: "all", status: "all", pendingAge: "all", dateFrom: "", dateTo: "" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Data Records</h1>
        <p className="text-slate-500 mt-1">
          {filteredRecords.length} record{filteredRecords.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <FilterBar filters={filters} setFilters={setFilters} onClear={clearFilters} />

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : (
        <DataTable
          records={filteredRecords}
          onEdit={setEditingRecord}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          isAdmin={user?.role === "admin"}
        />
      )}

      <Dialog open={!!editingRecord} onOpenChange={() => setEditingRecord(null)}>
        <DialogContent className="max-w-2xl p-0 bg-transparent border-0">
          <DataForm
            record={editingRecord}
            onSubmit={handleUpdate}
            onCancel={() => setEditingRecord(null)}
            isLoading={updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}