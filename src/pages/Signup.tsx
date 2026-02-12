import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type AppRole = "donor" | "receiver" | "volunteer";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<AppRole>("receiver");
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Strong password regex: at least 8 chars, letters, numbers, symbols
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      toast({
        title: "Weak Password",
        description:
          "Password must be at least 8 characters long and include letters, numbers, and symbols.",
        variant: "destructive",
      });
      return; // stop submission
    }

    setLoading(true);
    try {
      await signUp(email, password, name, role);
      toast({
        title: "Account created!",
        description: "You're now signed in.",
      });
      navigate("/");
    } catch (err: any) {
      toast({
        title: "Signup failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link
            to="/"
            className="mx-auto mb-2 flex items-center gap-2 text-xl font-bold text-primary"
          >
            <Heart className="h-6 w-6 fill-primary" /> LeftoverLove
          </Link>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>
            Join the community and start sharing food
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field with Show/Hide and Strong Validation */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
                  title="Password must contain at least 8 characters, including letters, numbers, and special symbols."
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-primary hover:text-primary/80"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Must contain at least 8 characters, including letters, numbers,
                and symbols (e.g., @, #, !, &)
              </p>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label>I want to join as</Label>
              <Select value={role} onValueChange={(v) => setRole(v as AppRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="donor">
                    🍽️ Donor — Share surplus food
                  </SelectItem>
                  <SelectItem value="receiver">
                    🙋 Receiver — Find free food
                  </SelectItem>
                  <SelectItem value="volunteer">
                    🚗 Volunteer — Help with deliveries
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
