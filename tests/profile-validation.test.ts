import assert from "node:assert/strict";
import { test } from "node:test";
import { validateProfile } from "../lib/profile/validation";
import { compatibilityQuestions } from "../lib/onboarding/options";

function validForm() {
  const form = new FormData();
  form.set("displayName", "  Jordan  ");
  form.set("instagramHandle", " @jordan.meet ");
  form.append("interests", "Painting");
  form.set("matchingOptIn", "no");
  for (const question of compatibilityQuestions) form.set(question.id, question.answers[0]);
  return form;
}

test("accepts explicit matching opt-out and normalizes profile values", () => {
  const { values, fieldErrors } = validateProfile(validForm());
  assert.deepEqual(fieldErrors, {});
  assert.equal(values.displayName, "Jordan");
  assert.equal(values.instagramHandle, "jordan.meet");
  assert.equal(values.matchingOptIn, "no");
});

test("requires all profile sections before completing setup", () => {
  const { fieldErrors } = validateProfile(new FormData());
  for (const field of ["displayName", "instagramHandle", "interests", "matchingOptIn", ...compatibilityQuestions.map(({ id }) => id)]) {
    assert.ok(fieldErrors[field], `${field} must be required`);
  }
});

test("rejects tampered interests, matching values, and compatibility answers", () => {
  const form = validForm();
  form.append("interests", "unlisted-interest");
  form.set("matchingOptIn", "true");
  form.set(compatibilityQuestions[0].id, "unlisted-answer");
  const { fieldErrors } = validateProfile(form);
  assert.ok(fieldErrors.interests);
  assert.ok(fieldErrors.matchingOptIn);
  assert.ok(fieldErrors[compatibilityQuestions[0].id]);
});

test("rejects oversized names and Instagram URLs", () => {
  const form = validForm();
  form.set("displayName", "x".repeat(81));
  form.set("instagramHandle", "https://instagram.com/jordan");
  const { fieldErrors } = validateProfile(form);
  assert.ok(fieldErrors.displayName);
  assert.ok(fieldErrors.instagramHandle);
});

test("deduplicates interests and ignores submitted account IDs", () => {
  const form = validForm();
  form.append("interests", "Painting");
  form.set("id", "another-account");
  form.set("onboarding_completed_at", "forged");
  const { values, fieldErrors } = validateProfile(form);
  assert.deepEqual(fieldErrors, {});
  assert.deepEqual(values.interests, ["Painting"]);
  assert.equal("id" in values, false);
  assert.equal("onboarding_completed_at" in values, false);
});
