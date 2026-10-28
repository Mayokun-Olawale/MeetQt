"use client";

import { useActionState, useState } from "react";
import { saveOnboarding, updateProfile, type OnboardingState } from "@/app/actions/onboarding";
import { compatibilityQuestions, interestCategories } from "@/lib/onboarding/options";

export function OnboardingForm({ initialValues, mode = "onboarding" }: {
  initialValues: import("@/lib/profile/validation").ProfileValues;
  mode?: "onboarding" | "edit";
}) {
  const [values, setValues] = useState(initialValues);
  const [state, action, pending] = useActionState<OnboardingState, FormData>(mode === "edit" ? updateProfile : saveOnboarding, {});

  return (
    <form action={action} className="meetq-form onboarding-form" aria-busy={pending}>
      <h1>{mode === "edit" ? "Make it yours" : "Tell us about yourself"}</h1>
      <p>{mode === "edit" ? "Update your details, interests, and matching preferences." : "This helps us find better event matches for you."}</p>

      <div className="form-field">
      <label htmlFor="displayName">What should we call you?</label>
      <input aria-invalid={Boolean(state.fieldErrors?.displayName)} aria-describedby={state.fieldErrors?.displayName ? "displayName-error" : undefined} id="displayName" name="displayName" value={values.displayName} onChange={(event) => setValues({ ...values, displayName: event.target.value })} autoComplete="nickname" maxLength={80} required />
      {state.fieldErrors?.displayName && <p id="displayName-error" role="alert">{state.fieldErrors.displayName}</p>}

      </div>

      <div className="form-field">
      <label htmlFor="instagramHandle">Instagram handle</label>
      <p className="field-hint" id="instagramHelp">Add your Instagram handle so your event group can contact you.</p>
      <input
        id="instagramHandle"
        name="instagramHandle"
        value={values.instagramHandle}
        onChange={(event) => setValues({ ...values, instagramHandle: event.target.value })}
        autoCapitalize="none" spellCheck={false}
        placeholder="@yourusername"
        maxLength={31}
        aria-invalid={Boolean(state.fieldErrors?.instagramHandle)}
        aria-describedby={`instagramHelp${state.fieldErrors?.instagramHandle ? " instagramHandle-error" : ""}`}
        required
      />
      {state.fieldErrors?.instagramHandle && <p id="instagramHandle-error" role="alert">{state.fieldErrors.instagramHandle}</p>}

      </div>

      <fieldset aria-describedby={state.fieldErrors?.interests ? "interests-error" : undefined}>
        <legend>What are you interested in?</legend>
        <p>Choose at least one.</p>
        {interestCategories.map(({ category, interests }) => (
          <fieldset key={category}>
            <legend>{category}</legend>
            <div className="option-list">{interests.map((interest) => (
              <label className="choice" key={interest}>
                <input type="checkbox" name="interests" value={interest} checked={values.interests.includes(interest)} onChange={(event) => setValues({ ...values, interests: event.target.checked ? [...values.interests, interest] : values.interests.filter((value) => value !== interest) })} />
                {interest}
              </label>
            ))}</div>
          </fieldset>
        ))}
        {state.fieldErrors?.interests && <p id="interests-error" role="alert">{state.fieldErrors.interests}</p>}
      </fieldset>

      <fieldset aria-describedby={state.fieldErrors?.matchingOptIn ? "matchingOptIn-error" : undefined}>
        <legend>Would you like to opt into event matching?</legend>
        <p>
          If you opt in, 12 hours before an event you will be paired in a group of
          2–4 people for the event.
        </p>
        <label className="choice"><input type="radio" name="matchingOptIn" value="yes" checked={values.matchingOptIn === "yes"} onChange={() => setValues({ ...values, matchingOptIn: "yes" })} required /> Yes, match me</label>
        <label className="choice"><input type="radio" name="matchingOptIn" value="no" checked={values.matchingOptIn === "no"} onChange={() => setValues({ ...values, matchingOptIn: "no" })} /> No, not yet</label>
        {state.fieldErrors?.matchingOptIn && <p id="matchingOptIn-error" role="alert">{state.fieldErrors.matchingOptIn}</p>}
      </fieldset>

      <section className="question-section">
        <h2>Compatibility questions</h2>
        <p>There are no right answers. Pick the option that feels most like you.</p>
        {compatibilityQuestions.map(({ id, question, answers }) => (
          <fieldset key={id} aria-describedby={state.fieldErrors?.[id] ? `${id}-error` : undefined}>
            <legend>{question}</legend>
            <div className="option-list">{answers.map((answer) => (
              <label className="choice" key={answer}>
                <input type="radio" name={id} value={answer} checked={values.compatibilityAnswers[id] === answer} onChange={() => setValues({ ...values, compatibilityAnswers: { ...values.compatibilityAnswers, [id]: answer } })} required />
                {answer}
              </label>
            ))}</div>
            {state.fieldErrors?.[id] && <p id={`${id}-error`} role="alert">{state.fieldErrors[id]}</p>}
          </fieldset>
        ))}
      </section>

      {state.error && <p role="alert">{state.error}</p>}
      <button type="submit" disabled={pending}>
        {pending ? "Saving your profile..." : mode === "edit" ? "Save changes" : "Finish setup"}
      </button>
    </form>
  );
}
