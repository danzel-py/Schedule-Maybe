import { useRouter } from "next/router"
import { useEffect, useState } from "react"



export default function Page404() {
  const [counter,setCounter] = useState<number>(5)
  const router = useRouter()

  useEffect(() => {
    if(counter == 1){
      router.push('/')
    }
    counter > 1 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);


  return(
    <main>
      404, redirecting to homepage in {counter}...

      <button className="bg-gray-200 hover:bg-gray-500 hover:text-white text-gray-500 text-center py-2 px-4 rounded"

      onClick={()=>router.back()}>go back instead</button>
    </main>
  )
}