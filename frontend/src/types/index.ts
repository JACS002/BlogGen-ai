// src/types/index.ts

export interface BlogRequest {
  youtubeUrl: string;
}

export interface BlogResponse {
  id: string;
  title: string;
  content_markdown: string; // El contenido generado
  created_at: string;
  status: "processing" | "completed" | "failed";
}
