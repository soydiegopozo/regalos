# regalos.diegopozo.com

Portal de lead magnets de Soy Diego Pozo. Sitio estático en GitHub Pages; los correos se capturan con formularios de Systeme.io.

## Estructura

```
index.html              Portal con la lista de regalos
estilos.css             Estilos compartidos (marca Soy Diego Pozo)
acceso.js               Contraseña sencilla para las páginas de acceso
_plantilla/             Plantilla de un regalo (no se enlaza desde el portal)
  index.html            Página de captura: promesa + formulario de Systeme
  gracias/index.html    Página de acceso después de dejar el correo (con contraseña)
  generar-clave/        Saca el hash de una contraseña y el link que abre solo
CNAME                   Dominio: regalos.diegopozo.com
.nojekyll               Publica los archivos tal cual (sin Jekyll)
```

## Cómo agregar un regalo

1. **Copia la plantilla.** Duplica `_plantilla/` con el nombre corto del regalo, por ejemplo `checklist-lanzamiento/`.
   - La captura queda en `regalos.diegopozo.com/checklist-lanzamiento/`.
   - El acceso queda en `regalos.diegopozo.com/checklist-lanzamiento/gracias/`.
2. **Edita los textos** marcados con `EDITAR` en los dos archivos. En `index.html` del regalo, borra la línea `<meta name="robots" content="noindex">`.
3. **Pon el regalo en la página de gracias.** Cambia el `href="#"` del botón por el link del PDF, la plantilla, el video o la herramienta. Los archivos van en Drive, Canva, YouTube no listado o Systeme, no en este repo (es público).
4. **Ponle contraseña a la página de acceso.** Abre `regalos.diegopozo.com/_plantilla/generar-clave/`, escribe la contraseña y la carpeta del regalo, y:
   - pega la línea `<meta name="clave" …>` en `gracias/index.html` del regalo (reemplaza la del ejemplo);
   - guarda el link que termina en `#clave=…`: abre la página sin escribir la contraseña.
   La contraseña es "de adorno": evita que alguien entre por casualidad, pero no es seguridad real (el contenido sigue en el código de la página). Por eso los archivos van en Drive, Canva, YouTube no listado, etc., no en este repo.
5. **Crea el formulario en Systeme.io:**
   - Una etiqueta para el regalo, por ejemplo `regalo-checklist-lanzamiento`.
   - Un embudo con un paso de formulario en línea (inline). Después de enviar, que redirija al link con `#clave=…` del paso 4.
   - Una regla de automatización: al enviar ese formulario → agregar la etiqueta y mandar el correo con el link con `#clave=…` (y la contraseña escrita, por si la necesitan).
   - Copia el código de inserción del formulario y pégalo dentro de `form-slot` en el `index.html` del regalo (borra el aviso `form-pending`).
6. **Agrégalo al portal.** En el `index.html` de la raíz, copia el bloque de ejemplo que está comentado dentro de `#lista`.
7. **Publica** los archivos en la rama `main` y prueba el flujo completo con un correo tuyo.

## DNS

En GoDaddy: registro **CNAME**, nombre `regalos`, valor `soydiegopozo.github.io`.
