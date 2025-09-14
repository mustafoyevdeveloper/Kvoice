import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminPanel } from "@/components/AdminPanel";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleCategorySelect = (category: string) => {
    navigate(category === "all" ? "/" : `/${category}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onSearch={handleSearch}
        onCategorySelect={handleCategorySelect}
        selectedCategory="admin"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Saytni to'liq boshqarish va nazorat qilish</p>
        </div>

        <AdminPanel />
      </main>

      <Footer />
    </div>
  );
};

export default Admin;