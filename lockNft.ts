import {
    Blockfrost,
    C,
    Data,
    Lucid,
    SpendingValidator,
    TxHash,
    fromHex,
    toHex,
    Wallet,
  } from "https://deno.land/x/lucid@0.10.7/mod.ts";
  import * as cbor from "https://deno.land/x/cbor@v1.4.1/index.js";
   
  const lucid = await Lucid.new(
    new Blockfrost(
        "https://cardano-preview.blockfrost.io/api/v0",
        "preview5ZEeQD8I1W8MHLEwlKy7NEmXKjSPJhRZ",
    ),
    "Preview",
);
// NFT1: 30536421d43e6247a1a0ba9c71d184cac936a7222dc574a8913147c5
// AssetName1: 436f66666565
//Coffee

//NFT2:5444c748eb01aa93d2cb4441e84c340d0a2b8154f341494d9f9ae787
// AssetName2:446f676572
// Doger

//NFT3: 6fa09568177b414920682fc5dfff422223629ba4ba13765121cf23d6
//AssetName: 526f6164
//Road
const wallet = lucid.selectWalletFromSeed(await Deno.readTextFile("./bidder.seed"));

const validator = await readValidator();
 
// --- Supporting functions
 
async function readValidator(): Promise<SpendingValidator> {
  const validator = JSON.parse(await Deno.readTextFile("plutus.json")).validators[1];
  return {
    type: "PlutusV2",
    script: toHex(cbor.encode(fromHex(validator.compiledCode))),
  };
}
const payment_credential = lucid.utils.getAddressDetails(
    await lucid.wallet.address()
).paymentCredential.hash;
//f484eb9c0a537c084fd61b0750e9ef4d20e23c27f491c72f304d21a7
const stake_credential = lucid.utils.getAddressDetails(
    await lucid.wallet.address()
).stakeCredential.hash;
//50fc3802591711ddb3dd0bb56cd802efb6f1447848c8dec3fe770f08
const bidderAddress= await lucid.wallet.address();
const Datum = Data.Object({
//    lock_until: typeof Data.BigInt, 
    policyId: typeof Data.String,
    assetName: typeof Data.String,
    bidder: typeof Data.String, 
    auction: typeof Data.String, 
    });
type Datum = Data.Static<typeof Datum>;
// const datum = Data.to<Datum>(
//     {
//       policyId: "30536421d43e6247a1a0ba9c71d184cac936a7222dc574a8913147c5", 
//       assetName:"436f66666565",
//       bidder: payment_credential, // our own wallet verification key hash
//       auction: "cee92c06f49e3494378dc7e023b5628c20e4645039aec57093b9935f",
//     },
//     Datum
//   );
//   const datum = Data.to<Datum>(
//     {
//       policyId: "5444c748eb01aa93d2cb4441e84c340d0a2b8154f341494d9f9ae787", 
//       assetName:"446f676572",
//       bidder: payment_credential, // our own wallet verification key hash
//       auction: "cee92c06f49e3494378dc7e023b5628c20e4645039aec57093b9935f",
//     },
//     Datum
//   );
  const datum = Data.to<Datum>(
    {
      policyId: "6fa09568177b414920682fc5dfff422223629ba4ba13765121cf23d6", 
      assetName:"526f6164",
      bidder: payment_credential, // our own wallet verification key hash
      auction: "cee92c06f49e3494378dc7e023b5628c20e4645039aec57093b9935f",
    },
    Datum
  );
  let winter= { type: "Key", hash: "489794cd7bc74e17e8c3d069c5119b266f9b874511f95e1054a51987" }
  let winterAddr = lucid.utils.credentialToAddress(winter)
  console.log(`winter address:${winterAddr}`)

