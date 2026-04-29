export interface UserProfile {
  id: string;
  bio: string | null;
  avatar: string | null;
  headline: string | null;
}

export interface SanitizedUser {
  id: number;
  userId: number;
  username: string;
  name: string;
  email: string;
  profile: UserProfile;
  createdAt: string;
}

export interface UpdateProfileInput {
  name?: string;
  bio?: string | null;
  avatar?: string | null;
  headline?: string | null;
}