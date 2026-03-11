import { validateProspect } from "../prospect-helpers";
import { filterProspectsByInterest } from "@shared/schema";
import type { Prospect } from "@shared/schema";

describe("salary field in prospect validation", () => {
  test("accepts a valid prospect with a salary string", () => {
    const result = validateProspect({
      companyName: "Acme",
      roleTitle: "Engineer",
      salary: "$120,000",
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("accepts a prospect with no salary (optional field)", () => {
    const result = validateProspect({
      companyName: "Acme",
      roleTitle: "Engineer",
    });
    expect(result.valid).toBe(true);
  });

  test("accepts a prospect with an empty salary string", () => {
    const result = validateProspect({
      companyName: "Acme",
      roleTitle: "Engineer",
      salary: "",
    });
    expect(result.valid).toBe(true);
  });

  test("accepts varied salary formats", () => {
    const formats = [
      "$120,000",
      "$100K–$130K/yr",
      "€80,000",
      "120000",
      "Competitive",
      "$80K base + equity",
    ];
    for (const salary of formats) {
      const result = validateProspect({
        companyName: "Acme",
        roleTitle: "Engineer",
        salary,
      });
      expect(result.valid).toBe(true);
    }
  });
});

describe("salary field on Prospect type", () => {
  function makeProspect(overrides: Partial<Prospect> = {}): Prospect {
    return {
      id: 1,
      companyName: "Acme",
      roleTitle: "Engineer",
      jobUrl: null,
      status: "Bookmarked",
      interestLevel: "Medium",
      salary: null,
      notes: null,
      createdAt: new Date(),
      ...overrides,
    };
  }

  test("salary is null when not set", () => {
    const p = makeProspect();
    expect(p.salary).toBeNull();
  });

  test("salary holds the stored string value", () => {
    const p = makeProspect({ salary: "$120,000" });
    expect(p.salary).toBe("$120,000");
  });

  test("interest filter still works correctly when salary is present", () => {
    const prospects = [
      makeProspect({ id: 1, interestLevel: "High", salary: "$120,000" }),
      makeProspect({ id: 2, interestLevel: "Low", salary: null }),
    ];
    const result = filterProspectsByInterest(prospects, "High");
    expect(result).toHaveLength(1);
    expect(result[0].salary).toBe("$120,000");
  });
});
