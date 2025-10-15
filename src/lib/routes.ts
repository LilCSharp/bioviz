// lib/routes.ts
export const routes = {
  // Gallery: parentId is the folder id expected by the API
  gallery: (parentId?: string) =>
    `/api/gallery${parentId ? `?parentId=${encodeURIComponent(parentId)}` : ''}`,

  // Splats
  splats: {
    list: '/api/gs/splats',
    one: (id: string) => `/api/gs/splats/${encodeURIComponent(id)}`,
  },

  // Jobs
  jobs: {
    create: '/api/gs/jobs',
    one: (id: string) => `/api/gs/jobs/${encodeURIComponent(id)}`,
  },

  // Breadcrumb path for a folder (id may contain slashes)
  folderPath: (id: string) => `/api/folder/${encodeURIComponent(id)}`,

  // Uploads
  uploads: {
    presign: '/api/uploads/presign',
    commit: '/api/uploads/commit',
  },
};
