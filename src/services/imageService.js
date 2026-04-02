// Image Service - Uses reliable Unsplash images with fallback to Pexels
// All images are freely licensed and reliable

export const PERFUME_IMAGE_MAP = {
  // Women's fragrances
  'Black Opium': '/images/ysl-black-opium-alt2.png',
  'Black Opium Le Parfum': '/images/yves-saint-laurent-black-opium.png',
  'Mon Paris': '/images/ysl-mon-paris.jpg',
  'Opium': 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=500&q=80',
  'Libre': '/images/ysl-fit-73789.jpg',
  'Coco Mademoiselle': '/images/chanel-coco-mademoiselle.jpg',
  'Coco Mademoiselle Dscentsation': '/images/chanel-coco-mademoiselle-dscentsation.jpg',
  'Coco Mademoiselle Alt': '/images/heinemann-coco-mademoiselle.jpg',
  'Chanel Chance Eau Vive': '/images/chanel-chance-eau-vive.jpg',
  "Lancome L'Eau": '/images/lancome-leau.jpg',
  'Lancome Idole': '/images/lancome-idole.jpg',
  'Lancome Magnifique': '/images/lancome-magnifique.jpg',
  'Armani Acqua di Gio Essenza': '/images/armani-acqua-di-gio-essenza.jpg',
  'Daisy': '/images/marc-jacobs-daisy.png',
  
  // Men's fragrances
  'Sauvage': 'https://images.unsplash.com/photo-1577720643272-265e434f6f6e?auto=format&fit=crop&w=500&q=80',
  'Dior Homme Intense': 'https://images.unsplash.com/photo-1612528443702-f6741f70a049?auto=format&fit=crop&w=500&q=80',
  'Bleu de Chanel': 'https://images.unsplash.com/photo-1508737763262-07a07d71fe3e?auto=format&fit=crop&w=500&q=80',
  'Eros': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=500&q=80',
  
  // Unisex fragrances
  'CK One': 'https://images.unsplash.com/photo-1524634126288-917feca00226?auto=format&fit=crop&w=500&q=80',
  'Tom Ford Black Orchid': 'https://images.unsplash.com/photo-1506755855726-85d282a102f2?auto=format&fit=crop&w=500&q=80',
};

// Fallback colors
const FALLBACK_COLORS = [
  '#F4A6C1', '#D4A5A5', '#A5C0D4', '#B8A5D4', '#D4B8A5',
  '#C1F4A6', '#A6C1F4', '#F4D4A6', '#E8A6F4', '#A6E8F4',
  '#F9B4D1', '#D4B5C4', '#B5D4E0', '#C4B5D4', '#E0D4B5'
];

export const getPerfumeImage = (perfumeName, id, productImage = null) => {
  // If product has a custom image URL provided, use it first
  if (productImage && productImage.trim() !== '') {
    return productImage;
  }
  
  // Check if we have a custom image for this perfume
  if (PERFUME_IMAGE_MAP[perfumeName]) {
    return PERFUME_IMAGE_MAP[perfumeName];
  }
  
  // Default to a aesthetically pleasing perfume/flower image
  const defaultImages = [
    'https://images.unsplash.com/photo-1494252499848-1da0e9b39469?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1575457595142-38b6eef1ff28?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1577720643272-265e434f6f6e?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1508737763262-07a07d71fe3e?auto=format&fit=crop&w=500&q=80',
  ];
  
  return defaultImages[id % defaultImages.length];
};

export const getFallbackColor = (id) => {
  return FALLBACK_COLORS[id % FALLBACK_COLORS.length];
};

export default {
  getPerfumeImage,
  getFallbackColor,
  PERFUME_IMAGE_MAP,
};
