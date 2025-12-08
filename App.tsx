
import React, { useState, useMemo, useEffect } from 'react';
import { MapPin, Bell, Search, Filter, ChevronLeft, Star, Clock, Heart, ShieldCheck, ChevronRight, X, Navigation, Target, CreditCard, History, Settings, HelpCircle, LogOut, Wallet, TrendingUp, Clock3, Briefcase, Check, ArrowRight, Mail, Lock, Eye, EyeOff, Trash2, CheckCheck, KeyRound, UserCircle, MousePointerClick, Moon, Sun, Loader2, Calendar, MessageCircle, CheckCircle2, DollarSign, Rocket, Store, Users, CalendarDays, Plus, Phone, BarChart3, PieChart, Edit, ListChecks, Power, BriefcaseBusiness, Globe, Shield, Smartphone, FileText, BadgeCheck, Sparkles } from 'lucide-react';
import { CATEGORIES, PROVIDERS, PROMOS, RECENT_SEARCHES, POPULAR_TAGS, FLASH_DEALS, MOCK_NOTIFICATIONS } from './constants';
import { Provider, AppNotification, ServiceItem, Employee, Schedule, LocationTarget } from './types';
import { BottomNav } from './components/BottonNav';
import { ProviderCard } from './components/ProviderCard';
import { AIChat } from './components/AIChat';
import * as Icons from 'lucide-react';
// import { HeroApi } from './services/heroApi'; // Uncomment to use real backend

