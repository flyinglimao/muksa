import { ReactNode, createContext, useEffect, useState } from "react"

type Dao = { avatar: string; id: number; name: string }

type LocalDataObject = {
  joinedDaos: Dao[]
  addJoinedDao: (dao: Dao) => void
}

export const LocalDataContext = createContext<LocalDataObject>({
  joinedDaos: [],
  addJoinedDao: () => {
    throw new Error("Not initialized")
  },
})

export function LocalDataProvider({ children }: { children: ReactNode }) {
  const [joinedDaos, setJoinedDaos] = useState<{ avatar: string; id: number; name: string }[]>([])

  useEffect(() => {
    if (localStorage.getItem("Muksa_JoinedDao")) {
      setJoinedDaos(JSON.parse(localStorage.getItem("Muksa_JoinedDao") || ""))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("Muksa_JoinedDao", JSON.stringify(joinedDaos))
  }, [joinedDaos])

  function addJoinedDao(dao: Dao) {
    setJoinedDaos((prev) => [...prev, dao])
  }

  return (
    <LocalDataContext.Provider
      value={{
        joinedDaos,
        addJoinedDao,
      }}
    >
      {children}
    </LocalDataContext.Provider>
  )
}
