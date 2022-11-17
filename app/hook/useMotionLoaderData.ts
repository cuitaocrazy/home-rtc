import { useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";

export function useMotionLoaderData<T>() {
  const data = useLoaderData<T>()
  const lastData = useRef<typeof data>(data)

  useEffect(() => {
    if(data) {
      lastData.current = data
    }
  }, [data])
  return data || lastData.current
}