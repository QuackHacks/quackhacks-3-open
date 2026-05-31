import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Terms of Service | QuackHacks",
	description: "QuackHacks event terms of service, rules, and participant agreements",
};

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
	return (
		<section id={id} className="scroll-mt-24">
			<h2 className="font-liebling text-2xl font-bold text-neutral-900 mb-4 pb-2 border-b border-neutral-200">
				{title}
			</h2>
			<div className="space-y-4 text-sm text-neutral-700 leading-relaxed">{children}</div>
		</section>
	);
}

function Rule({ children }: { children: React.ReactNode }) {
	return (
		<li className="flex gap-3">
			<span className="font-bold text-neutral-400 shrink-0 mt-0.5">—</span>
			<span>{children}</span>
		</li>
	);
}

const TOC = [
	{ id: "overview", label: "1. Event Overview" },
	{ id: "eligibility", label: "2. Eligibility" },
	{ id: "conduct", label: "3. Code of Conduct" },
	{ id: "prohibited", label: "4. Prohibited Items & Substances" },
	{ id: "belongings", label: "5. Personal Belongings" },
	{ id: "safety", label: "6. Venue Safety" },
	{ id: "photography", label: "7. Photography & Image Release" },
	{ id: "liability", label: "8. Activity & Liability Waiver" },
	{ id: "student-conduct", label: "9. Student Code of Conduct" },
	{ id: "ip", label: "10. Intellectual Property" },
	{ id: "prizes", label: "11. Prize Allocation" },
	{ id: "changes", label: "12. Changes & Enforcement" },
	{ id: "contact", label: "13. Contact" },
];

