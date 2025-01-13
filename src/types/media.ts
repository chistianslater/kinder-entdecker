export interface MediaFile {
  type: 'image' | 'video';
  url: string;
  id?: string;
  caption?: string;
}