import Image from 'next/image'

function Camera() {
  return (
    <div className="flex justify-center items-center">
      <Image
        src="/camera2-removebg-preview.png"
        alt="camera"
        width={400}
        height={400}
        className="w-auto h-full object-contain z-10 drop-shadow-[0_15px_15px_rgba(0,0,0,0.75)] lg:drop-shadow-[0_30px_15px_rgba(0,0,0,0.75)]"
      />
    </div>
  );
}

export default Camera;