import Link from 'next/link';

function Pricing() {
  return (
    <div className='w-full h-full flex flex-col lg:flex-row justify-between items-center gap-3 px-4 my-2'>
      {/* Left Section */}
      <div className="w-full lg:w-1/3 h-full text-center lg:text-start flex flex-col justify-center items-center lg:items-start gap-5">
        <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-start uppercase rubik-dirtFont">intax fujifilm</h2>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam sed corrupti dolorum illum nostrum quasi, natus corporis saepe maiores, quae laudantium tenetur hic laborum, ducimus asperiores perspiciatis atque laboriosam rerum autem vel pariatur vero vitae. Laboriosam quas amet dolorum dolorem?</p>
        <Link 
          href="/reservation" 
          className="w-1/3 text-center bg-zinc-950 text-white p-2 rounded hover:bg-zinc-800 transition-colors"
          title='Book Now'>
            Book Now
        </Link>
      </div>
      
      {/* Right Section */}
      <div className="w-full lg:w-1/3 h-full py-1 flex flex-col items-center gap-2">
        <div className="w-full h-1/3 border-3 p-3 flex flex-col justify-center border-zinc-900 hover:bg-zinc-900 hover:text-white transition-colors">
          <h3 className='font-bold text-2xl'>Price</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe, laudantium.</p>
          <div className="w-full flex gap-5">
            <span className="w-1/3 rubik-dirtFont flex justify-center items-center font-bold rubik-DirtFont text-4xl md:text-5xl">55%</span>
            <p className="w-2/3">Lorem ipsum dolor sit, amet consectetur adipisicing.</p>
          </div>
        </div>

        <div className="w-full h-1/3 border-3 p-3 flex flex-col justify-center border-zinc-900 hover:bg-zinc-900 hover:text-white transition-colors">
          <h3 className='font-bold text-2xl'>Price</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe, laudantium.</p>
          <div className="w-full flex gap-5">
            <span className="w-1/3 rubik-dirtFont flex justify-center items-center font-bold rubik-DirtFont text-4xl md:text-5xl">55%</span>
            <p className="w-2/3">Lorem ipsum dolor sit, amet consectetur adipisicing.</p>
          </div>
        </div>
        
        <div className="w-full h-1/3 border-3 p-3 flex flex-col justify-center border-zinc-900 hover:bg-zinc-900 hover:text-white transition-colors">
          <h3 className='font-bold text-2xl'>Price</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe, laudantium.</p>
          <div className="w-full flex gap-5">
            <span className="w-1/3 rubik-dirtFont flex justify-center items-center font-bold rubik-DirtFont text-4xl md:text-5xl">55%</span>
            <p className="w-2/3">Lorem ipsum dolor sit, amet consectetur adipisicing.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pricing;
