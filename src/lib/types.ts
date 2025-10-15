export type Id = string;

export type FolderRef = {
  id: Id;
  type: 'folder';
  name: string;
  path: string[];
  createdAt: string;
  updatedAt?: string;
  // NEW
  previewImageUrl?: string;       // first image in folder (if any)
  counts?: { images: number; folders: number; total: number };
};

export type ImageRef = {
  id: Id;
  type: 'image';
  name: string;
  path: string[];
  createdAt: string;
  sizeBytes: number;
  mime: string;
  width?: number;
  height?: number;
  thumbnailUrl: string;
  originalUrl: string;
};

export type GalleryItem = FolderRef | ImageRef;

export type SplatRef = {
  id: Id;
  name: string;
  createdAt: string;
  status: 'ready' | 'processing' | 'failed';
  previewImageUrl?: string;
  assetUrl?: string;
};

export type JobRef = {
  id: Id;
  createdAt: string;
  status: 'queued'|'running'|'failed'|'completed';
  progress?: { pct: number; detail?: string };
  resultSplatId?: Id;
};