//addr_test1qr6gf6uupffhczz06cdsw58faaxjpc3uyl6fr3e0xpxjrf6slsuqykghz8wm8hgtk4kdsqh0kmc5g7zger0v8lnhpuyq0smpp9
console.log(`address Bidder: `+ bidderAddress)
console.log(`Payment Credential: `+payment_credential)
console.log(`Stake Credential: `+stake_credential)
const NFT = "6fa09568177b414920682fc5dfff422223629ba4ba13765121cf23d6" + "526f6164";
const NFT1=[
  {
    policyId:"28ba7433939a496afe1a174fbb87880d3a5d9c54c49cf59bc115a3e3",
    assetName:"4d6f6f6e"
  },
  {
    policyId:"b506e34512f4daf84bc550a222728c6ab34c3f89d53f145960eea2fb",
    assetName:"53756e"
    //sun
    },
]
let datums1 : Datum[] = []
let nameNFTs1: typeof Data.String[]=[];
for (let i = 0; i < NFT1.length; i++) {
    // Pass data into datum
    let tmp = Data.to<Datum>(
        {
            policyId: NFT1[i].policyId,
            assetName: NFT1[i].assetName,
            bidder: "489794cd7bc74e17e8c3d069c5119b266f9b874511f95e1054a51987",
            auction: "cee92c06f49e3494378dc7e023b5628c20e4645039aec57093b9935f",
        },
        Datum
    );
    let nameNFT=NFT1[i].policyId+NFT1[i].assetName;
    nameNFTs1.push(nameNFT)
    datums1.push(tmp);
    console.log(tmp)
}
console.log(datums1)
console.log(nameNFTs1)
// const txLock = await lock(NFT, { into: validator, datum: datum });

// await lucid.awaitTx(txLock);

// console.log(`NFT lock to the contract
//     Tx ID: ${txLock}
// `);
// async function lock(NFT, { into, datum }): Promise<TxHash> {
//     const contractAddress = lucid.utils.validatorToAddress(into);
   
//     const tx = await lucid
//       .newTx()
//       .payToContract(contractAddress, { inline: datum }, { [NFT]:BigInt(1) })
//       .complete();
   
//     const signedTx = await tx.sign().complete();
   
//     return signedTx.submit();
//   }

// const txLock = await lock(nameNFTs1, { into: validator, datum: datums1 });

// // Time until the transaction is confirmed on the Blockchain
// await lucid.awaitTx(txLock);

// console.log(`NFT locked into the contract
//   Tx ID: ${txLock}
//   Datum: ${datums1}
// `);
const contractAddress = lucid.utils.validatorToAddress(validator);
  console.log(contractAddress);
// Asset locking function
async function lock(NFT, { into, datum }): Promise<TxHash> {
  // Read the contract address from the validator variable
  const contractAddress = lucid.utils.validatorToAddress(into);
 // console.log(contractAddress);

  // Create transaction
  let tx = await lucid
      .newTx();

  for (let i = 0; i < datum.length; i++) {
      tx = await tx.payToContract(contractAddress, { inline: datum[i] }, { [NFT[i]]: BigInt(1)});
  }

  tx = await tx
      .complete();

  // Sign transaction
  const signedTx = await tx.sign().complete();

  // Send transactions to onchain
  return signedTx.submit();
}

const scriptAddress = lucid.utils.validatorToAddress(validator);// địa chỉ hợp đồng thông minh
//console.log(scriptAddress);
  const scriptUtxos = await lucid.utxosAt(scriptAddress);

    scriptUtxos.filter((utxo) => {
        try {
            let datum = Data.from<Datum>(utxo.datum, Datum);
            // console.log("UTxO Datum:", datum);  // In ra để kiểm tra dữ liệu
            // console.log("Beneficiary:", datum.beneficiary);
            // console.log("Policy ID:", datum.policyId);
            // console.log("Asset Name:", datum.assetName);
    
            // utxos sẽ chứa các utxo thỏa mãn 2 điều kiện đó là  utxo này cho người thụ hưởng và thời gian khóa hợp đồng nhỏ hơn hoặc bằng thời gian hiện tại
        } catch (e) {
            console.error("Error deserializing Datum:", e);
            return false; // That UTxO is not selected
        }
  });
