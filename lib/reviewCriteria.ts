export type ReviewCriterion = { id: string; label: string; description?: string };

export type ReviewCriteriaGroup =
	| { kind: "required"; id: string; label: string; items: ReviewCriterion[] }
	| { kind: "quota"; id: string; label: string; minPassing: number; items: ReviewCriterion[] };

export const REVIEW_CRITERIA: ReviewCriteriaGroup[] = [
	{
		kind: "required",
		id: "base",
		label: "Base Requirements",
		items: [
			{ id: "mlh_eligible", label: "Meets MLH eligibility requirements" },
			{ id: "resume_legible", label: "Resume is legible and parseable" },
			{
				id: "recent_finished_project",
				label: "Has built at least one finished project recently (within a year)",
			},
			{
				id: "specific_entries",
				label: "Projects and/or experiences are specific entries, not vague explanations",
			},
		],
	},
	{
		kind: "quota",
		id: "conditional",
		label: "Conditional Requirements (need 3 of 5)",
		minPassing: 3,
		items: [
			{ id: "tech_depth_breadth", label: "Has a depth or breadth in technologies" },
			{ id: "self_directed_learning", label: "Shows self-directed learning" },
			{ id: "recent_momentum", label: "Has recent momentum (last 3 to 6 months)" },
			{ id: "team_collaboration", label: "Shows evidence of team collaboration" },
			{ id: "hackathon_history", label: "Has prior hackathon or competition history" },
			{ id: "adds_to_room", label: "Brings a perspective, skill, or interest area that benefits the event uniquely. (Design, hardware, a non-CS major, accessibility, organizing experience)" },
		],
	},
];

export type CriteriaResults = Record<string, boolean>;

export function evaluateCriteria(results: CriteriaResults): { passing: boolean; failures: string[] } {
	const failures: string[] = [];
	for (const group of REVIEW_CRITERIA) {
		if (group.kind === "required") {
			for (const item of group.items) {
				if (!results[item.id]) failures.push(item.label);
			}
		} else {
			const passed = group.items.filter((i) => results[i.id]).length;
			if (passed < group.minPassing) {
				failures.push(`${group.label}: ${passed}/${group.minPassing}`);
			}
		}
	}
	return { passing: failures.length === 0, failures };
}

export function countQuotaPassed(
	group: Extract<ReviewCriteriaGroup, { kind: "quota" }>,
	results: CriteriaResults,
): number {
	return group.items.filter((i) => results[i.id]).length;
}
