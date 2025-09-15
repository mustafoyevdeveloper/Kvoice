import { useState } from "react";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Film, 
  Users, 
  BarChart3, 
  Settings,
  Eye,
  Calendar,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMovies } from "@/store/movies";

export const AdminPanel = () => {
  const { toast } = useToast();
  const { movies, addMovie, updateMovie, deleteMovie } = useMovies();
  const [selectedTab, setSelectedTab] = useState("movies");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [users] = useState([
    { id: "1", name: "Admin User", email: "admin@asilmedia.org", role: "admin", lastLogin: "2025-01-14" },
    { id: "2", name: "Editor User", email: "editor@asilmedia.org", role: "editor", lastLogin: "2025-01-13" },
  ]);

  const stats = {
    totalMovies: movies.length,
    totalViews: movies.reduce((sum, movie) => sum + movie.views, 0),
    totalUsers: users.length,
    todayViews: 1247,
  };

  const handleAddMovie = () => {
    // Determine category based on selected filter
    let category = "movies";
    let isPremiere = false;
    let isNew = false;

    if (selectedCategory === "premieres") {
      category = "premieres";
      isPremiere = true;
    } else if (selectedCategory === "series") {
      category = "series";
    } else if (selectedCategory === "trailers") {
      category = "trailers";
    } else if (selectedCategory === "new") {
      category = "movies";
      isNew = true;
    }

    addMovie({
      title: "Yangi kino",
      poster: "",
      rating: 8,
      year: new Date().getFullYear(),
      quality: ["480p", "720p", "1080p"],
      category: category,
      views: 0,
      isPremiere: isPremiere,
      isNew: isNew,
    });
    toast({ title: "Kino qo'shildi", description: `${getCategoryTitle(selectedCategory)} bo'limiga yangi ${getCategoryItemName(selectedCategory)} qo'shildi.` });
  };

  const handleDeleteMovie = (id: string) => {
    deleteMovie(id);
    toast({ title: "Kino o'chirildi", description: "Kino muvaffaqiyatli o'chirildi." });
  };

  // Filter movies by selected category
  const filteredMovies = movies.filter(movie => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "premieres") return movie.category === "premieres" || movie.isPremiere;
    if (selectedCategory === "movies") return movie.category === "movies";
    if (selectedCategory === "series") return movie.category === "series";
    if (selectedCategory === "trailers") return movie.category === "trailers";
    if (selectedCategory === "new") return movie.isNew;
    return true;
  });

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "all": return "Barchasi";
      case "premieres": return "Premyeralar";
      case "movies": return "Kinolar";
      case "series": return "Seriallar";
      case "trailers": return "Treylerlar";
      case "new": return "Yangi";
      default: return "Barchasi";
    }
  };

  const getCategoryItemName = (category: string) => {
    switch (category) {
      case "all": return "Kino";
      case "premieres": return "Premyera";
      case "movies": return "Kino";
      case "series": return "Serial";
      case "trailers": return "Treyler";
      case "new": return "Kino";
      default: return "Kino";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami Kinolar</CardTitle>
            <Film className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMovies}</div>
            <p className="text-xs text-muted-foreground">
              +2 oxirgi haftada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami Ko'rishlar</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.todayViews} bugun
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Foydalanuvchilar</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +1 yangi foydalanuvchi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">O'rtacha Reyting</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.2</div>
            <p className="text-xs text-muted-foreground">
              +0.3 oxirgi oyda
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Admin Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="movies" className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
            <Film className="h-4 w-4" />
            <span className="hidden md:inline">Kinolar</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden md:inline">Foydalanuvchilar</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden md:inline">Tahlil</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden md:inline">Sozlamalar</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="movies" className="space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h3 className="text-lg font-semibold">Kinolar Boshqaruvi</h3>
            <Button onClick={handleAddMovie} className="bg-primary hover:bg-primary-glow w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Yangi Kino Qo'shish
            </Button>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {["all", "premieres", "movies", "series", "trailers", "new"].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="animate-slide-in-left"
              >
                {getCategoryTitle(category)}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category === "all" ? movies.length : 
                   category === "premieres" ? movies.filter(m => m.category === "premieres" || m.isPremiere).length :
                   category === "movies" ? movies.filter(m => m.category === "movies").length :
                   category === "series" ? movies.filter(m => m.category === "series").length :
                   category === "trailers" ? movies.filter(m => m.category === "trailers").length :
                   category === "new" ? movies.filter(m => m.isNew).length : 0}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Add Movie Form */}
          <Card>
            <CardHeader>
              <CardTitle>{getCategoryTitle(selectedCategory)} bo'limiga yangi {getCategoryItemName(selectedCategory)} qo'shish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Kino Nomi</Label>
                  <Input id="title" placeholder="Kino nomini kiriting" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Yil</Label>
                  <Input id="year" type="number" placeholder="2025" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Reyting</Label>
                  <Input id="rating" type="number" step="0.1" placeholder="8.5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Kategoriya</Label>
                  <Select defaultValue={selectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Kategoriyani tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="premieres">Premyeralar</SelectItem>
                      <SelectItem value="movies">Kinolar</SelectItem>
                      <SelectItem value="series">Seriallar</SelectItem>
                      <SelectItem value="trailers">Treylerlar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Tavsif</Label>
                <Textarea id="description" placeholder="Kino haqida qisqacha ma'lumot" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="poster">Poster URL</Label>
                <Input id="poster" placeholder="https://example.com/poster.jpg" />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleAddMovie}>
                  {getCategoryTitle(selectedCategory)} bo'limiga qo'shish
                </Button>
                <Button variant="outline" onClick={() => setSelectedCategory("all")}>
                  Barcha Kategoriyalarni Ko'rish
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Movies List */}
          <Card>
            <CardHeader>
              <CardTitle>{getCategoryTitle(selectedCategory)} - Mavjud Kinolar ({filteredMovies.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 md:space-y-4">
                {filteredMovies.map((movie) => (
                  <div key={movie.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 border rounded-lg gap-3">
                    <div className="space-y-1 flex-1">
                      <h4 className="font-semibold text-sm md:text-base">{movie.title}</h4>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs md:text-sm text-muted-foreground">
                        <span>{movie.year}</span>
                        <Badge variant="secondary" className="text-xs">{movie.category}</Badge>
                        <span>⭐ {movie.rating}</span>
                        <span>👁 {movie.views}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 self-end sm:self-auto">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDeleteMovie(movie.id)}
                      >
                        <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h3 className="text-lg font-semibold">Foydalanuvchilar</h3>
            <Button className="bg-primary hover:bg-primary-glow w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Yangi Foydalanuvchi
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="space-y-3 md:space-y-4 p-4 md:p-6">
                {users.map((user) => (
                  <div key={user.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 border rounded-lg gap-3">
                    <div className="space-y-1 flex-1">
                      <h4 className="font-semibold text-sm md:text-base">{user.name}</h4>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs md:text-sm text-muted-foreground">
                        <span className="break-all">{user.email}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-xs">
                            {user.role}
                          </Badge>
                          <span className="hidden sm:inline">Oxirgi kirish: {user.lastLogin}</span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground sm:hidden">Oxirgi kirish: {user.lastLogin}</span>
                    </div>
                    <div className="flex space-x-2 self-end sm:self-auto">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" className="h-8 w-8 p-0">
                        <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 md:space-y-6">
          <h3 className="text-lg font-semibold">Analitika va Hisobotlar</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ko'rishlar Statistikasi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Grafik ko'rsatkich yuklanmoqda...</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mashhur Kinolar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {movies.sort((a, b) => b.views - a.views).slice(0, 3).map((movie, index) => (
                  <div key={movie.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="font-medium">{movie.title}</span>
                    </div>
                    <span className="text-muted-foreground">{movie.views} ko'rishlar</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 md:space-y-6">
          <h3 className="text-lg font-semibold">Sayt Sozlamalari</h3>
          
          <Card>
            <CardHeader>
              <CardTitle>Asosiy Sozlamalar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Sayt Nomi</Label>
                <Input id="siteName" defaultValue="MovieMedia" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Sayt Tavsifi</Label>
                <Textarea id="siteDescription" defaultValue="Eng yangi kinolar va seriallar" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Aloqa Email</Label>
                <Input id="contactEmail" defaultValue="contact@moviemedia.org" />
              </div>
              <Button className="w-full">
                Sozlamalarni Saqlash
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};