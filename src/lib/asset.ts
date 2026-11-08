/**
 * Ruta a un archivo de /public respetando la base del despliegue
 * (p. ej. GitHub Pages sirve el sitio en /yellow-mask/).
 */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}
