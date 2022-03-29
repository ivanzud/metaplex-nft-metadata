import "./styles.css";
import { useEffect, useState } from "react";
import { Account } from "@metaplex-foundation/mpl-core";
import Card from "./components/Card";
import { Connection, programs } from "@metaplex/js";
const {
  metadata: { Metadata },
} = programs;

const connection = new Connection("devnet");
const tokenPublicKey = "Gz3vYbpsB2agTsAwedtvtTkQ1CG9vsioqLW3r9ecNpvZ";

export default function App() {
  const [tokenAdr, setToken] = useState(tokenPublicKey);
  const [newToken, setNewToken] = useState(tokenPublicKey);
  const [data, setData] = useState<unknown>(null);
  const [imageSrc, setImage] = useState(null);
  const [name, setName] = useState<unknown>(null);
  const [url, setUrl] = useState<string>("");
  useEffect(() => {
    const loadImageData = async (uri: string) => {
      const response = await fetch(uri);
      const { image } = await response.json();
      setImage(image);
    };

    const getMetadata = async () => {
      const ownedMetadata = await Metadata.load(connection, tokenPublicKey);
      console.log(ownedMetadata);
      await loadImageData(ownedMetadata.data.data.uri);
      setData(ownedMetadata);
      setName(ownedMetadata.data.data.name);
      setUrl(ownedMetadata.data.data.uri);
    };

    getMetadata();
  }, [tokenAdr]);

  useEffect(() => {
    const loadNFTdata = async (uri: string) => {
      const response = await fetch(uri);
      const { properties } = await response.json();
      console.log(properties);
      // setImage(image);
    };

    const getNFTData = async () => {
      const ownedMetadata = await Metadata.load(connection, tokenPublicKey);
      console.log(ownedMetadata);
      await loadNFTdata(ownedMetadata.data.data.uri);
      // setData(ownedMetadata);
      // setName(ownedMetadata.data.data.name);
      // setUrl(ownedMetadata.data.data.uri);
    };

    getNFTData();
  }, [tokenAdr]);

  return (
    <div className="App">
      <input
        value={newToken}
        onChange={(evt) => setNewToken(evt.target.value)}
      />
      <button onClick={() => setToken(newToken)}>Load metadata</button>
      <div>{url}</div>
      {!data ? (
        "Loading..."
      ) : (
        <div>
          <Card imageSrc={imageSrc} text={name} />
          <h2>Metadata</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
