# Center Gym - E-commerce de Productos Deportivos

Aplicación web de e-commerce desarrollada con React, Vite y Firebase para la venta de productos deportivos y suplementos.

## 🚀 Tecnologías Utilizadas

- **React 19** - Biblioteca para construir la interfaz de usuario
- **Vite** - Herramienta de construcción y desarrollo
- **React Router** - Navegación entre componentes (SPA)
- **Firebase** - Backend como servicio
  - **Firestore** - Base de datos NoSQL
  - **Authentication** - Autenticación de usuarios
  - **Cloud Functions** - Funciones serverless
  - **Hosting** - Despliegue de la aplicación
- **SASS** - Preprocesador CSS para estilos

## 📋 Funcionalidades Implementadas

### ✅ Listado y Detalle de Productos
- **ItemListContainer** - Contenedor que gestiona la lógica de obtención de productos
- **ItemList** - Componente de presentación que muestra la lista de productos
- **ItemCard** - Tarjeta individual de cada producto
- **ItemDetailContainer** - Contenedor que gestiona la carga del detalle del producto
- **ItemDetail** - Componente de presentación del detalle del producto
- **ItemCount** - Selector de cantidad con validaciones (mínimo 1, máximo según stock)
- Ocultamiento de ItemCount después de agregar producto al carrito

### ✅ Navegación
- Implementación de React Router para navegación SPA
- **NavBar** con enlaces a:
  - Inicio
  - Productos (catálogo completo)
  - Categorías (Remeras Hombre, Remeras Mujer, Calzas, Gorras, Proteínas, Creatina, Otros)
- Navegación sin recargas de página

### ✅ Carrito de Compras
- **CartContext** - Context API para gestión global del estado del carrito
- **Cart** - Componente que muestra:
  - Lista de productos en el carrito
  - Cantidades por producto
  - Subtotales por producto
  - Total general
  - Botón para finalizar compra
- **CartWidget** - Widget en el NavBar que muestra el total de unidades en el carrito

### ✅ Firebase/Firestore
- Colección `products` en Firestore con todos los productos
- Consultas desde React para obtener productos:
  - Todos los productos
  - Productos por categoría
  - Producto por ID
- Colección `orders` en Firestore para almacenar las compras
- Generación de documento en Firestore al confirmar una compra
- Mostrar ID de orden al usuario después del checkout

### ✅ Experiencia de Usuario
- Renderizado condicional para:
  - Loaders durante carga de datos
  - Mensajes de "carrito vacío"
  - Mensajes de "producto sin stock"
  - Mensajes de error
  - Mensajes de éxito
- Confirmación de compra con ID de orden visible

## 📁 Estructura del Proyecto

```
gym-gear-shop/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── Cart.jsx              # Carrito de compras
│   │   ├── CartWidget.jsx        # Widget del carrito
│   │   ├── ErrorBoundary.jsx     # Manejo de errores
│   │   ├── ItemCard.jsx          # Tarjeta de producto (presentación)
│   │   ├── ItemCount.jsx         # Selector de cantidad
│   │   ├── ItemDetail.jsx        # Detalle de producto (presentación)
│   │   ├── ItemDetailContainer.jsx # Contenedor del detalle
│   │   ├── ItemList.jsx          # Lista de productos (presentación)
│   │   ├── ItemListContainer.jsx # Contenedor de la lista
│   │   ├── Navbar.jsx            # Barra de navegación
│   │   └── ShopContainer.jsx     # Página de inicio
│   ├── context/
│   │   └── CartContext.jsx       # Context del carrito
│   ├── firebase/
│   │   ├── auth.js               # Servicio de autenticación
│   │   ├── config.js             # Configuración de Firebase
│   │   ├── orders.js             # Servicio de órdenes
│   │   ├── products.js           # Servicio de productos
│   │   └── index.js              # Barrel export
│   ├── data/
│   │   └── products.js           # Datos estáticos (backup)
│   ├── App.jsx                   # Componente principal
│   ├── main.jsx                  # Punto de entrada
│   └── index.scss                # Estilos globales
├── functions/                    # Cloud Functions
├── public/                       # Archivos estáticos
├── firebase.json                 # Configuración de Firebase
├── firestore.rules               # Reglas de seguridad
└── firestore.indexes.json        # Índices de Firestore
```

## 🔧 Instalación y Configuración

### Requisitos Previos
- Node.js (v18 o superior)
- npm o yarn
- Cuenta de Firebase

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/Ferropelato/gimnasio-center-gym.git
cd gimnasio-center-gym
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar Firebase**
   - Crear archivo `.env` en la raíz del proyecto
   - Agregar las credenciales de Firebase:
```env
VITE_FIREBASE_API_KEY=tu-api-key
VITE_FIREBASE_AUTH_DOMAIN=center-gym-yacanto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=center-gym-yacanto
VITE_FIREBASE_STORAGE_BUCKET=center-gym-yacanto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
VITE_FIREBASE_APP_ID=tu-app-id
```

4. **Migrar productos a Firestore**
```bash
npm run migrate:products
```

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

## 🚀 Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Crea build de producción
- `npm run preview` - Preview del build
- `npm run lint` - Ejecuta ESLint
- `npm run migrate:products` - Migra productos a Firestore
- `npm run firebase:deploy` - Despliega en Firebase
- `npm run firebase:deploy:hosting` - Despliega solo hosting

## 🌐 Despliegue

La aplicación está desplegada en Firebase Hosting:
**URL:** https://center-gym-yacanto.web.app

## 📝 Convenciones y Buenas Prácticas

- Nombres de componentes en PascalCase
- Nombres de funciones en camelCase
- Separación de responsabilidades: contenedores y componentes de presentación
- Uso de Context API para estado global
- Manejo de errores con ErrorBoundary
- Validaciones en formularios y componentes
- Código modular y reutilizable

## 👨‍💻 Autor

**Fernando Ropelato**
- Proyecto: Center Gym E-commerce
- Curso: Desarrollo Web con React

## 📄 Licencia

Este proyecto es parte de un curso académico.
