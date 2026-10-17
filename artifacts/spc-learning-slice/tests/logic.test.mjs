import test from "node:test";
import assert from "node:assert/strict";
import {
  SAMPLE_JOB, SAMPLE_SKILLS, READINGS, CENTER, LCL, UCL, SPEC_LOW, SPEC_HIGH,
  analyze, initialRoute, recommend, beyondLimits, isCorrect,
  DIAG, INTRO_OBS, INTRO_ACT, CHAL, QUESTIONS,
} from "../src/lib/spc.ts";

// These exercise deterministic rules, not browser navigation or React state.
test("sample beginner's correct introductory answers are accepted", () => {
  assert.equal(analyze(SAMPLE_JOB, SAMPLE_SKILLS).status, "sample");
  assert.equal(initialRoute("new"), "intro");
  assert.equal(recommend("b"), "intro");
  assert.equal(isCorrect(INTRO_OBS, "7"), true);
  assert.equal(isCorrect(INTRO_ACT, "a"), true);
});

test("self-reported experience sets challenge independently of diagnostic", () => {
  assert.equal(initialRoute("some"), "challenge");
  assert.equal(recommend("a"), "challenge");
  assert.equal(recommend("c"), "intro");
  assert.equal(initialRoute("some"), "challenge");
  assert.equal(isCorrect(CHAL, "a"), true);
});

test("empty fields return helpful field-specific recovery", () => {
  const empty = analyze("", " ");
  assert.equal(empty.status, "invalid");
  assert.match(empty.jobError, /load the sample/);
  assert.match(empty.skillsError, /load the sample/);
  const oneEmpty = analyze(SAMPLE_JOB, "");
  assert.equal(oneEmpty.jobError, undefined);
  assert.ok(oneEmpty.skillsError);
  assert.equal(analyze(SAMPLE_JOB, SAMPLE_SKILLS).status, "sample");
});

test("changed text is unsupported, rather than semantically analyzed", () => {
  assert.equal(analyze(SAMPLE_JOB + " Additional text.", SAMPLE_SKILLS).status, "unsupported");
  assert.equal(analyze(SAMPLE_JOB, "Experienced engineer").status, "unsupported");
  assert.equal(analyze(`  ${SAMPLE_JOB} `, ` ${SAMPLE_SKILLS}\n`).status, "sample");
});

test("fictional values and supplied limits match the educational brief", () => {
  assert.deepEqual(READINGS, [100, 101, 99, 100, 102, 101, 105, 100]);
  assert.deepEqual([CENTER, LCL, UCL, SPEC_LOW, SPEC_HIGH], [100, 97, 103, 94, 106]);
  assert.deepEqual(beyondLimits(), [7]);
  assert.deepEqual(beyondLimits([97, 103]), []);
  assert.ok(READINGS[6] >= SPEC_LOW && READINGS[6] <= SPEC_HIGH);
  assert.ok(READINGS[6] > UCL);
});

test("all diagnostic answers get the specified recommendation", () => {
  for (const option of DIAG.options) {
    assert.equal(recommend(option.id), option.correct ? "challenge" : "intro");
  }
});

test("each question has one correct choice and distinct prepared feedback", () => {
  for (const question of Object.values(QUESTIONS)) {
    assert.equal(question.options.filter(o => o.correct).length, 1);
    assert.equal(new Set(question.options.map(o => o.feedback)).size, question.options.length);
    for (const option of question.options) assert.ok(option.feedback.length > 20);
    assert.equal(isCorrect(question, null), false);
    assert.equal(isCorrect(question, "not-an-answer"), false);
  }
});
