import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  onAuthSuccess?: () => void;
};

const AdminLogin = ({ onAuthSuccess }: Props) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === adminPass) {
      sessionStorage.setItem("isAdminAuthed", "true");
      onAuthSuccess && onAuthSuccess();
    } else {
      setError("Invalid password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-secondary/5">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Restricted area — enter the admin password to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
              />
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <div className="flex justify-end">
              <Button type="submit">Sign in</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