const App = () => {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'recover-pass'>('login');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  
  // Loading States
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isRecoveryLoading, setIsRecoveryLoading] = useState(false);
  const [isProviderLoading, setIsProviderLoading] = useState(false);
  const [providerSuccess, setProviderSuccess] = useState(false);
  
  // App State
  const [currentTab, setCurrentTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Provider / Business Management State
  const [isProviderMode, setIsProviderMode] = useState(false); // Controls the "Create Business" Wizard
  const [myBusinesses, setMyBusinesses] = useState<Provider[]>([]); // List of businesses owned by user
  const [dashboardBusiness, setDashboardBusiness] = useState<Provider | null>(null); // Currently selected business for dashboard

  // Wizard State for Provider Registration
  const [regStep, setRegStep] = useState(1);
  const initialRegData = {
      name: '',
      categoryId: '',
      description: '',
      phoneNumber: '',
      location: '',
      coordinates: { lat: 0, lng: 0 }
  };
  const [regData, setRegData] = useState(initialRegData);
  const [regServices, setRegServices] = useState<ServiceItem[]>([]);
  const [regEmployees, setRegEmployees] = useState<Employee[]>([]);
  const initialSchedule: Schedule[] = [
      { day: 'Lun', open: '09:00', close: '18:00', active: true },
      { day: 'Mar', open: '09:00', close: '18:00', active: true },
      { day: 'Mié', open: '09:00', close: '18:00', active: true },
      { day: 'Jue', open: '09:00', close: '18:00', active: true },
      { day: 'Vie', open: '09:00', close: '18:00', active: true },
      { day: 'Sáb', open: '10:00', close: '14:00', active: true },
      { day: 'Dom', open: '00:00', close: '00:00', active: false },
  ];
  const [regSchedule, setRegSchedule] = useState<Schedule[]>(initialSchedule);
  
  // Temp states for adding items in wizard
  const [tempService, setTempService] = useState({ name: '', price: '', duration: '' });
  const [tempEmployee, setTempEmployee] = useState({ name: '', role: '' });


  // Booking & Cart State
  const [cart, setCart] = useState<ServiceItem[]>([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<'datetime' | 'summary' | 'success'>('datetime');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Dark Mode State
  const [darkMode, setDarkMode] = useState(false);

  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    whatsappUpdates: false,
    locationPrecise: true,
    biometricLogin: false,
    dataUsage: false
  });

  // Notifications State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [notifFilter, setNotifFilter] = useState<'all' | 'order' | 'promo'>('all');

  // Location State
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [locationTarget, setLocationTarget] = useState<LocationTarget>('user'); // 'user' address or 'business' address
  const [currentAddress, setCurrentAddress] = useState('Av. Reforma 123, CDMX');
  const [tempAddress, setTempAddress] = useState('');

  // Dark Mode Persistence & Initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({...prev, [key]: !prev[key]}));
  };

  // Splash Screen Logic
  useEffect(() => {
    // Phase 1: Show splash
    const timer1 = setTimeout(() => {
      setSplashFading(true); // Start fade out
    }, 2800); // Slightly longer to enjoy the animation

    // Phase 2: Remove splash from DOM
    const timer2 = setTimeout(() => {
      setShowSplash(false);
    }, 3500); // after fade starts

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Derived state for filtering
  const filteredProviders = useMemo(() => {
    return PROVIDERS.filter(p => {
      // 1. Category Filter
      const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
      
      // 2. Search Text Filter
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.services.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // 3. Subcategory Filter
      let matchesSubcategory = true;
      if (selectedCategory !== 'all' && selectedSubcategory !== 'all') {
         // Basic matching logic: check if subcategory name appears in provider text or services
         // We slice to avoid strict exact matches (e.g. "Plomería" vs "Plomero")
         const term = selectedSubcategory.toLowerCase().slice(0, 4); 
         matchesSubcategory = 
            p.name.toLowerCase().includes(term) ||
            p.description.toLowerCase().includes(term) ||
            p.services.some(s => s.name.toLowerCase().includes(term));
      }

      return matchesCategory && matchesSearch && matchesSubcategory;
    });
  }, [selectedCategory, selectedSubcategory, searchQuery]);

  // Derived state for carousels
  const topRatedProviders = useMemo(() => [...PROVIDERS].sort((a, b) => b.rating - a.rating).slice(0, 5), []);
  const nearProviders = useMemo(() => [...PROVIDERS].filter(p => p.distance.includes('km') && parseFloat(p.distance) < 4), []);
  const homeServiceProviders = useMemo(() => [...PROVIDERS].filter(p => p.categoryId === 'home'), []);
  
  // New Carousels
  const newProviders = useMemo(() => [...PROVIDERS].reverse().slice(0, 5), []); // Simulate new arrivals
  const verifiedProviders = useMemo(() => [...PROVIDERS].filter(p => p.verified), []);

  // Notifications Helpers
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const filteredNotifications = notifications.filter(n => {
    if (notifFilter === 'all') return true;
    if (notifFilter === 'order') return n.type === 'order' || n.type === 'payment';
    if (notifFilter === 'promo') return n.type === 'promo';
    return true;
  });

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({...n, read: true})));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };


  const handleProviderClick = (provider: Provider) => {
    setSelectedProvider(provider);
    setCart([]); // Reset cart when entering a new provider
  };

  const handleBack = () => {
    if (selectedProvider) {
      setSelectedProvider(null);
      setCart([]);
    } else {
      // Optional: Handle tab history logic here
    }
  };

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setSelectedSubcategory('all'); // Reset subcategory when changing main category
    setCurrentTab('home');
  };

  const handleCategoryFromAI = (catId: string) => {
    handleCategorySelect(catId);
  };

  const openLocationMap = (target: LocationTarget) => {
    setLocationTarget(target);
    if (target === 'user') {
        setTempAddress(currentAddress);
    } else {
        setTempAddress(regData.location || "Selecciona en el mapa");
    }
    setIsLocationOpen(true);
  };

  const confirmLocation = () => {
    if (locationTarget === 'user') {
        setCurrentAddress(tempAddress);
    } else {
        // Update Business Location
        setRegData({ ...regData, location: tempAddress });
    }
    setIsLocationOpen(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setIsAuthLoading(false);
      setIsLoggedIn(true);
    }, 1500);
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if(!recoveryEmail) return;
    
    setIsRecoveryLoading(true);
    setTimeout(() => {
      setIsRecoveryLoading(false);
      setRecoverySuccess(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setRecoverySuccess(false);
        setAuthMode('login');
        setRecoveryEmail('');
      }, 3000);
    }, 1500);
  };
  
  // --- Provider / Business Wizard Logic ---

  const startNewBusiness = () => {
      // Reset form
      setRegData(initialRegData);
      setRegServices([]);
      setRegEmployees([]);
      setRegSchedule(initialSchedule);
      setRegStep(1);
      setIsProviderMode(true);
  };

  const handleProviderSubmit = () => {
      setIsProviderLoading(true);
      setTimeout(() => {
          setIsProviderLoading(false);
          setProviderSuccess(true);
          
          // Create the new provider object
          const newBusiness: Provider = {
              id: Date.now().toString(),
              name: regData.name,
              categoryId: regData.categoryId,
              rating: 0,
              reviewCount: 0,
              imageUrl: 'https://picsum.photos/400/300?random=' + Date.now(),
              distance: '0 km',
              availability: 'Disponible',
              description: regData.description,
              verified: false,
              phoneNumber: regData.phoneNumber,
              location: regData.location,
              services: regServices,
              employees: regEmployees,
              schedule: regSchedule,
              coordinates: regData.coordinates
          };

          // Add to my businesses
          setMyBusinesses(prev => [...prev, newBusiness]);

      }, 1500);
  };
  
  // Provider Wizard Helpers
  const addServiceToReg = () => {
      if(!tempService.name || !tempService.price) return;
      setRegServices([...regServices, {
          id: Date.now().toString(),
          name: tempService.name,
          price: parseFloat(tempService.price),
          duration: tempService.duration
      }]);
      setTempService({ name: '', price: '', duration: '' });
  };
  
  const removeServiceFromReg = (id: string) => {
      setRegServices(regServices.filter(s => s.id !== id));
  };

  const addEmployeeToReg = () => {
      if(!tempEmployee.name) return;
      setRegEmployees([...regEmployees, {
          id: Date.now().toString(),
          name: tempEmployee.name,
          role: tempEmployee.role,
          avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
      }]);
      setTempEmployee({ name: '', role: '' });
  };
  
  const removeEmployeeFromReg = (id: string) => {
      setRegEmployees(regEmployees.filter(e => e.id !== id));
  };
  
  const toggleScheduleDay = (idx: number) => {
      const newSchedule = [...regSchedule];
      newSchedule[idx].active = !newSchedule[idx].active;
      setRegSchedule(newSchedule);
  };

  const closeProviderFlow = () => {
      setIsProviderMode(false);
      setProviderSuccess(false);
  };

  const openDashboard = (business: Provider) => {
      setDashboardBusiness(business);
  };

  const closeDashboard = () => {
      setDashboardBusiness(null);
  };

  // --- Booking Logic ---

  const toggleCartItem = (service: ServiceItem) => {
      if (cart.find(s => s.id === service.id)) {
          setCart(cart.filter(s => s.id !== service.id));
      } else {
          setCart([...cart, service]);
      }
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price, 0);

  const openBookingModal = () => {
      if (cart.length === 0) return;
      setBookingStep('datetime');
      // Set default next dates
      setIsBookingOpen(true);
  };

  const confirmBooking = () => {
      setBookingStep('success');
      // In a real app, send API request here
      setTimeout(() => {
         // Auto close after success? Or manual.
      }, 500);
  };

  const closeBooking = () => {
      setIsBookingOpen(false);
      setBookingStep('datetime');
      if (bookingStep === 'success') {
          // Cleart cart and go back
          setCart([]);
          setSelectedProvider(null);
      }
  };

  const handleWhatsApp = () => {
      if (!selectedProvider?.phoneNumber) return;
      const message = `Hola ${selectedProvider.name}, te vi en Hero Be Here. Estoy interesado en tus servicios.`;
      const url = `https://wa.me/52${selectedProvider.phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
  };

  // --- Views ---

  const renderSplash = () => (
    <div className={`fixed inset-0 z-[100] bg-brand-500 flex flex-col items-center justify-center text-white transition-opacity duration-700 overflow-hidden ${splashFading ? 'opacity-0' : 'opacity-100'}`}>
       
       <style>{`
          @keyframes elastic-box {
            0% { transform: scale(0) rotate(-180deg); opacity: 0; }
            60% { transform: scale(1.1) rotate(10deg); opacity: 1; }
            80% { transform: scale(0.95) rotate(-5deg); }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
          @keyframes finger-enter {
            0% { transform: translate(30px, 30px) scale(0.5); opacity: 0; }
            50% { transform: translate(30px, 30px) scale(1); opacity: 1; }
            100% { transform: translate(0, 0) scale(1); opacity: 1; }
          }
          @keyframes finger-click {
            0% { transform: scale(1) rotate(180deg); }
            40% { transform: scale(0.85) rotate(180deg); } /* Press */
            100% { transform: scale(1) rotate(180deg); } /* Release */
          }
          @keyframes ripple-explode {
             0% { transform: scale(0.8); opacity: 0.8; border-width: 8px; }
             100% { transform: scale(2.5); opacity: 0; border-width: 0px; }
          }
          @keyframes slide-up-fade {
            0% { transform: translateY(20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          
          .anim-box { animation: elastic-box 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
          .anim-finger-enter { animation: finger-enter 0.8s ease-out 0.5s forwards; opacity: 0; }
          .anim-finger-click { animation: finger-click 0.4s ease-in-out 1.2s forwards; }
          .anim-ripple { animation: ripple-explode 1.5s ease-out 1.3s infinite; opacity: 0; }
          .anim-text { animation: slide-up-fade 0.8s ease-out 1.5s forwards; opacity: 0; }
       `}</style>

       <div className="relative mb-8">
         {/* Background Ripples */}
         <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 border-white rounded-full anim-ripple"></div>
         </div>
         <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 border-white rounded-full anim-ripple" style={{animationDelay: '1.6s'}}></div>
         </div>
         
         {/* Main Box Container */}
         <div className="relative w-28 h-28 bg-white rounded-3xl flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] anim-box z-10">
            {/* The Finger Icon */}
            <div className="anim-finger-enter w-full h-full flex items-center justify-center">
               <div className="anim-finger-click">
                  <MousePointerClick size={64} className="text-brand-600" fill="currentColor" />
               </div>
            </div>
         </div>
       </div>

       {/* Text Reveal */}
       <div className="text-center space-y-2 z-10">
         <h1 className="text-5xl font-extrabold tracking-tight anim-text">
            Hero <span className="text-brand-200">Be Here</span>
         </h1>
         <p className="text-orange-100 text-lg font-medium tracking-wide anim-text" style={{animationDelay: '1.7s'}}>
            Tu solución, al toque.
         </p>
       </div>

       {/* Loader at bottom */}
       <div className="absolute bottom-12 flex flex-col items-center anim-text" style={{animationDelay: '2s'}}>
          <div className="flex space-x-2">
             <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
             <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></div>
             <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
          </div>
       </div>
    </div>
  );

  const renderLogin = () => (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col justify-center px-6 animate-in fade-in duration-700 transition-colors duration-300">
      <div className="mb-8 text-center">
        <div className="w-20 h-20 bg-brand-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-brand-200 dark:shadow-none transition-transform hover:rotate-3">
          <MousePointerClick size={40} className="text-white rotate-180" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Hero Be Here</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Soluciones al instante, en tu puerta.</p>
      </div>

      {/* Recovery Modes */}
      {authMode === 'recover-pass' && (
        <div className="bg-white dark:bg-gray-900 animate-in slide-in-from-right duration-300">
           {recoverySuccess ? (
             <div className="text-center py-8 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-800">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="text-green-600 dark:text-green-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">¡Correo enviado!</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm px-6">
                  Hemos enviado las instrucciones a <strong>{recoveryEmail}</strong>. Revisa tu bandeja de entrada.
                </p>
             </div>
           ) : (
             <div className="bg-white dark:bg-gray-900">
                <button onClick={() => setAuthMode('login')} className="flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 mb-6 text-sm font-medium transition-colors">
                  <ChevronLeft size={20} className="mr-1" /> Volver al inicio
                </button>
                
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Recuperar Contraseña
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                </p>

                <form onSubmit={handleRecovery} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                    <input 
                      type="email" 
                      required
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      placeholder="Correo electrónico registrado" 
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 pl-12 rounded-xl outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-gray-900 dark:text-white" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isRecoveryLoading}
                    className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl hover:bg-brand-700 active:scale-[0.98] transition-all shadow-lg shadow-brand-200 dark:shadow-none mt-6 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isRecoveryLoading ? <Loader2 className="animate-spin" size={24} /> : 'Enviar instrucciones'}
                  </button>
                </form>
             </div>
           )}
        </div>
      )}

      {/* Login / Register Modes */}
      {(authMode === 'login' || authMode === 'register') && (
        <div className="bg-white dark:bg-gray-900 animate-in slide-in-from-left duration-300">
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6">
            <button 
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${authMode === 'login' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
            >
              Iniciar Sesión
            </button>
            <button 
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${authMode === 'register' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authMode === 'register' && (
              <div className="relative">
                <Icons.User className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input type="text" placeholder="Nombre completo" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 pl-12 rounded-xl outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-gray-900 dark:text-white" />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input type="email" placeholder="Correo electrónico" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 pl-12 rounded-xl outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-gray-900 dark:text-white" />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input type="password" placeholder="Contraseña" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 pl-12 rounded-xl outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-gray-900 dark:text-white" />
            </div>

            {/* Recovery Links */}
            {authMode === 'login' && (
              <div className="flex justify-end items-center text-xs px-1">
                 <button type="button" onClick={() => setAuthMode('recover-pass')} className="text-brand-600 dark:text-brand-500 font-bold hover:text-brand-700 dark:hover:text-brand-400 flex items-center gap-1 transition-colors">
                   <KeyRound size={14} /> ¿Olvidaste tu contraseña?
                 </button>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isAuthLoading}
              className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl hover:bg-brand-700 active:scale-[0.98] transition-all shadow-lg shadow-brand-200 dark:shadow-none mt-6 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isAuthLoading ? <Loader2 className="animate-spin" size={24} /> : (authMode === 'login' ? 'Ingresar' : 'Crear Cuenta')}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">O continúa con</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-white dark:bg-gray-800">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5 mr-2" alt="Google" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Google</span>
              </button>
              <button className="flex items-center justify-center px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-white dark:bg-gray-800">
                <img src="https://www.svgrepo.com/show/511330/apple-173.svg" className="h-5 w-5 mr-2" alt="Apple" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Apple</span>
              </button>
            </div>
          </div>
          
          <p className="mt-10 text-center text-xs text-gray-400">
            Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad.
          </p>
        </div>
      )}
    </div>
  );

  const renderProviderRegistration = () => {
    if (providerSuccess) {
      return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col justify-center items-center p-6 animate-in zoom-in duration-300">
           <div className="w-24 h-24 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mb-6 relative">
             <Rocket size={48} className="text-green-600 dark:text-green-400" />
             <div className="absolute top-0 right-0 animate-ping h-full w-full rounded-full bg-green-200 dark:bg-green-800 opacity-20"></div>
           </div>
           <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">¡Negocio Publicado!</h2>
           <p className="text-gray-500 dark:text-gray-400 text-center max-w-xs mb-10">
             Tu perfil ya está visible. Puedes verlo en tu lista de negocios.
           </p>
           <button 
             onClick={closeProviderFlow}
             className="w-full max-w-xs bg-brand-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-200 dark:shadow-none hover:bg-brand-700 transition-all"
           >
             Volver a mi perfil
           </button>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pb-safe animate-in slide-in-from-right duration-300 transition-colors duration-300 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-10 px-4 py-3 flex items-center border-b border-gray-100 dark:border-gray-800">
          <button onClick={() => { if(regStep > 1) setRegStep(regStep-1); else setIsProviderMode(false); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full mr-2">
            <ChevronLeft size={24} className="text-gray-700 dark:text-gray-200" />
          </button>
          <div className="flex-1">
             <span className="font-bold text-lg text-gray-800 dark:text-white block">Publicar Negocio</span>
             <span className="text-xs text-brand-600 font-semibold">Paso {regStep} de 4</span>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {/* Progress Bar */}
          <div className="flex gap-2 mb-6">
             {[1,2,3,4].map(s => (
                 <div key={s} className={`h-1 flex-1 rounded-full ${s <= regStep ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
             ))}
          </div>

          {regStep === 1 && (
             <div className="animate-in fade-in slide-in-from-right duration-300 space-y-6">
                <div className="mb-4">
                   <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><Store className="text-brand-500"/> Info del Negocio</h2>
                   <p className="text-gray-500 dark:text-gray-400 text-sm">¿Cómo te encontrarán los clientes?</p>
                </div>

                <div>
                   <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase">Nombre del Negocio / Profesional</label>
                   <input type="text" value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})} placeholder="Ej. Salón Belleza Total" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl outline-none focus:border-brand-500 text-gray-900 dark:text-white" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase">Categoría Principal</label>
                   <select value={regData.categoryId} onChange={e => setRegData({...regData, categoryId: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl outline-none focus:border-brand-500 text-gray-900 dark:text-white">
                      <option value="">Selecciona...</option>
                      {CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                   </select>
                </div>
                
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase flex items-center gap-1"><Phone size={12}/> Teléfono (WhatsApp)</label>
                        <input type="tel" value={regData.phoneNumber} onChange={e => setRegData({...regData, phoneNumber: e.target.value})} placeholder="55 1234 5678" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl outline-none focus:border-brand-500 text-gray-900 dark:text-white" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase flex items-center gap-1"><MapPin size={12}/> Ubicación del Negocio</label>
                    <div className="flex gap-2">
                        <input type="text" value={regData.location} onChange={e => setRegData({...regData, location: e.target.value})} placeholder="Escribe la dirección..." className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl outline-none focus:border-brand-500 text-gray-900 dark:text-white" />
                        <button 
                            onClick={() => openLocationMap('business')}
                            className="bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 p-4 rounded-xl hover:bg-brand-200 dark:hover:bg-brand-900/50 transition-colors"
                        >
                            <MapPin size={24} />
                        </button>
                    </div>
                    {regData.location && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
                            <CheckCheck size={12} className="mr-1"/> Ubicación confirmada
                        </p>
                    )}
                </div>

                <div>
                   <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase">Descripción</label>
                   <textarea value={regData.description} onChange={e => setRegData({...regData, description: e.target.value})} placeholder="Describe tu experiencia y especialidades..." className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl outline-none focus:border-brand-500 h-24 text-gray-900 dark:text-white resize-none"></textarea>
                </div>
                
                <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <Icons.Image size={24} className="text-brand-500 mb-2" />
                    <p className="text-sm text-gray-500">Subir foto de portada</p>
                </div>

                <button disabled={!regData.name || !regData.categoryId || !regData.phoneNumber || !regData.location} onClick={() => setRegStep(2)} className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl mt-4 hover:bg-brand-700 disabled:opacity-50">Siguiente</button>
             </div>
          )}

          {regStep === 2 && (
             <div className="animate-in fade-in slide-in-from-right duration-300 space-y-6">
                 <div className="mb-4">
                   <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><Briefcase className="text-brand-500"/> Menú de Servicios</h2>
                   <p className="text-gray-500 dark:text-gray-400 text-sm">Agrega los servicios que ofreces.</p>
                </div>

                {/* List of added services */}
                <div className="space-y-3">
                    {regServices.map(s => (
                        <div key={s.id} className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 flex justify-between items-center shadow-sm">
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">{s.name}</h4>
                                <p className="text-xs text-gray-500">{s.duration} • ${s.price}</p>
                            </div>
                            <button onClick={() => removeServiceFromReg(s.id)} className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full">
                                <Trash2 size={16}/>
                            </button>
                        </div>
                    ))}
                    {regServices.length === 0 && (
                        <div className="text-center py-8 text-gray-400 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                            <p>No has agregado servicios aún.</p>
                        </div>
                    )}
                </div>

                {/* Add Service Form */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3 mt-4">
                    <h4 className="font-bold text-sm text-gray-700 dark:text-gray-300">Nuevo Servicio</h4>
                    <input type="text" value={tempService.name} onChange={e => setTempService({...tempService, name: e.target.value})} placeholder="Nombre (ej. Corte Caballero)" className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg text-sm outline-none text-gray-900 dark:text-white" />
                    <div className="flex gap-3">
                        <input type="number" value={tempService.price} onChange={e => setTempService({...tempService, price: e.target.value})} placeholder="Precio $" className="w-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg text-sm outline-none text-gray-900 dark:text-white" />
                        <input type="text" value={tempService.duration} onChange={e => setTempService({...tempService, duration: e.target.value})} placeholder="Duración (ej. 30m)" className="w-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg text-sm outline-none text-gray-900 dark:text-white" />
                    </div>
                    <button onClick={addServiceToReg} disabled={!tempService.name || !tempService.price} className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 rounded-lg text-sm disabled:opacity-50">Agregar Servicio</button>
                </div>

                <button onClick={() => setRegStep(3)} disabled={regServices.length === 0} className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl mt-4 hover:bg-brand-700 disabled:opacity-50">Siguiente</button>
             </div>
          )}

          {regStep === 3 && (
             <div className="animate-in fade-in slide-in-from-right duration-300 space-y-6">
                 <div className="mb-4">
                   <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><Users className="text-brand-500"/> Equipo (Opcional)</h2>
                   <p className="text-gray-500 dark:text-gray-400 text-sm">Agrega a tus empleados o especialistas.</p>
                </div>

                {/* List of employees */}
                <div className="space-y-3">
                    {regEmployees.map(e => (
                        <div key={e.id} className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 flex justify-between items-center shadow-sm">
                            <div className="flex items-center gap-3">
                                <img src={e.avatar} alt={e.name} className="w-10 h-10 rounded-full"/>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">{e.name}</h4>
                                    <p className="text-xs text-gray-500">{e.role}</p>
                                </div>
                            </div>
                            <button onClick={() => removeEmployeeFromReg(e.id)} className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full">
                                <Trash2 size={16}/>
                            </button>
                        </div>
                    ))}
                    {regEmployees.length === 0 && (
                        <div className="text-center py-6 text-gray-400">
                            <p className="text-sm">Sin empleados (Trabajas solo).</p>
                        </div>
                    )}
                </div>

                 {/* Add Employee Form */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3 mt-4">
                    <h4 className="font-bold text-sm text-gray-700 dark:text-gray-300">Nuevo Miembro</h4>
                    <input type="text" value={tempEmployee.name} onChange={e => setTempEmployee({...tempEmployee, name: e.target.value})} placeholder="Nombre (ej. Ana López)" className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg text-sm outline-none text-gray-900 dark:text-white" />
                    <input type="text" value={tempEmployee.role} onChange={e => setTempEmployee({...tempEmployee, role: e.target.value})} placeholder="Rol (ej. Estilista Senior)" className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg text-sm outline-none text-gray-900 dark:text-white" />
                    <button onClick={addEmployeeToReg} disabled={!tempEmployee.name} className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 rounded-lg text-sm disabled:opacity-50">Agregar Miembro</button>
                </div>

                <div className="flex gap-3">
                     <button onClick={() => setRegStep(4)} className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl mt-4 hover:bg-brand-700">Siguiente</button>
                </div>
             </div>
          )}

          {regStep === 4 && (
             <div className="animate-in fade-in slide-in-from-right duration-300 space-y-6">
                 <div className="mb-4">
                   <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><CalendarDays className="text-brand-500"/> Horarios</h2>
                   <p className="text-gray-500 dark:text-gray-400 text-sm">Define tus días y horas de atención.</p>
                </div>

                <div className="space-y-2">
                    {regSchedule.map((s, idx) => (
                        <div key={s.day} className={`flex items-center justify-between p-3 rounded-xl border ${s.active ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' : 'bg-gray-50 dark:bg-gray-900 border-transparent opacity-60'}`}>
                            <div className="flex items-center gap-3">
                                <div onClick={() => toggleScheduleDay(idx)} className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer ${s.active ? 'bg-brand-600 border-brand-600' : 'border-gray-400'}`}>
                                    {s.active && <Check size={14} className="text-white"/>}
                                </div>
                                <span className="font-bold text-gray-800 dark:text-gray-200 w-10">{s.day}</span>
                            </div>
                            {s.active ? (
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{s.open}</span>
                                    <span>-</span>
                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{s.close}</span>
                                </div>
                            ) : (
                                <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Cerrado</span>
                            )}
                        </div>
                    ))}
                </div>

                <button 
                   onClick={handleProviderSubmit} 
                   disabled={isProviderLoading}
                   className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl hover:bg-brand-700 mt-6 flex justify-center gap-2"
                >
                    {isProviderLoading ? <Loader2 className="animate-spin"/> : <> <Rocket size={20}/> Publicar Negocio </>}
                </button>
             </div>
          )}
        </div>
      </div>
    );
  };

  const renderProviderDashboard = () => {
    if (!dashboardBusiness) return null;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-safe animate-in fade-in duration-300">
          {/* Header */}
          <div className="bg-white dark:bg-gray-900 p-6 pt-12 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                  <button onClick={closeDashboard} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                      <ChevronLeft size={24} className="text-gray-600 dark:text-gray-300" />
                  </button>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Abierto
                  </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardBusiness.name}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Panel de Administración</p>
          </div>

          <div className="p-4 space-y-6">
              {/* Financial Summary */}
              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase">
                          <DollarSign size={14} /> Ganancias (Mes)
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">$1,250</p>
                      <p className="text-xs text-green-500 flex items-center mt-1"><TrendingUp size={10} className="mr-1"/> +12% vs mes anterior</p>
                  </div>
                   <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase">
                          <ListChecks size={14} /> Pedidos
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
                      <p className="text-xs text-gray-400 mt-1">3 pendientes</p>
                  </div>
              </div>

              {/* Quick Actions */}
              <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Gestión Rápida</h3>
                  <div className="grid grid-cols-2 gap-3">
                       <button className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                           <div className="p-2 bg-brand-100 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-full">
                               <Briefcase size={20} />
                           </div>
                           <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Servicios ({dashboardBusiness.services.length})</span>
                       </button>
                       <button className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                           <div className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
                               <CalendarDays size={20} />
                           </div>
                           <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Horarios</span>
                       </button>
                       <button className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                           <div className="p-2 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full">
                               <Users size={20} />
                           </div>
                           <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Equipo ({dashboardBusiness.employees.length})</span>
                       </button>
                       <button className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                           <div className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                               <Edit size={20} />
                           </div>
                           <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Perfil</span>
                       </button>
                  </div>
              </div>

               {/* Recent Activity Mock */}
              <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Actividad Reciente</h3>
                  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                      {[1,2,3].map(i => (
                          <div key={i} className="p-4 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-500 font-bold">
                                      CP
                                  </div>
                                  <div>
                                      <p className="text-sm font-bold text-gray-900 dark:text-white">Cliente Prueba</p>
                                      <p className="text-xs text-gray-500">Corte de Pelo • 10:00 AM</p>
                                  </div>
                              </div>
                              <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">Completado</span>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Business Settings */}
               <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                       <Power size={20} className="text-red-500" />
                       <span className="font-semibold text-gray-800 dark:text-white">Cerrar Negocio Temporalmente</span>
                   </div>
                   <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded-full relative cursor-pointer">
                       <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                   </div>
               </div>
          </div>
      </div>
    );
  };

  const renderBookingModal = () => {
      if (!isBookingOpen || !selectedProvider) return null;

      return (
          <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end sm:items-center sm:justify-center p-0 sm:p-4">
              <div className="bg-white dark:bg-gray-900 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                          {bookingStep === 'datetime' && 'Elige un horario'}
                          {bookingStep === 'summary' && 'Confirmar Reserva'}
                          {bookingStep === 'success' && '¡Listo!'}
                      </h3>
                      <button onClick={closeBooking} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                          <X size={20} className="text-gray-500 dark:text-gray-300" />
                      </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6">
                      {bookingStep === 'datetime' && (
                          <div className="space-y-6">
                              <div>
                                  <label className="text-sm font-semibold text-gray-500 mb-3 block">Días disponibles</label>
                                  <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                                      {['Hoy', 'Mañana', 'Lun 12', 'Mar 13', 'Mié 14'].map((day, idx) => (
                                          <button 
                                              key={day}
                                              onClick={() => setSelectedDate(day)}
                                              className={`flex flex-col items-center justify-center min-w-[70px] h-20 rounded-xl border-2 transition-all ${selectedDate === day ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 hover:border-gray-200'}`}
                                          >
                                              <span className="text-xs font-bold">{day.split(' ')[0]}</span>
                                              <span className="text-lg font-bold">{idx + 10}</span>
                                          </button>
                                      ))}
                                  </div>
                              </div>
                              <div>
                                  <label className="text-sm font-semibold text-gray-500 mb-3 block">Horarios</label>
                                  <div className="grid grid-cols-3 gap-3">
                                      {['09:00', '10:00', '11:30', '13:00', '15:00', '16:30'].map(time => (
                                          <button
                                              key={time}
                                              onClick={() => setSelectedTime(time)}
                                              className={`py-2 px-4 rounded-lg text-sm font-semibold border transition-all ${selectedTime === time ? 'bg-brand-600 text-white border-brand-600' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'}`}
                                          >
                                              {time}
                                          </button>
                                      ))}
                                  </div>
                              </div>
                              
                              <button 
                                  disabled={!selectedDate || !selectedTime}
                                  onClick={() => setBookingStep('summary')}
                                  className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-200 dark:shadow-none hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed mt-4 transition-all"
                              >
                                  Continuar
                              </button>
                          </div>
                      )}

                      {bookingStep === 'summary' && (
                          <div className="space-y-6">
                              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl flex gap-4 items-center">
                                  <img src={selectedProvider.imageUrl} className="w-16 h-16 rounded-lg object-cover" alt="Provider" />
                                  <div>
                                      <h4 className="font-bold text-gray-900 dark:text-white">{selectedProvider.name}</h4>
                                      <div className="flex text-sm text-gray-500 dark:text-gray-400 gap-2 mt-1">
                                          <span className="flex items-center"><Calendar size={14} className="mr-1"/> {selectedDate}</span>
                                          <span className="flex items-center"><Clock size={14} className="mr-1"/> {selectedTime}</span>
                                      </div>
                                  </div>
                              </div>

                              <div>
                                  <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-3">Servicios seleccionados</h4>
                                  <div className="space-y-2">
                                      {cart.map(item => (
                                          <div key={item.id} className="flex justify-between text-sm">
                                              <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
                                              <span className="font-semibold text-gray-900 dark:text-white">${item.price.toFixed(2)}</span>
                                          </div>
                                      ))}
                                      <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2 flex justify-between font-bold text-lg">
                                          <span className="text-gray-900 dark:text-white">Total</span>
                                          <span className="text-brand-600 dark:text-brand-500">${cartTotal.toFixed(2)}</span>
                                      </div>
                                  </div>
                              </div>

                              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg flex items-start gap-2">
                                  <Icons.Info size={18} className="text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
                                  <p className="text-xs text-yellow-800 dark:text-yellow-300">
                                      El pago se realiza directamente al proveedor al finalizar el servicio. La cancelación es gratuita hasta 2h antes.
                                  </p>
                              </div>

                              <button 
                                  onClick={confirmBooking}
                                  className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-200 dark:shadow-none hover:bg-brand-700 transition-all flex justify-between items-center px-6"
                              >
                                  <span>Confirmar Reserva</span>
                                  <ArrowRight size={20} />
                              </button>
                          </div>
                      )}

                      {bookingStep === 'success' && (
                          <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in duration-300">
                              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                                  <CheckCircle2 size={48} className="text-green-600 dark:text-green-400" />
                              </div>
                              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">¡Reserva Confirmada!</h2>
                              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs">
                                  Tu héroe ha sido notificado. Puedes ver los detalles en la sección "Mis Pedidos".
                              </p>
                              <button 
                                  onClick={closeBooking}
                                  className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-4 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
                              >
                                  Volver al inicio
                              </button>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      );
  };

  const renderNotifications = () => {
    return (
      <div className="fixed inset-0 z-[60] bg-white dark:bg-gray-900 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="bg-white dark:bg-gray-900 px-4 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 shadow-sm z-10 transition-colors duration-300">
          <div className="flex items-center">
            <button onClick={() => setIsNotificationsOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full mr-2">
              <ChevronLeft size={24} className="text-gray-700 dark:text-gray-200" />
            </button>
            <h1 className="font-bold text-lg text-gray-800 dark:text-white">Notificaciones</h1>
          </div>
          {notifications.some(n => !n.read) && (
             <button onClick={markAllRead} className="text-brand-600 dark:text-brand-500 text-sm font-medium flex items-center hover:bg-brand-50 dark:hover:bg-brand-900/20 px-2 py-1 rounded-md">
                <CheckCheck size={16} className="mr-1"/> Marcar leídas
             </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 flex gap-2">
           {['all', 'order', 'promo'].map((t) => (
             <button 
                key={t}
                onClick={() => setNotifFilter(t as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${notifFilter === t ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700'}`}
             >
                {t === 'all' ? 'Todas' : t === 'order' ? 'Pedidos' : 'Promos'}
             </button>
           ))}
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-4 space-y-3">
           {filteredNotifications.length > 0 ? (
             filteredNotifications.map((notif) => {
               // Icon logic based on type
               let Icon = Icons.Info;
               let colorClass = "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
               if (notif.type === 'order') { Icon = Icons.Truck; colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"; }
               if (notif.type === 'promo') { Icon = Icons.Tag; colorClass="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"; }
               if (notif.type === 'payment') { Icon = Icons.CreditCard; colorClass="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"; }
               if (notif.type === 'system') { Icon = Icons.Shield; colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"; }

               return (
                 <div key={notif.id} className={`relative bg-white dark:bg-gray-900 p-4 rounded-xl border ${notif.read ? 'border-gray-100 dark:border-gray-800' : 'border-l-4 border-l-brand-500 border-y-brand-100 border-r-brand-100 dark:border-y-brand-900 dark:border-r-brand-900 shadow-sm'} transition-all`}>
                    <div className="flex gap-3">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
                          <Icon size={20} />
                       </div>
                       <div className="flex-1">
                          <div className="flex justify-between items-start">
                             <h4 className={`text-sm font-bold ${notif.read ? 'text-gray-800 dark:text-gray-200' : 'text-gray-900 dark:text-white'}`}>{notif.title}</h4>
                             <span className="text-[10px] text-gray-400">{notif.time}</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{notif.message}</p>
                       </div>
                    </div>
                    {/* Delete Action */}
                    <button 
                      onClick={() => deleteNotification(notif.id)}
                      className="absolute bottom-2 right-2 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                 </div>
               );
             })
           ) : (
             <div className="flex flex-col items-center justify-center h-64 opacity-50">
                <Bell size={48} className="text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">No hay notificaciones</p>
                <p className="text-xs text-gray-400">Te avisaremos cuando suceda algo.</p>
             </div>
           )}
        </div>
      </div>
    );
  };

  const renderLocationSelector = () => (
    <div className="fixed inset-0 z-[60] bg-white dark:bg-gray-900 flex flex-col animate-in slide-in-from-bottom duration-300">
      {/* Search Header */}
      <div className="bg-white dark:bg-gray-900 p-4 shadow-sm z-10 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800">
        <button onClick={() => setIsLocationOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
          <X size={24} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center px-3 py-2">
          <Search size={16} className="text-gray-400 mr-2" />
          <input 
            type="text" 
            value={tempAddress}
            onChange={(e) => setTempAddress(e.target.value)}
            className="bg-transparent w-full text-sm outline-none text-gray-800 dark:text-white placeholder-gray-400"
            placeholder="Buscar calle, número..."
          />
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-gray-200 dark:bg-gray-800">
        {/* Real Map Iframe */}
        <iframe 
          width="100%" 
          height="100%" 
          frameBorder="0" 
          scrolling="no" 
          marginHeight={0} 
          marginWidth={0} 
          src="https://www.openstreetmap.org/export/embed.html?bbox=-99.18129920959474%2C19.41879038753239%2C-99.15280342102052%2C19.442805903937175&amp;layer=mapnik" 
          style={{border: 0}}
          title="Ubicación"
          className="" // We keep map as is, dark mode maps usually require a different provider tile layer
        ></iframe>
        
        {/* Center Pin */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-8 flex flex-col items-center pointer-events-none">
          <div className="relative">
            <MapPin size={48} className="text-brand-600 drop-shadow-md" fill="currentColor" />
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-1.5 bg-black/20 rounded-full blur-[2px]"></div>
          </div>
        </div>

        {/* Locate Me Button */}
        <button 
          onClick={() => setTempAddress(locationTarget === 'user' ? "Ubicación actual detectada" : "Ubicación del Negocio detectada")}
          className="absolute bottom-10 right-6 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg text-gray-700 dark:text-white active:scale-95 transition-transform z-20"
        >
          <Target size={24} />
        </button>
      </div>

      {/* Bottom Sheet */}
      <div className="bg-white dark:bg-gray-900 p-6 pb-12 rounded-t-3xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] -mt-6 z-10 relative border-t border-gray-100 dark:border-gray-800">
        <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-6 opacity-60"></div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
            {locationTarget === 'user' ? 'Confirmar dirección de entrega' : 'Confirmar ubicación del negocio'}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Mueve el mapa para ajustar el pin en la entrada exacta.</p>
        
        <div className="flex items-start gap-3 mb-6 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
          <MapPin className="text-brand-600 shrink-0 mt-1" size={20} />
          <div>
            <p className="font-semibold text-gray-800 dark:text-white text-sm">{tempAddress || "Seleccionando en el mapa..."}</p>
            <p className="text-xs text-gray-400">Ciudad de México, MX</p>
          </div>
        </div>

        <button 
          onClick={confirmLocation}
          className="w-full bg-brand-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-200 dark:shadow-none hover:bg-brand-700 transition-colors"
        >
          Confirmar dirección
        </button>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="fixed inset-0 z-[60] bg-gray-50 dark:bg-gray-950 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 px-4 py-3 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 shadow-sm z-10">
        <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
          <ChevronLeft size={24} className="text-gray-700 dark:text-gray-200" />
        </button>
        <h1 className="font-bold text-lg text-gray-800 dark:text-white">Configuración</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Profile Edit Quick Link */}
        <div className="flex items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
           <div className="w-12 h-12 bg-brand-50 dark:bg-brand-900/20 rounded-full flex items-center justify-center text-brand-600 dark:text-brand-400">
              <UserCircle size={24} />
           </div>
           <div className="flex-1">
             <h3 className="font-bold text-gray-900 dark:text-white">Usuario Demo</h3>
             <p className="text-xs text-gray-500">usuario@ejemplo.com</p>
           </div>
           <button className="text-sm font-semibold text-brand-600 dark:text-brand-500">Editar</button>
        </div>

        {/* Group: Preferencias */}
        <div>
           <h3 className="text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Preferencias de App</h3>
           <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
               <div className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                     <Globe size={20} className="text-gray-400" />
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Idioma</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                     Español <ChevronRight size={16} />
                  </div>
               </div>
               <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                     {darkMode ? <Moon size={20} className="text-gray-400"/> : <Sun size={20} className="text-gray-400"/>}
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Modo Oscuro</span>
                  </div>
                  {/* Custom Toggle Switch */}
                  <div 
                    onClick={toggleDarkMode}
                    className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${darkMode ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${darkMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </div>
               </div>
           </div>
        </div>

        {/* Group: Notificaciones */}
        <div>
           <h3 className="text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Notificaciones</h3>
           <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
               <div className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                     <Bell size={20} className="text-gray-400" />
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Push Notificaciones</span>
                  </div>
                  <div 
                    onClick={() => toggleSetting('pushNotifications')}
                    className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${settings.pushNotifications ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${settings.pushNotifications ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </div>
               </div>
               <div className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                     <Mail size={20} className="text-gray-400" />
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Correos Promocionales</span>
                  </div>
                  <div 
                    onClick={() => toggleSetting('emailNotifications')}
                    className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${settings.emailNotifications ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${settings.emailNotifications ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </div>
               </div>
               <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                     <MessageCircle size={20} className="text-gray-400" />
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Actualizaciones por WhatsApp</span>
                  </div>
                  <div 
                    onClick={() => toggleSetting('whatsappUpdates')}
                    className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${settings.whatsappUpdates ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${settings.whatsappUpdates ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </div>
               </div>
           </div>
        </div>

        {/* Group: Privacidad y Datos */}
        <div>
           <h3 className="text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Privacidad y Seguridad</h3>
           <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
               <div className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                     <MapPin size={20} className="text-gray-400" />
                     <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Ubicación Precisa</p>
                        <p className="text-[10px] text-gray-400">Para encontrar proveedores cercanos</p>
                     </div>
                  </div>
                  <div 
                    onClick={() => toggleSetting('locationPrecise')}
                    className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${settings.locationPrecise ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${settings.locationPrecise ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </div>
               </div>
               
               <div className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-3">
                     <Lock size={20} className="text-gray-400" />
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Cambiar Contraseña</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
               </div>

               <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-3">
                     <Shield size={20} className="text-gray-400" />
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Autenticación en 2 Pasos</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
               </div>
           </div>
        </div>

        {/* Group: Legal */}
        <div>
           <h3 className="text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Legal</h3>
           <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
               <div className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-800 cursor-pointer">
                  <div className="flex items-center gap-3">
                     <FileText size={20} className="text-gray-400" />
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Términos y Condiciones</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
               </div>
               <div className="flex items-center justify-between p-4 cursor-pointer">
                  <div className="flex items-center gap-3">
                     <ShieldCheck size={20} className="text-gray-400" />
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Política de Privacidad</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
               </div>
           </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-8">
           <button className="w-full bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-bold py-3 rounded-xl border border-red-100 dark:border-red-900/30 flex justify-center items-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
              <Trash2 size={18} /> Eliminar mi cuenta
           </button>
           <p className="text-center text-[10px] text-gray-400 mt-2">
              Esta acción es permanente y no se puede deshacer.
           </p>
        </div>

      </div>
    </div>
  );

  const renderHome = () => (
    <div className="pb-24 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 sticky top-0 z-30 px-4 py-3 shadow-sm border-b border-gray-100 dark:border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col cursor-pointer" onClick={() => openLocationMap('user')}>
            <span className="text-xs text-gray-400 font-medium">Ubicación actual</span>
            <div className="flex items-center text-brand-600 font-bold text-sm">
              <MapPin size={14} className="mr-1" />
              <span className="truncate max-w-[200px]">{currentAddress}</span>
              <Icons.ChevronDown size={14} className="ml-1" />
            </div>
          </div>
          <button 
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-500 rounded-full border border-white dark:border-gray-900 animate-pulse"></span>
            )}
          </button>
        </div>

        {/* Search Bar Trigger */}
        <div className="relative" onClick={() => setCurrentTab('search')}>
          <div className="w-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm rounded-lg pl-10 pr-4 py-3 cursor-pointer">
            ¿Qué servicio buscas hoy?
          </div>
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <button className="absolute right-3 top-3 text-gray-400">
            <Filter size={18} />
          </button>
        </div>
      </header>

      {/* Categories Rail */}
      <div className="mt-4 px-4">
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {CATEGORIES.map((cat) => {
            const Icon = (Icons as any)[cat.icon] || Icons.HelpCircle;
            const isSelected = selectedCategory === cat.id;
            // Dark mode adjustment for categories: keep colors but soften them or use specific logic
            return (
              <button 
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`flex flex-col items-center flex-shrink-0 space-y-2 group`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200 ${isSelected ? 'bg-brand-600 text-white shadow-md scale-105' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 shadow-sm border border-gray-100 dark:border-gray-700'}`}>
                  <Icon size={28} />
                </div>
                <span className={`text-xs font-medium ${isSelected ? 'text-brand-600' : 'text-gray-500 dark:text-gray-400'}`}>{cat.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Subcategories Chips (Interactive Filtering) */}
      {selectedCategory !== 'all' && (
        <div className="mt-2 px-4 flex gap-2 overflow-x-auto no-scrollbar">
           <button 
              onClick={() => setSelectedSubcategory('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${selectedSubcategory === 'all' ? 'bg-brand-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}
           >
              Todos
           </button>
           {CATEGORIES.find(c => c.id === selectedCategory)?.subcategories?.map(sub => {
              const isActive = selectedSubcategory === sub;
              return (
                <button 
                  key={sub} 
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${isActive ? 'bg-brand-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}
                >
                  {sub}
                </button>
              );
           })}
        </div>
      )}

      {/* Hero Promos Carousel */}
      {selectedCategory === 'all' && !searchQuery && (
        <div className="mt-6 pl-4">
          <div className="flex gap-4 overflow-x-auto no-scrollbar pr-4 pb-2 snap-x">
            {PROMOS.map((promo) => {
              const Icon = (Icons as any)[promo.icon] || Icons.Star;
              return (
                <div key={promo.id} className={`snap-center flex-shrink-0 w-72 h-36 rounded-2xl bg-gradient-to-r ${promo.color} p-4 text-white flex justify-between items-center shadow-lg relative overflow-hidden`}>
                  <div className="relative z-10 flex flex-col h-full justify-between items-start">
                    <div>
                      <h3 className="font-bold text-xl">{promo.title}</h3>
                      <p className="text-xs text-white/90 font-medium">{promo.subtitle}</p>
                    </div>
                    <button className="bg-white text-gray-900 text-xs font-bold px-4 py-2 rounded-full shadow-sm">
                      {promo.btnText}
                    </button>
                  </div>
                  <Icon size={80} className="text-white opacity-20 absolute -right-4 -bottom-4 rotate-12" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Flash Deals Section */}
      {selectedCategory === 'all' && !searchQuery && (
        <div className="mt-8 px-4">
           <div className="flex items-center gap-2 mb-3">
             <div className="bg-red-500 p-1 rounded-md">
               <Icons.Zap size={14} className="text-white fill-current"/>
             </div>
             <h2 className="font-bold text-gray-800 dark:text-white text-lg">Ofertas Flash</h2>
             <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-500 dark:text-gray-400">02:15:30</span>
           </div>
           <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
             {FLASH_DEALS.map(deal => (
               <div key={deal.id} className="w-32 flex-shrink-0 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                 <div className="h-24 bg-gray-100 dark:bg-gray-700 relative">
                   <img src={deal.image} alt={deal.title} className="w-full h-full object-cover"/>
                   <span className="absolute bottom-0 right-0 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-tl-lg font-bold">
                     {deal.time}
                   </span>
                 </div>
                 <div className="p-2">
                   <h4 className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{deal.title}</h4>
                   <div className="flex items-center gap-2 mt-1">
                     <span className="text-sm font-bold text-brand-600 dark:text-brand-500">{deal.price}</span>
                     <span className="text-xs text-gray-400 line-through">{deal.oldPrice}</span>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      )}

      {/* Horizontal List: Top Rated */}
      {selectedCategory === 'all' && !searchQuery && (
        <div className="mt-8">
          <div className="px-4 flex justify-between items-end mb-3">
            <h2 className="font-bold text-gray-800 dark:text-white text-lg">Mejor calificados</h2>
            <span className="text-xs text-brand-600 font-semibold cursor-pointer">Ver todos</span>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 pb-4 snap-x">
            {topRatedProviders.map(provider => (
               <div key={`top-${provider.id}`} className="snap-start flex-shrink-0 w-64">
                 <ProviderCard provider={provider} onClick={() => handleProviderClick(provider)} />
               </div>
            ))}
          </div>
        </div>
      )}

      {/* Horizontal List: Home Services */}
      {selectedCategory === 'all' && !searchQuery && (
        <div className="mt-4">
          <div className="px-4 flex justify-between items-end mb-3">
            <h2 className="font-bold text-gray-800 dark:text-white text-lg">Soluciones para tu Hogar</h2>
            <span className="text-xs text-brand-600 font-semibold cursor-pointer">Ver todos</span>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 pb-4 snap-x">
            {homeServiceProviders.map(provider => (
               <div key={`home-${provider.id}`} className="snap-start flex-shrink-0 w-64">
                 <ProviderCard provider={provider} onClick={() => handleProviderClick(provider)} />
               </div>
            ))}
          </div>
        </div>
      )}

      {/* Horizontal List: Near You */}
      {selectedCategory === 'all' && !searchQuery && (
        <div className="mt-4">
          <div className="px-4 flex justify-between items-end mb-3">
            <h2 className="font-bold text-gray-800 dark:text-white text-lg">Cerca de ti</h2>
            <span className="text-xs text-brand-600 font-semibold cursor-pointer">Ver todos</span>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 pb-4 snap-x">
            {nearProviders.map(provider => (
               <div key={`near-${provider.id}`} className="snap-start flex-shrink-0 w-64">
                 <ProviderCard provider={provider} onClick={() => handleProviderClick(provider)} />
               </div>
            ))}
          </div>
        </div>
      )}

      {/* NEW SECTION: New Arrivals (Recién Unidos) */}
      {selectedCategory === 'all' && !searchQuery && (
        <div className="mt-4">
          <div className="px-4 flex justify-between items-end mb-3">
             <div className="flex items-center gap-2">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-1 rounded-md">
                   <Sparkles size={14} className="text-purple-600 dark:text-purple-400"/>
                </div>
                <h2 className="font-bold text-gray-800 dark:text-white text-lg">Recién unidos</h2>
             </div>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 pb-4 snap-x">
            {newProviders.map(provider => (
               <div key={`new-${provider.id}`} className="snap-start flex-shrink-0 w-64">
                 <ProviderCard provider={provider} onClick={() => handleProviderClick(provider)} />
               </div>
            ))}
          </div>
        </div>
      )}

      {/* NEW SECTION: Verified Providers (Héroes Verificados) */}
      {selectedCategory === 'all' && !searchQuery && (
        <div className="mt-4">
          <div className="px-4 flex justify-between items-end mb-3">
             <div className="flex items-center gap-2">
                <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-md">
                   <BadgeCheck size={14} className="text-green-600 dark:text-green-400"/>
                </div>
                <h2 className="font-bold text-gray-800 dark:text-white text-lg">Héroes Verificados</h2>
             </div>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 pb-4 snap-x">
            {verifiedProviders.map(provider => (
               <div key={`verified-${provider.id}`} className="snap-start flex-shrink-0 w-64">
                 <ProviderCard provider={provider} onClick={() => handleProviderClick(provider)} />
               </div>
            ))}
          </div>
        </div>
      )}

      {/* Main List (Filtered or Recommended) */}
      <div className="mt-6 px-4">
        <div className="flex justify-between items-end mb-4">
          <h2 className="font-bold text-gray-800 dark:text-white text-lg">
            {selectedCategory === 'all' 
               ? 'Todos los profesionales' 
               : selectedSubcategory !== 'all' 
                 ? `${selectedSubcategory}`
                 : `Servicios de ${CATEGORIES.find(c => c.id === selectedCategory)?.name}`
            }
          </h2>
        </div>
        
        {filteredProviders.length > 0 ? (
          filteredProviders.map(provider => (
            <ProviderCard key={provider.id} provider={provider} onClick={() => handleProviderClick(provider)} />
          ))
        ) : (
          <div className="text-center py-10 text-gray-400">
            <p>No encontramos servicios con ese filtro.</p>
            <button onClick={() => {setSelectedCategory('all'); setSearchQuery('');}} className="text-brand-600 font-bold mt-2">Limpiar filtros</button>
          </div>
        )}
      </div>
    </div>
  );

  const renderSearch = () => {
    return (
      <div className="pb-24 pt-4 px-4 min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        {/* Active Search Header */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-3.5 text-brand-600" size={20} />
          <input 
            type="text" 
            autoFocus
            placeholder="¿Qué necesitas?" 
            className="w-full bg-gray-50 dark:bg-gray-800 border-0 p-3.5 pl-12 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-brand-500 font-medium text-gray-800 dark:text-white placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3.5 text-gray-400 p-1">
              <X size={16} />
            </button>
          )}
        </div>

        {!searchQuery ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             {/* Recent Searches */}
             <div className="mb-8">
               <div className="flex justify-between items-center mb-3">
                 <h3 className="font-bold text-gray-800 dark:text-white text-base">Búsquedas recientes</h3>
                 <span className="text-xs text-brand-600 font-medium">Borrar</span>
               </div>
               <div className="space-y-3">
                 {RECENT_SEARCHES.map((term, i) => (
                   <div key={i} className="flex items-center text-gray-600 dark:text-gray-300 active:bg-gray-50 dark:active:bg-gray-800 p-2 -mx-2 rounded-lg cursor-pointer" onClick={() => setSearchQuery(term)}>
                     <Clock3 size={18} className="mr-3 text-gray-400" />
                     <span className="text-sm flex-1">{term}</span>
                     <ChevronRight size={16} className="text-gray-300 dark:text-gray-600" />
                   </div>
                 ))}
               </div>
             </div>

             {/* Explore Categories Grid */}
             <div className="mb-8">
               <h3 className="font-bold text-gray-800 dark:text-white text-base mb-4">Explorar por categoría</h3>
               <div className="grid grid-cols-2 gap-3">
                 {CATEGORIES.filter(c => c.id !== 'all').map(cat => {
                   const Icon = (Icons as any)[cat.icon] || Icons.Circle;
                   return (
                     <div key={cat.id} onClick={() => {handleCategorySelect(cat.id);}} className={`${cat.color.replace('text-', 'bg-opacity-20 ')} rounded-xl p-4 flex items-center justify-between cursor-pointer active:scale-95 transition-transform`}>
                        <span className="font-semibold text-gray-800 text-sm">{cat.name}</span>
                        <div className={`p-2 bg-white rounded-lg shadow-sm ${cat.color.split(' ')[1]}`}>
                           <Icon size={18} />
                        </div>
                     </div>
                   )
                 })}
               </div>
             </div>

             {/* Popular Tags */}
             <div>
               <h3 className="font-bold text-gray-800 dark:text-white text-base mb-3 flex items-center gap-2">
                 <TrendingUp size={18} className="text-brand-600" />
                 Tendencias hoy
               </h3>
               <div className="flex flex-wrap gap-2">
                 {POPULAR_TAGS.map(tag => (
                   <span key={tag} onClick={() => setSearchQuery(tag)} className="px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm rounded-lg border border-gray-100 dark:border-gray-700 font-medium active:bg-brand-50 dark:active:bg-brand-900 active:text-brand-600 cursor-pointer transition-colors">
                     {tag}
                   </span>
                 ))}
               </div>
             </div>
          </div>
        ) : (
          <div className="space-y-4">
             <p className="text-sm text-gray-500 mb-4">Resultados para "{searchQuery}"</p>
             {filteredProviders.length > 0 ? (
                filteredProviders.map(provider => (
                  <ProviderCard key={provider.id} provider={provider} onClick={() => handleProviderClick(provider)} />
                ))
             ) : (
                <div className="flex flex-col items-center justify-center py-10 opacity-70">
                   <Search size={48} className="text-gray-300 mb-4" />
                   <p className="text-gray-500 font-medium">No encontramos resultados</p>
                   <p className="text-sm text-gray-400">Intenta con "Plomero" o "Limpieza"</p>
                </div>
             )}
          </div>
        )}
      </div>
    );
  };

  const renderProfile = () => {
    const menuItems = [
      { icon: History, label: 'Mis pedidos', subtitle: 'En curso y finalizados' },
      { icon: Heart, label: 'Favoritos', subtitle: 'Tus expertos guardados' },
      { icon: Wallet, label: 'Billetera', subtitle: 'Métodos de pago' },
      { icon: MapPin, label: 'Direcciones', subtitle: 'Casa, Oficina' },
      { icon: HelpCircle, label: 'Ayuda', subtitle: 'Soporte y preguntas frecuentes' },
      { icon: Settings, label: 'Configuración', subtitle: 'Notificaciones, Privacidad', action: () => setIsSettingsOpen(true) },
    ];

    return (
      <div className="pb-24 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
        {/* Header Profile */}
        <div className="bg-white dark:bg-gray-900 p-6 pt-12 pb-8 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
             <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden border-2 border-brand-100 dark:border-gray-700 p-1">
               <img src="https://picsum.photos/200" alt="Avatar" className="w-full h-full rounded-full object-cover" />
             </div>
             <div className="flex-1">
               <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Usuario Demo</h1>
               <p className="text-gray-500 dark:text-gray-400 text-sm">usuario@ejemplo.com</p>
               <div className="mt-2 inline-flex items-center px-2 py-1 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold rounded-md">
                 <Star size={12} className="mr-1 fill-current" /> 4.9 Usuario Top
               </div>
             </div>
             
             {/* Dark Mode Toggle in Header */}
             <button 
                onClick={toggleDarkMode}
                className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
             >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-4">
           {/* My Businesses Section */}
           {myBusinesses.length > 0 && (
             <div className="space-y-2">
                 <div className="flex justify-between items-center px-1">
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase">Mis Negocios</h3>
                    <button 
                        onClick={startNewBusiness}
                        className="text-xs bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 px-2 py-1 rounded-full font-bold flex items-center"
                    >
                        <Plus size={12} className="mr-1"/> Agregar nuevo
                    </button>
                 </div>
                 {myBusinesses.map(business => (
                     <div 
                        key={business.id}
                        onClick={() => openDashboard(business)}
                        className="bg-gray-900 dark:bg-gray-800 rounded-2xl p-4 flex items-center justify-between text-white shadow-lg cursor-pointer transform active:scale-[0.98] transition-all border border-transparent dark:border-gray-700"
                        >
                        <div className="flex items-center gap-4">
                            <div className="bg-green-500 p-2.5 rounded-xl text-white">
                                <Store size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">{business.name}</h3>
                                <p className="text-xs text-gray-400">Administrar</p>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-gray-400" />
                     </div>
                 ))}
             </div>
           )}
           
           {/* If no businesses, show CTA to create the first one */}
           {myBusinesses.length === 0 && (
             <div 
               onClick={startNewBusiness}
               className="bg-brand-600 dark:bg-gray-800 rounded-2xl p-4 flex items-center justify-between text-white shadow-lg cursor-pointer transform active:scale-[0.98] transition-all border border-transparent dark:border-gray-700"
             >
               <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-2.5 rounded-xl text-white">
                    <Briefcase size={22} />
                  </div>
                  <div>
                     <h3 className="font-bold text-sm">Publicar Negocio</h3>
                     <p className="text-xs text-gray-100 dark:text-gray-400">Ofrece tus servicios aquí</p>
                  </div>
               </div>
               <ChevronRight size={20} className="text-gray-100" />
             </div>
           )}

           <div className="border-t border-gray-100 dark:border-gray-800 my-2"></div>

           {/* Section 1 */}
           <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              {menuItems.slice(0, 4).map((item, idx) => (
                <div key={item.label} className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${idx !== 3 ? 'border-b border-gray-50 dark:border-gray-800' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 flex items-center justify-center mr-4">
                    <item.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">{item.label}</h4>
                    <p className="text-xs text-gray-400">{item.subtitle}</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 dark:text-gray-600" />
                </div>
              ))}
           </div>

           {/* Section 2 */}
           <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              {menuItems.slice(4).map((item, idx) => (
                <div 
                    key={item.label} 
                    onClick={item.action}
                    className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${idx !== 1 ? 'border-b border-gray-50 dark:border-gray-800' : ''}`}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center justify-center mr-4">
                    <item.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">{item.label}</h4>
                    <p className="text-xs text-gray-400">{item.subtitle}</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 dark:text-gray-600" />
                </div>
              ))}
           </div>

           {/* Logout */}
           <button onClick={() => setIsLoggedIn(false)} className="w-full bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/30 flex items-center justify-center text-red-500 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <LogOut size={20} className="mr-2" />
              Cerrar sesión
           </button>

           <p className="text-center text-xs text-gray-400 py-4">Hero Be Here v1.0.3</p>
        </div>
      </div>
    );
  };

  const renderDetail = () => {
    if (!selectedProvider) return null;
    return (
      <div className="bg-white dark:bg-gray-900 min-h-screen pb-28 animate-in slide-in-from-right duration-200 transition-colors duration-300">
        {/* Detail Header Image */}
        <div className="relative h-64 w-full">
          <img src={selectedProvider.imageUrl} className="w-full h-full object-cover" alt="Cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <button 
            onClick={handleBack}
            className="absolute top-4 left-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30"
          >
            <ChevronLeft size={24} />
          </button>
          <button className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30">
            <Heart size={24} />
          </button>
        </div>

        <div className="px-5 -mt-8 relative z-10">
          <div className="bg-white dark:bg-gray-900 rounded-t-3xl p-6 shadow-sm border-b border-gray-100 dark:border-gray-800 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedProvider.name}</h1>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1 space-x-2">
                   {selectedProvider.verified && (
                     <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-[10px] font-bold flex items-center">
                       <ShieldCheck size={12} className="mr-1" /> VERIFICADO
                     </span>
                   )}
                   <span>• {CATEGORIES.find(c => c.id === selectedProvider.categoryId)?.name}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-lg">
                  <Star size={16} className="text-yellow-400 fill-current" />
                  <span className="ml-1 font-bold text-gray-800 dark:text-white">{selectedProvider.rating}</span>
                </div>
                <span className="text-xs text-gray-400 mt-1">{selectedProvider.reviewCount} reseñas</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between py-4 border-t border-b border-gray-100 dark:border-gray-800">
               <div className="flex items-center space-x-3">
                 <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-brand-600 dark:text-brand-400 rounded-full">
                   <Clock size={20} />
                 </div>
                 <div>
                   <p className="text-xs text-gray-400">Disponibilidad</p>
                   <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{selectedProvider.availability}</p>
                 </div>
               </div>
               <div className="flex items-center space-x-3">
                 <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-brand-600 dark:text-brand-400 rounded-full">
                   <MapPin size={20} />
                 </div>
                 <div>
                   <p className="text-xs text-gray-400">Distancia</p>
                   <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{selectedProvider.distance}</p>
                 </div>
               </div>
            </div>

            <div className="mt-4 flex gap-3">
                <button 
                    onClick={handleWhatsApp}
                    className="flex-1 bg-green-500 text-white font-bold py-3 rounded-xl shadow-sm hover:bg-green-600 transition-colors flex justify-center items-center gap-2"
                >
                    <MessageCircle size={20} /> Contactar
                </button>
                <button className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white font-bold py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    Ver perfil completo
                </button>
            </div>

            <div className="mt-6">
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">Sobre el experto</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                {selectedProvider.description}
              </p>
            </div>

            {/* Employee/Team Section (Only if available) */}
            {selectedProvider.employees && selectedProvider.employees.length > 0 && (
                <div className="mt-8">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-3">Equipo</h3>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                        {selectedProvider.employees.map(emp => (
                            <div key={emp.id} className="flex flex-col items-center min-w-[80px]">
                                <img src={emp.avatar} alt={emp.name} className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm" />
                                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-1 text-center truncate w-full">{emp.name}</span>
                                <span className="text-[10px] text-gray-500 dark:text-gray-400">{emp.role}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 mt-2 pb-32 transition-colors">
            <h3 className="font-bold text-gray-800 dark:text-white mb-4 text-lg">Servicios</h3>
            <div className="space-y-4">
              {selectedProvider.services.map(service => {
                const isSelected = cart.some(item => item.id === service.id);
                return (
                  <div 
                    key={service.id} 
                    onClick={() => toggleCartItem(service)}
                    className={`flex justify-between items-center p-4 border rounded-xl transition-all cursor-pointer bg-gray-50/50 dark:bg-gray-800/50 ${isSelected ? 'border-brand-500 ring-1 ring-brand-500 bg-brand-50/30 dark:bg-brand-900/10' : 'border-gray-100 dark:border-gray-800 hover:border-gray-300'}`}
                  >
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200">{service.name}</h4>
                      <p className="text-xs text-gray-400 mt-1 flex items-center">
                        <Clock size={12} className="mr-1" /> {service.duration}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-brand-600 dark:text-brand-400 text-lg">${service.price}</span>
                      <div className={`mt-2 w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-brand-500 border-brand-500' : 'border-gray-300 dark:border-gray-600'}`}>
                          {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Floating Action Button for Booking */}
        {cart.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-4 pb-8 z-50 transition-colors animate-in slide-in-from-bottom duration-300">
                <div className="flex justify-between items-center mb-2 px-2">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{cart.length} servicio(s) seleccionado(s)</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total: ${cartTotal.toFixed(2)}</span>
                </div>
                <button 
                    onClick={openBookingModal}
                    className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-200 dark:shadow-none hover:bg-brand-700 transition-colors flex justify-between px-6 items-center"
                >
                    <span>Reservar ahora</span>
                    <ChevronRight />
                </button>
            </div>
        )}
      </div>
    );
  };

  // Main Render Logic
  
  if (showSplash) {
    return renderSplash();
  }

  if (!isLoggedIn) {
    return renderLogin();
  }

  if (dashboardBusiness) {
      return renderProviderDashboard();
  }

  if (isProviderMode) {
    return renderProviderRegistration();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* Modals */}
      {isLocationOpen && renderLocationSelector()}
      {isNotificationsOpen && renderNotifications()}
      {isBookingOpen && renderBookingModal()}
      {isSettingsOpen && renderSettings()}

      {/* View Router */}
      {selectedProvider ? (
        renderDetail()
      ) : (
        <>
          {currentTab === 'home' && renderHome()}
          {currentTab === 'search' && renderSearch()}
          {currentTab === 'ai' && (
             <div className="h-screen flex flex-col pb-20 pt-safe bg-white dark:bg-gray-900 transition-colors duration-300">
               <div className="p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                 <h1 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                   <Icons.Sparkles className="text-brand-500" fill="currentColor" /> 
                   Asistente Hero
                 </h1>
                 <p className="text-xs text-gray-500 dark:text-gray-400">Impulsado por Gemini</p>
               </div>
               <div className="flex-1 overflow-hidden">
                 <AIChat onRecommendCategory={handleCategoryFromAI} />
               </div>
             </div>
          )}
          {currentTab === 'profile' && renderProfile()}
          
          <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
        </>
      )}
    </div>
  );
};

export default App;
