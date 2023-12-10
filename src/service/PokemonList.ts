import { IpokemonLisRespones } from "@/interface/PokemonList"
import { pokemonURL } from "@/utils/constand"
import { handleResponse, IResponse } from '@/utils/handleresponse'
import axios from "axios"

interface IgetpokemonListRespones extends IResponse {
    status : number | undefined,
    data?   : IpokemonLisRespones
}

export const pokemonListServaice = {
    getPokemonList : async (limit?:number , offset? : number):Promise< IgetpokemonListRespones>=>{
        try {
            const respones = await axios.get( `${pokemonURL}/pokemon?limit=${limit||151}&offset=${offset|| 0}`)
            return handleResponse.success(respones)
        } catch (error:any) {
            return handleResponse.error(error)
        }
     
    }
}