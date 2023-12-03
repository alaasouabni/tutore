import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect } from 'react'
import { upload } from './utils/web3storage'
function App() {
  const [count, setCount] = useState(0)
  const [did, setDid] = useState(null)

  useEffect(()=>{
    upload({ test: "hello" }, "DID:1234", "walletId:1234");
  },[])

  const handleCreateDID = async ()=>{
    const res = await fetch("http://localhost:3000/createDID", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    console.log(data);
    setDid(data);
  }

  return (
    <>
     <button onClick={handleCreateDID}>Create DID</button>
    </>
  )
}

export default App
