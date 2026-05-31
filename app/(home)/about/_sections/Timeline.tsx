export default function Timeline() {
    // list all items on the timeline here
    const events = [
        {
            title: "Registration Opens",
            date: "March 1",
            description: "Sign up and start forming your team.",
        },
        {
            title: "Registration Deadline",
            date: "March 20",
            description: "Final day to register.",
        },
        {
            title: "Hackathon Begins",
            date: "March 28 · 9:00 AM",
            description: "Opening ceremony and hacking starts.",
        },
        {
            title: "Submissions Due",
            date: "March 29 · 12:00 PM",
            description: "Finalize and submit your project.",
        },
        {
            title: "Winners Announced",
            date: "March 29 · 4:00 PM",
            description: "Judging concludes and awards are announced.",
        },
    ];
    return (
        <section className="py-24 px-4">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-6xl font-bold text-center mb-6">
                    Timeline
                </h2>
                <p className="text-center max-w-2xl mx-auto mb-16">
                    Important dates and milestones for the event
                </p>
                <div className="flex flex-col gap-12 relative pl-8">
                    {events.map((event, idx) => (
                        <TimelineItem
                            key={idx}
                            title={event.title}
                            date={event.date}
                            description={event.description}
                            index={idx}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}


function TimelineItem({
    title,
    date,
    description,
    index,
}: {
    title: string;
    date: string;
    description: string;
    index: number;
}) {
    return (
        <div className="relative">
            <div className="bg-lime-400 p-8 pl-12 relative border-4 border-black">
                
                {/* badges with index number */}
                <div className="absolute -left-6 top-6 w-12 h-12 bg-black border-4 border-lime-400 flex items-center justify-center">
                    <span className="text-lime-400 font-black text-xl">{index + 1}</span>
                </div>
                
                {/* content includes what is written the event list */}
                <div className="relative z-10 pr-8">
                    <h3 className="text-2xl text-black font-black mb-2 uppercase tracking-tight">
                        {title}
                    </h3>
                    <p className="text-base text-black font-bold mb-3 tracking-wide">
                        {date}
                    </p>
                    <p className="text-sm text-black font-medium">
                        {description}
                    </p>
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-black" />
            </div>
        </div>
    );
}