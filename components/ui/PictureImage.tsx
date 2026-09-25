import { preload } from "react-dom";
import { getImageProps, type ImageProps } from "next/image";

type PictureImageProps = Omit<ImageProps, "src" | "preload" | "priority"> & {
  /** WebP source, served to every browser that supports it. */
  src: string;
  /** PNG/JPG for the few browsers without WebP (IE, Safari < 14). */
  fallbackSrc: string;
  /** Above-the-fold image: eager + high fetch priority + <link rel=preload>. */
  priority?: boolean;
};

/**
 * next/image can't emit <picture>, and with `images.unoptimized` (static
 * export) it does no format conversion anyway — so this wraps getImageProps
 * (Next's documented route for <picture>) to keep its sizing/`fill` handling
 * while offering WebP with a plain-format <img> fallback.
 */
export function PictureImage({
  src,
  fallbackSrc,
  priority,
  ...rest
}: PictureImageProps) {
  const { props: webp } = getImageProps({ ...rest, src });
  const { props: img } = getImageProps({
    ...rest,
    src: fallbackSrc,
    ...(priority && { loading: "eager", fetchPriority: "high" }),
  });

  if (priority) {
    preload(webp.src, { as: "image", type: "image/webp", fetchPriority: "high" });
  }

  return (
    // `contents` keeps <picture> out of layout so the <img> (absolute for
    // `fill`, block otherwise) sizes against the same parent as before.
    <picture className="contents">
      <source type="image/webp" srcSet={webp.srcSet ?? webp.src} />
      <img {...img} alt={img.alt} />
    </picture>
  );
}
