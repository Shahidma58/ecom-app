import Image from "next/image";

export default function CircularCat({
  imgUrl,
  text,
}: {
  imgUrl: string;
  text: string;
}) {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-[150px] h-[150px] rounded-full overflow-hidden">
        <Image
          src={imgUrl}
          alt="Circular Cat"
          width={150}
          height={150}
          className="object-cover"
        />
      </div>
      <p className="mt-3 hover:text-gray-600 hover:underline">{text}</p>
    </div>
  );
}
