export type LetterGrade = "A" | "B" | "C" | "D" | "F";

export interface Landlord {
  addresses?: string[];
  buildingGrade?: LetterGrade;
  createdAt: Date;
  gradeAggregate?: LetterGrade;
  id: string;
  name: string;
  note?: string;
  reviewCount: number;
  wouldRentAgainPct?: number;
}

export interface Review {
  bathrooms?: number;
  bedrooms?: number;
  buildingCondition: LetterGrade;
  comment: string;
  createdAt: Date;
  grade: LetterGrade;
  id: string;
  isVerifiedStudent: boolean;
  landlordId: string;
  propertyAddress?: string;
  rentAmount?: number;
  tags: string[];
  updatedAt: Date;
  userId: string | null;
  wouldRentAgain: boolean;
}

export interface User {
  createdAt: Date;
  email: string;
  emailVerified: boolean;
  id: string;
  isVerifiedStudent: boolean;
}
