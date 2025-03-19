import localFont from 'next/font/local'

const squid = localFont({
  src: '../../fonts/squidfont.ttf',
  variable: "--font-squid",
  display: 'swap',
})

function Home() {
  return (
    <div className={`${squid.className} h-screen w-screen text-white bg-black flex flex-col items-center justify-center`}>
        <p className='text-4xl'>Choose</p>
        <div className='flex gap-2'>
            <div className='h-[50vh] w-[50vh] flex items-center justify-center text-[10rem]'>⭐</div>
            <div className='h-[50vh] w-[50vh] flex items-center justify-center text-[10rem]'>♥️</div>
            <div className='h-[50vh] w-[50vh] flex items-center justify-center text-[10rem]'>⬢</div>
        </div>
    </div>
  )
}

export default Home