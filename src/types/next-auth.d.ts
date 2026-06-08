import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id?: string;
    role?: string;
    onboardingCompleted?: boolean;
    careerStage?: string;
    currentCompany?: string;
    yearsExperience?: number;
    location?: string;
  }

  interface Session {
    user: User & {
      id?: string;
      role?: string;
      onboardingCompleted?: boolean;
      careerStage?: string;
      currentCompany?: string;
      yearsExperience?: number;
      location?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    onboardingCompleted?: boolean;
  }
}
