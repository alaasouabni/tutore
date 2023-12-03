import { Web3Storage } from "web3.storage";

function getAccessToken() {
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEU0RDU1OENjNGEyZGU4ODg2MGU0M2JkMDhGNDM3Y2NmMDRGN0Y5Q2IiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDk1MDIyMTQwNjAsIm5hbWUiOiJ0ZXN0In0.maFSn8Y-xBvN8UQhnb_44NHZRVLu90u-E-R-4u089es";
}
export function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}
export async function retrieveFilesHTTP(cid) {
  let FileName = "Project.json";
  const x = await axios.get("https://" + cid + ".ipfs.dweb.link/" + FileName);
}

export function makeFileObjects(object, filename) {
  const buffer = Buffer.from(JSON.stringify(object));
  const files = [new File([buffer], filename)];
  return files;
}

export async function storeFiles(files) {
  const client = makeStorageClient();
  const cid = await client.put(files);
  console.log("stored files with cid:", cid);
  return cid;
}

export const upload = async (data, did, walletId) => {
  const filename = `record.json`;
  const metadata = {
    data: data,
    did: did,
    walletId: walletId,
  };
  const cid = await storeFiles(makeFileObjects(metadata, filename));
  return `https://${cid}.ipfs.w3s.link/${filename}`;
};
