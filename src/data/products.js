export const products = [
  {
    id: 1,
    name: "Remera Hombre Muscle Fit",
    category: "remeras-hombre",
    price: 12999,
    stock: 15,
    description: "Remera de algodón premium con corte ajustado. Ideal para entrenamiento y uso diario. Material transpirable y resistente.",
    image: "/remera hombre 1.jpg"
  },
  {
    id: 2,
    name: "Remera Hombre Dry Fit",
    category: "remeras-hombre",
    price: 14999,
    stock: 20,
    description: "Tecnología Dry Fit que elimina la humedad. Perfecta para entrenamientos intensos. Secado rápido y comodidad superior.",
    image: "/remera hombre 2.jpg"
  },
  {
    id: 4,
    name: "Remera Mujer Crop Top",
    category: "remeras-mujer",
    price: 11999,
    stock: 18,
    description: "Crop top deportivo con corte moderno. Material elástico y suave. Perfecto para entrenar con estilo.",
    image: "/remera mujer 1.jpg"
  },
  {
    id: 5,
    name: "Remera Mujer Fit Active",
    category: "remeras-mujer",
    price: 13999,
    stock: 22,
    description: "Remera ajustada con tecnología anti-humedad. Diseño femenino y funcional para cualquier actividad física.",
    image: "/remera mujer 2.jpg"
  },
  {
    id: 6,
    name: "Remera Mujer Racerback",
    category: "remeras-mujer",
    price: 10999,
    stock: 16,
    description: "Diseño racerback que permite libertad total de movimiento. Ideal para entrenamientos de fuerza y cardio.",
    image: "/remera mujer 3.jpg"
  },
  {
    id: 7,
    name: "Calza Deportiva High Waist",
    category: "calzas",
    price: 17999,
    stock: 14,
    description: "Calza de cintura alta con soporte abdominal. Material compresivo y elástico. Perfecta para yoga, pilates y gimnasio.",
    image: "/calza mujer 1.jpg"
  },
  {
    id: 8,
    name: "Calza Deportiva Running",
    category: "calzas",
    price: 19999,
    stock: 10,
    description: "Calza especializada para running con bolsillos laterales. Tecnología de compresión y transpirabilidad mejorada.",
    image: "/calza deportiva 2.jpg"
  },
  {
    id: 9,
    name: "Calza Deportiva 7/8",
    category: "calzas",
    price: 16999,
    stock: 13,
    description: "Calza 7/8 con diseño moderno. Material suave y resistente. Ideal para entrenamientos de alta intensidad.",
    image: "/calza deportiva 2.jpg"
  },
  {
    id: 10,
    name: "Gorra Snapback Deportiva",
    category: "gorras",
    price: 8999,
    stock: 25,
    description: "Gorra snapback ajustable con visera curva. Diseño deportivo y moderno. Perfecta para entrenar al aire libre.",
    image: "/gorra 1.jpg"
  },
  {
    id: 11,
    name: "Gorra Trucker",
    category: "gorras",
    price: 7999,
    stock: 20,
    description: "Gorra trucker con panel trasero de malla. Ventilación superior y estilo clásico deportivo.",
    image: "/gorra 2.jpg"
  },
  {
    id: 13,
    name: "Proteína Whey 2kg",
    category: "proteinas",
    price: 24999,
    stock: 8,
    description: "Proteína de suero de leche de alta calidad. 25g de proteína por porción. Sabor chocolate. Ideal para recuperación post-entrenamiento.",
    image: "/proteina 1.jpg"
  },
  {
    id: 14,
    name: "Proteína Whey 5kg",
    category: "proteinas",
    price: 54999,
    stock: 5,
    description: "Proteína de suero en presentación económica 5kg. Máxima pureza y absorción. Sabor vainilla. Ahorro en cantidad.",
    image: "/proteina 2.jpg"
  },
  {
    id: 15,
    name: "Proteína Vegana 1kg",
    category: "proteinas",
    price: 18999,
    stock: 12,
    description: "Proteína 100% vegetal a base de arvejas y arroz. Sin lactosa ni gluten. Sabor frutilla. Para dietas veganas.",
    image: "/proteina 3.jpg"
  },
  {
    id: 16,
    name: "Creatina Monohidrato 300g",
    category: "creatina",
    price: 12999,
    stock: 15,
    description: "Creatina monohidrato micronizada de máxima pureza. Aumenta fuerza y masa muscular. Sin sabor, fácil de mezclar.",
    image: "/creatina 1.jpg"
  },
  {
    id: 17,
    name: "Creatina Monohidrato 500g",
    category: "creatina",
    price: 18999,
    stock: 10,
    description: "Creatina en presentación 500g. Máxima calidad y pureza. Mejora el rendimiento en entrenamientos de alta intensidad.",
    image: "/creatina 2.jpg"
  },
  {
    id: 18,
    name: "Creatina en Cápsulas 200u",
    category: "creatina",
    price: 14999,
    stock: 8,
    description: "Creatina en formato cápsulas para mayor comodidad. Sin sabor, fácil de tomar. Ideal para llevar al gimnasio.",
    image: "/creatina 3.jpg"
  },
  {
    id: 21,
    name: "Botella Deportiva 1L",
    category: "otros",
    price: 4999,
    stock: 30,
    description: "Botella de acero inoxidable con tapa deportiva. Mantiene la temperatura. Libre de BPA. Diseño ergonómico.",
    image: "/botella de agua deportiva.jpg"
  },
  {
    id: 22,
    name: "Toalla Deportiva Microfibra",
    category: "otros",
    price: 6999,
    stock: 25,
    description: "Toalla de microfibra ultra absorbente. Secado rápido. Tamaño ideal para gimnasio. Fácil de transportar.",
    image: "/toalla deportiva.jpg"
  }
]

export const getProductsByCategory = (category) => {
  if (!category) return products
  return products.filter(product => product.category === category)
}

export const getProductById = (id) => {
  return products.find(product => product.id === parseInt(id))
}

export const getCategories = () => {
  const categories = [...new Set(products.map(product => product.category))]
  return categories
}

