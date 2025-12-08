
import { ServiceCategory, Provider, AppNotification } from './types';

export const CATEGORIES: ServiceCategory[] = [
  { id: 'all', name: 'Todos', icon: 'LayoutGrid', color: 'bg-gray-100 text-gray-700' },
  { 
    id: 'home', 
    name: 'Hogar', 
    icon: 'Home', 
    color: 'bg-blue-100 text-blue-700',
    subcategories: ['Plomería', 'Limpieza', 'Jardinería', 'Electricidad', 'Pintura', 'Mudanzas']
  },
  { 
    id: 'tech', 
    name: 'Técnico', 
    icon: 'Wrench', 
    color: 'bg-orange-100 text-orange-700',
    subcategories: ['Aire Acondicionado', 'Computadoras', 'Celulares', 'Electrodomésticos', 'Smart Home']
  },
  { 
    id: 'beauty', 
    name: 'Belleza', 
    icon: 'Sparkles', 
    color: 'bg-pink-100 text-pink-700',
    subcategories: ['Manicure', 'Pedicure', 'Corte de Pelo', 'Maquillaje', 'Masajes']
  },
  { 
    id: 'health', 
    name: 'Salud', 
    icon: 'HeartPulse', 
    color: 'bg-teal-100 text-teal-700',
    subcategories: ['Enfermería', 'Fisioterapia', 'Cuidador', 'Nutrición']
  },
  { 
    id: 'pet', 
    name: 'Mascotas', 
    icon: 'Dog', 
    color: 'bg-green-100 text-green-700',
    subcategories: ['Paseador', 'Baño y Corte', 'Veterinario', 'Entrenamiento']
  },
  { 
    id: 'educ', 
    name: 'Clases', 
    icon: 'BookOpen', 
    color: 'bg-purple-100 text-purple-700',
    subcategories: ['Idiomas', 'Matemáticas', 'Música', 'Entrenador Personal']
  },
  { 
    id: 'events', 
    name: 'Eventos', 
    icon: 'PartyPopper', 
    color: 'bg-indigo-100 text-indigo-700',
    subcategories: ['DJ', 'Decoración', 'Fotografía', 'Catering', 'Meseros']
  },
  { 
    id: 'auto', 
    name: 'Auto', 
    icon: 'Car', 
    color: 'bg-red-100 text-red-700',
    subcategories: ['Mecánica', 'Lavado', 'Grúa', 'Cerrajería']
  },
];

export const PROMOS = [
  {
    id: 1,
    title: "¡20% OFF!",
    subtitle: "En tu primera limpieza",
    color: "from-brand-600 to-brand-500",
    icon: "Sparkles",
    btnText: "Ver cupón"
  },
  {
    id: 2,
    title: "Electricidad Express",
    subtitle: "Llegamos en < 30 min",
    color: "from-blue-600 to-cyan-500",
    icon: "Zap",
    btnText: "Pedir ya"
  },
  {
    id: 3,
    title: "Spa en Casa",
    subtitle: "2x1 en Manicure",
    color: "from-pink-500 to-purple-500",
    icon: "Heart",
    btnText: "Reservar"
  }
];

export const FLASH_DEALS = [
  { id: 1, title: "Revisión AA", price: "$15", oldPrice: "$30", time: "Solo hoy", image: "https://picsum.photos/200/200?random=10" },
  { id: 2, title: "Corte Caballero", price: "$10", oldPrice: "$18", time: "2h rest.", image: "https://picsum.photos/200/200?random=11" },
  { id: 3, title: "Lavado Auto", price: "$12", oldPrice: "$20", time: "5 cupos", image: "https://picsum.photos/200/200?random=12" },
];

export const RECENT_SEARCHES = [
  "Plomero cerca", "Limpieza de sillones", "Instalación de TV"
];

export const POPULAR_TAGS = [
  "Manicure Gel", "Fugas de agua", "Clases de Inglés", "Paseo de perros", "Mecánico a domicilio", "Instalación de aire"
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 1,
    type: 'order',
    title: 'Tu experto está en camino',
    message: 'Juan Pérez llegará a tu ubicación en aproximadamente 10 minutos.',
    time: 'Hace 5 min',
    read: false
  },
  {
    id: 2,
    type: 'promo',
    title: '¡Vuelve a pedir!',
    message: 'Te extrañamos. Aquí tienes un cupón de $50 para tu próximo servicio de limpieza.',
    time: 'Hace 2 horas',
    read: false
  },
  {
    id: 3,
    type: 'system',
    title: 'Bienvenido a ServiGo',
    message: 'Gracias por registrarte. Completa tu perfil para obtener mejores recomendaciones.',
    time: 'Ayer',
    read: true
  },
  {
    id: 4,
    type: 'payment',
    title: 'Pago exitoso',
    message: 'Tu pago de $35.00 a ElectroFix ha sido procesado correctamente.',
    time: 'Ayer',
    read: true
  },
  {
    id: 5,
    type: 'order',
    title: 'Servicio finalizado',
    message: '¿Cómo estuvo tu servicio de ayer? Califícalo ahora.',
    time: 'Hace 2 días',
    read: true
  }
];

