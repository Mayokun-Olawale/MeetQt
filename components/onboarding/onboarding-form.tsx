"use client";

import { useActionState } from "react";
import { saveOnboarding, type OnboardingState } from "@/app/actions/onboarding";
import { compatibilityQuestions, interestCategories } from "@/lib/onboarding/options";

export function OnboardingForm({
  initialName = "",
  initialInstagramHandle = "",
}: {
  initialName?: string;
  initialInstagramHandle?: string;
}) {
  const [state, action, pending] = useActionState<OnboardingState, FormData>(saveOnboarding, {});

  return (
    <form action={action}>
      <h1>Tell us about yourself</h1>
      <p>This helps us find better event matches for you.</p>

      <label htmlFor="displayName">What should we call you?</label>
      <input id="displayName" name="displayName" defaultValue={initialName} maxLength={80} required />
      {state.fieldErrors?.displayName && <p role="alert">{state.fieldErrors.displayName}</p>}

      <label htmlFor="instagramHandle">Instagram handle</label>
      <p id="instagramHelp">Add your Instagram handle so your event group can contact you.</p>
      <input
        id="instagramHandle"
        name="instagramHandle"
        defaultValue={initialInstagramHandle}
        placeholder="@yourusername"
        maxLength={31}
        aria-describedby="instagramHelp"
        required
      />
      {state.fieldErrors?.instagramHandle && <p role="alert">{state.fieldErrors.instagramHandle}</p>}

      <fieldset>
        <legend>What are you interested in?</legend>
        <p>Choose at least one.</p>
        {interestCategories.map(({ category, interests }) => (
          <fieldset key={category}>
            <legend>{category}</legend>
            {interests.map((interest) => (
              <label key={interest}>
                <input type="checkbox" name="interests" value={interest} />
                {interest}
              </label>
            ))}
          </fieldset>
        ))}
        {state.fieldErrors?.interests && <p role="alert">{state.fieldErrors.interests}</p>}
      </fieldset>

      <fieldset>
        <legend>Would you like to opt into event matching?</legend>
        <p>
          If you opt in, 12 hours before an event you will be paired in a group of
          2–4 people for the event.
        </p>
        <label><input type="radio" name="matchingOptIn" value="yes" required /> Yes, match me</label>
        <label><input type="radio" name="matchingOptIn" value="no" /> No, not yet</label>
        {state.fieldErrors?.matchingOptIn && <p role="alert">{state.fieldErrors.matchingOptIn}</p>}
      </fieldset>

      <section>
        <h2>Compatibility questions</h2>
        <p>There are no right answers. Pick the option that feels most like you.</p>
        {compatibilityQuestions.map(({ id, question, answers }) => (
          <fieldset key={id}>
            <legend>{question}</legend>
            {answers.map((answer) => (
              <label key={answer}>
                <input type="radio" name={id} value={answer} required />
                {answer}
              </label>
            ))}
            {state.fieldErrors?.[id] && <p role="alert">{state.fieldErrors[id]}</p>}
          </fieldset>
        ))}
      </section>

      {state.error && <p role="alert">{state.error}</p>}
      <button type="submit" disabled={pending}>
        {pending ? "Saving your profile..." : "Finish setup"}
      </button>
    </form>
  );
}
