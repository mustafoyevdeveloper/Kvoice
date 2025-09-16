import React, { useState, useRef } from "react";
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
  Star,
  X,
  Save,
  Search,
  Filter,
  MoreVertical,
  Play,
  Download,
  Share2,
  Upload,
  Link,
  Clock,
  Globe,
  FileVideo,
  Image,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useMovies } from "@/store/movies";
import { Movie } from "./MovieCard";

interface MovieFormData {
  title: string;
    description: string;
  year: number;
    language: string;
    rating: number;
    videoFile: File | null;
    videoUrl: string;
    posterFile: File | null;
    posterUrl: string;
  quality: string[];
    duration: string;
    genres: string[];
    similarContentIds: string[];
  category: string;
  isNew?: boolean;
  isPremiere?: boolean;
  }

interface ContentCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
}

export const AdminPanel = () => {
  const { toast } = useToast();
  const { movies, addMovie, updateMovie, deleteMovie } = useMovies();
  const [selectedTab, setSelectedTab] = useState("movies");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [autoSwitch, setAutoSwitch] = useState(false);
  
  // Site settings state
  const [siteSettings, setSiteSettings] = useState(() => {
    const saved = localStorage.getItem('moviemedia_site_settings');
    return saved ? JSON.parse(saved) : {
      siteName: "MovieMedia",
      siteDescription: "Eng yangi kinolar va seriallar",
      siteIcon: "",
      contactEmail: "contact@moviemedia.org",
      contactPhone: "+998 90 123 45 67",
      socialMedia: {
        facebook: "https://facebook.com/moviemedia",
        instagram: "https://instagram.com/moviemedia",
        telegram: "https://t.me/moviemedia",
        youtube: "https://youtube.com/moviemedia"
      },
      sectionNames: {
        premieres: "Premyeralar",
        movies: "Kinolar",
        series: "Seriallar",
        trailers: "Treylerlar",
        new: "Yangi"
      },
      sectionTitles: {
        premieres: "PREMYERALAR",
        movies: "KINOLAR", 
        series: "SERIALLAR",
        trailers: "TREYLERLAR",
        new: "YANGI KINOLAR"
      },
      sectionDescriptions: {
        premieres: "Issiq'ida tomosha qilib oling! Hammasi bizda!",
        movies: "Eng yaxshi kinolar to'plami",
        series: "Mashhur seriallar va multfilmlar",
        trailers: "Eng so'nggi treylerlar",
        new: "Yangi qo'shilgan kinolar"
      },
      heroTitle: "Eng yaxshi kinolar va seriallar",
      heroSubtitle: "O'zbek tilida eng yangi va mashhur kinolar",
      aboutTitle: "Biz haqimizda",
      aboutDescription: "MovieMedia - kinolar va seriallar olamiga xush kelibsiz",
      privacyTitle: "Maxfiylik siyosati",
      privacyDescription: "Sizning shaxsiy ma'lumotlaringiz biz uchun muhim",
      termsTitle: "Foydalanish shartlari",
      termsDescription: "Saytdan foydalanish shartlari va qoidalari"
    };
  });
  
  const videoFileRef = useRef<HTMLInputElement>(null);
  const posterFileRef = useRef<HTMLInputElement>(null);
  const autoSwitchInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Auto switch chart type
  const startAutoSwitch = () => {
    if (autoSwitchInterval.current) {
      clearInterval(autoSwitchInterval.current);
    }
    
    autoSwitchInterval.current = setInterval(() => {
      setChartType(prev => prev === 'bar' ? 'line' : 'bar');
    }, 3000); // 3 soniyada bir o'zgaradi
  };
  
  const stopAutoSwitch = () => {
    if (autoSwitchInterval.current) {
      clearInterval(autoSwitchInterval.current);
      autoSwitchInterval.current = null;
    }
  };
  
  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (autoSwitchInterval.current) {
        clearInterval(autoSwitchInterval.current);
      }
    };
  }, []);
  
  const [formData, setFormData] = useState<MovieFormData>({
    title: "",
    description: "",
    year: new Date().getFullYear(),
    language: "uzbek",
    rating: 8.0,
    videoFile: null,
    videoUrl: "",
    posterFile: null,
    posterUrl: "",
    quality: ["480p", "720p", "1080p"],
    duration: "",
    genres: [],
    similarContentIds: [],
    category: "movies",
    isNew: false,
    isPremiere: false
  });

  // Content categories
  const contentCategories: ContentCategory[] = [
    { id: "movies", name: "Kinolar", icon: Film, color: "bg-blue-500" },
    { id: "series", name: "Seriallar", icon: Play, color: "bg-green-500" },
    { id: "trailers", name: "Treylerlar", icon: Globe, color: "bg-purple-500" }
  ];

  // Available languages
  const languages = [
    { value: "uzbek", label: "O'zbek" },
    { value: "russian", label: "Rus" },
    { value: "english", label: "Ingliz" },
    { value: "german", label: "Nemis" },
    { value: "spanish", label: "Ispan" },
    { value: "italian", label: "Italian" },
    { value: "japanese", label: "Yapon" },
    { value: "chinese", label: "Xitoy" },
    { value: "turkish", label: "Turk" },
    { value: "korean", label: "Koreys" }
  ];

  // Available genres
  const availableGenres = [
    "Drama", "Komediya", "Fantastika", "Triller", "Jangari", 
    "Romantik", "Detektiv", "Tarixiy", "Oilaviy", "Dokumental",
    "Qo'rqinchli", "Sarguzasht", "Sport", "Musiqiy", "G'ayritabiiy"
  ];

  // Available qualities
  const availableQualities = ["360p", "480p", "720p", "1080p", "1440p", "4K"];

  const [users, setUsers] = useState(() => {
    // Load users from localStorage or use default
    const savedUsers = localStorage.getItem('moviemedia_users');
    if (savedUsers) {
      return JSON.parse(savedUsers);
    }
    return [
      { 
        id: "1", 
        name: "Admin User", 
        email: "admin@movimedia.uz", 
        role: "admin", 
        lastLogin: "2025-01-14",
        loginCount: 1,
        firstLogin: "2025-01-14",
        isOnline: false
      },
      { 
        id: "2", 
        name: "Editor User", 
        email: "editor@movimedia.uz", 
        role: "editor", 
        lastLogin: "2025-01-13",
        loginCount: 1,
        firstLogin: "2025-01-13",
        isOnline: false
      },
    ];
  });

  // Track current user
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('moviemedia_current_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // User login tracking functions
  const trackUserLogin = (userData: { name: string; email: string; role?: string }) => {
    const now = new Date().toISOString().split('T')[0];
    const existingUser = users.find(user => user.email === userData.email);
    
    if (existingUser) {
      // Update existing user
      const updatedUser = {
        ...existingUser,
        lastLogin: now,
        loginCount: existingUser.loginCount + 1,
        isOnline: true
      };
      
      const updatedUsers = users.map(user => 
        user.id === existingUser.id ? updatedUser : user
      );
      
      setUsers(updatedUsers);
      setCurrentUser(updatedUser);
      localStorage.setItem('moviemedia_users', JSON.stringify(updatedUsers));
      localStorage.setItem('moviemedia_current_user', JSON.stringify(updatedUser));
    } else {
      // Create new user
      const newUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'user',
        lastLogin: now,
        firstLogin: now,
        loginCount: 1,
        isOnline: true
      };
      
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      setCurrentUser(newUser);
      localStorage.setItem('moviemedia_users', JSON.stringify(updatedUsers));
      localStorage.setItem('moviemedia_current_user', JSON.stringify(newUser));
    }
  };

  const trackUserLogout = () => {
    if (currentUser) {
      const updatedUsers = users.map(user => 
        user.id === currentUser.id ? { ...user, isOnline: false } : user
      );
      setUsers(updatedUsers);
      setCurrentUser(null);
      localStorage.setItem('moviemedia_users', JSON.stringify(updatedUsers));
      localStorage.removeItem('moviemedia_current_user');
    }
  };

  const stats = {
    totalMovies: movies.length,
    totalViews: movies.reduce((sum, movie) => sum + movie.views, 0),
    totalUsers: users.length,
    todayViews: Math.floor(Math.random() * 2000) + 500, // Random today views (500-2499)
    onlineUsers: users.filter(user => user.isOnline).length,
    totalLogins: users.reduce((sum, user) => sum + user.loginCount, 0),
    newUsersToday: users.filter(user => {
      const today = new Date().toISOString().split('T')[0];
      return user.firstLogin === today;
    }).length,
    averageLoginsPerUser: users.length > 0 ? Math.round(users.reduce((sum, user) => sum + user.loginCount, 0) / users.length) : 0
  };

  // Utility functions
  const generateUniqueId = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let id = '';
    
    // Generate 2 letters
    for (let i = 0; i < 2; i++) {
      id += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    
    // Generate 4 numbers
    for (let i = 0; i < 4; i++) {
      id += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    
    return id;
  };

  // Generate random URL for content
  const generateContentUrl = (category: string) => {
    const baseUrl = "https://moviemedia-cinema.vercel.app";
    const randomId = Math.floor(Math.random() * 1000) + 10; // 10-1009 random ID
    
    switch (category) {
      case "movies":
        return `${baseUrl}/movie/${randomId}`;
      case "series":
        return `${baseUrl}/series/${randomId}`;
      case "trailers":
        return `${baseUrl}/trailer/${randomId}`;
      case "premieres":
        return `${baseUrl}/premiere/${randomId}`;
      default:
        return `${baseUrl}/movie/${randomId}`;
    }
  };

  const detectVideoDuration = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const duration = video.duration;
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor(duration % 60);
        
        if (hours > 0) {
          resolve(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        } else {
          resolve(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  const detectVideoQuality = (file: File): Promise<string[]> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const width = video.videoWidth;
        const height = video.videoHeight;
        
        let qualities: string[] = [];
        if (height >= 2160) qualities.push('4K');
        if (height >= 1440) qualities.push('1440p');
        if (height >= 1080) qualities.push('1080p');
        if (height >= 720) qualities.push('720p');
        if (height >= 480) qualities.push('480p');
        if (height >= 360) qualities.push('360p');
        
        resolve(qualities.length > 0 ? qualities : ['480p', '720p', '1080p']);
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  const simulateFileUpload = async (file: File): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadProgress(i);
    }
    
    setIsUploading(false);
    setUploadProgress(0);
    
    // Return a mock URL (in real app, this would be the actual uploaded file URL)
    return URL.createObjectURL(file);
  };

  // Reset form data
  const resetFormData = () => {
    setFormData({
      title: "",
      description: "",
      year: new Date().getFullYear(),
      language: "uzbek",
      rating: 8.0,
      videoFile: null,
      videoUrl: "",
      posterFile: null,
      posterUrl: "",
      quality: ["480p", "720p", "1080p"],
      duration: "",
      genres: [],
      similarContentIds: [],
      category: selectedCategory === "all" ? "movies" : selectedCategory,
      isNew: selectedCategory === "new",
      isPremiere: selectedCategory === "premieres"
    });
  };

  // Open add dialog
  const handleOpenAddDialog = () => {
    resetFormData();
    setIsAddDialogOpen(true);
  };

  // Open edit dialog
  const handleOpenEditDialog = (movie: Movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      description: "",
      year: movie.year,
      language: "uzbek",
      rating: movie.rating,
      videoFile: null,
      videoUrl: "",
      posterFile: null,
      posterUrl: movie.poster,
      quality: movie.quality,
      duration: "",
      genres: [],
      similarContentIds: [],
      category: movie.category,
      isNew: movie.isNew || false,
      isPremiere: movie.isPremiere || false
    });
    setIsEditDialogOpen(true);
  };

  // File upload handlers
  const handleVideoFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setFormData(prev => ({ ...prev, videoFile: file, videoUrl: "" }));
        
        try {
          const duration = await detectVideoDuration(file);
          const quality = await detectVideoQuality(file);
          setFormData(prev => ({ 
            ...prev, 
            duration, 
            quality: quality.length > 0 ? quality : prev.quality 
          }));
          
          toast({
            title: "Video fayl yuklandi",
            description: `Davomiyligi: ${duration}, Sifat: ${quality.join(', ')}`
          });
        } catch (error) {
          toast({
            title: "Xatolik",
            description: "Video fayl ma'lumotlarini o'qishda xatolik yuz berdi",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Noto'g'ri fayl formati",
          description: "Faqat video fayllar qabul qilinadi",
          variant: "destructive"
        });
      }
    }
  };

  const handlePosterFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setFormData(prev => ({ ...prev, posterFile: file, posterUrl: "" }));
        
        try {
          const url = await simulateFileUpload(file);
          setFormData(prev => ({ ...prev, posterUrl: url }));
          
          toast({
            title: "Poster yuklandi",
            description: "Rasm muvaffaqiyatli yuklandi"
          });
        } catch (error) {
          toast({
            title: "Xatolik",
            description: "Rasm yuklashda xatolik yuz berdi",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Noto'g'ri fayl formati",
          description: "Faqat rasm fayllar qabul qilinadi",
          variant: "destructive"
        });
      }
    }
  };

  const handleVideoUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, videoUrl: url, videoFile: null }));
  };

  const handlePosterUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, posterUrl: url, posterFile: null }));
  };

  // Handle form submission
  const handleSubmit = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({ title: "Xatolik", description: "Kino nomi kiritilishi shart!", variant: "destructive" });
      return;
    }

    if (!formData.videoFile && !formData.videoUrl) {
      toast({ title: "Xatolik", description: "Video fayl yoki YouTube link kiritilishi shart!", variant: "destructive" });
      return;
    }

    if (!formData.posterFile && !formData.posterUrl) {
      toast({ title: "Xatolik", description: "Poster rasm yoki URL kiritilishi shart!", variant: "destructive" });
      return;
    }

    try {
      let finalVideoUrl = formData.videoUrl;
      let finalPosterUrl = formData.posterUrl;

      // Upload files if needed
      if (formData.videoFile) {
        finalVideoUrl = await simulateFileUpload(formData.videoFile);
      }
      if (formData.posterFile) {
        finalPosterUrl = await simulateFileUpload(formData.posterFile);
      }

      const generatedUrl = generateContentUrl(formData.category);
      console.log('Generated URL:', generatedUrl);
      
      const movieData = {
        id: editingMovie?.id || generateUniqueId(),
        title: formData.title,
        poster: finalPosterUrl,
        rating: formData.rating,
        year: formData.year,
        quality: formData.quality,
        category: formData.category,
        views: Math.floor(Math.random() * 1000) + 100, // Auto-generated views (100-1099)
        isNew: formData.isNew,
        isPremiere: formData.isPremiere,
        url: generatedUrl, // Auto-generated URL
        // Additional fields for future use
        description: formData.description,
        language: formData.language,
        duration: formData.duration || "2:30:45", // Auto-generated duration if not detected
        genres: formData.genres,
        similarContentIds: formData.similarContentIds,
        videoUrl: finalVideoUrl
      };
      
      console.log('Movie data with URL:', movieData);

    if (editingMovie) {
      // Update existing movie
        updateMovie(editingMovie.id, movieData);
      toast({ title: "Muvaffaqiyat", description: "Kino muvaffaqiyatli yangilandi!" });
      setIsEditDialogOpen(false);
      setEditingMovie(null);
    } else {
      // Add new movie
        addMovie(movieData);
      toast({ title: "Muvaffaqiyat", description: "Yangi kino muvaffaqiyatli qo'shildi!" });
      setIsAddDialogOpen(false);
    }
    
    resetFormData();
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Fayl yuklashda xatolik yuz berdi",
        variant: "destructive"
      });
    }
  }, [formData, editingMovie, addMovie, updateMovie, toast, generateUniqueId, simulateFileUpload]);

  // Handle delete movie
  const handleDeleteMovie = (id: string) => {
    deleteMovie(id);
    toast({ title: "Muvaffaqiyat", description: "Kino muvaffaqiyatli o'chirildi!" });
  };

  // Handle quality change
  const handleQualityChange = React.useCallback((quality: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        quality: [...prev.quality, quality]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        quality: prev.quality.filter(q => q !== quality)
      }));
    }
  }, []);

  // Handle genre change
  const handleGenreChange = React.useCallback((genre: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        genres: [...prev.genres, genre]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        genres: prev.genres.filter(g => g !== genre)
      }));
    }
  }, []);

  // Handle similar content ID change
  const handleSimilarContentChange = React.useCallback((value: string) => {
    const ids = value.split(',').map(id => id.trim()).filter(id => id.length > 0);
    setFormData(prev => ({
      ...prev,
      similarContentIds: ids
    }));
  }, []);

  // Filter movies by selected category and search
  const filteredMovies = movies.filter(movie => {
    // Category filter
    let categoryMatch = true;
    if (selectedCategory === "all") categoryMatch = true;
    else if (selectedCategory === "premieres") categoryMatch = movie.category === "premieres" || movie.isPremiere;
    else if (selectedCategory === "movies") categoryMatch = movie.category === "movies";
    else if (selectedCategory === "series") categoryMatch = movie.category === "series";
    else if (selectedCategory === "trailers") categoryMatch = movie.category === "trailers";
    else if (selectedCategory === "new") categoryMatch = movie.isNew;
    
    // Search filter
    const searchMatch = !searchQuery.trim() || 
      movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && searchMatch;
  });

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "all": return "Barchasi";
      case "premieres": return siteSettings.sectionNames.premieres;
      case "movies": return siteSettings.sectionNames.movies;
      case "series": return siteSettings.sectionNames.series;
      case "trailers": return siteSettings.sectionNames.trailers;
      case "new": return siteSettings.sectionNames.new;
      default: return "Barchasi";
    }
  };

  const getSectionTitle = (category: string) => {
    switch (category) {
      case "premieres": return siteSettings.sectionTitles.premieres;
      case "movies": return siteSettings.sectionTitles.movies;
      case "series": return siteSettings.sectionTitles.series;
      case "trailers": return siteSettings.sectionTitles.trailers;
      case "new": return siteSettings.sectionTitles.new;
      default: return "BO'LIM";
    }
  };

  const getSectionDescription = (category: string) => {
    switch (category) {
      case "premieres": return siteSettings.sectionDescriptions.premieres;
      case "movies": return siteSettings.sectionDescriptions.movies;
      case "series": return siteSettings.sectionDescriptions.series;
      case "trailers": return siteSettings.sectionDescriptions.trailers;
      case "new": return siteSettings.sectionDescriptions.new;
      default: return "Bo'lim tavsifi";
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

  // Enhanced Movie form component
  const MovieForm = React.useMemo(() => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Asosiy Ma'lumotlar</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Kino Nomi *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Kino nomini kiriting"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="year">Yil *</Label>
          <Input
            id="year"
            type="number"
            value={formData.year}
              onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) || 0 }))}
            placeholder="2025"
            min="1900"
            max="2030"
            required
          />
        </div>
          <div className="space-y-2">
            <Label htmlFor="language">Til *</Label>
            <Select
              value={formData.language}
              onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tilni tanlang" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        <div className="space-y-2">
          <Label htmlFor="rating">Reyting *</Label>
          <Input
            id="rating"
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={formData.rating}
              onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) || 0 }))}
            placeholder="8.5"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Kategoriya *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Kategoriyani tanlang" />
            </SelectTrigger>
            <SelectContent>
                {contentCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        </div>
      </div>

      {/* Description */}
        <div className="space-y-2">
        <Label htmlFor="description">Tavsif *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Kino haqida batafsil ma'lumot"
          rows={4}
            required
          />
        </div>

      {/* Video Upload Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Video Kontent</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label>Video Fayl Yuklash</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <FileVideo className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">MP4 formatida video fayl yuklang</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => videoFileRef.current?.click()}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Yuklanmoqda..." : "Fayl Tanlash"}
              </Button>
              <input
                ref={videoFileRef}
                type="file"
                accept="video/*"
                onChange={handleVideoFileChange}
                className="hidden"
              />
              {formData.videoFile && (
                <p className="text-xs text-green-600 mt-2">
                  ✓ {formData.videoFile.name}
                </p>
              )}
            </div>
            {isUploading && (
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
      </div>

          {/* YouTube URL */}
      <div className="space-y-2">
            <Label>YouTube Link</Label>
            <div className="flex space-x-2">
              <Input
                value={formData.videoUrl}
                onChange={(e) => handleVideoUrlChange(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                disabled={!!formData.videoFile}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={!!formData.videoFile}
              >
                <Link className="h-4 w-4" />
              </Button>
            </div>
            {formData.videoUrl && (
              <p className="text-xs text-green-600">
                ✓ YouTube link kiritildi
              </p>
            )}
          </div>
        </div>

        {/* Video Info Display */}
        {(formData.duration || formData.quality.length > 0) && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Video Ma'lumotlari</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {formData.duration && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Davomiyligi: {formData.duration}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span>Sifat: {formData.quality.join(', ')}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Poster Upload Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Poster Rasm</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label>Rasm Fayl Yuklash</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">JPG, PNG formatida rasm yuklang</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => posterFileRef.current?.click()}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Yuklanmoqda..." : "Rasm Tanlash"}
              </Button>
              <input
                ref={posterFileRef}
                type="file"
                accept="image/*"
                onChange={handlePosterFileChange}
                className="hidden"
              />
              {formData.posterFile && (
                <p className="text-xs text-green-600 mt-2">
                  ✓ {formData.posterFile.name}
                </p>
              )}
            </div>
          </div>

          {/* URL Input */}
          <div className="space-y-2">
            <Label>Rasm URL</Label>
            <div className="flex space-x-2">
              <Input
                value={formData.posterUrl}
                onChange={(e) => handlePosterUrlChange(e.target.value)}
                placeholder="https://example.com/poster.jpg"
                disabled={!!formData.posterFile}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={!!formData.posterFile}
              >
                <Link className="h-4 w-4" />
              </Button>
            </div>
            {formData.posterUrl && (
              <p className="text-xs text-green-600">
                ✓ Rasm URL kiritildi
              </p>
            )}
          </div>
        </div>

        {/* Poster Preview */}
        {formData.posterUrl && (
          <div className="mt-4">
            <Label>Poster Ko'rinishi</Label>
            <div className="mt-2 w-32 h-48 border rounded-lg overflow-hidden">
              <img
                src={formData.posterUrl}
                alt="Poster preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* Quality Selection */}
      <div className="space-y-2">
        <Label>Video Sifatlar *</Label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {availableQualities.map((quality) => (
            <div key={quality} className="flex items-center space-x-2">
              <Checkbox
                id={quality}
                checked={formData.quality.includes(quality)}
                onCheckedChange={(checked) => handleQualityChange(quality, checked as boolean)}
              />
              <Label htmlFor={quality} className="text-sm">{quality}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Genres Selection */}
      <div className="space-y-2">
        <Label>Janrlar</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {availableGenres.map((genre) => (
            <div key={genre} className="flex items-center space-x-2">
              <Checkbox
                id={genre}
                checked={formData.genres.includes(genre)}
                onCheckedChange={(checked) => handleGenreChange(genre, checked as boolean)}
              />
              <Label htmlFor={genre} className="text-sm">{genre}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Similar Content */}
      <div className="space-y-2">
        <Label htmlFor="similarContent">O'xshash Kontent ID lari</Label>
        <Input
          id="similarContent"
          value={formData.similarContentIds.join(', ')}
          onChange={(e) => handleSimilarContentChange(e.target.value)}
          placeholder="ID1, ID2, ID3 (vergul bilan ajrating)"
        />
        <p className="text-xs text-muted-foreground">
          O'xshash kinolar/seriallar ID larini vergul bilan ajrating
        </p>
      </div>

      {/* Status Flags */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isNew"
            checked={formData.isNew}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isNew: checked as boolean }))}
          />
          <Label htmlFor="isNew">Yangi</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isPremiere"
            checked={formData.isPremiere}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPremiere: checked as boolean }))}
          />
          <Label htmlFor="isPremiere">Premyera</Label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsAddDialogOpen(false);
            setIsEditDialogOpen(false);
            setEditingMovie(null);
            resetFormData();
          }}
        >
          Bekor qilish
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary-glow" disabled={isUploading}>
          <Save className="h-4 w-4 mr-2" />
          {isUploading ? "Yuklanmoqda..." : editingMovie ? "Yangilash" : "Qo'shish"}
        </Button>
      </div>
    </form>
  ), [formData, handleSubmit, handleVideoFileChange, handlePosterFileChange, handleVideoUrlChange, handlePosterUrlChange, handleQualityChange, handleGenreChange, handleSimilarContentChange, isUploading, uploadProgress, videoFileRef, posterFileRef, languages, contentCategories, availableQualities, availableGenres, editingMovie]);

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
              +{stats.newUsersToday} yangi foydalanuvchi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Foydalanuvchilar</CardTitle>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.onlineUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalLogins} jami kirish
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
          {/* Header with Search and Add Button */}
          <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-4">
            <h3 className="text-lg font-semibold">Kinolar Boshqaruvi</h3>
            <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
              <div className="relative flex-1 xl:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Kino qidirish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full xl:w-96"
                />
              </div>
              <Button onClick={handleOpenAddDialog} className="bg-primary hover:bg-primary-glow w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Yangi Qo'shish
              </Button>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="grid grid-cols-3 gap-2 w-full sm:flex sm:flex-wrap">
            {["all", "premieres", "movies", "series", "trailers", "new"].map((category) => {
              const count = category === "all" ? movies.length : 
                           category === "premieres" ? movies.filter(m => m.category === "premieres" || m.isPremiere).length :
                           category === "movies" ? movies.filter(m => m.category === "movies").length :
                           category === "series" ? movies.filter(m => m.category === "series").length :
                           category === "trailers" ? movies.filter(m => m.category === "trailers").length :
                           category === "new" ? movies.filter(m => m.isNew).length : 0;
              
              return (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                  className="animate-slide-in-left sm:flex-1 sm:min-w-0"
                >
                  {getCategoryTitle(category)} ({count})
              </Button>
              );
            })}
          </div>

          {/* Content Section Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <h3 className="text-lg font-semibold">
              {getCategoryTitle(selectedCategory)} - Mavjud Kontentlar ({filteredMovies.length})
            </h3>
                </div>

          {/* Movies List */}
          <Card>
            <CardContent className="p-0">
              <div className="space-y-3 md:space-y-4 p-4 md:p-6">
                {filteredMovies.map((movie) => (
                  <div key={movie.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 border rounded-lg gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm md:text-base">{movie.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono bg-muted px-2 py-1 rounded">#{movie.id}</span>
                          {movie.url && (
                            <a 
                              href={movie.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-500 hover:text-blue-700 underline"
                            >
                              Link
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs md:text-sm text-muted-foreground">
                        <span>{movie.year}</span>
                        <span className="capitalize">{movie.category}</span>
                        <span>⭐ {movie.rating}</span>
                        <span>👁 {movie.views}</span>
                        {movie.isNew && <span className="text-red-500 font-medium">Yangi</span>}
                        {movie.isPremiere && <span className="text-blue-500 font-medium">Premyera</span>}
                      </div>
                    </div>
                    <div className="flex space-x-2 self-end sm:self-auto">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleOpenEditDialog(movie)}
                      >
                        <Edit className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" className="h-8 w-8 p-0">
                        <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Kontentni o'chirish</AlertDialogTitle>
                            <AlertDialogDescription>
                              "{movie.title}" ni o'chirishni xohlaysizmi? Bu amal qaytarib bo'lmaydi.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteMovie(movie.id)}>
                              O'chirish
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="space-y-3 md:space-y-4 p-4 md:p-6">
                {users.map((user) => (
                  <div key={user.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 border rounded-lg gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm md:text-base">{user.name}</h4>
                        {user.isOnline && (
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs md:text-sm text-muted-foreground">
                        <span className="break-all">{user.email}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-xs">
                            {user.role}
                          </Badge>
                          <span className="hidden sm:inline">Oxirgi kirish: {user.lastLogin}</span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-muted-foreground">
                        <span className="sm:hidden">Oxirgi kirish: {user.lastLogin}</span>
                        <span>Kirishlar soni: {user.loginCount}</span>
                        <span>Birinchi kirish: {user.firstLogin}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 self-end sm:self-auto">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="h-8 w-8 p-0">
                        <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Foydalanuvchini o'chirish</AlertDialogTitle>
                            <AlertDialogDescription className="space-y-2">
                              <div className="font-semibold">"{user.name}" ni o'chirishni xohlaysizmi?</div>
                              <div className="text-sm text-muted-foreground">
                                <div>Email: {user.email}</div>
                                <div>Rol: {user.role}</div>
                                <div>Kirishlar soni: {user.loginCount}</div>
                                <div>Birinchi kirish: {user.firstLogin}</div>
                                <div>Oxirgi kirish: {user.lastLogin}</div>
                                <div>Status: {user.isOnline ? "Online" : "Offline"}</div>
                              </div>
                              <div className="text-red-500 font-medium">Bu amal qaytarib bo'lmaydi.</div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => {
                                const updatedUsers = users.filter(u => u.id !== user.id);
                                setUsers(updatedUsers);
                                localStorage.setItem('moviemedia_users', JSON.stringify(updatedUsers));
                                toast({ title: "Muvaffaqiyat", description: "Foydalanuvchi muvaffaqiyatli o'chirildi!" });
                              }}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              O'chirish
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Ko'rishlar Statistikasi
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant={chartType === 'bar' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setChartType('bar');
                        stopAutoSwitch();
                        setAutoSwitch(false);
                      }}
                      className="h-8 px-3"
                    >
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={chartType === 'line' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setChartType('line');
                        stopAutoSwitch();
                        setAutoSwitch(false);
                      }}
                      className="h-8 px-3"
                    >
                      <TrendingUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={autoSwitch ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        if (autoSwitch) {
                          stopAutoSwitch();
                          setAutoSwitch(false);
                        } else {
                          startAutoSwitch();
                          setAutoSwitch(true);
                        }
                      }}
                      className="h-8 px-3"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Chart Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Oxirgi 7 kun</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Ko'rishlar</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chart Container */}
                  <div className="space-y-3">
                    <div className="flex items-end justify-between h-32 gap-1 relative">
                      {[
                        { day: "Dush", views: 45 },
                        { day: "Sesh", views: 32 },
                        { day: "Chor", views: 67 },
                        { day: "Pay", views: 89 },
                        { day: "Jum", views: 123 },
                        { day: "Shan", views: 156 },
                        { day: "Yak", views: 98 }
                      ].map((item, index) => {
                        const height = (item.views / 160) * 100;
                        const isLast = index === 6;
                        
                        return (
                          <div key={index} className="flex flex-col items-center gap-1 flex-1 relative">
                            {chartType === 'bar' ? (
                              // Bar Chart
                              <div 
                                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm transition-all duration-300 hover:from-blue-600 hover:to-blue-500"
                                style={{ height: `${height}%` }}
                              ></div>
                            ) : (
                              // Line Chart
                              <div className="relative w-full h-full">
                                {/* Line to next point */}
                                {!isLast && (
                                  <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                                    <line
                                      x1="50%"
                                      y1={`${100 - height}%`}
                                      x2="150%"
                                      y2={`${100 - ((item.views / 160) * 100)}%`}
                                      stroke="#10b981"
                                      strokeWidth="4"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                )}
                                {/* Data point */}
                                <div 
                                  className="absolute w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg transition-all duration-300 hover:scale-125 hover:bg-green-600"
                                  style={{ 
                                    left: '50%', 
                                    top: `${100 - height}%`, 
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 2
                                  }}
                                ></div>
                              </div>
                            )}
                            <span className="text-xs text-muted-foreground">{item.day}</span>
                            <span className="text-xs font-medium">{item.views}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Stats Summary */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">612</div>
                      <div className="text-xs text-muted-foreground">Jami ko'rishlar</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">156</div>
                      <div className="text-xs text-muted-foreground">Eng ko'p (Shan)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">87</div>
                      <div className="text-xs text-muted-foreground">O'rtacha</div>
                    </div>
                  </div>
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Asosiy Sozlamalar */}
          <Card>
            <CardHeader>
              <CardTitle>Asosiy Sozlamalar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Sayt Nomi</Label>
                  <Input 
                    id="siteName" 
                    value={siteSettings.siteName}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, siteName: e.target.value }))}
                  />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Sayt Tavsifi</Label>
                  <Textarea 
                    id="siteDescription" 
                    value={siteSettings.siteDescription}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteIcon">Sayt Ikonkasi (Emoji)</Label>
                  <Input 
                    id="siteIcon" 
                    value={siteSettings.siteIcon}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, siteIcon: e.target.value }))}
                  />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Aloqa Email</Label>
                  <Input 
                    id="contactEmail" 
                    type="email"
                    value={siteSettings.contactEmail}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                  />
              </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Telefon Raqami</Label>
                  <Input 
                    id="contactPhone" 
                    type="tel"
                    value={siteSettings.contactPhone}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                    placeholder="+998 90 123 45 67"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Media Sozlamalari */}
            <Card>
              <CardHeader>
                <CardTitle>Ijtimoiy Tarmoqlar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input 
                    id="facebook" 
                    type="url"
                    value={siteSettings.socialMedia.facebook}
                    onChange={(e) => setSiteSettings(prev => ({ 
                      ...prev, 
                      socialMedia: { ...prev.socialMedia, facebook: e.target.value }
                    }))}
                    placeholder="https://facebook.com/moviemedia"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input 
                    id="instagram" 
                    type="url"
                    value={siteSettings.socialMedia.instagram}
                    onChange={(e) => setSiteSettings(prev => ({ 
                      ...prev, 
                      socialMedia: { ...prev.socialMedia, instagram: e.target.value }
                    }))}
                    placeholder="https://instagram.com/moviemedia"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telegram">Telegram</Label>
                  <Input 
                    id="telegram" 
                    type="url"
                    value={siteSettings.socialMedia.telegram}
                    onChange={(e) => setSiteSettings(prev => ({ 
                      ...prev, 
                      socialMedia: { ...prev.socialMedia, telegram: e.target.value }
                    }))}
                    placeholder="https://t.me/moviemedia"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input 
                    id="youtube" 
                    type="url"
                    value={siteSettings.socialMedia.youtube}
                    onChange={(e) => setSiteSettings(prev => ({ 
                      ...prev, 
                      socialMedia: { ...prev.socialMedia, youtube: e.target.value }
                    }))}
                    placeholder="https://youtube.com/moviemedia"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Bo'limlar Nomi Sozlamalari */}
            <Card>
              <CardHeader>
                <CardTitle>Bo'limlar Nomi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="premieres">Premyeralar</Label>
                  <Input 
                    id="premieres" 
                    value={siteSettings.sectionNames.premieres}
                    onChange={(e) => setSiteSettings(prev => ({ 
                      ...prev, 
                      sectionNames: { ...prev.sectionNames, premieres: e.target.value }
                    }))}
                    placeholder="Premyeralar"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="movies">Kinolar</Label>
                  <Input 
                    id="movies" 
                    value={siteSettings.sectionNames.movies}
                    onChange={(e) => setSiteSettings(prev => ({ 
                      ...prev, 
                      sectionNames: { ...prev.sectionNames, movies: e.target.value }
                    }))}
                    placeholder="Kinolar"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="series">Seriallar</Label>
                  <Input 
                    id="series" 
                    value={siteSettings.sectionNames.series}
                    onChange={(e) => setSiteSettings(prev => ({ 
                      ...prev, 
                      sectionNames: { ...prev.sectionNames, series: e.target.value }
                    }))}
                    placeholder="Seriallar"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trailers">Treylerlar</Label>
                  <Input 
                    id="trailers" 
                    value={siteSettings.sectionNames.trailers}
                    onChange={(e) => setSiteSettings(prev => ({ 
                      ...prev, 
                      sectionNames: { ...prev.sectionNames, trailers: e.target.value }
                    }))}
                    placeholder="Treylerlar"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">Yangi</Label>
                  <Input 
                    id="new" 
                    value={siteSettings.sectionNames.new}
                    onChange={(e) => setSiteSettings(prev => ({ 
                      ...prev, 
                      sectionNames: { ...prev.sectionNames, new: e.target.value }
                    }))}
                    placeholder="Yangi"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Bo'limlar Sarlavhalari */}
            <Card>
              <CardHeader>
                <CardTitle>Bo'limlar Sarlavhalari</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="premieres-title">Premyeralar Sarlavhasi</Label>
                  <Input 
                    id="premieres-title" 
                    value={siteSettings.sectionTitles.premieres}
                    onChange={(e) => setSiteSettings(prev => ({ 
                      ...prev, 
                      sectionTitles: { ...prev.sectionTitles, premieres: e.target.value }
                    }))}
                    placeholder="PREMYERALAR"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="movies-title">Kinolar Sarlavhasi</Label>
                  <Input 
                    id="movies-title" 
                    value={siteSettings.sectionTitles.movies}
                    onChange={(e) => setSiteSettings(prev => ({ 
                      ...prev, 
                      sectionTitles: { ...prev.sectionTitles, movies: e.target.value }
                    }))}
                    placeholder="KINOLAR"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="series-title">Seriallar Sarlavhasi</Label>
                  <Input 
                    id="series-title" 
                    value={siteSettings.sectionTitles.series}
                    onChange={(e) => setSiteSettings(prev => ({ 
                      ...prev, 
                      sectionTitles: { ...prev.sectionTitles, series: e.target.value }
                    }))}
                    placeholder="SERIALLAR"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trailers-title">Treylerlar Sarlavhasi</Label>
                  <Input 
                    id="trailers-title" 
                    value={siteSettings.sectionTitles.trailers}
                    onChange={(e) => setSiteSettings(prev => ({ 
                      ...prev, 
                      sectionTitles: { ...prev.sectionTitles, trailers: e.target.value }
                    }))}
                    placeholder="TREYLERLAR"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-title">Yangi Sarlavhasi</Label>
                  <Input 
                    id="new-title" 
                    value={siteSettings.sectionTitles.new}
                    onChange={(e) => setSiteSettings(prev => ({ 
                      ...prev, 
                      sectionTitles: { ...prev.sectionTitles, new: e.target.value }
                    }))}
                    placeholder="YANGI KINOLAR"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Bo'limlar Tavsiflari */}
            <Card>
              <CardHeader>
                <CardTitle>Bo'limlar Tavsiflari</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="premieres-desc">Premyeralar Tavsifi</Label>
                  <Textarea 
                    id="premieres-desc" 
                    value={siteSettings.sectionDescriptions.premieres}
                    onChange={(e) => setSiteSettings(prev => ({ 
                      ...prev, 
                      sectionDescriptions: { ...prev.sectionDescriptions, premieres: e.target.value }
                    }))}
                    placeholder="Issiq'ida tomosha qilib oling! Hammasi bizda!"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="movies-desc">Kinolar Tavsifi</Label>
                  <Textarea 
                    id="movies-desc" 
                    value={siteSettings.sectionDescriptions.movies}
                    onChange={(e) => setSiteSettings(prev => ({ 
                      ...prev, 
                      sectionDescriptions: { ...prev.sectionDescriptions, movies: e.target.value }
                    }))}
                    placeholder="Eng yaxshi kinolar to'plami"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="series-desc">Seriallar Tavsifi</Label>
                  <Textarea 
                    id="series-desc" 
                    value={siteSettings.sectionDescriptions.series}
                    onChange={(e) => setSiteSettings(prev => ({ 
                      ...prev, 
                      sectionDescriptions: { ...prev.sectionDescriptions, series: e.target.value }
                    }))}
                    placeholder="Mashhur seriallar va multfilmlar"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trailers-desc">Treylerlar Tavsifi</Label>
                  <Textarea 
                    id="trailers-desc" 
                    value={siteSettings.sectionDescriptions.trailers}
                    onChange={(e) => setSiteSettings(prev => ({ 
                      ...prev, 
                      sectionDescriptions: { ...prev.sectionDescriptions, trailers: e.target.value }
                    }))}
                    placeholder="Eng so'nggi treylerlar"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-desc">Yangi Tavsifi</Label>
                  <Textarea 
                    id="new-desc" 
                    value={siteSettings.sectionDescriptions.new}
                    onChange={(e) => setSiteSettings(prev => ({ 
                      ...prev, 
                      sectionDescriptions: { ...prev.sectionDescriptions, new: e.target.value }
                    }))}
                    placeholder="Yangi qo'shilgan kinolar"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Hero Section Sozlamalari */}
            <Card>
              <CardHeader>
                <CardTitle>Hero Bo'limi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="heroTitle">Hero Sarlavha</Label>
                  <Input 
                    id="heroTitle" 
                    value={siteSettings.heroTitle}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, heroTitle: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroSubtitle">Hero Tavsif</Label>
                  <Textarea 
                    id="heroSubtitle" 
                    value={siteSettings.heroSubtitle}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* About Page Sozlamalari */}
            <Card>
              <CardHeader>
                <CardTitle>About Sahifasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="aboutTitle">About Sarlavha</Label>
                  <Input 
                    id="aboutTitle" 
                    value={siteSettings.aboutTitle}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, aboutTitle: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aboutDescription">About Tavsif</Label>
                  <Textarea 
                    id="aboutDescription" 
                    value={siteSettings.aboutDescription}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, aboutDescription: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Terms Sozlamalari */}
            <Card>
              <CardHeader>
                <CardTitle>Maxfiylik va Shartlar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="privacyTitle">Maxfiylik Sarlavha</Label>
                  <Input 
                    id="privacyTitle" 
                    value={siteSettings.privacyTitle}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, privacyTitle: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="privacyDescription">Maxfiylik Tavsif</Label>
                  <Textarea 
                    id="privacyDescription" 
                    value={siteSettings.privacyDescription}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, privacyDescription: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="termsTitle">Shartlar Sarlavha</Label>
                  <Input 
                    id="termsTitle" 
                    value={siteSettings.termsTitle}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, termsTitle: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="termsDescription">Shartlar Tavsif</Label>
                  <Textarea 
                    id="termsDescription" 
                    value={siteSettings.termsDescription}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, termsDescription: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Saqlash Tugmasi */}
          <Card>
            <CardContent className="pt-6">
              <Button 
                className="w-full"
                onClick={() => {
                  localStorage.setItem('moviemedia_site_settings', JSON.stringify(siteSettings));
                  toast({ title: "Muvaffaqiyat", description: "Sozlamalar muvaffaqiyatli saqlandi!" });
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                Barcha Sozlamalarni Saqlash
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Movie Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Yangi {getCategoryItemName(selectedCategory)} Qo'shish</DialogTitle>
          </DialogHeader>
          {MovieForm}
        </DialogContent>
      </Dialog>

      {/* Edit Movie Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Kontentni Tahrirlash</DialogTitle>
          </DialogHeader>
          {MovieForm}
        </DialogContent>
      </Dialog>
    </div>
  );
};