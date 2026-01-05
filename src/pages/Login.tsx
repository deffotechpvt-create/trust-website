import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApi } from '@/lib/api'; // or wherever your useApi is located

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
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

        // Navigate to admin dashboard
        navigate("/admin");
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
          <CardTitle>Login</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@domain.com" />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <div className="flex justify-between items-center">
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>

              <Button variant="link" onClick={() => navigate('/signup')}>Create account</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
