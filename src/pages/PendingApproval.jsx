import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, LogOut } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function PendingApproval() {
  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center bg-white border-0 shadow-lg">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-8 h-8 text-amber-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Account Pending Approval
        </h1>
        
        <p className="text-slate-500 mb-6 leading-relaxed">
          Your account is currently awaiting approval from an administrator. 
          You'll be notified once your account has been approved.
        </p>

        <div className="p-4 bg-slate-50 rounded-lg mb-6">
          <p className="text-sm text-slate-600">
            This usually takes 24-48 hours. If you have any questions, 
            please contact your administrator.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </Card>
    </div>
  );
}