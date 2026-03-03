import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, XCircle, Clock, Mail } from "lucide-react";
import { format } from "date-fns";

export default function UserApprovalCard({ user, onApprove, onReject, isLoading }) {
  const initials = user.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  const roleColors = {
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    user: "bg-blue-100 text-blue-800 border-blue-200",
    admin: "bg-purple-100 text-purple-800 border-purple-200"
  };

  return (
    <Card className="p-5 bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12 bg-slate-100">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 truncate">{user.full_name}</h3>
            <Badge variant="outline" className={roleColors[user.role]}>
              {user.role}
            </Badge>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-slate-500 mb-2">
            <Mail className="w-3.5 h-3.5" />
            <span className="truncate">{user.email}</span>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="w-3 h-3" />
            <span>Joined {format(new Date(user.created_date), "MMM d, yyyy")}</span>
          </div>
        </div>

        {user.role === "pending" && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onReject(user.id)}
              disabled={isLoading}
              className="border-rose-200 text-rose-600 hover:bg-rose-50"
            >
              <XCircle className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              onClick={() => onApprove(user.id)}
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <CheckCircle className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}