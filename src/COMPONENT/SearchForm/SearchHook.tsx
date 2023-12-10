import { IpokemonDetailRespones } from "@/interface/pokemonDetail";
import { pokemonDetailServaice, pokemonListServaice } from "@/service";
import { usePokemonlistStore } from "@/store/Pokemonlist";
import { generationList } from "@/utils/optionList";
import { useEffect } from "react";
import { useForm } from "react-hook-form";


const useSearchForm = () => {
  const {
    register,
   
    watch,
  } = useForm();
  const { setFetachPokemonList, featchpokemon, setPokemonList  } =
    usePokemonlistStore();
  const keyword = watch("keyword");
  const Generation = watch("Generation");
  const Type = watch("Type");
  const sort = watch("sort");
  const calldata = async (filter: {
    name: string;
    limit: number;
    offset: number;
  }) => {
    setFetachPokemonList({ data: [], loading: true,error: null });
    const responesList = await pokemonListServaice.getPokemonList(
      filter.limit,
      filter.offset
    );

    const pokeList = [];
    if (responesList.status === 200) {
      const responseResults = responesList.data?.results || [];
      for (const pokemon of responseResults) {
        const response = await pokemonDetailServaice.getPokemonDetail(
          pokemon.name
        );
        const pokeData = response.data;
        if (pokeData)
          pokeList.push({
            ...pokeData,
            image:
              pokeData.sprites.other.dream_world.front_default ||
              pokeData.sprites.other["official-artwork"].front_default,
          });
      }

      setFetachPokemonList({ data: pokeList,loading: false, error: null,});
      const data = filterPokemon(  pokeList, keyword, Type, sort )
      setPokemonList({ data: data,loading: false,   error: null,
      });
    } else {
      setFetachPokemonList({ data: [], loading: false,error: responesList.error,});
    }
  };

  
  var filterPokemon = (
    pokeList :IpokemonDetailRespones[],
     keyword: string,
     Type: string, 
     sort:'id' | 'name'
     ) => {
    const keywordfilter =  pokeList.filter((item) =>
      item.name.toLowerCase().includes(keyword?.toLowerCase())
    )
    const Typefilter = Type !== 'all types'? keywordfilter.filter((item)=>
    item.types.find((f)=>f.type.name.toLowerCase().includes( Type.toLowerCase())
    )
    )
   
    :keywordfilter
    
   return sortBy(Typefilter ,sort)
  };
  const sortBy = (data: IpokemonDetailRespones[], Type: 'id' | 'name') => {
    switch (Type) {
      case 'id':
        return data.sort((a, b) => a.id-b.id)
      case 'name':
        return data.sort((a, b) =>(a.name>b.name? 1 : b.name > a.name? -1 : 0))
      default:
        return data.sort((a, b) => a.id-b.id)
    }
  };


 
  useEffect(() => {
    if (Generation !== undefined) {
      calldata(generationList[Generation]);
    }
  }, [Generation ]);

  useEffect(() => {
    const data = filterPokemon( featchpokemon.data, keyword, Type, sort )
  setPokemonList({
      data: data,
      loading: false,   
      error: null,
    });
  },[keyword, Type, sort ,featchpokemon  ])

  return {
    fieldKeyWord: register('keyword'),
    fieldGeneration: register('Generation'),
    fieldType: register('Type'),
    fieldSort: register('sort'),
  }
}
export { useSearchForm };
