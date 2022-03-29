import { programs } from "@metaplex/js";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  AccountInfo,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

export function loadWalletKey(keypair): Keypair {
  if (!keypair || keypair == "") {
    throw new Error("Keypair is required!");
  }
  const loaded = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(keypair).toString()))
  );
  console.log(`wallet public key: ${loaded.publicKey}`);
  return loaded;
}

export const updateMetadataV1 = async () => {
  let {
    metadata: { Metadata, UpdateMetadata, MetadataDataData, Creator },
  } = programs;
  let signer = loadWalletKey(keyfile);
  let nftMintAccount = new PublicKey(
    "EC8gGdtVFDoTf3vEGbLvPp7SVWta2xQrs99iWMbaFrdE"
  );
  let metadataAccount = await Metadata.getPDA(nftMintAccount);
  const metadat = await Metadata.load(solConnection, metadataAccount);
  let newUri = "https://arweave.net/my arweave address";
  if (metadat.data.data.creators != null) {
    const creators = metadat.data.data.creators.map(
      (el) =>
        new Creator({
          ...el,
        })
    );
    let newMetadataData = new MetadataDataData({
      name: metadat.data.data.name,
      symbol: metadat.data.data.symbol,
      uri: newUri,
      creators: [...creators],
      sellerFeeBasisPoints: metadat.data.data.sellerFeeBasisPoints,
    });
    const updateTx = new UpdateMetadata(
      { feePayer: signer.publicKey },
      {
        metadata: metadataAccount,
        updateAuthority: signer.publicKey,
        metadataData: newMetadataData,
        newUpdateAuthority: signer.publicKey,
        primarySaleHappened: metadat.data.primarySaleHappened,
      }
    );
    let result = await sendAndConfirmTransaction(solConnection, updateTx, [
      signer,
    ]);
    console.log("result =", result);
  }
};
