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

const wallet = lucid.selectWalletFromSeed(await Deno.readTextFile("./voter1.seed"));

const validator = await readValidator();
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
//2d589b414b21220b3f1617923e14b798b4f0bba0b54d0594af36a3be
const stake_credential = lucid.utils.getAddressDetails(
    await lucid.wallet.address()
).stakeCredential.hash;
//a543a1f3c612226a05c6454f26866fbe0005268191f350652086acaf
const voterAddress= await lucid.wallet.address();
//addr_test1qqk43x6pfvsjyzelzctey0s5k7vtfu9m5z656pv54um28049gwsl83sjyf4qt3j9fungvma7qqzjdqv37dgx2gyx4jhslckr7v

// NFT1: 
//policyId: 8bc25f2231d89b07b5a391071a1633b26d8342c278e2104f4ec669cc
//Asset name: 446f676572
//Doger

// NFT2:
// policyId: ad062dde1d4a9df5b001389baf14f5c078cc81f9f36b8cfe62b456ba
// AssetName: 436f66666565
// Coffee 

// NFT3: 
// policyId: b59661fa5173d69903086184f30ea83836e47481eb5c08db2b67506e
// assetName: 526f6164
// Road 

// NFT 4: 
//policyId: b9ca3e2246ae6f4653d2e5993135ca882fc9aad9fbd019b935a246dc
//assetname: 446f676572 
//Doger 

console.log(`address voter: `+ voterAddress)
console.log(`Payment Credential: `+payment_credential)
console.log(`Stake Credential: `+stake_credential)
const Datum = Data.Object({
  //    lock_until: typeof Data.BigInt, 
      policyId: typeof Data.String,
      assetName: typeof Data.String,
      voter: typeof Data.String, 
      auction: typeof Data.String, 
      });
  type Datum = Data.Static<typeof Datum>;
const NFT1=[
  {
    policyId:"8bc25f2231d89b07b5a391071a1633b26d8342c278e2104f4ec669cc",
    assetName:"446f676572"
  },
  {
    policyId:"ad062dde1d4a9df5b001389baf14f5c078cc81f9f36b8cfe62b456ba",
    assetName:"436f66666565"
  },
  {
    policyId:"b59661fa5173d69903086184f30ea83836e47481eb5c08db2b67506e",
    assetName:"526f6164"
  },
  {
    policyId:"b9ca3e2246ae6f4653d2e5993135ca882fc9aad9fbd019b935a246dc",
    assetName:"446f676572"
  },
]
const NFT2=[
  {
    policyId:"96e0d39c50af1087c580af63c8e1047677ff5e623102723cb1c3d236",
    assetName:"446f676572"
  },
  {
    policyId:"e1b854d63acaf1825384397b6f0e9b237dfde19d86406e50a1744000",
    assetName:"436f66666565"
    },
]
// let datums : Datum[] = []
// let nameNFTs: typeof Data.String[]=[];
// for (let i = 0; i < NFT1.length; i++) {
//     // Pass data into datum
//     let tmp = Data.to<Datum>(
//         {
//             policyId: NFT1[i].policyId,
//             assetName: NFT1[i].assetName,
//             voter: "2d589b414b21220b3f1617923e14b798b4f0bba0b54d0594af36a3be",
//             auction: "cee92c06f49e3494378dc7e023b5628c20e4645039aec57093b9935f",
//         },
//         Datum
//     );
//     let nameNFT=NFT1[i].policyId+NFT1[i].assetName;
//     nameNFTs.push(nameNFT)
//     datums.push(tmp);
// }
//console.log(datums);
let datums1 : Datum[] = []
let nameNFTs1: typeof Data.String[]=[];
for (let i = 0; i < NFT2.length; i++) {
    // Pass data into datum
    let tmp = Data.to<Datum>(
        {
            policyId: NFT1[i].policyId,
            assetName: NFT1[i].assetName,
            voter: "489794cd7bc74e17e8c3d069c5119b266f9b874511f95e1054a51987",
            auction: "cee92c06f49e3494378dc7e023b5628c20e4645039aec57093b9935f",
        },
        Datum
    );
    let nameNFT=NFT1[i].policyId+NFT1[i].assetName;
    nameNFTs1.push(nameNFT)
    datums1.push(tmp);
}
console.log(datums1)
console.log(nameNFTs1)

// Lock assets into contracts
const txLock = await lock(nameNFTs1, { into: validator, datum: datums1 });

// Time until the transaction is confirmed on the Blockchain
await lucid.awaitTx(txLock);

console.log(`NFT locked into the contract
  Tx ID: ${txLock}
  Datum: ${datums1}
`);
const contractAddress = lucid.utils.validatorToAddress(validator);
  console.log(contractAddress);
// Asset locking function
async function lock(NFT, { into, datum }): Promise<TxHash> {
  // Read the contract address from the validator variable
  const contractAddress = lucid.utils.validatorToAddress(into);
  console.log(contractAddress);

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


// stake1:64141a6137bbd81fa994108b12a532749fce6b08ed0797531bee7930
// payment1:489794cd7bc74e17e8c3d069c5119b266f9b874511f95e1054a51987
// address1:addr_test1qpyf09xd00r5u9lgc0gxn3g3nvnxlxu8g5gljhss2jj3npmyzsdxzdammq06n9qs3vf22vn5nl8xkz8dq7t4xxlw0ycqcwr09l

//NFT 1:
// policyId: 96e0d39c50af1087c580af63c8e1047677ff5e623102723cb1c3d236
// assetname: 446f676572
// Doger 

//NFT 2:
// policyId: e1b854d63acaf1825384397b6f0e9b237dfde19d86406e50a1744000
// assetname: 436f66666565
// Coffee 