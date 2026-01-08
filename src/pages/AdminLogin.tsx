import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApi } from "@/lib/api";

type Props = {
  onAuthSuccess?: () => void;
};

const AdminLogin = ({ onAuthSuccess }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { post } = useApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await post('/auth/login', {
        email,
        password
      });

      const data = response.data;

      if (data.success && data.token) {
        // Save token and admin info
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_info", JSON.stringify(data.admin));
        
        // Set session
        sessionStorage.setItem("isAdminAuthed", "true");
        
        // Call success callback
        onAuthSuccess && onAuthSuccess();
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Invalid email or password";
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-secondary/5">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Restricted area — enter your credentials to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                {error}
              </div>
            )}
            <div className="flex justify-end">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;