'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LogoHomeButton({size, path} : {size : number[], path ?: string}) {

    const router = useRouter()
    const logoPath = path ?? "/logo/quackhacks_logo_white_no_letters.webp"

    return (
        <>
        <Image
        src={logoPath}
        alt="back home"
        width={size[0]}
        height={size[1]}
        onClick={() => router.push("/")}
        className="cursor-pointer transition-transform duration-400 ease-out hover:scale-[1.1]"
        />
        </>
    )
}