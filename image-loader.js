export default function imageLoader({ src, width, quality }) {
  // For GitHub Pages, serve images as-is
  if (src.startsWith('/')) {
    return `/Ecommerce${src}`;
  }
  return src;
}