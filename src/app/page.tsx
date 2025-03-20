import localFont from 'next/font/local'

const squid = localFont({
  src: '../fonts/squidfont.ttf',
  variable: "--font-squid",
  display: 'swap',
})

function Home() {
  return (
    <div className={`${squid.className} h-screen w-screen text-white bg-black flex flex-col items-center justify-center`}>
        <p className='text-9xl'>Technothon</p>
        <p className='mt-8 text-4xl'>2025</p>
    </div>
  )
}

export default Home