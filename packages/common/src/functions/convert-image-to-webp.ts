const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp",
  "image/tiff",
  "image/webp",
  "image/avif",
] as const;

type SupportedImageType = (typeof SUPPORTED_IMAGE_TYPES)[number];

type ConvertImageToWebpOptions = {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
};

function isSupportedImageType(type: string): type is SupportedImageType {
  return SUPPORTED_IMAGE_TYPES.includes(type as SupportedImageType);
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new window.Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Nepodařilo se načíst obrázek."));
    };

    image.src = url;
  });
}

function calculateResizedDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth?: number,
  maxHeight?: number,
): { width: number; height: number } {
  let width = originalWidth;
  let height = originalHeight;

  if (maxWidth && width > maxWidth) {
    height = Math.round(height * (maxWidth / width));
    width = maxWidth;
  }

  if (maxHeight && height > maxHeight) {
    width = Math.round(width * (maxHeight / height));
    height = maxHeight;
  }

  return { width, height };
}

/**
 * Converts a standard image file (JPEG, PNG, GIF, BMP, TIFF, AVIF, WebP)
 * to WebP format using the browser Canvas API.
 *
 * Optionally resizes the image if maxWidth/maxHeight are provided.
 *
 * @returns A new File object in WebP format with the same base name.
 */
export async function convertImageToWebp(
  file: File,
  options: ConvertImageToWebpOptions = {},
): Promise<File> {
  const { quality = 0.85, maxWidth, maxHeight } = options;

  if (!isSupportedImageType(file.type)) {
    throw new Error(
      `Nepodporovaný formát obrázku: ${file.type}. Podporované formáty: ${SUPPORTED_IMAGE_TYPES.join(", ")}.`,
    );
  }

  if (
    file.type === "image/webp" &&
    maxWidth === undefined &&
    maxHeight === undefined
  ) {
    return file;
  }

  const image = await loadImage(file);

  const { width, height } = calculateResizedDimensions(
    image.naturalWidth,
    image.naturalHeight,
    maxWidth,
    maxHeight,
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Nepodařilo se vytvořit canvas context.");
  }

  context.drawImage(image, 0, 0, width, height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Konverze do WebP se nezdařila."));
        }
      },
      "image/webp",
      quality,
    );
  });

  const baseName = file.name.replace(/\.[^.]+$/, "");

  return new File([blob], `${baseName}.webp`, { type: "image/webp" });
}
