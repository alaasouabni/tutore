import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect } from 'react'
import axios from 'axios'
import Alaa from './Alaa'

function App() {
  const [count, setCount] = useState(0)
  const [did, setDid] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male', 
    cnss: ''
  });
  const [vc, setVc] = useState(null)
  const [verfication, setVerification] = useState(null)
  const [ipfsHash, setIPFSHash] = useState(null)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit =  async (e) => {
    e.preventDefault();
    issueCredential(formData)
  };

  async function issueCredential(formData) {
    const url = 'https://signatory.ssikit.walt.id/v1/credentials/issue';
    const didRaw = await createDID()
    const did = didRaw.data
    const requestBody = {
      templateId:"UniversityDegree",
      config:{
        issuerDid: did,
        subjectDid: did,
        proofType: "LD_PROOF"
      },
      credentialData:{
        id: did,
        data: formData
      }
    };
  setDid(did)
    try {
      const response = await axios.post(url, requestBody, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      setVc(JSON.stringify(response.data))
      console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }



  const createDID = async ()=>{
    const url = 'https://custodian.ssikit.walt.id/did/create';
    const requestBody = {
      method: 'key'
    };
    
    return await axios.post(url, requestBody, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
  }

  const handleCreateDID = async () => {
    const did = await createDID()
    setDid(did.data)
  }

  async function handleVerifyVC(credentials) {
    const url = 'https://auditor.ssikit.walt.id/v1/verify';
  
    const requestBody = {
      policies: [
        {
          policy: 'SignaturePolicy'
        }
      ],
      credentials: [credentials]
    };
  
    try {
      const response = await axios.post(url, requestBody, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      setVerification(response.data.valid)
      console.log('Verification Result:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  const handleUploadToIPFS = async (record = {}) => {
    return new Promise ((resolve, reject) => {
    var ipfs = window.IpfsApi('localhost', '5001')
    const Buffer = window.IpfsApi().Buffer;
  
    var buffer = Buffer(JSON.stringify(record));

    ipfs.files.add(buffer, (error, result) => {
      if(error)
      {
        console.error(error)
        reject(error)
        return
      }
      resolve(result[0].hash)
      setIPFSHash(result[0].hash)
      console.log('ipfs result', result)})
    })
  }
  
  const getFromIPFS = async (hash) => {
    fetch("http://localhost:8080/ipfs/" + hash)
  .then(response => {
    return response.json()
  })
  .then(data => {
    console.log(data) 
  })
  .catch(error => {
    console.error("Error fetching data:", error);
  });
  }

  return (
    <>

     <button onClick={handleCreateDID}>Create DID</button>

     <p>{did}</p>

     <div>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <br />
        <label>
          Age:
          <input type="text" name="age" value={formData.age} onChange={handleChange} />
        </label>
        <br />
        <label>
          Gender:
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <br />
        <label>
          CNSS:
          <input type="text" name="cnss" value={formData.cnss} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
    {vc && <p>{vc}</p>}

    <button onClick={()=>handleVerifyVC(JSON.parse(vc))}>Verify VC</button>
    {verfication && <p>{verfication.toString()}</p>}
    <button onClick={handleUploadToIPFS}>Upload to IPFS</button>
    {ipfsHash && <p>{ipfsHash}</p>}

    <button onClick={()=>getFromIPFS(ipfsHash)}>Get from IPFS</button>
    <Alaa />
    </>
  )
}

export default App
