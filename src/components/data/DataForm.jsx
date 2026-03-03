import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X } from "lucide-react";

export default function DataForm({ record, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    city: "",
    leader: "",
    coordinator: "",
    insertion_date: new Date().toISOString().split("T")[0],
    motivation: "community",
    notes: "",
    status: "pending"
  });

  useEffect(() => {
    if (record) {
      setFormData({
        city: record.city || "",
        leader: record.leader || "",
        coordinator: record.coordinator || "",
        insertion_date: record.insertion_date || new Date().toISOString().split("T")[0],
        motivation: record.motivation || "community",
        notes: record.notes || "",
        status: record.status || "pending"
      });
    }
  }, [record]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="bg-white border-0 shadow-sm">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-800">
            {record ? "Edit Record" : "Add New Record"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-slate-700">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Enter city name"
                required
                className="border-slate-200 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motivation" className="text-slate-700">Motivation *</Label>
              <Select
                value={formData.motivation}
                onValueChange={(value) => setFormData({ ...formData, motivation: value })}
              >
                <SelectTrigger className="border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="community">Community</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="culture">Culture</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="leader" className="text-slate-700">Leader *</Label>
              <Input
                id="leader"
                value={formData.leader}
                onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                placeholder="Leader's name"
                required
                className="border-slate-200 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coordinator" className="text-slate-700">Coordinator *</Label>
              <Input
                id="coordinator"
                value={formData.coordinator}
                onChange={(e) => setFormData({ ...formData, coordinator: e.target.value })}
                placeholder="Coordinator's name"
                required
                className="border-slate-200 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="insertion_date" className="text-slate-700">Date of Insertion *</Label>
              <Input
                id="insertion_date"
                type="date"
                value={formData.insertion_date}
                onChange={(e) => setFormData({ ...formData, insertion_date: e.target.value })}
                required
                className="border-slate-200 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-slate-700">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="solved">Solved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-slate-700">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes..."
              rows={3}
              className="border-slate-200 focus:border-blue-500 resize-none"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 pt-4 border-t">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" /> Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : record ? "Update" : "Create"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}