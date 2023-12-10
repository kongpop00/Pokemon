import { create } from 'zustand'
import {IpokemonDetailRespones} from '@/interface/pokemonDetail'

const initStore = {
    pokemon :{
        data : [],
        loading : false ,
        error:null
           
    },
    featchpokemon :{
        data : [],
        loading : false ,
        error:null
  
    }
}

type pokemontype ={
    data : IpokemonDetailRespones[]
    loading : boolean
    error : null | any
    
}
type UsePokemonListStoreType ={
    pokemon : pokemontype,
    featchpokemon : pokemontype
    setPokemonList:(value:pokemontype)=>void,
    setFetachPokemonList:(value:pokemontype)=>void,
    clearPokemon:()=> void,
}


export const usePokemonlistStore = create<UsePokemonListStoreType>((set) => ({
  ...initStore,
  setPokemonList:(value:pokemontype)=>set({pokemon:value}),
  setFetachPokemonList:(value:pokemontype)=>set({featchpokemon:value}),
  clearPokemon:()=> set({...initStore}),
 
}))

