import Pokemoncrad from "@/COMPONENT/Pokemoncard";
import Searchform from "@/COMPONENT/SearchForm/Searchform";
import { usePokemonlistStore } from "@/store/Pokemonlist";
import ReactLoading from "react-loading";

const Homepage = () => {
  const { pokemon, featchpokemon } = usePokemonlistStore();

  return (
    <div className="bg-[url('public/BG-HOME.svg')] h-[100%]   ">
      <div className="w-[80%] m-[auto]">
        <div className="w-[90%]  sm:w-[70%] md:w-[70%] lg:w-[40%]  m-[auto]  ">
          <img src="public/logo.png" alt="" />
        </div>
        <Searchform />

        {featchpokemon.loading && (
          <div className="h-[800px] flex justify-center  items-center">
            <ReactLoading type="spin" color="blue" />
          </div>
        )}

        {!featchpokemon.loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 md:grid-cols-3 gap-[20px] mt-[20px] ">
            {pokemon.data?.map((item) => {
              return (
                <Pokemoncrad
                  image={item.image || ""}
                  id={item.id}
                  name={item.name}
                  types={item.types}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
