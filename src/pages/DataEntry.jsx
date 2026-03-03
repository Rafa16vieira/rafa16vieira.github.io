import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DataForm from "@/components/data/DataForm";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

export default function DataEntry() {
  const queryClient = useQueryClient();
  const [showSuccess, setShowSuccess] = useState(false);

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.DataRecord.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records"] });
      toast.success("Record created successfully");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  });

  const handleSubmit = (data) => {
    createMutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Add New Record</h1>
        <p className="text-slate-500 mt-1">Enter the details for your new data record</p>
      </div>

      {showSuccess && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <p className="text-emerald-800 font-medium">Record created successfully!</p>
        </div>
      )}

      <DataForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}