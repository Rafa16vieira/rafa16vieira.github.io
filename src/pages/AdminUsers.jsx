import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import UserApprovalCard from "@/components/users/UserApprovalCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { createPageUrl } from "@/utils";

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    base44.auth.me().then(setCurrentUser);
  }, []);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => base44.entities.User.list("-created_date")
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.User.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
    }
  });

  const handleApprove = (userId) => {
    updateUserMutation.mutate({
      id: userId,
      data: {
        role: "user",
        approved_date: new Date().toISOString(),
        approved_by: currentUser?.email
      }
    });
  };

  const handleReject = (userId) => {
    if (confirm("Are you sure you want to reject this user?")) {
      updateUserMutation.mutate({
        id: userId,
        data: { role: "rejected" }
      });
    }
  };

  if (currentUser && currentUser.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 text-center max-w-md">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-500">
            You don't have permission to access this page. Only administrators can manage users.
          </p>
        </Card>
      </div>
    );
  }

  const pendingUsers = users.filter((u) => u.role === "pending");
  const approvedUsers = users.filter((u) => u.role === "user" || u.role === "admin");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="text-slate-500 mt-1">Approve or reject user registrations</p>
      </div>

      {pendingUsers.length > 0 && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <p className="text-amber-800">
            <span className="font-semibold">{pendingUsers.length}</span> user{pendingUsers.length !== 1 ? "s" : ""} awaiting approval
          </p>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100">
          <TabsTrigger value="pending" className="data-[state=active]:bg-white">
            Pending ({pendingUsers.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="data-[state=active]:bg-white">
            Approved ({approvedUsers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {isLoading ? (
            <div className="grid gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : pendingUsers.length === 0 ? (
            <Card className="p-12 text-center bg-white border-0 shadow-sm">
              <p className="text-slate-500">No pending users</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingUsers.map((user) => (
                <UserApprovalCard
                  key={user.id}
                  user={user}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  isLoading={updateUserMutation.isPending}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          {isLoading ? (
            <div className="grid gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : approvedUsers.length === 0 ? (
            <Card className="p-12 text-center bg-white border-0 shadow-sm">
              <p className="text-slate-500">No approved users yet</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {approvedUsers.map((user) => (
                <UserApprovalCard
                  key={user.id}
                  user={user}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  isLoading={updateUserMutation.isPending}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}