import Image from "next/image"


export default function QuackHacksLoading({theme = "dark"} : {theme?: "dark" | "light" }) {

    const imagePath = theme === "dark" ? "/logo/quackhacks_logo_white_no_letters.webp" : "/logo/b_logo_noletters2.webp"

    return (
        <div className="animate-pulse">
            <div className="relative h-20 w-20 flex justify-center items-center">
                <Image 
                    src={imagePath}
                    alt="loading quackhacks..."
                    width={50}
                    height={50}
                />
                <div className="absolute inset-0 rounded-full border-[6px] border-white/15" />
                <div className={`absolute inset-0 animate-spin rounded-full border-[6px] border-transparent border-t-green-400/30 border-r-green-600/80`} />
            </div>
        </div>
    )
}