const DEFAULT_SCHEDULE = [
  { day: 'Lun', open: '09:00', close: '18:00', active: true },
  { day: 'Mar', open: '09:00', close: '18:00', active: true },
  { day: 'Mié', open: '09:00', close: '18:00', active: true },
  { day: 'Jue', open: '09:00', close: '18:00', active: true },
  { day: 'Vie', open: '09:00', close: '18:00', active: true },
  { day: 'Sáb', open: '10:00', close: '14:00', active: true },
  { day: 'Dom', open: '00:00', close: '00:00', active: false },
];

export const PROVIDERS: Provider[] = [
  {
    id: '1',
    name: 'Juan Pérez - Plomería Expert',
    categoryId: 'home',
    rating: 4.8,
    reviewCount: 124,
    imageUrl: 'https://picsum.photos/400/300?random=1',
    distance: '1.2 km',
    availability: 'Hoy 15:30',
    description: 'Especialista en fugas, instalaciones de baño y cocina. 10 años de experiencia garantizada.',
    verified: true,
    phoneNumber: '5512345678',
    services: [
      { id: 's1', name: 'Visita de diagnóstico', price: 15.00, duration: '30 min' },
      { id: 's2', name: 'Reparación de fuga simple', price: 45.00, duration: '1h' },
      { id: 's3', name: 'Instalación de grifería', price: 35.00, duration: '45 min' },
    ],
    employees: [
       { id: 'e1', name: 'Juan Pérez', role: 'Maestro Plomero', avatar: 'https://i.pravatar.cc/150?u=1' }
    ],
    schedule: DEFAULT_SCHEDULE
  },
  {
    id: '2',
    name: 'Glamour en Casa',
    categoryId: 'beauty',
    rating: 4.9,
    reviewCount: 89,
    imageUrl: 'https://picsum.photos/400/300?random=2',
    distance: '3.5 km',
    availability: 'Mañana 10:00',
    description: 'Manicure y pedicure spa en la comodidad de tu hogar. Utilizamos productos premium.',
    verified: true,
    phoneNumber: '5512345678',
    services: [
      { id: 'b1', name: 'Manicure Gel', price: 25.00, duration: '1h' },
      { id: 'b2', name: 'Pedicure Spa', price: 30.00, duration: '1h 15min' },
      { id: 'b3', name: 'Corte y Peinado', price: 40.00, duration: '1h' },
    ],
    employees: [
       { id: 'e1', name: 'María López', role: 'Estilista', avatar: 'https://i.pravatar.cc/150?u=2' },
       { id: 'e2', name: 'Carla Ruiz', role: 'Manicurista', avatar: 'https://i.pravatar.cc/150?u=3' }
    ],
    schedule: DEFAULT_SCHEDULE
  },
  {
    id: '3',
    name: 'ElectroFix 24/7',
    categoryId: 'tech',
    rating: 4.6,
    reviewCount: 210,
    imageUrl: 'https://picsum.photos/400/300?random=3',
    distance: '0.8 km',
    availability: 'En 30 min',
    description: 'Electricistas certificados para emergencias y mantenimiento. Solucionamos cortos circuitos.',
    verified: true,
    phoneNumber: '5512345678',
    services: [
      { id: 'e1', name: 'Revisión eléctrica', price: 20.00, duration: '45 min' },
      { id: 'e2', name: 'Instalación de luminaria', price: 15.00, duration: '30 min/u' },
      { id: 'e3', name: 'Cambio de cableado', price: 100.00, duration: '3h' },
    ],
    employees: [],
    schedule: DEFAULT_SCHEDULE
  },
  {
    id: '4',
    name: 'DogWalker Pro',
    categoryId: 'pet',
    rating: 5.0,
    reviewCount: 45,
    imageUrl: 'https://picsum.photos/400/300?random=4',
    distance: '2.0 km',
    availability: 'Hoy 17:00',
    description: 'Paseos divertidos y seguros para tu mascota. Incluye fotos y reporte de ruta GPS.',
    verified: false,
    phoneNumber: '5512345678',
    services: [
      { id: 'p1', name: 'Paseo 30 min', price: 8.00, duration: '30 min' },
      { id: 'p2', name: 'Paseo 1 hora', price: 14.00, duration: '1h' },
      { id: 'p3', name: 'Cuidado de día', price: 25.00, duration: '4h' },
    ],
    employees: [],
    schedule: DEFAULT_SCHEDULE
  },
  {
    id: '5',
    name: 'CleanMaster',
    categoryId: 'home',
    rating: 4.7,
    reviewCount: 340,
    imageUrl: 'https://picsum.photos/400/300?random=5',
    distance: '5.0 km',
    availability: 'Mañana 08:00',
    description: 'Limpieza profunda de hogares y oficinas. Traemos nuestros propios insumos.',
    verified: true,
    phoneNumber: '5512345678',
    services: [
      { id: 'c1', name: 'Limpieza Express (2h)', price: 35.00, duration: '2h' },
      { id: 'c2', name: 'Limpieza Profunda (4h)', price: 65.00, duration: '4h' },
      { id: 'c3', name: 'Lavado de Alfombras', price: 40.00, duration: '1h 30m' },
    ],
    employees: [],
    schedule: DEFAULT_SCHEDULE
  },
  {
    id: '6',
    name: 'Profe Matemáticas',
    categoryId: 'educ',
    rating: 4.9,
    reviewCount: 22,
    imageUrl: 'https://picsum.photos/400/300?random=6',
    distance: 'Online',
    availability: 'Hoy 18:00',
    description: 'Clases de regularización para primaria y secundaria. Paciencia y métodos divertidos.',
    verified: true,
    phoneNumber: '5512345678',
    services: [
      { id: 'ed1', name: 'Clase Virtual 1h', price: 12.00, duration: '1h' },
      { id: 'ed2', name: 'Clase Presencial', price: 18.00, duration: '1h' },
    ],
    employees: [],
    schedule: DEFAULT_SCHEDULE
  },
  {
    id: '7',
    name: 'Jardinería Zen',
    categoryId: 'home',
    rating: 4.5,
    reviewCount: 56,
    imageUrl: 'https://picsum.photos/400/300?random=7',
    distance: '4.2 km',
    availability: 'Jueves',
    description: 'Mantenimiento de jardines, poda y diseño de paisajismo.',
    verified: false,
    phoneNumber: '5512345678',
    services: [
      { id: 'j1', name: 'Corte de pasto', price: 20.00, duration: '45 min' },
      { id: 'j2', name: 'Poda de árbol', price: 40.00, duration: '1h' },
    ],
    employees: [],
    schedule: DEFAULT_SCHEDULE
  },
  {
    id: '8',
    name: 'Mecánica Rápida',
    categoryId: 'auto',
    rating: 4.6,
    reviewCount: 78,
    imageUrl: 'https://picsum.photos/400/300?random=8',
    distance: '3.0 km',
    availability: 'Hoy 14:00',
    description: 'Mecánico a domicilio para servicios básicos: cambio de batería, paso de corriente y diagnóstico.',
    verified: true,
    phoneNumber: '5512345678',
    services: [
      { id: 'a1', name: 'Cambio de batería', price: 15.00, duration: '30 min' },
      { id: 'a2', name: 'Diagnóstico Scanner', price: 25.00, duration: '45 min' },
    ],
    employees: [],
    schedule: DEFAULT_SCHEDULE
  },
  {
    id: '9',
    name: 'ClimaFresco AC',
    categoryId: 'tech',
    rating: 4.8,
    reviewCount: 156,
    imageUrl: 'https://picsum.photos/400/300?random=9',
    distance: '6.0 km',
    availability: 'Mañana 09:00',
    description: 'Expertos en aire acondicionado y ventilación. Mantenimiento preventivo y correctivo.',
    verified: true,
    phoneNumber: '5512345678',
    services: [
      { id: 'ac1', name: 'Mantenimiento Split', price: 40.00, duration: '1h 30m' },
      { id: 'ac2', name: 'Carga de gas', price: 35.00, duration: '1h' },
    ],
    employees: [],
    schedule: DEFAULT_SCHEDULE
  },
  {
    id: '10',
    name: 'DJ Fiestero',
    categoryId: 'events',
    rating: 4.9,
    reviewCount: 42,
    imageUrl: 'https://picsum.photos/400/300?random=10',
    distance: '10 km',
    availability: 'Fines de semana',
    description: 'El mejor ambiente para tus fiestas. Incluye luces y sonido profesional.',
    verified: true,
    phoneNumber: '5512345678',
    services: [
      { id: 'ev1', name: 'Servicio x Hora', price: 80.00, duration: '1h' },
      { id: 'ev2', name: 'Paquete Fiesta 5h', price: 350.00, duration: '5h' },
    ],
    employees: [],
    schedule: DEFAULT_SCHEDULE
  },
  {
    id: '11',
    name: 'Enfermera Sara',
    categoryId: 'health',
    rating: 5.0,
    reviewCount: 15,
    imageUrl: 'https://picsum.photos/400/300?random=11',
    distance: '1.5 km',
    availability: '24/7',
    description: 'Cuidado de pacientes, inyecciones, curaciones y toma de presión a domicilio.',
    verified: true,
    phoneNumber: '5512345678',
    services: [
      { id: 'h1', name: 'Inyección a domicilio', price: 10.00, duration: '20 min' },
      { id: 'h2', name: 'Turno de noche (8h)', price: 60.00, duration: '8h' },
    ],
    employees: [],
    schedule: DEFAULT_SCHEDULE
  }
];
