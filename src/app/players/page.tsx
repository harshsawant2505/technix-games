import Image, { ImageProps } from 'next/image'
import one from '../../../public/players/1.png'

function PlayerPage() {
  return (
    <div className='h-screen flex items-center bg-black'>
        <div className='flex gap-2 flex-wrap overflow-hidden max-h-screen  justify-between px-32'>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one} disabled={true}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one} disabled={true}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one} disabled={true}/>
            <PlayerImage src={one}/>
            <PlayerImage src={one}/>
            
        </div>
    </div>
  )
}

function PlayerImage({src, disabled=false}:{src:any, disabled?:boolean}) {
  return (
    <Image
      src={src.src}
      alt="Player"
      className={`flex-1 min-w-[120px] object-contain ${disabled ? 'opacity-20' : ''}`}
      width={120}
      height={120}
    />
  )
}

export default PlayerPage