import { AxiosResponse , AxiosError} from "axios"
export interface IResponse {
    status : number | undefined,
    error? : AxiosError<AxiosResponse<AxiosResponse<any,any>,any>> | AxiosResponse<any,any> | undefined
}

export const handleResponse ={
    success :(res:AxiosResponse) =>{
        return {
            status : res.status,
            data : res.data
        }
    },
    error : (res: AxiosError<AxiosResponse>) =>{
      if (res.message === "neteork Erorr"){
        return {
            status : 500 ,
            console: res
        }   
        } else{
            return {
                status : res.response?.status,
                error : res.response?.data
                
                
            }
        }
      },
    }
    
