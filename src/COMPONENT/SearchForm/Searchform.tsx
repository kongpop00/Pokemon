
import {generationList ,sortList , typesList} from '@/utils/optionList'
import { useSearchForm } from "./SearchHook";

const Searchform = () => {
  const {fieldKeyWord ,fieldGeneration,fieldSort,fieldType } = useSearchForm()
  return (
    <form className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-[20px] w-[100%] bg-red-500 h-[100%] rounded-xl p-[40px] mt-[40px]">
      <div >
        <label
          htmlFor=" Generation"
          className="block mb-2 text-md font-medium text-white"
        >
          Generation
        </label>
        <select
        {...fieldGeneration}
          id=" Generation"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
      
          {generationList.map((item ,index)=>{
            return<option key={`generation-key=${index}`} value={index} selected>{item.name}</option>
          })}
        </select>
      </div>
      <div>
        <label
          htmlFor=" Generation "
          className="block mb-2 text-md font-medium text-white"
        >
          Type
        </label>
        <select
        {...fieldType}
          id="  Type"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {typesList.map((item ,index)=>{
            return <option key={`type-key=${index}`} value={item} selected>{item}</option>
          })}
        </select>
      </div>
      <div>
        <label
          htmlFor=" Generation"
          className="block mb-2 text-md font-medium text-white"
        >
        Sort By
        </label>
        <select
        {...fieldSort}
          id="  Sort "
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
         {sortList.map((item ,index)=>{
            return <option key={`sort-key=${index}`} value={item} selected>{item}</option>
          })}
        </select>
      </div>
      <div>
        <label
          htmlFor=" Generation"
          className="block mb-2 text-md font-medium text-white"
        >
          Search
        </label>
        <input
          {...fieldKeyWord}
          id=" input"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
 
        </input>
      </div>
    </form>
    
  );
};

export default Searchform;
