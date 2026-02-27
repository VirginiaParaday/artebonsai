# 🌿 Arte Bonsái – Página Web Personal

Sitio web personal sobre el arte del bonsái de **Carlos Mauricio Martínez Sarmiento**.

## Estructura del proyecto

```
bonsai-app/
├── app.js                    # Entrada principal Express
├── package.json
├── routes/
│   ├── index.js              # Inicio
│   ├── sobremi.js            # Sobre mí
│   ├── galeria.js            # Galería
│   ├── guias.js              # Guías y Consejos
│   ├── blog.js               # Blog / Diario
│   ├── recursos.js           # Recursos
│   └── contacto.js           # Contacto (con validación)
├── views/
│   ├── partials/
│   │   ├── header.ejs        # Navbar sticky
│   │   └── footer.ejs        # Footer con copyright
│   ├── index.ejs
│   ├── sobremi.ejs
│   ├── galeria.ejs
│   ├── guias.ejs
│   ├── blog.ejs
│   ├── recursos.ejs
│   ├── contacto.ejs
│   └── 404.ejs
└── public/
    ├── css/style.css         # Diseño natural (verde, marrón, tonos tierra)
    └── js/main.js            # Nav móvil + highlights
```

## Instalación y ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor
npm start

# 3. Abrir en el navegador
# http://localhost:3000
```

## Secciones

| Ruta | Sección |
|------|---------|
| `/` | Inicio con hero, presentación y accesos rápidos |
| `/sobre-mi` | Historia personal y filosofía |
| `/galeria` | Estilos chokkan, shakkan y kengai con SVG |
| `/guias` | Técnicas, herramientas y cuidados por especie |
| `/blog` | Diario de cultivo y reflexiones |
| `/recursos` | Libros, videos y comunidades |
| `/contacto` | Formulario con validación servidor |

## Tecnologías

- **Node.js** + **Express 4**
- **EJS** (motor de plantillas)
- **CSS puro** con variables, Flexbox y Grid
- Fuentes: Lora (serif) + Open Sans (sans) via Google Fonts
- Sin dependencias de frontend (sin jQuery, sin Bootstrap)

## Personalización

Para cambiar las entradas del blog, edita `views/blog.ejs`.  
Para agregar fotos reales a la galería, reemplaza los bloques `<svg>` en `views/galeria.ejs` por `<img src="...">`.
