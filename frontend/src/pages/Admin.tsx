import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminPanel } from "@/components/AdminPanel";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Eye, EyeOff, LogOut } from "lucide-react";

const ADMIN_PASSWORD = "12345678!@WEB";
const ADMIN_SESSION_KEY = "admin_authorized";

const Admin = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(() => {
    // Check if user is already authorized (session exists)
    return localStorage.getItem(ADMIN_SESSION_KEY) === "true";
  });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCategorySelect = (category: string) => {
    navigate(category === "all" ? "/" : `/${category}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        setIsAuthorized(true);
        // Save session to localStorage
        localStorage.setItem(ADMIN_SESSION_KEY, "true");
      } else {
        setError("Noto'g'ri parol! Qaytadan urinib ko'ring.");
        setPassword("");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setPassword("");
  };

  // Check authorization on mount
  useEffect(() => {
    const isAuth = localStorage.getItem(ADMIN_SESSION_KEY) === "true";
    setIsAuthorized(isAuth);
  }, []);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header
          onSearch={handleSearch}
          onCategorySelect={handleCategorySelect}
          selectedCategory="admin"
        />
        
        <div className="flex items-center justify-center flex-1 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Admin Panel</CardTitle>
              <p className="text-muted-foreground">Tizimga kirish uchun parolni kiriting</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium">
                    Foydalanuvchi nomi
                  </label>
                  <Input
                    id="username"
                    type="text"
                    value="admin"
                    readOnly
                    className="bg-muted"
                    autoComplete="username"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Parol
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Parolni kiriting..."
                      className="pr-10"
                      autoComplete="current-password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Kirilmoqda...
                    </>
                  ) : (
                    "Kirish"
                  )}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => navigate("/")}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ← Bosh sahifaga qaytish
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        onSearch={handleSearch}
        onCategorySelect={handleCategorySelect}
        selectedCategory="admin"
      />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Chiqish
          </Button>
        </div>
        <AdminPanel />
      </main>

      <Footer />
    </div>
  );
};

export default Admin;