export default function TermsPage() {
	return (
		<div className="min-h-screen bg-[#f4f4f4]">
			<div className="max-w-4xl mx-auto px-5 md:px-8 pt-20 pb-24">

				{/* ── Header ── */}
				<div className="mb-12">
					<p className="font-mono text-[9px] uppercase tracking-superwide text-neutral-400 mb-3">
						QuackHacks · Legal
					</p>
					<h1 className="font-liebling font-bold text-5xl md:text-6xl text-neutral-900 leading-tight mb-4">
						Terms of Service
					</h1>
					<p className="text-neutral-500 text-sm">
						Last updated: April 2026 &nbsp;·&nbsp; Applies to: QuackHacks 2026
					</p>

					{/* Alert banner */}
					<div className="mt-6 rounded-xl border-2 border-red-300 bg-red-50 px-5 py-4">
						<p className="text-sm font-semibold text-red-800">
							By registering for QuackHacks you agree to all terms on this page, including the{" "}
							<a href="#prohibited" className="underline hover:text-red-600">zero-tolerance substance & weapons policy</a>,{" "}
							<a href="#liability" className="underline hover:text-red-600">liability waiver</a>, and{" "}
							<a href="#photography" className="underline hover:text-red-600">image release consent</a>.
						</p>
					</div>
				</div>

				<div className="flex flex-col lg:flex-row gap-10">

					{/* ── Table of Contents (sticky sidebar) ── */}
					<aside className="lg:w-56 shrink-0">
						<div className="lg:sticky lg:top-8 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
							<p className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400 mb-3">Contents</p>
							<nav className="space-y-1">
								{TOC.map((item) => (
									<a
										key={item.id}
										href={`#${item.id}`}
										className="block text-xs text-neutral-600 hover:text-neutral-900 hover:font-medium py-0.5 transition-colors"
									>
										{item.label}
									</a>
								))}
							</nav>
						</div>
					</aside>

					{/* ── Body ── */}
					<main className="flex-1 space-y-12">

						{/* 1 — Overview */}
						<Section id="overview" title="1. Event Overview">
							<p>
								QuackHacks is a student-run hackathon hosted at the University of Oregon. The event
								brings together students and participants to collaborate, build, and compete over a
								multi-hour hacking period. By completing registration and attending QuackHacks, you
								agree to be bound by these Terms of Service in their entirety.
							</p>
							<p>
								These Terms supplement — and do not replace — applicable University of Oregon policies,
								local laws, and any additional agreements you may sign on-site. In the event of a
								conflict, the stricter standard applies.
							</p>
						</Section>

						{/* 2 — Eligibility */}
						<Section id="eligibility" title="2. Eligibility">
							<p>To participate in QuackHacks you must:</p>
							<ul className="space-y-2 pl-1">
								<Rule>Be at least 18 years of age at the time of the event.</Rule>
								<Rule>Be currently enrolled as a student or have graduated within the past 12 months.</Rule>
								<Rule>Complete all required registration fields honestly and accurately.</Rule>
								<Rule>Agree to all terms, waivers, and policies listed on this page.</Rule>
							</ul>
							<p>
								QuackHacks reserves the right to verify eligibility and to revoke acceptance at any
								time if the above conditions are not met or if misrepresentation is discovered.
							</p>
						</Section>

						{/* 3 — Code of Conduct */}
						<Section id="conduct" title="3. Code of Conduct">
							<p>
								QuackHacks is committed to providing a safe, inclusive, and respectful environment for
								all participants. All attendees, volunteers, sponsors, and organizers are required to
								comply with the following conduct standards for the duration of the event, including
								travel to and from any official QuackHacks venues.
							</p>
							<ul className="space-y-2 pl-1">
								<Rule>
									Treat all participants, volunteers, and organizers with respect and professionalism
									regardless of gender, sexual orientation, disability, ethnicity, religion, age, or
									any other characteristic.
								</Rule>
								<Rule>
									Harassment of any kind — including unwanted physical contact, verbal abuse,
									intimidation, stalking, or deliberate exclusion — is strictly prohibited and will
									result in immediate removal from the event.
								</Rule>
								<Rule>
									Disruption of presentations, workshops, or working sessions is not permitted.
								</Rule>
								<Rule>
									Report any Code of Conduct violations to an organizer immediately. All reports
									will be handled confidentially.
								</Rule>
							</ul>
							<p>
								Violations may result in removal from the event, disqualification of your team&apos;s
								submission, and/or referral to University of Oregon student conduct authorities.
							</p>
						</Section>

						{/* 4 — Prohibited Items */}
						<Section id="prohibited" title="4. Prohibited Items & Substances">
							<div className="rounded-xl border-2 border-red-300 bg-red-50 p-5">
								<p className="font-black text-red-800 text-xs uppercase tracking-widest mb-3">
									⚠ Zero Tolerance — No Exceptions
								</p>
								<ul className="space-y-3 pl-1">
									<Rule>
										<strong>Alcohol.</strong> No alcoholic beverages may be brought onto or consumed
										on the premises at any time, regardless of age. Any participant found in
										possession of or under the influence of alcohol will be immediately removed.
									</Rule>
									<Rule>
										<strong>Controlled substances & drugs.</strong> Illegal drugs, cannabis (including
										products legal under state law), and any other controlled or intoxicating
										substances are absolutely prohibited at all QuackHacks venues.
									</Rule>
									<Rule>
										<strong>Weapons.</strong> Firearms, knives, blunt instruments, and any other
										weapon or dangerous object are banned from the event. This includes props,
										replicas, and decorative items that resemble weapons. No exceptions.
									</Rule>
									<Rule>
										<strong>Hazardous materials.</strong> Flammable, explosive, toxic, or otherwise
										hazardous substances may not be brought to the venue.
									</Rule>
								</ul>
							</div>
							<p className="text-neutral-600">
								Participants found in violation of this section will be immediately and permanently
								removed from QuackHacks without refund or appeal. Depending on severity, violations
								may be reported to University of Oregon security or local law enforcement.
							</p>
						</Section>

						{/* 5 — Personal Belongings */}
						<Section id="belongings" title="5. Personal Belongings">
							<div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
								<p className="font-semibold text-amber-900 mb-2">
									You are solely responsible for your personal property.
								</p>
								<p className="text-amber-800">
									QuackHacks, its organizers, volunteers, sponsors, and the University of Oregon
									assume no responsibility for any lost, stolen, misplaced, or damaged personal
									property at any point during the event.
								</p>
							</div>
							<ul className="space-y-2 pl-1">
								<Rule>Keep all personal belongings — including laptops, phones, wallets, and equipment — within
									your line of sight at all times.</Rule>
								<Rule>Do not leave valuables unattended at your workstation or anywhere in the venue.</Rule>
								<Rule>QuackHacks does not provide storage or security for personal property.</Rule>
								<Rule>
									If you believe property has been stolen, report it to venue security or University
									of Oregon campus safety immediately — do not wait until the event ends.
								</Rule>
							</ul>
							<p>
								By attending QuackHacks you agree that you have read, understood, and accepted this
								policy and that you will not hold the organizers liable for any property losses.
							</p>
						</Section>

						{/* 6 — Venue Safety */}
						<Section id="safety" title="6. Venue Safety">
							<p>
								The QuackHacks venue is an active working environment. Please be aware of the
								following physical hazards and take reasonable precautions at all times.
							</p>
							<ul className="space-y-2 pl-1">
								<Rule>
									<strong>Cables & cords.</strong> Power strips, extension cords, ethernet cables,
									and charging cables will be running along floors and tables throughout the venue.
									Watch your step — trip hazards are present in all areas. Do not pull or disconnect
									cables that are not yours.
								</Rule>
								<Rule>
									<strong>Electronic equipment.</strong> Laptops, monitors, soldering equipment, and
									other hardware may be present. Handle all equipment with care and do not touch
									hardware that does not belong to you.
								</Rule>
								<Rule>
									<strong>Crowded spaces.</strong> During peak hours the venue may be crowded. Walk
									carefully, do not run, and give others adequate space.
								</Rule>
								<Rule>
									<strong>Emergency exits.</strong> Familiarize yourself with the emergency exits
									upon arrival. In the event of a fire alarm or emergency, evacuate immediately and
									follow the instructions of venue staff and emergency personnel.
								</Rule>
								<Rule>
									Report any unsafe conditions to an organizer or venue staff immediately. Do not
									attempt to fix hazards yourself unless it is safe to do so.
								</Rule>
							</ul>
							<p>
								QuackHacks organizers will make reasonable efforts to maintain a safe environment, but
								participants are expected to exercise personal responsibility and common sense at all
								times. The organizers are not liable for injuries resulting from a failure to exercise
								reasonable caution.
							</p>
						</Section>

						{/* 7 — Photography */}
						<Section id="photography" title="7. Photography & Image Release">
							<p>
								QuackHacks may photograph, film, and record participants during the event for
								promotional, educational, and archival purposes. This media may be used on the
								QuackHacks website, social media channels, printed materials, and in communications
								with sponsors and university administration.
							</p>
							<p>
								By registering for QuackHacks, you grant the organizers a perpetual, non-exclusive,
								royalty-free license to use your image, likeness, voice, and appearance in any media
								captured during the event, consistent with the{" "}
								<a
									href="https://communications.uoregon.edu/sites/default/files/2024-06/uo-model-release.pdf"
									target="_blank"
									rel="noopener noreferrer"
									className="font-semibold underline underline-offset-2 text-brand-600 hover:text-brand-700"
								>
									University of Oregon Model Release Form
								</a>
								.
							</p>
							<p>
								If you do not wish to be photographed or filmed, please notify an organizer at check-in.
								While we will make reasonable efforts to accommodate your request, we cannot guarantee
								that you will not appear in any background footage of the event.
							</p>
						</Section>

						{/* 8 — Liability Waiver */}
						<Section id="liability" title="8. Activity & Liability Waiver">
							<p>
								Participation in QuackHacks involves activities that carry inherent risks, including
								but not limited to exposure to electronic equipment, physical activity, and movement
								within a crowded venue. By registering and attending, you voluntarily assume all
								such risks.
							</p>
							<p>
								You agree to release, waive, discharge, and hold harmless the University of Oregon,
								QuackHacks organizers, event staff, volunteers, sponsors, and all affiliated parties
								from any and all claims, liabilities, costs, and expenses arising out of or relating
								to your participation in the event, consistent with the{" "}
								<a
									href="https://safety.uoregon.edu/sites/default/files/risk_uo_waiver_eng.pdf"
									target="_blank"
									rel="noopener noreferrer"
									className="font-semibold underline underline-offset-2 text-brand-600 hover:text-brand-700"
								>
									University of Oregon Activity & Liability Waiver
								</a>
								.
							</p>
							<p>
								This waiver applies to property damage, personal injury, illness, and any other losses
								sustained during the event, to the fullest extent permitted by law.
							</p>
						</Section>

						{/* 9 — Student Code of Conduct */}
						<Section id="student-conduct" title="9. Student Code of Conduct">
							<p>
								QuackHacks is held on or in affiliation with the University of Oregon. All participants
								are expected to comply with the{" "}
								<a
									href="https://policies.uoregon.edu/vol-3-administration-student-affairs/ch-1-conduct/student-conduct-code"
									target="_blank"
									rel="noopener noreferrer"
									className="font-semibold underline underline-offset-2 text-brand-600 hover:text-brand-700"
								>
									University of Oregon Student Code of Conduct
								</a>{" "}
								for the duration of the event, regardless of their home institution.
							</p>
							<p>
								Key obligations under the Student Code of Conduct include, but are not limited to:
							</p>
							<ul className="space-y-2 pl-1">
								<Rule>Honest and ethical behavior in all academic and competitive activities.</Rule>
								<Rule>Respect for the rights and property of others on campus.</Rule>
								<Rule>Compliance with all university policies regarding alcohol, drugs, and weapons.</Rule>
								<Rule>
									Cooperation with university officials and law enforcement in the exercise of
									their duties.
								</Rule>
							</ul>
							<p>
								Violations of the Student Code of Conduct may result in removal from QuackHacks and
								referral to University of Oregon student conduct authorities, in addition to any
								actions taken by QuackHacks organizers.
							</p>
						</Section>

						{/* 10 — IP */}
						<Section id="ip" title="10. Intellectual Property">
							<p>
								You retain full ownership of all intellectual property you create during QuackHacks.
								QuackHacks does not claim any rights over your project, code, designs, or other
								creative work produced at the event.
							</p>
							<p>
								By submitting a project, you grant QuackHacks and the University of Oregon a
								non-exclusive license to display, describe, and promote your project for event
								documentation and promotional purposes. You represent that your submission does not
								infringe on the intellectual property rights of any third party.
							</p>
						</Section>

						{/* 11 — Prize Allocation */}
						<Section id="prizes" title="11. Prize Allocation">
							<p>
								Prize eligibility and distribution are subject to QuackHacks organizer review and
								available prize inventory. Unless otherwise stated by QuackHacks or MLH, a project
								may win up to one QuackHacks track prize and one MLH track prize.
							</p>
							<ul className="space-y-2 pl-1">
								<Rule>
									Each eligible winner may receive only one prize item per winning category. For
									example, a solo participant may claim one prize item for a winning submission, not
									all prize items allocated to a full team.
								</Rule>
								<Rule>
									Team prizes are allocated by eligible team member count. For example, if a team of
									three wins a category with up to four prize items available, that team may receive
									up to three prize items.
								</Rule>
								<Rule>
									Prize substitutions, shipping methods, and final allocation decisions are handled
									at the discretion of QuackHacks organizers and any applicable prize sponsors.
								</Rule>
							</ul>
						</Section>

						{/* 12 — Changes */}
						<Section id="changes" title="12. Changes & Enforcement">
							<p>
								QuackHacks reserves the right to amend these Terms at any time prior to the event.
								Material changes will be communicated to registered participants via email. Continued
								participation constitutes acceptance of the updated Terms.
							</p>
							<p>
								QuackHacks organizers have sole discretion over the interpretation and enforcement of
								these Terms. Decisions regarding violations, removal, and disqualification are final.
							</p>
						</Section>

						{/* 13 — Contact */}
						<Section id="contact" title="13. Contact">
							<p>
								If you have questions about these Terms, a concern about event safety, or a Code of
								Conduct issue to report, please contact the QuackHacks organizing team:
							</p>
							<div className="rounded-xl border border-neutral-200 bg-white p-5 font-mono text-sm">
								<p className="text-neutral-900 font-semibold">QuackHacks Organizing Team</p>
								<p className="text-neutral-500">University of Oregon</p>
								<p className="text-brand-600 mt-2">quackhacks@uoregon.edu</p>
							</div>
						</Section>

						{/* Back to archive */}
						<div className="pt-4 border-t border-neutral-200">
							<Link
								href="/projects"
								className="inline-flex items-center gap-2 rounded-lg border border-neutral-900 bg-neutral-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-neutral-800 transition-colors"
							>
								← Back to Projects
							</Link>
						</div>

					</main>
				</div>
			</div>
		</div>
	);
}
