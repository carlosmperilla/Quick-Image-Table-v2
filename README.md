# Quick-Image-Table-v2
Generador de tabla de productos con imágenes, con procesamiento rápido y exportable. Con Vue 3/Nuxt 3.  Con Nuxt-Auth y Django-REST-Framework.

> ¡Nuevas caracteristicas V2!
> * Manejo multi-tabla.
> * Datos asincronos.
> * Mayor almacenamiento.
> * Autenticación.


QuickImageTable es una herramienta para generar tablas de productos apoyadas con imágenes.
Su finalidad es generar tablas a partir de fotografías, nombre, precio y cantidad. Debido a que estos son los requisitos mínimos para identificar un producto nuevo.

Para conservar las tablas, se pueden exportar en:
* **Formato PDF:** Se conserva su estilo, estructura, datos por producto (imagen, nombre, precio, cantidad), costo total y nombre de tabla.
* **Archivo comprimido ZIP:** Se compone de las imágenes, cada una de ellas contiene los datos de cada producto, para que pueda ser identificado con facilidad.

## Deploy URL
[https://quickimagetablev2.netlify.app/](https://quickimagetablev2.netlify.app/)

## Guest
Acceso a invitados:
* **Username:** Invitados
* **Password:** 123QWE###

## Dependencies
* npm 9.6.0

## Local Use - Nuxt 3 Minimal Starter
Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

### Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install
```

### Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

### Production

Build the application for production:

```bash
npm run build
```

### Generate Static Files

Generate static files:

```bash
npm run generate
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## About QuickImageTable
### ¿Para qué es útil QuickImageTable?
* Crear tablas de productos de compra/venta, con apoyo visual.
* Conservar imágenes con información condensada, sin edición visual.
* Revisar costos de compra en tiempo real.
* Obtención de tablas e imágenes de productos nuevos en tiempos mínimos.
* Creación de tablas de productos con nombres únicos (si se repite un nombre, automáticamente lo readapta en su ingreso).

### ¿Para qué NO es útil QuickImageTable?
La mayoría de estas características no están incluidas porque reducen la velocidad de creación de la tabla.
* Generar tablas a partir de un archivo (PDF, CSV, Excel, etcétera).
* Varias imágenes por producto.
* Edición avanzada para múltiples productos.
* Filtrado de productos.
* Tablas complejas con campos diferentes a los que se encuentran por defecto. Lo mejor sería exportar a PDF la tabla e importarla a otra aplicación web.

## ¿How To Use?
### ¿Cómo empezar?
* Da clic en [Icono Circle-Plus](https://fontawesome.com/icons/circle-plus?f=classic&s=regular) para **Añadir producto**.
* Permite el acceso a la cámara, para poder tomar fotos de los productos desde la página web.
* A continuación, sigue los pasos para ingresar el producto. Puedes modificar los datos, incluyendo la fotografía, en caso de ser necesario. Recuerda que el nombre tiene un _límite de 50 caracteres_ como máximo.
* Asegúrate de tomar la foto correcta, después de **Añadir producto**, no podrás volver a editar la imagen.

### ¿Puedo cambiar el nombre de la tabla?
El nombre por defecto es _MyQuickTable_, si haces clic en él, puedes modificarlo al que más te convenga. Tiene un _límite de 20 caracteres_ como máximo.

### Ya he ingresado un producto ¿Cómo lo edito?
* Vas a Modo y eliges **Edición**.
* Recuerda que solo puedes editar _Nombre, Precio y Cantidad_. No se puede cambiar de imagen por producto.
* La edición es automática, el botón de **Terminar edición** solo te cambia del modo _Editar_ al modo _Visualización_.

### ¿Cómo elimino un producto?
* Vas a Modo y eliges **Eliminación**.
* Seleccionas todos los productos a eliminar.
* Cliqueas en **Eliminar X productos**.

### ¿Cómo elimino la tabla de productos?
* Vas a Modo y eliges **Eliminación**.
* Cliqueas en **¡Eliminar Tabla!**.

### ¿Cómo puedo exportar la tabla?
* En el apartado de **Exportar tabla**, selecciona el formato de exportación de preferencia (PDF o ZIP).
* El archivo ZIP contiene las imágenes, cada una, con su nombre, precio y cantidad.
* El **Costo total** no se conserva en el formato ZIP, sí lo hace en el PDF.

### Otras funciones
* [Icono Hand-Point-Up](https://fontawesome.com/icons/hand-point-up?f=classic&s=solid) al darle clic subes al tope de la página.
* [Icono Table-Cells](https://fontawesome.com/icons/table-cells?f=classic&s=regular) **Modo normal** de tabla.
* [Icono Panorama](https://fontawesome.com/icons/panorama?f=classic&s=solid) **Modo tarjetas** de tabla. De arriba a abajo la información corresponde a _Image, Nombre, Precio y Cantidad._

## Limitations
* Cada tabla puede tener como **máximo alrededor de 90-100 productos**. QuickImageTable prioriza su uso, sin necesidad de internet para tablas pequeñas. Esto se debe a que el almacenamiento de productos se da localmente (por limitaciones del localStorage), no en un servidor.
* El nombre de cada producto está **limitado a 50 caracteres**.
* El nombre de la tabla está **limitado a 20 caracteres**.
* La calidad de la imagen por producto es estándar. Se prioriza la información y la rapidez, sobre la "Estética" y el contenido "Especifico".
* No se puede adaptar el diseño de PDF exportado, ni de los datos por imágenes en el ZIP.

## Example Images
La aplicación se centra en funcionar para dispositivos móviles. Aunque también funciona en computadoras de escritorio con cámara.
<p float="left" align="middle">
  <img src="https://raw.githubusercontent.com/carlosmperilla/Quick-Image-Table/main/Example%20Images/Mobile/0%20-%20Inicio.PNG" alt="Movil - Index" width="200"/>
  <img src="https://raw.githubusercontent.com/carlosmperilla/Quick-Image-Table/main/Example%20Images/Mobile/1%20-%20Detalles.PNG" alt="Movil - Details" width="200"/>
  <img src="https://raw.githubusercontent.com/carlosmperilla/Quick-Image-Table/main/Example%20Images/Mobile/3%20-%20Producto%20A%C3%B1adido.PNG" alt="Movil - Add Product" width="200"/>
  <img src="https://raw.githubusercontent.com/carlosmperilla/Quick-Image-Table/main/Example%20Images/Mobile/4%20-%20Cambio%20de%20modo%20vista.PNG" alt="Movil - Change Visual Mode" width="200"/>
  <img src="https://github.com/carlosmperilla/Quick-Image-Table/blob/main/Example%20Images/Mobile/5%20-%20Modo%20edici%C3%B3n.PNG" alt="Movil - Edit Mode" width="200"/>
  <img src="https://raw.githubusercontent.com/carlosmperilla/Quick-Image-Table/main/Example%20Images/Mobile/6%20-%20Modo%20eliminaci%C3%B3n.PNG" alt="Movil - Delete Mode" width="200"/>
  <img src="https://raw.githubusercontent.com/carlosmperilla/Quick-Image-Table/main/Example%20Images/Mobile/7%20-%20Exportaci%C3%B3n.PNG" alt="Movil - Exportation" width="200"/>
</p>
