export interface GitHubRepo {
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  private: boolean;
  visibility: 'public' | 'private';
  html_url: string;
}

export interface VisibilityChangeResult {
  repo: string;
  success: boolean;
  error?: string;
}

export type TargetVisibility = 'public' | 'private';
