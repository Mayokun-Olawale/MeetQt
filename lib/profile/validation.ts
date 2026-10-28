import { compatibilityQuestions, interestCategories } from "../onboarding/options";

export type ProfileValues = {
  displayName: string;
  instagramHandle: string;
  interests: string[];
  matchingOptIn: string;
  compatibilityAnswers: Record<string, string>;
};

export function validateProfile(formData: FormData) {
  const values: ProfileValues = {
    displayName: String(formData.get("displayName") ?? "").trim(),
    instagramHandle: String(formData.get("instagramHandle") ?? "").trim().replace(/^@/, ""),
    interests: [...new Set(formData.getAll("interests").filter((value): value is string => typeof value === "string"))],
    matchingOptIn: String(formData.get("matchingOptIn") ?? ""),
    compatibilityAnswers: {},
  };
  const fieldErrors: Record<string, string> = {};
  if (!values.displayName) fieldErrors.displayName = "Enter your name.";
  if (values.displayName.length > 80) fieldErrors.displayName = "Name must be 80 characters or fewer.";
  if (!/^[A-Za-z0-9._]{1,30}$/.test(values.instagramHandle)) fieldErrors.instagramHandle = "Enter a valid Instagram handle.";
  const allowedInterests = new Set<string>(interestCategories.flatMap(({ interests }) => [...interests]));
  if (!values.interests.length || values.interests.length > 50 || values.interests.some((interest) => !allowedInterests.has(interest))) {
    fieldErrors.interests = "Choose between 1 and 50 interests from the list.";
  }
  if (!["yes", "no"].includes(values.matchingOptIn)) fieldErrors.matchingOptIn = "Choose yes or no.";
  for (const question of compatibilityQuestions) {
    const answer = formData.get(question.id);
    if (typeof answer !== "string" || !(question.answers as readonly string[]).includes(answer)) {
      fieldErrors[question.id] = "Choose an answer.";
    } else values.compatibilityAnswers[question.id] = answer;
  }
  return { values, fieldErrors };
}
