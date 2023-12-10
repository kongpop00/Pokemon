import { IpokemonDetailRespones } from "@/interface/pokemonDetail";
import { pokemonDetailServaice } from "@/service";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
type pokemontype = {
  data: IpokemonDetailRespones | undefined;
  loading: boolean;
  error: null | any;
};

const Detail = () => {
  const { name } = useParams();

  const [pokemon, setPokemon] = useState<pokemontype>({
    data: undefined,
    loading: true,
    error: null,
  });
  const calldata = async (name: string) => {
    const response = await pokemonDetailServaice.getPokemonDetail(name);
    if (response.status === 200) {
      if (response.data)
        setPokemon({
          data: {
            ...response.data,
            image:
              response.data.sprites.other.dream_world.front_default ||
              response.data.sprites.other["official-artwork"].front_default,
          },
          loading: false,
          error: null,
        });
    } else {
      setPokemon({
        data: undefined,
        loading: false,
        error: response.error,
      });
    }
  };

  useEffect(() => {
    if (name) calldata(name);
  }, [name]);

  return (
    <div className="">
      <div className=" bg-[url('public/POKEMON.svg')] h-[100vh] py-[100px] bg-cover bg-center flex flex-col justify-center items-center text-center ">
        <div className=" w-[70%] sm:w-[80%] ">
          <div className="w-[50%]  sm:w-[50%] md:w-[50%] lg:w-[30%]  m-[auto] z-20 relative ">
            <img src="/public/logo.png" alt="" />
          </div>
          <div className="w-[90%] max-w-[600px] m-[auto]  ">
            {pokemon.data && (
              <div className={`mt-[-30px]`}>
                <div className="relative">
                  <div className=" rounded-t-[25px] bg-slate-200  border-slate-500  p-[20px] mt-[-70px] z-10 border-double border-x-[15px] border-t-[15px] ">
                    <div className="bg-red-500  bg-center rounded-[20px] w-[90%]  m-[auto] border-[5px] border-slate-500 ">
                      <img
                        className=" h-[400px]  w-[100%] relative  "
                        src={pokemon.data.image}
                        alt=""
                      />
                    </div>
                  </div>
                </div>

                <div className=" py-5 bg-slate-300 rounded-b-[25px] p-[40px] z-50 border-double border-x-[15px] border-b-[15px] border-slate-500  ">
                  <div className="flex justify-between">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white capitalize">
                      {pokemon.data.name}
                    </h5>
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                      #{pokemon.data.id}
                    </h5>
                  </div>
                  <div className="grid grid-cols-2 ">
                    <div className="">
                      <div className="flex gap-x-[20px]">
                        <div>Height</div>
                        <div>{(pokemon.data.height / 10).toFixed(2)} m.</div>
                      </div>
                      <div className="flex gap-x-[10px]">
                        <div>Weight</div>
                        <div>{(pokemon.data.weight / 10).toFixed(2)} kg.</div>
                      </div>
                    </div>
                    <div className="flex  gap-2 justify-end h-[30px]">
                      {pokemon.data.types.map((item) => {
                        return (
                          <span
                            className={`badge-type-${item.type.name} px-2 py-1 rounded-lg capitalize`}
                          >
                            {item.type.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 grid-cols-1 mt-[20px] ">
                    <div>
                      <h5 className="text-lg  font-medium">Abilities</h5>
                      <div className="">
                        {pokemon.data.abilities.map((item) => {
                          return (
                            <div>
                              <div
                                className={` px-2  rounded-lg capitalize w-[60%] mt-[20px] bg-white  `}
                              >
                                {item.ability.name}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <h5 className="  xl:text-lg  font-medium  ">Status</h5>
                      <div className="">
                        {pokemon.data.stats.map((item) => {
                          return (
                            <div className="  flex justify-between  px-[20px]">
                              <div className="text-cyan-600 font-medium">
                                {item.stat.name}
                              </div>
                              <div
                                className={`bg-slate-200  rounded-[100%] w-[25px] h-[25px] text-center`}
                              >
                                {item.base_stat}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
