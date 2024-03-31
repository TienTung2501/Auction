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

const wallet = lucid.selectWalletFromSeed(await Deno.readTextFile("./auction.seed"));

const validator = await readValidator();
async function readValidator(): Promise<SpendingValidator> {
    const validator = JSON.parse(await Deno.readTextFile("plutus.json")).validators[2];
    return {
      type: "PlutusV2",
      script: toHex(cbor.encode(fromHex(validator.compiledCode))),
    };
  }


const payment_credential = lucid.utils.getAddressDetails(
    await lucid.wallet.address()
).paymentCredential.hash;
//cee92c06f49e3494378dc7e023b5628c20e4645039aec57093b9935f
const stake_credential = lucid.utils.getAddressDetails(
    await lucid.wallet.address()
).stakeCredential.hash;
//90189ff2cef86afa5a7326c19e60ae22e235027a2858cca6768bbcdd
const auctionAddress= await lucid.wallet.address();
//addr_test1qr8wjtqx7j0rf9ph3hr7qga4v2xzpery2qu6a3tsjwuexhusrz0l9nhcdta95uexcx0xpt3zug6sy73gtrx2va5thnws9gt295
console.log(`address Auction: `+ auctionAddress)
console.log(`Payment Credential: `+payment_credential)
console.log(`Stake Credential: `+stake_credential)
  
  const scriptAddress = lucid.utils.validatorToAddress(validator);
  const scriptUtxos = await lucid.utxosAt(scriptAddress);
  const timeSection = new Date('March 4, 2024 15:01:57').getTime();
  const laterTime =  new Date(timeSection + 2 * 60 * 60 * 1000).getTime();

  console.log(timeSection);
  console.log(laterTime)
  const Datum = Data.Object({
    policyId: typeof Data.String,
    assetName: typeof Data.String,
    lock_until: typeof Data.BigInt, 
    voter: typeof Data.String, 
    auction: typeof Data.String, 
    });
type Datum = Data.Static<typeof Datum>;

  const utxos = scriptUtxos.filter((utxo) => {
    let datum = Data.from<Datum>(
      utxo.datum,
      Datum,
    );
    
    console.log(`Datum NFT 
    Policy:${datum.policyId}
    Asset Name: ${datum.assetName}
    lock_until:${datum.lock_until}
    `);
  // utxos sẽ chứa các utxo thỏa mãn 2 điều kiện đó là  utxo này cho người thụ hưởng và thời gian khóa hợp đồng nhỏ hơn hoặc bằng thời gian hiện tại
    return datum.lock_until <= timeSection;
      
  });
  if (utxos.length === 0) {
    console.log("No redeemable utxo found. You need to wait a little longer...");
    Deno.exit(1);
  }
  // we don't have any redeemer in our contract but it needs to be empty
  const redeemer = Data.void();// không cần sử dụng redeemer
  
  const txUnlock = await unlock(utxos, timeSection,laterTime, { from: validator, using: redeemer });
  console.log(3);
  await lucid.awaitTx(txUnlock);
   
  console.log(`NFT recovered from the contract to Voter
      Tx ID: ${txUnlock}
      Redeemer: ${redeemer}
  `);
   
  // --- Supporting functions
  // check date: call api post list top NFT
//   type NFTBid = {
//     assetname?: Data.String,
//     number?: Data.Number
// };
// let NFTs: NFTBid[]=[] 
// const utxos= scriptUtxos.filter((utxo) => {
//     try {
//         let datum = Data.from<DatumLock>(utxo.datum, DatumLock);
// //            console.log("UTxO Datum:", datum);  // In ra để kiểm tra dữ liệu
//         // console.log("Policy ID:", datum.policyId);
//         // console.log("Asset Name:", datum.assetName);
//         // console.log("Bidder:", datum.bidder);
//         const nftWithAssetName = NFTs.find(nft => nft.assetname === datum.assetName);

//         if (nftWithAssetName) {
//             nftWithAssetName.number+=1;
//         } 
//         else {
//             const newNFT = {
//                 assetname: datum.assetName,
//                 number: 1
//             };
//             NFTs.push(newNFT);
//         }
//         if(datum.assetName!==""){
//             return true
//         }
//         else
//             return false
//         // utxos sẽ chứa các utxo thỏa mãn 2 điều kiện đó là  utxo này cho người thụ hưởng và thời gian khóa hợp đồng nhỏ hơn hoặc bằng thời gian hiện tại
//     } catch (e) {
//         console.error("Error deserializing Datum:", e);
//         return false; // That UTxO is not selected
//     }
// });
// //  console.log(`number of utxo : ${utxos.length}`)
// // console.log(NFTs)
// NFTs.sort((a, b) => a.number - b.number);
// const TopNFT = NFTs.slice(0, 3);
//   if(new Date().getTime()>=laterTime){
//     let nameNFTs: typeof Data.String[]=[];
//     utxos.filter(utxo=>{
//       datum = Data.from<Datum>(utxo.datum, Datum);
//     })
//   }
  async function unlock(utxos, timeSection,laterTime, { from, using }): Promise<TxHash> {
    
    console.log(timeSection);
    console.log(laterTime);
      let tx = await lucid
        .newTx();

        for(let i=0;i<utxos.length;i++){
          let datum = Data.from<Datum>(
            utxos[i].datum,
            Datum,
          );
          const voter={ type: "Key", hash: datum.voter };
          const voterAddr=lucid.utils.credentialToAddress(voter)
          const NFT=datum.policyId+datum.assetName;
          tx= await tx
          .payToAddress(voterAddr,{[NFT]:BigInt(1)})
        }


        tx=await tx
        .collectFrom(utxos, using)
        .addSigner(await lucid.wallet.address())
        .validFrom(timeSection)
        .validTo(laterTime)
        .attachSpendingValidator(from)
        .complete();
  
      const signedTx = await tx
        .sign()
        .complete();
  
      return signedTx.submit();
    
  }
