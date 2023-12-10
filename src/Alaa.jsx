import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { detect } from '@metamask/detect-provider';
import axios from 'axios';

// Replace with your contract address and ABI
const contractAddress = '0xF0E06525560dC68C2dB10bE0225A29760a7d78ad';
const contractAbi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_did",
				"type": "string"
			},
			{
				"name": "_name",
				"type": "string"
			},
			{
				"name": "_speciality",
				"type": "string"
			},
			{
				"name": "_age",
				"type": "uint256"
			},
			{
				"name": "_designation",
				"type": "uint256"
			},
			{
				"name": "_hash",
				"type": "string"
			},
			{
				"name": "_gender",
				"type": "string"
			},
			{
				"name": "_cnss",
				"type": "string"
			}
		],
		"name": "add_agent",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "paddr",
				"type": "address"
			},
			{
				"name": "_diagnosis",
				"type": "uint256"
			},
			{
				"name": "_hash",
				"type": "string"
			}
		],
		"name": "insurance_claim",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "addr",
				"type": "address"
			}
		],
		"name": "permit_access",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "daddr",
				"type": "address"
			}
		],
		"name": "revoke_access",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "doctorList",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "addr",
				"type": "address"
			}
		],
		"name": "get_accessed_doctorlist_for_patient",
		"outputs": [
			{
				"name": "",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "addr",
				"type": "address"
			}
		],
		"name": "get_accessed_patientlist_for_doctor",
		"outputs": [
			{
				"name": "",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "addr",
				"type": "address"
			}
		],
		"name": "get_doctor",
		"outputs": [
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "get_doctor_list",
		"outputs": [
			{
				"name": "",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "paddr",
				"type": "address"
			}
		],
		"name": "get_hash",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "addr",
				"type": "address"
			}
		],
		"name": "get_patient",
		"outputs": [
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "uint256[]"
			},
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "paddr",
				"type": "address"
			},
			{
				"name": "daddr",
				"type": "address"
			}
		],
		"name": "get_patient_doctor_name",
		"outputs": [
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "get_patient_list",
		"outputs": [
			{
				"name": "",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "addr",
				"type": "address"
			}
		],
		"name": "isDoctor",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "addr",
				"type": "address"
			}
		],
		"name": "isPatient",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "patientList",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]; // Your contract ABI

