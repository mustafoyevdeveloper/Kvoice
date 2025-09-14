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

export const AdminPanel = () => {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("movies");

  // Sample data (would come from backend)
  const [movies, setMovies] = useState([
    { id: "1", title: "Yura davri dunyosi", rating: 8.5, year: 2025, category: "premieres", views: 194 },
    { id: "2", title: "Osiris: Yirtqich missiyasi", rating: 7.8, year: 2025, category: "premieres", views: 85 },
    { id: "3", title: "Esh yovuz o'liklarga qarshi", rating: 8.2, year: 2015, category: "series", views: 19 },
  ]);

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
    toast({
      title: "Kino qo'shildi",
      description: "Yangi kino muvaffaqiyatli qo'shildi.",
    });
  };

  const handleDeleteMovie = (id: string) => {
    setMovies(movies.filter(movie => movie.id !== id));
    toast({
      title: "Kino o'chirildi",
      description: "Kino muvaffaqiyatli o'chirildi.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <TabsTrigger value="movies">Kinolar</TabsTrigger>
          <TabsTrigger value="users">Foydalanuvchilar</TabsTrigger>
          <TabsTrigger value="analytics">Tahlil</TabsTrigger>
          <TabsTrigger value="settings">Sozlamalar</TabsTrigger>
        </TabsList>

        <TabsContent value="movies" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Kinolar Boshqaruvi</h3>
            <Button onClick={handleAddMovie} className="bg-primary hover:bg-primary-glow">
              <Plus className="h-4 w-4 mr-2" />
              Yangi Kino Qo'shish
            </Button>
          </div>

          {/* Add Movie Form */}
          <Card>
            <CardHeader>
              <CardTitle>Yangi Kino Qo'shish</CardTitle>
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
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Kategoriyani tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="premieres">Premyeralar</SelectItem>
                      <SelectItem value="movies">Kinolar</SelectItem>
                      <SelectItem value="series">Seriallar</SelectItem>
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
              <Button className="w-full" onClick={handleAddMovie}>
                Kinoni Saqlash
              </Button>
            </CardContent>
          </Card>

          {/* Movies List */}
          <Card>
            <CardHeader>
              <CardTitle>Mavjud Kinolar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {movies.map((movie) => (
                  <div key={movie.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-semibold">{movie.title}</h4>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{movie.year}</span>
                        <Badge variant="secondary">{movie.category}</Badge>
                        <span>⭐ {movie.rating}</span>
                        <span>👁 {movie.views}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteMovie(movie.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Foydalanuvchilar</h3>
            <Button className="bg-primary hover:bg-primary-glow">
              <Plus className="h-4 w-4 mr-2" />
              Yangi Foydalanuvchi
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="space-y-4 p-6">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-semibold">{user.name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{user.email}</span>
                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                          {user.role}
                        </Badge>
                        <span>Oxirgi kirish: {user.lastLogin}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <h3 className="text-lg font-semibold">Analitika va Hisobotlar</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <TabsContent value="settings" className="space-y-6">
          <h3 className="text-lg font-semibold">Sayt Sozlamalari</h3>
          
          <Card>
            <CardHeader>
              <CardTitle>Asosiy Sozlamalar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Sayt Nomi</Label>
                <Input id="siteName" defaultValue="AsilMedia" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Sayt Tavsifi</Label>
                <Textarea id="siteDescription" defaultValue="Eng yangi kinolar va seriallar" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Aloqa Email</Label>
                <Input id="contactEmail" defaultValue="contact@asilmedia.org" />
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