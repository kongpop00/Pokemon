import axios from "axios"
import { pokemonURL } from "@/utils/constand"
import { IpokemonDetailRespones } from "@/interface/pokemonDetail"
import { IResponse, handleResponse } from "@/utils/handleresponse"



interface IgetpokemonDetailRespones extends IResponse {
    status : number | undefined,
    data ?  : IpokemonDetailRespones
}

export const pokemonDetailServaice = {
    getPokemonDetail: async (name : string):Promise< IgetpokemonDetailRespones>=>{
     
     
     try {
        const respones = await axios.get( `${pokemonURL}/pokemon/${name}`)
        return handleResponse.success(respones)
    } catch (error:any) {
        return handleResponse.error(error)
    }
 
},
    }
