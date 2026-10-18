type Props = {
  /** Имя файла без ширины и расширения: /photos/<name>-<ширина>.webp (готовит scripts/photos.mjs). */
  name: string;
  /** Две ширины для srcset: меньшая и большая. */
  widths: [number, number];
  /** Размеры большего файла: для резервирования места, чтобы страница не прыгала. */
  width: number;
  height: number;
  alt: string;
  sizes: string;
  /** Фото на первом экране: грузим сразу и с высоким приоритетом, а не лениво. */
  priority?: boolean;
  className?: string;
};

// Обычный img, а не next/image: файлы уже уменьшены заранее, а оптимизатор Next на free-сервисе
// Render после каждого «пробуждения» начинал бы работу заново.
export function Photo({ name, widths, width, height, alt, sizes, priority = false, className }: Props) {
  const [small, large] = widths;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={`/photos/${name}-${large}.webp`}
      srcSet={`/photos/${name}-${small}.webp ${small}w, /photos/${name}-${large}.webp ${large}w`}
      sizes={sizes}
      width={width}
      height={height}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
    />
  );
}
