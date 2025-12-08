# Hero Be Here - Configuración Local

Si estás viendo errores como "Cannot find module 'tailwindcss'", sigue estos pasos:

1.  Abre una terminal en la carpeta de este proyecto.
2.  Ejecuta el siguiente comando para descargar las librerías necesarias:
    ```bash
    npm install
    ```
3.  Una vez termine, inicia el proyecto con:
    ```bash
    npm run dev
    ```

## Solución de problemas

Si el error persiste:
1. Borra la carpeta `node_modules` y el archivo `package-lock.json`.
2. Vuelve a ejecutar `npm install`.
