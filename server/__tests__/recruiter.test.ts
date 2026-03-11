import { validateProspect } from "../prospect-helpers";
import type { Prospect } from "@shared/schema";

function makeProspect(overrides: Partial<Prospect> = {}): Prospect {
  return {
    id: 1,
    companyName: "Acme",
    roleTitle: "Engineer",
    jobUrl: null,
    status: "Bookmarked",
    interestLevel: "Medium",
    salary: null,
    recruiterName: null,
    notes: null,
    createdAt: new Date(),
    ...overrides,
  };
}

describe("recruiterName field in prospect validation", () => {
  test("accepts a prospect with a recruiter name", () => {
    const result = validateProspect({
      companyName: "Acme",
      roleTitle: "Engineer",
      recruiterName: "Jane Smith",
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("accepts a prospect with no recruiter name (optional field)", () => {
    const result = validateProspect({
      companyName: "Acme",
      roleTitle: "Engineer",
    });
    expect(result.valid).toBe(true);
  });

  test("accepts a prospect with an empty recruiter name string", () => {
    const result = validateProspect({
      companyName: "Acme",
      roleTitle: "Engineer",
      recruiterName: "",
    });
    expect(result.valid).toBe(true);
  });
});

describe("recruiterName field on Prospect type", () => {
  test("recruiterName is null when not set", () => {
    const p = makeProspect();
    expect(p.recruiterName).toBeNull();
  });

  test("recruiterName holds the stored string value", () => {
    const p = makeProspect({ recruiterName: "Jane Smith" });
    expect(p.recruiterName).toBe("Jane Smith");
  });

  test("recruiterName is independent of other optional fields", () => {
    const p = makeProspect({ recruiterName: "Bob Lee", salary: "$130,000" });
    expect(p.recruiterName).toBe("Bob Lee");
    expect(p.salary).toBe("$130,000");
  });
});
