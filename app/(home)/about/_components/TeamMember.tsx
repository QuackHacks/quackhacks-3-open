import Image, { StaticImageData } from "next/image"

export default function TeamMember({
    name, 
    position, 
    imageSrc
} : {
    name: string, 
    position: string, 
    imageSrc: string | StaticImageData
}) {

    return (
        <div className="w-40 flex flex-col items-center text-center">
            <div className="relative w-full aspect-square mb-2">
                <Image
                    src={imageSrc}
                    alt={`Photo of ${name}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 540px) 100vw, 256px"
                />
                <div className="absolute top-0 right-0 w-6 h-6 bg-lime-400" />
            </div>
            <h4 className="text-lg font-semibold">{name}</h4>
            <h5 className="text-sm text-gray-500">{position}</h5>
        </div>
    )
}