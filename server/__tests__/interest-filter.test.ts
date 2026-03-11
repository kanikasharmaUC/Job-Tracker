import { filterProspectsByInterest } from "@shared/schema";
import type { Prospect, InterestFilter } from "@shared/schema";

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

describe("filterProspectsByInterest", () => {
  const prospects: Prospect[] = [
    makeProspect({ id: 1, interestLevel: "High" }),
    makeProspect({ id: 2, interestLevel: "Medium" }),
    makeProspect({ id: 3, interestLevel: "Low" }),
    makeProspect({ id: 4, interestLevel: "High" }),
  ];

  test("returns all prospects when filter is All", () => {
    const result = filterProspectsByInterest(prospects, "All");
    expect(result).toHaveLength(4);
    expect(result).toEqual(prospects);
  });

  test("returns only High interest prospects", () => {
    const result = filterProspectsByInterest(prospects, "High");
    expect(result).toHaveLength(2);
    expect(result.every((p) => p.interestLevel === "High")).toBe(true);
  });

  test("returns only Medium interest prospects", () => {
    const result = filterProspectsByInterest(prospects, "Medium");
    expect(result).toHaveLength(1);
    expect(result[0].interestLevel).toBe("Medium");
  });

  test("returns only Low interest prospects", () => {
    const result = filterProspectsByInterest(prospects, "Low");
    expect(result).toHaveLength(1);
    expect(result[0].interestLevel).toBe("Low");
  });

  test("returns empty array when no prospects match the filter", () => {
    const onlyHigh = [makeProspect({ id: 1, interestLevel: "High" })];
    const result = filterProspectsByInterest(onlyHigh, "Low");
    expect(result).toHaveLength(0);
  });

  test("does not mutate the original array", () => {
    const original = [...prospects];
    filterProspectsByInterest(prospects, "High");
    expect(prospects).toEqual(original);
  });
});
