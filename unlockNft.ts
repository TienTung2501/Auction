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
const validatorLock = await readLockValidator();
 
// --- Supporting functions
 
async function readLockValidator(): Promise<SpendingValidator> {
  const validator = JSON.parse(await Deno.readTextFile("plutus.json")).validators[1];
  return {
    type: "PlutusV2",
    script: toHex(cbor.encode(fromHex(validator.compiledCode))),
  };
}
const validatorUnlock = await readUnLockValidator();
 
// --- Supporting functions
let NFT=["436f66666565","446f676572"];
let ux
// bid
async function readUnLockValidator(): Promise<SpendingValidator> {
  const validator = JSON.parse(await Deno.readTextFile("plutus.json")).validators[0];
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
const scriptAddress = lucid.utils.validatorToAddress(validatorLock);// địa chỉ hợp đồng thông minh
console.log(scriptAddress);

const scriptUtxos = await lucid.utxosAt(scriptAddress);

const DatumLock = Data.Object({
//    lock_until: typeof Data.BigInt, 
    policyId: typeof Data.String,
    assetName: typeof Data.String,
    bidder: typeof Data.String, 
    auction: typeof Data.String, 
    });
type DatumLock = Data.Static<typeof DatumLock>;
// update datum khi chuyển NFT sang bid khi đó các thuộc tính winter chưa có gì, author có

const DatumBid = Data.Object({
    policyId: typeof Data.String,
    assetName: typeof Data.String,
    bidder: typeof Data.String,
    winter: typeof Data.String,
    smc_address: typeof Data.String,
    author: typeof Data.String,
    price: typeof Data.BigInt
});

type DatumBid = Data.Static<typeof DatumBid>;
    
type NFTBid = {
    assetname?: Data.String,
    number?: Data.Number
};

// lấy ra top NFT 

let NFTs: NFTBid[]=[] 
const utxos= scriptUtxos.filter((utxo) => {
    try {
        let datum = Data.from<DatumLock>(utxo.datum, DatumLock);
//            console.log("UTxO Datum:", datum);  // In ra để kiểm tra dữ liệu
        // console.log("Policy ID:", datum.policyId);
        // console.log("Asset Name:", datum.assetName);
        // console.log("Bidder:", datum.bidder);
        const nftWithAssetName = NFTs.find(nft => nft.assetname === datum.assetName);

        if (nftWithAssetName) {
            nftWithAssetName.number+=1;
        } 
        else {
            const newNFT = {
                assetname: datum.assetName,
                number: 1
            };
            NFTs.push(newNFT);
        }
        if(datum.assetName!==""){
            return true
        }
        else
            return false
        // utxos sẽ chứa các utxo thỏa mãn 2 điều kiện đó là  utxo này cho người thụ hưởng và thời gian khóa hợp đồng nhỏ hơn hoặc bằng thời gian hiện tại
    } catch (e) {
        console.error("Error deserializing Datum:", e);
        return false; // That UTxO is not selected
    }
});
//  console.log(`number of utxo : ${utxos.length}`)
// console.log(NFTs)
NFTs.sort((a, b) => a.number - b.number);
const TopNFT = NFTs.slice(0, 3);
//console.log(TopNFT)
  // khai báo 1 mảng chứa list assetname và numbers
  // lấy ra các utxo có trong list top NFT
const utxosBids = scriptUtxos.filter((utxo) => {
    try {
        // Pour datum data into the temp variable of the current UTxO
        const temp = Data.from<DatumLock>(utxo.datum, DatumLock);

        // Check to see if that UTxO actually contains the NFT you want to buy?
        if (TopNFT.find(nft => nft.assetname === temp.assetName)) {
            //UTOut = Data.from<Datum>(utxo.datum, Datum); // Get the data of UTxO and pour it into a variable
            return true; // That UTxO has been taken
            
        }
        return false; // That UTxO is not selected
    } catch (e) {
        return false; // That UTxO is not selected
    }
});
//console.log(utxosBids)

const authorPublicKeyHash =
    lucid.utils.getAddressDetails("addr_test1qqja25tffmwywjufeycgn86zj7slfj9w4wh5a7ft4png47ue0r2q9x4995mt5xscmehf5swm6qx4flkg98euf3rk45usuerp08")
        .paymentCredential.hash;
const contractUnlockAddress =
    lucid.utils.getAddressDetails(
        await lucid.utils.validatorToAddress(validatorUnlock)
    ).paymentCredential.hash;
 console.log(`contract address: ${contractUnlockAddress}`)
 const contractlockAddress = await lucid.utils.validatorToAddress(validatorLock)
 console.log(`contract address: ${contractlockAddress}`)
// update datum
// console.log(`ContractPHK:${contractPublicKeyHash}`) 6396b55efe136105aaca705704b6e91db6fe218facc8cab00763a5ce
// console.log(`author: ${authorPublicKeyHash}`) 25d551694edc474b89c930899f4297a1f4c8aeabaf4ef92ba8668afb
// let updatedatum : DatumBid[] = []
//let nameNFTs1: typeof Data.String[]=[];

// console.log(1)
// for (let i = 0; i < utxosBids.length; i++) {
//     // Pass data into datum
//     let datum = Data.from<DatumLock>(utxosBids[i].datum, DatumLock);// không liên quan
//     console.log(`datum bidder: ${datum.bidder}`)

//     let tmp = Data.to<DatumBid>(
//         {
//             policyId: datum.policyId,
//             assetName:datum.assetName,
//             bidder: datum.bidder,
//             winter: datum.bidder,
//             smc_address:contractAddress,
//             author: authorPublicKeyHash,
//             price: 0n,
//         },
//         DatumBid
//     );
    
//     updatedatum.push(tmp);
// }
//console.log(utxos)
//console.log(2)
const redeemer = Data.void();
// console.log(`Datumsauupdate ${updatedatum}`);
// The function unlocks the assets on the contract
async function unlock(utxos,utxosBids, { from, using }): Promise<TxHash> {
    // console.log(utxos);
    // console.log(updatedatum);
    const contractAddr= lucid.utils.validatorToAddress(validatorUnlock)
    // Initiate transaction
    let tx = await lucid
        .newTx();

    for (let i = 0; i < utxos.length; i++) {
        // Exchange fees need to be paid
 //       let exchange_fee = BigInt(parseInt(UTOut[i].price) * 1 / 100);
        let datum = Data.from<DatumLock>(utxos[i].datum, DatumLock);// không liên quan
        if(utxosBids.find(utxosBid => {
            const datum1 = Data.from<DatumLock>(utxosBid.datum, DatumLock);
            return datum.assetName === datum1.assetName;
        })){
            
            let updateDatumBid = Data.to<DatumBid>(
                {
                    policyId: datum.policyId,
                    assetName:datum.assetName,
                    bidder: datum.bidder,
                    winter: datum.bidder,
                    smc_address: "6396b55efe136105aaca705704b6e91db6fe218facc8cab00763a5ce",
                    author: "25d551694edc474b89c930899f4297a1f4c8aeabaf4ef92ba8668afb",
                    price: 0n,
                },
                DatumBid
            );
            // let datumBid = Data.from<DatumBid>(updateDatumBid, DatumBid);
            // console.log(`DatumBid policyId: ${datumBid.policyId}`)
            // console.log(`DatumBid assetName: ${datumBid.assetName}`)
            // console.log(`DatumBid bidder: ${datumBid.bidder}`)
            // console.log(`DatumBid winter: ${datumBid.winter}`)
            // console.log(`DatumBid smc_address: ${datumBid.smc_address}`)
            // console.log(`DatumBid author: ${datumBid.author}`)
            // console.log(`DatumBid price: ${datumBid.price}`)
            tx = await tx
            .payToContract(contractAddr,{inline: updateDatumBid},{ [datum.policyId+datum.assetName] : BigInt(1)})
            console.log(`Datum hash :${updateDatumBid}`)
            

        }
        else {
 //           console.log(22)
            let bidder= { type: "Key", hash: datum.bidder }
            let bidderAddr = lucid.utils.credentialToAddress(bidder)
            tx = await tx
            .payToAddress(bidderAddr,{ [datum.policyId+datum.assetName] : 1n})
            console.log(bidderAddr)
        }
    }
    console.log(1)
    tx = await tx
        .collectFrom(scriptUtxos, using)
        .attachSpendingValidator(from)
        .addSigner(await lucid.wallet.address())
        .complete();

    console.log(`xong ki`);

    // Sign the transaction
    let signedTx = await tx.sign().complete();

    // Send transactions to onchain
    return signedTx.submit();
}

// Execute the asset purchase transaction in the contract
const txUnlock = await unlock( utxos, utxosBids, { from: validatorLock, using: redeemer });

// // Waiting time until the transaction is confirmed on the Blockchain
await lucid.awaitTx(txUnlock);
console.log(`Success`)







