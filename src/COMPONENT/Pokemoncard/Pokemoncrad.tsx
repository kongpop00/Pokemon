import { Type } from '@/interface/pokemonDetail'
import { Link } from 'react-router-dom'


interface Pokemoncrdpops {
    image :string,
    id  :number,
    name :string,
    types:Type[],
}

const Pokemoncrad = ({image ,id , name ,types }:Pokemoncrdpops) => {
  return (
   

<div className={ `max-w-[280px] rounded-[20px] shadow dark:bg-gray-800 dark:border-gray-700 overflow-hidden p-[10px] bg-white m-[auto]`}>
    <div className=" bg-[url('public/assets/backgroundCard.png')] bg-center  bg-cover rounded-lg">
    <Link to={`/detail/${name}`}>
        <img className=" h-[218px]  p-[30px] w-[300px]  rounded-[20px]" src={image} alt="" />
    </Link>
    </div>
    <div className=" py-5 ">
        <div className='flex justify-between'> 
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{name}</h5>
            <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">#{id}</h5>
        </div>
        <div className='flex  gap-2 justify-end'>
            {types.map((item)=>{
                return <span className={`badge-type-${item.type.name} px-2 py-1 rounded-lg capitalize`}>{item.type.name}</span>
            })}
       
        </div>

        
    </div>
</div>


  )
}

export default Pokemoncrad
