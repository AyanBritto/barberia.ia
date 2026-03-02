export const services = [
    { id: 1, name: "Corte Clásico", precio: "60.000 Gs", icon: "Scissors" },
    { id: 2, name: "Barba & Ritual", precio: "40.000 Gs", icon: "Razor" },
    { id: 3, name: "Corte + Barba", precio: "85.000 Gs", icon: "Crown" },
    { id: 4, name: "Perfilado Cejas", precio: "20.000 Gs", icon: "Eye" },
    { id: 5, name: "Limpieza Facial", precio: "50.000 Gs", icon: "Sparkles" },
];

export const barbers = [
    { id: 1, name: "Alejandro", img: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=400&q=80" },
    { id: 2, name: "Lisandro", img: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=400&q=80" },
    { id: 3, name: "Carlos", img: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=400&q=80" },
];

// src/data/mockData.ts
export const aiSuggestions = {
  ovalado: [
    { 
      nombre: "Crop Texturizado", 
      imagen: "/imagenes-cortes/crop-texturizado.jpg",
      descripcion: "Ideal para rostros ovalados.",
      confianza: 0.92
    }
  ],
  redondo: [
    { 
      nombre: "Fade Alto", 
      imagen: "/imagenes-cortes/fade-alto.jpg",
      descripcion: "Alarga visualmente el rostro.",
      confianza: 0.88
    }
  ],
  cuadrado: [
    { 
      nombre: "Buzz Cut", 
      imagen: "/imagenes-cortes/buzz-cut.jpg",
      descripcion: "Resalta la mandíbula fuerte.",
      confianza: 0.85
    }
  ]
};
