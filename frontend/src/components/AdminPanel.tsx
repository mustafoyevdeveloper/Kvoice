import React, { useState, useRef, useEffect } from "react";
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
  TrendingUp,
  RefreshCw,
  Database,
  HardDrive,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import useAdminStore from "@/store/admin";
import useAuthStore from "@/store/auth";
import useAnalyticsStore from "@/store/analytics";
import useSettingsStore from "@/store/settings";

interface MovieFormData {
  title: string;
  description: string;
  year: number;
  language: string;
  rating: number;
  videoQuality: string[];
  posterFile: File | null;
  posterUrl: string;
  poster: string;
  genres: string[];
  category: string;
  videoLink: string; // Telegram link for video
  // Serial uchun qo'shimcha maydonlar
  totalEpisodes?: number; // Nechta qismdan iboratligi
  currentEpisode?: number; // Nechanchi qism ekanligi
}

interface ContentCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
}

export const AdminPanel = () => {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { 
    dashboard, 
    content, 
    users: adminUsers, 
    analytics, 
    uploadStats,
    isLoading,
    error,
    pagination,
    getDashboard,
    getContent,
    getUsers,
    getAnalytics,
    getUploadStats,
    updateContentStatus,
    updateUser,
    deleteUser,
    uploadVideo,
    uploadPoster,
    uploadImages,
    deleteFile,
    createMovie,
    updateMovie,
    deleteMovie
  } = useAdminStore();
  const { trackView, trackRating, trackSearch } = useAnalyticsStore();
  const { 
    settings, 
    isLoading: settingsLoading, 
    error: settingsError,
    getSettings, 
    updateSettings, 
    updateSection,
    resetSettings 
  } = useSettingsStore();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [autoSwitch, setAutoSwitch] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedUserStatus, setSelectedUserStatus] = useState('all');
  
  // Site settings state - now loaded from backend
  const [siteSettings, setSiteSettings] = useState({
    siteName: "Kvoice",
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
      movies: "Eng mashhur Koreya kinolari to'plami",
      series: "Mashhur K-dramalar va Koreya seriallari",
      trailers: "Eng so'nggi Koreya kinolar treylerlari",
      new: "Yangi qo'shilgan Koreya kinolari va seriallari"
    },
    heroTitle: "Koreya kinolari va seriallari",
    heroSubtitle: "Eng mashhur K-dramalar va Koreya filmlarini O'zbek tilida tomosha qiling",
    aboutTitle: "Biz haqimizda",
    aboutDescription: "Kvoice - Koreya kinolari va seriallari olamiga xush kelibsiz! Bizning platformamizda eng mashhur K-dramalar, Koreya filmlari va seriallarini O'zbek tilida tomosha qiling. HD va 4K sifatda barcha kontentlar mavjud.",
    privacyTitle: "Maxfiylik siyosati",
    privacyDescription: "Sizning shaxsiy ma'lumotlaringiz biz uchun muhim",
    termsTitle: "Foydalanish shartlari",
    termsDescription: "Saytdan foydalanish shartlari va qoidalari"
  });

  // Update site settings when backend settings change
  useEffect(() => {
    if (settings) {
      setSiteSettings({
        siteName: settings.siteName || "Kvoice",
        siteDescription: settings.siteDescription || "Koreya kinolari va seriallarini O'zbek tilida tomosha qiling",
        siteIcon: settings.siteIcon || "",
        contactEmail: settings.contactEmail || "contact@moviemedia.org",
        contactPhone: settings.contactPhone || "+998 90 123 45 67",
        socialMedia: settings.socialMedia || {
          facebook: "https://facebook.com/moviemedia",
          instagram: "https://instagram.com/moviemedia",
          telegram: "https://t.me/moviemedia",
          youtube: "https://youtube.com/moviemedia"
        },
        sectionNames: settings.sectionNames || {
          premieres: "Premyeralar",
          movies: "Kinolar",
          series: "Seriallar",
          trailers: "Treylerlar",
          new: "Yangi"
        },
        sectionTitles: settings.sectionTitles || {
          premieres: "PREMYERALAR",
          movies: "KINOLAR", 
          series: "SERIALLAR",
          trailers: "TREYLERLAR",
          new: "YANGI KINOLAR"
        },
        sectionDescriptions: settings.sectionDescriptions || {
          premieres: "Issiq'ida tomosha qilib oling! Hammasi bizda!",
          movies: "Eng mashhur Koreya kinolari to'plami",
          series: "Mashhur K-dramalar va Koreya seriallari",
          trailers: "Eng so'nggi Koreya kinolar treylerlari",
          new: "Yangi qo'shilgan Koreya kinolari va seriallari"
        },
        heroTitle: settings.heroTitle || "Koreya kinolari va seriallari",
        heroSubtitle: settings.heroSubtitle || "Eng mashhur K-dramalar va Koreya filmlarini O'zbek tilida tomosha qiling",
        aboutTitle: settings.aboutTitle || "Biz haqimizda",
        aboutDescription: settings.aboutDescription || "Kvoice - Koreya kinolari va seriallari olamiga xush kelibsiz! Bizning platformamizda eng mashhur K-dramalar, Koreya filmlari va seriallarini O'zbek tilida tomosha qiling. HD va 4K sifatda barcha kontentlar mavjud.",
        privacyTitle: settings.privacyTitle || "Maxfiylik siyosati",
        privacyDescription: settings.privacyDescription || "Sizning shaxsiy ma'lumotlaringiz biz uchun muhim",
        termsTitle: settings.termsTitle || "Foydalanish shartlari",
        termsDescription: settings.termsDescription || "Saytdan foydalanish shartlari va qoidalari"
      });
    }
  }, [settings]);
  
  const posterFileRef = useRef(null);
  const autoSwitchInterval = useRef(null);
  
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
  
  // Initialize data on mount
  useEffect(() => {
    // Ensure token is set for development
    if (!localStorage.getItem('token')) {
      localStorage.setItem('token', 'mock-admin-token-12345');
    }
    
    getDashboard();
    getContent();
    getUsers();
    getAnalytics();
    getUploadStats();
    getSettings();
  }, []);





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
    year: 0,
    language: "",
    rating: 0,
    videoQuality: [],
    posterFile: null,
    posterUrl: "",
    poster: "",
    genres: [],
    category: "movies",
    videoLink: "",
    totalEpisodes: 0,
    currentEpisode: 0
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

  const [localUsers, setLocalUsers] = useState([]);

  // Track current user
  const [currentUser, setCurrentUser] = useState(null);

  // User login tracking functions - removed localStorage usage
  const trackUserLogin = (userData: { name: string; email: string; role?: string }) => {
    // This function is now handled by the backend
    console.log('User login tracked:', userData);
  };

  const trackUserLogout = () => {
    // This function is now handled by the backend
    console.log('User logout tracked');
  };

  const stats = {
    totalMovies: content.length,
    totalViews: content.reduce((sum, movie) => sum + (movie.views || 0), 0),
    totalUsers: adminUsers.length,
    todayViews: Math.floor(Math.random() * 2000) + 500, // Random today views (500-2499)
    onlineUsers: adminUsers.filter(user => user.isOnline).length,
    totalLogins: adminUsers.reduce((sum, user) => sum + (user.loginCount || 0), 0),
    newUsersToday: adminUsers.filter(user => {
      const today = new Date().toISOString().split('T')[0];
      return user.firstLogin === today;
    }).length,
    averageLoginsPerUser: adminUsers.length > 0 ? Math.round(adminUsers.reduce((sum, user) => sum + (user.loginCount || 0), 0) / adminUsers.length) : 0
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
      year: 0,
      language: "",
      rating: 0,
      videoQuality: [],
      posterFile: null,
      posterUrl: "",
      poster: "",
      genres: [],
      category: selectedCategory === "all" ? "movies" : selectedCategory,
      videoLink: "",
      totalEpisodes: 0,
      currentEpisode: 0
    });
  };

  // Open add dialog
  const handleOpenAddDialog = (category?: string) => {
    resetFormData();
    if (category) {
      setFormData(prev => ({ ...prev, category }));
    }
    setIsAddDialogOpen(true);
  };

  // Open edit dialog
  const handleOpenEditDialog = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      description: movie.description || "",
      year: movie.year,
      language: movie.language || "uzbek",
      rating: movie.rating,
      videoQuality: movie.videoQuality || movie.quality || [],
      posterFile: null,
      posterUrl: movie.posterUrl || "",
      poster: movie.poster || "",
      genres: movie.genres || ["Drama"],
      category: movie.category,
      videoLink: movie.videoLink || movie.videoUrl || "",
      totalEpisodes: movie.totalEpisodes || 1,
      currentEpisode: movie.currentEpisode || 1
    });
    setIsEditDialogOpen(true);
  };

  // File upload handlers
  const handlePosterFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setFormData(prev => ({ ...prev, posterFile: file, posterUrl: "" }));
        
        try {
          const url = await simulateFileUpload(file);
          setFormData(prev => ({ ...prev, posterUrl: url, poster: url }));
          
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

  const handlePosterUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, posterUrl: url, poster: url, posterFile: null }));
  };

  // Handle form submission
  const handleSubmit = React.useCallback(async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({ title: "Xatolik", description: "Nomi kiritilishi shart!", variant: "destructive" });
      return;
    }

    if (!formData.description.trim()) {
      toast({ title: "Xatolik", description: "Tavsif kiritilishi shart!", variant: "destructive" });
      return;
    }

    if (!formData.posterFile && !formData.posterUrl.trim()) {
      toast({ title: "Xatolik", description: "Preview rasm kiritilishi shart!", variant: "destructive" });
      return;
    }

    if (formData.genres.length === 0) {
      toast({ title: "Xatolik", description: "Kamida bitta janr tanlanishi shart!", variant: "destructive" });
      return;
    }

    if (formData.videoQuality.length === 0) {
      toast({ title: "Xatolik", description: "Kamida bitta sifat tanlanishi shart!", variant: "destructive" });
      return;
    }

    if (!formData.videoLink.trim()) {
      toast({ title: "Xatolik", description: "Video ko'rish tugasi uchun link kiritilishi shart!", variant: "destructive" });
      return;
    }

    try {
      let finalPosterUrl = formData.posterUrl;

      // Upload poster file if needed
      if (formData.posterFile) {
        const posterResult = await uploadPoster(formData.posterFile);
        if (posterResult.success) {
          finalPosterUrl = posterResult.data.url;
        } else {
          throw new Error(posterResult.error);
        }
      }

      const movieData = {
        title: formData.title,
        description: formData.description,
        year: formData.year,
        language: formData.language,
        rating: formData.rating,
        category: formData.category,
        videoQuality: formData.videoQuality,
        poster: finalPosterUrl || formData.posterUrl || formData.poster,
        posterUrl: finalPosterUrl || formData.posterUrl,
        genres: formData.genres,
        videoUrl: formData.videoLink,
        videoLink: formData.videoLink,
        // Serial uchun qo'shimcha maydonlar
        totalEpisodes: formData.category === "series" ? formData.totalEpisodes : undefined,
        currentEpisode: formData.category === "series" ? formData.currentEpisode : undefined,
        quality: formData.videoQuality
      };
      
      console.log('Form data before processing:', formData);
      console.log('Movie data:', movieData);

      if (editingMovie) {
        // Update existing movie
        const result = await updateMovie(editingMovie.id, movieData);
        if (result.success) {
          toast({ title: "Muvaffaqiyat", description: "Kontent muvaffaqiyatli yangilandi!" });
          setIsEditDialogOpen(false);
          setEditingMovie(null);
        } else {
          throw new Error(result.error);
        }
      } else {
        // Add new movie
        const result = await createMovie(movieData);
        if (result.success) {
          toast({ title: "Muvaffaqiyat", description: `Yangi ${formData.category === "series" ? "serial" : "kino"} qo'shildi!` });
          setIsAddDialogOpen(false);
        } else {
          throw new Error(result.error);
        }
      }
      
      resetFormData();
    } catch (error) {
      console.error('Error saving movie:', error);
      toast({ 
        title: "Xatolik", 
        description: error.message || "Kontent saqlanmadi", 
        variant: "destructive" 
      });
    }
  }, [formData, editingMovie, updateMovie, createMovie, uploadPoster, toast]);

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
        videoQuality: [...prev.videoQuality, quality]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        videoQuality: prev.videoQuality.filter(q => q !== quality)
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
  const filteredMovies = content.filter(movie => {
    // Category filter
    let categoryMatch = true;
    if (selectedCategory === "all") {
      // "Barchasi" bo'limida - kino va seriallar ham qidiriladi
      categoryMatch = true;
    } else if (selectedCategory === "movies") {
      // "Kinolar" bo'limida - faqat kinolar qidiriladi
      categoryMatch = movie.category === "movies";
    } else if (selectedCategory === "series") {
      // "Seriallar" bo'limida - faqat seriallar qidiriladi
      categoryMatch = movie.category === "series";
    }
    
    // Search filter - nom bo'yicha qidirish
    const searchMatch = !searchQuery.trim() || 
      movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && searchMatch;
  });

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "all": return "Barchasi";
      case "movies": return "Kinolar";
      case "series": return "Seriallar";
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
      case "all": return "Kontent";
      case "movies": return "Kino";
      case "series": return "Serial";
      default: return "Kontent";
    }
  };

  // Enhanced Movie form component
  const MovieForm = React.useMemo(() => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Nomi */}
      <div className="space-y-2">
        <Label htmlFor="title">Nomi *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Kino yoki serial nomini kiriting"
          required
        />
      </div>

      {/* 2. Yili */}
      <div className="space-y-2">
        <Label htmlFor="year">Yili *</Label>
        <Input
          id="year"
          type="number"
          value={formData.year === 0 ? "" : formData.year}
          onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) || 0 }))}
          placeholder="2025"
          min="1900"
          max="2030"
          required
        />
      </div>

      {/* 3. Tili */}
      <div className="space-y-2">
        <Label htmlFor="language">Tili *</Label>
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

      {/* 4. Reytingi */}
      <div className="space-y-2">
        <Label htmlFor="rating">Reytingi (1-10 gacha) *</Label>
        <Input
          id="rating"
          type="number"
          step="0.1"
          min="1"
          max="10"
          value={formData.rating === 0 ? "" : formData.rating}
          onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) || 0 }))}
          placeholder="8.5"
          required
        />
      </div>

      {/* Serial uchun qo'shimcha maydonlar */}
      {formData.category === "series" && (
        <>
          {/* 5. Nechta qismdan iboratligi */}
          <div className="space-y-2">
            <Label htmlFor="totalEpisodes">Nechta qismdan iboratligi *</Label>
            <Input
              id="totalEpisodes"
              type="number"
              min="1"
              value={formData.totalEpisodes === 0 ? "" : formData.totalEpisodes}
              onChange={(e) => setFormData(prev => ({ ...prev, totalEpisodes: parseInt(e.target.value) || 0 }))}
              placeholder="16"
              required
            />
          </div>

          {/* 6. Nechanchi qism ekanligi */}
          <div className="space-y-2">
            <Label htmlFor="currentEpisode">Nechanchi qism ekanligi *</Label>
            <Input
              id="currentEpisode"
              type="number"
              min="1"
              value={formData.currentEpisode === 0 ? "" : formData.currentEpisode}
              onChange={(e) => setFormData(prev => ({ ...prev, currentEpisode: parseInt(e.target.value) || 0 }))}
              placeholder="1"
              required
            />
          </div>
        </>
      )}

      {/* 5/7. Tavsifi */}
      <div className="space-y-2">
        <Label htmlFor="description">Tavsifi *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Kino yoki serial haqida batafsil ma'lumot"
          rows={4}
          required
        />
      </div>

      {/* 8/10. Preview uchun rasm */}
      <div className="space-y-4">
        <Label>Preview uchun rasm *</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label>Qurilmadan yuklash</Label>
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
            <Label>URL orqali</Label>
            <Input
              value={formData.posterUrl}
              onChange={(e) => handlePosterUrlChange(e.target.value)}
              placeholder="https://example.com/poster.jpg"
              disabled={!!formData.posterFile}
            />
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
            <Label>Ko'rinishi</Label>
            <div className="mt-2 w-32 h-48 border rounded-lg overflow-hidden">
              <img
                src={formData.posterUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* 6/8. Janri */}
      <div className="space-y-2">
        <Label>Janri *</Label>
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

      {/* 7/9. Sifati */}
      <div className="space-y-2">
        <Label>Sifati *</Label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {availableQualities.map((quality) => (
            <div key={quality} className="flex items-center space-x-2">
              <Checkbox
                id={quality}
                checked={formData.videoQuality.includes(quality)}
                onCheckedChange={(checked) => handleQualityChange(quality, checked as boolean)}
              />
              <Label htmlFor={quality} className="text-sm">{quality}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* 9/11. Video ko'rish tugasi uchun link */}
      <div className="space-y-2">
        <Label htmlFor="videoLink">Video ko'rish tugasi uchun link (Telegram) *</Label>
        <Input
          id="videoLink"
          value={formData.videoLink}
          onChange={(e) => setFormData(prev => ({ ...prev, videoLink: e.target.value }))}
          placeholder="https://t.me/..."
          required
        />
        <p className="text-xs text-muted-foreground">
          Telegram linkini kiriting
        </p>
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
  ), [formData, handleSubmit, handlePosterFileChange, handlePosterUrlChange, handleQualityChange, handleGenreChange, isUploading, uploadProgress, posterFileRef, languages, availableQualities, availableGenres, editingMovie]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-4">
        <h2 className="text-2xl font-bold">Kinolar va Seriallar Boshqaruvi</h2>
      </div>

      <div className="space-y-4 md:space-y-6">
        {/* Category Filter Tabs - Mobile'da birinchi */}
        <div className="flex gap-2 w-full">
          {["all", "movies", "series"].map((category) => {
            const count = category === "all" ? content.length : 
                         category === "movies" ? content.filter(m => m.category === "movies").length :
                         category === "series" ? content.filter(m => m.category === "series").length : 0;
            
            return (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="flex-1 animate-slide-in-left h-10 md:h-12"
              >
                {getCategoryTitle(category)} ({count})
              </Button>
            );
          })}
        </div>

        {/* Search and Add Button - Mobile'da ikkinchi va uchinchi */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <div className="relative flex-1 w-full md:w-auto md:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={
                selectedCategory === "all" 
                  ? "Kino yoki serial qidirish..." 
                  : selectedCategory === "movies" 
                  ? "Kino qidirish..." 
                  : "Serial qidirish..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full md:w-[28.1rem]"
            />
          </div>
          {selectedCategory === "movies" && (
            <Button onClick={() => handleOpenAddDialog("movies")} className="bg-primary hover:bg-primary-glow w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Yangi Kino Qo'shish
            </Button>
          )}
          {selectedCategory === "series" && (
            <Button onClick={() => handleOpenAddDialog("series")} className="bg-primary hover:bg-primary-glow w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Yangi Serial Qo'shish
            </Button>
          )}
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
              {filteredMovies.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    {searchQuery ? "Qidiruv natijasi topilmadi" : "Hech qanday kontent topilmadi"}
                  </p>
                </div>
              ) : (
                filteredMovies.map((movie) => (
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
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Movie Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Yangi {getCategoryItemName(selectedCategory)} Qo'shish</DialogTitle>
            <DialogDescription>
              Yangi kino qo'shish uchun barcha majburiy maydonlarni to'ldiring
            </DialogDescription>
          </DialogHeader>
          {MovieForm}
        </DialogContent>
      </Dialog>

      {/* Edit Movie Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Kontentni Tahrirlash</DialogTitle>
            <DialogDescription>
              Kino ma'lumotlarini tahrirlash uchun kerakli maydonlarni o'zgartiring
            </DialogDescription>
          </DialogHeader>
          {MovieForm}
        </DialogContent>
      </Dialog>
    </div>
  );
};