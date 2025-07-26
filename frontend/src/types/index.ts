export interface BrokenLink {
    url: string;
    status_code: number;
  }

  export interface UrlResult {
    id: number;
    url: string;
    title: string;
    html_version: string;
    h1_count: number;
    h2_count: number;
    h3_count: number;
    h4_count: number;
    h5_count: number;
    h6_count: number;
    internal_links: number;
    external_links: number;
    broken_links: BrokenLink[];
    has_login_form: boolean;
    status: string;
  }