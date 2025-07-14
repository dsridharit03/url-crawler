export interface UrlResult {
  id: number;
  url: string;
  title: string | null;
  html_version: string | null;
  h1_count: number | null;
  h2_count: number | null;
  h3_count: number | null;
  h4_count: number | null;
  h5_count: number | null;
  h6_count: number | null;
  internal_links: number | null;
  external_links: number | null;
  broken_links: Array<{ url: string; status_code: number }> | null;
  has_login_form: boolean | null;
  status: 'queued' | 'running' | 'done' | 'error' | null;
}