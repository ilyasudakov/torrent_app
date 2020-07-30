import React, { useEffect, useState } from 'react'
import './App.scss'
import { initClient } from './utils/initTorrent'
import Content from './components/Content/Content'

export const UserContext = React.createContext()

function App() {
  const [userData, setUserData] = useState(null)

  const getClientData = () => {
    let client = initClient()

    let newData = {
      client: client,
      torrents: [],
      previewTorrent: null,
    }

    setUserData({ ...newData })
  }

  useEffect(() => {
    userData === null && getClientData()
  }, [userData])

  return (
    <UserContext.Provider
      value={{
        userData: userData,
        setUserData: setUserData,
      }}
    >
      <div className="app">
        <Content />
      </div>
    </UserContext.Provider>
  )
}

export default App
