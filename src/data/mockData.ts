export const services = [
    { id: 1, name: "Corte Clásico", precio: "60.000 Gs", icon: "Scissors" },
    { id: 2, name: "Barba & Ritual", precio: "40.000 Gs", icon: "Razor" },
    { id: 3, name: "Corte + Barba", precio: "85.000 Gs", icon: "Crown" },
    { id: 4, name: "Perfilado Cejas", precio: "20.000 Gs", icon: "Eye" },
    { id: 5, name: "Limpieza Facial", precio: "50.000 Gs", icon: "Sparkles" },
];

export const barbers = [
  { 
    id: 1, 
    name: "Alejandro", 
    img: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=400&q=80",
    email: "alejandro@gmail.com" 
  },
  { 
    id: 2, 
    name: "Lisandro", 
    img: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=400&q=80",
    email: "lisandro@gmail.com"
  },
  { 
    id: 3, 
    name: "Carlos", 
    img: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=400&q=80",
    email: "b9525845@gmail.com",
    uid:"heMIAJSOHPUj4DpkOxIDx9BwQ5n1",
  }
];

// src/data/mockData.ts
export const aiSuggestions = {
  ovalado: [
    { 
      nombre: "Crop Texturizado", 
      imagen: "/imagenes-cortes/crop-texturizado.jpg",
      descripcion: "Estilo moderno y fácil de mantener.",
      confianza: 0.92
    },
    { 
      nombre: "Pompadour", 
      imagen: "/imagenes-cortes/Pompadour.jpg",
      descripcion: "Volumen arriba, look elegante.",
      confianza: 0.89
    },
    { 
      nombre: "Undercut", 
      imagen: "/imagenes-cortes/undercut.jpg",
      descripcion: "Contraste moderno.",
      confianza: 0.87
    }
  ],

  redondo: [
    { 
      nombre: "Fade Alto", 
      imagen: "/imagenes-cortes/fade-alto.jpg",
      descripcion: "Alarga el rostro.",
      confianza: 0.88
    },
    { 
      nombre: "Quiff", 
      imagen: "/imagenes-cortes/Quiff.jpg",
      descripcion: "Volumen arriba.",
      confianza: 0.86
    }
  ],

  cuadrado: [
    { 
      nombre: "Buzz Cut", 
      imagen: "/imagenes-cortes/buzz-cut.jpg",
      descripcion: "Minimalista y fuerte.",
      confianza: 0.85
    },
    { 
      nombre: "Crew Cut", 
      imagen: "/imagenes-cortes/Crew Cut.jpg",
      descripcion: "Clásico limpio.",
      confianza: 0.84
    }
  ]
};