const Alaa = () => {
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);
    const [isPatient, setIsPatient] = useState(false);
    const [isDoctor, setIsDoctor] = useState(false);
	const [did, setDid] = useState(null)
	const [formData, setFormData] = useState({
	  name: '',
	  age: '',
	  speciality: ''
	});
	const [patientData, setPatientData] = useState({
		name: '',
		age: '',
		gender: '',
		cnss: ''
	  });
	const [vc, setVc] = useState(null)
	const [verfication, setVerification] = useState(null)
	const handleChangeDoctor = (e) => {
	  const { name, value } = e.target;
	  setFormData(prevState => ({
		...prevState,
		[name]: value
	  }));
	};
	const handleChangePatient = (e) => {
		const { name, value } = e.target;
		setPatientData(prevState => ({
		  ...prevState,
		  [name]: value
		}));
	  };
  
	const handleSubmit =  async (e) => {
	  e.preventDefault();
	  issueCredential(formData);
	  await contract.add_agent(did, formData.name, formData.speciality, formData.age, 1, '', '', '');
	};
	const registerPatient =  async (e) => {
		e.preventDefault();
		issueCredential(patientData);
		await contract.add_agent(did, patientData.name, '', patientData.age, 0, '', patientData.gender, patientData.cnss);
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
  
    useEffect(() => {
      const init = async () => {
      // Check if MetaMask is installed
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        // Create contract instance
        const contract = new ethers.Contract(
          contractAddress,
          contractAbi,
          provider.getSigner()
        );
        setContract(contract);
        } else {
          console.error('MetaMask not detected!');
        }
      };
  
      init();
    }, []);
  
    const connectWallet = async () => {
      try {
        // Request MetaMask to connect
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
  
        // Check if the connected account is a patient or a doctor
        const isPatientResult = await contract.isPatient(accounts[0]);
        const isDoctorResult = await contract.isDoctor(accounts[0]);
  
        setIsPatient(isPatientResult);
        setIsDoctor(isDoctorResult);
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    };
  
    const renderLoginButtons = () => {
      if (isPatient & !isDoctor) {
        return (<><button onClick={loginAsPatient}>Login as Patient</button><button onClick={registerAsDoctor}>Register as Doctor</button></>);
      } else if (isDoctor & !isPatient) {
        return (<><button onClick={loginAsDoctor}>Login as Doctor</button><button onClick={registerAsPatient}>Register as Patient</button></>);
      } else if (isDoctor & isPatient){
		return(<><button onClick={loginAsPatient}>Login as Patient</button><button onClick={loginAsDoctor}>Login as Doctor</button></>)
	  }
	  else {
        return (
          <>
            <button onClick={registerAsPatient}>Register as Patient</button>
            <button onClick={registerAsDoctor}>Register as Doctor</button>
            <div>
                <p>Register as Doctor</p>
				<button onClick={handleCreateDID}>Create DID</button>

<p>{did}</p>

<div>
 <form onSubmit={handleSubmit}>
   <label>
	 Name:
	 <input type="text" name="name" value={formData.name} onChange={handleChangeDoctor} />
   </label>
   <br />
   <label>
	 Age:
	 <input type="text" name="age" value={formData.age} onChange={handleChangeDoctor} />
   </label>
   <br />
   <label>
	 Speciality:
	 <input type="text" name="speciality" value={formData.speciality} onChange={handleChangeDoctor} />
   </label>
   <br />
   <button type="submit">Submit</button>
 </form>
</div>
{vc && <p>{vc}</p>}

<button onClick={()=>handleVerifyVC(JSON.parse(vc))}>Verify VC</button>
{verfication && <p>{verfication.toString()}</p>}
            </div>
			<div>
                <p>Register as Patient</p>
				<button onClick={handleCreateDID}>Create DID</button>

<p>{did}</p>

<div>
 <form onSubmit={registerPatient}>
   <label>
	 Name:
	 <input type="text" name="name" value={patientData.name} onChange={handleChangePatient} />
   </label>
   <br />
   <label>
	 Age:
	 <input type="text" name="age" value={patientData.age} onChange={handleChangePatient} />
   </label>
   <br />
   <label>
	 Gender:
	 <input type="text" name="gender" value={patientData.gender} onChange={handleChangePatient} />
   </label>
   <br />
   <label>
	 CNSS:
	 <input type="text" name="cnss" value={patientData.cnss} onChange={handleChangePatient} />
   </label>
   <br />
   <button type="submit">Submit</button>
 </form>
</div>
{vc && <p>{vc}</p>}

<button onClick={()=>handleVerifyVC(JSON.parse(vc))}>Verify VC</button>
{verfication && <p>{verfication.toString()}</p>}
            </div>
          </>
        );
      }
    };
  
    const loginAsPatient = async () => {
      // Implement logic for logging in as a patient
      console.log('Login as Patient');
    };
  
    const loginAsDoctor = async () => {
      // Implement logic for logging in as a doctor
      console.log('Login as Doctor');
    };
  
    const registerAsPatient = async () => {
      // Implement logic for registering as a patient
      console.log('Register as Patient');
    };
  
    const registerAsDoctor = async () => {
      // Implement logic for registering as a doctor
      console.log('Register as Doctor');
    };
  
    return (
      <div>
        <h1>Smart Contract Interaction with MetaMask Login</h1>
        {account ? (
          <div>
            <p>Connected Account: {account}</p>
            {renderLoginButtons()}
          </div>
        ) : (
          <button onClick={connectWallet}>Connect to MetaMask</button>
        )}
      </div>
    );
  };

export default Alaa;
