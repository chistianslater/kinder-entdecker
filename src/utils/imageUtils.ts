export const placeholderImages = [
  'photo-1482938289607-e9573fc25ebb',
  'photo-1509316975850-ff9c5deb0cd9',
  'photo-1513836279014-a89f7a76ae86',
  'photo-1518495973542-4542c06a5843',
  'photo-1469474968028-56623f02e42e',
];

export const getRandomPlaceholder = () => {
  const randomIndex = Math.floor(Math.random() * placeholderImages.length);
  return `https://images.unsplash.com/${placeholderImages[randomIndex]}?auto=format&fit=crop&w=800&q=80`;
};

export const getPublicUrl = async (supabase: any, bucket: string, path: string) => {
  const { data: publicUrl } = supabase
    .storage
    .from(bucket)
    .getPublicUrl(path);
  return publicUrl.publicUrl;
};