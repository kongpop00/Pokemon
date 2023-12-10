
export interface IpokemonLisRespones  {

    count :number,
    next  : string,
     previous  :  null
    results : IpokemonList[]
    

}
export interface  IpokemonList {

    name :  string,
    url  :  string
}

