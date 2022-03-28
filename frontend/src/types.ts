export interface Teacher {
  node?: {
    id: string;
    firstName: string;
    lastName: string;
    school: {
      name: string;
      id: string;
    };
    department: string;
    ratings?: {
      avgDifficulty: number;
      avgRating: number;
      numRatings: number;
      teacherRatingTags: [
        {
          tagCount: number;
          tagName: string;
        }
      ];
      wouldTakeAgainPercent: number;
    };
  };
}

export interface School {
  node?: {
    city: string;
    id: string;
    name: string;
    state: string;
  };
}
