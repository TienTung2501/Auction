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
const wallet = await lucid.selectWalletFromSeed(await Deno.readTextFile("./bider2.seed"));
const validatorBid = await readBidValidator();
async function readBidValidator(): Promise<SpendingValidator> {
    const validator = JSON.parse(await Deno.readTextFile("plutus.json")).validators[0];
    return {
      type: "PlutusV2",
      script: toHex(cbor.encode(fromHex(validator.compiledCode))),
    };
  }
const bidderAddr= await lucid.wallet.address();
const bidderPaymentCredenciary= await lucid.utils.getAddressDetails(bidderAddr).paymentCredential.hash;
const bidContractAdd=await lucid.utils.validatorToAddress(validatorBid);
const bidContractpaymentcredenciary= await lucid.utils.getAddressDetails(bidContractAdd).paymentCredential.hash;
// bidder 2: 
console.log(`Bidder address ${bidderAddr}`);
//addr_test1qquy2uj5q5zudug70adv9sqa9gmr8qht5k6tav0vsv2t85udh82nml8yfrhralkukl6aquz6ru67eq8a4hv83j2ur0qqp6rmzx
console.log(`Bidder Payment Credential ${bidderPaymentCredenciary}`);
// 384572540505c6f11e7f5ac2c01d2a363382eba5b4beb1ec8314b3d3
console.log(`Bid Contract Address: ${bidContractAdd}`)
//addr_test1wqse6dcfjk7gjjtflp057c0v3nd7a656zj42ng6va202sqcanz404
console.log(`Bid Contract Payment credential: ${bidContractpaymentcredenciary}`)
//219d370995bc894969f85f4f61ec8cdbeeea9a14aaa9a34cea9ea803

//bidder 1
// address:addr_test1qr6gf6uupffhczz06cdsw58faaxjpc3uyl6fr3e0xpxjrf6slsuqykghz8wm8hgtk4kdsqh0kmc5g7zger0v8lnhpuyq0smpp9
//keyhash: f484eb9c0a537c084fd61b0750e9ef4d20e23c27f491c72f304d21a7
const DatumBid = Data.Object({
    policyId: typeof Data.String,
    assetName: typeof Data.String,
    bidder: typeof Data.String,
    winter: typeof Data.String,
    smc_address: typeof Data.String,
    author: typeof Data.String,
    price: typeof Data.BigInt
});
const assets=await lucid.utxosAt(bidderAddr);

console.log(`Assets on Bidder: ${assets.asset}`);
type DatumBid = Data.Static<typeof DatumBid>;
const utxos= await lucid.utxosAt(bidContractAdd);
const utxosNFT=utxos.filter((utxo) => {
    try {
        // Pour datum data into the temp variable of the current UTxO
        const temp = Data.from<DatumBid>(utxo.datum, DatumBid);
        // Check to see if that UTxO actually contains the NFT you want to buy?
        if (temp.price ===0n) {
            console.log(`
            utxo NFT:
            Policy Id:${temp.policyId}
            Asset Name: ${temp.assetName}
            bidder:${temp.bidder}
            winter:${temp.winter}
            smc_address:${temp.smc_address}
            author:${temp.author}
            price:${temp.price}
            `)
            return true; // That UTxO has been taken
            
        }
        return false; // That UTxO is not selected
    } catch (e) {
        return false; // That UTxO is not selected
    }
});
const utxosMoney=utxos.filter((utxo) => {
    try {
        // Pour datum data into the temp variable of the current UTxO
        const temp = Data.from<DatumBid>(utxo.datum, DatumBid);
        
        // Check to see if that UTxO actually contains the NFT you want to buy?
        if (temp.price !==0n) {
            console.log(`
            Money on Contract:
            policyId:${temp.policyId}
            bidderAddr:${temp.bidder}
            price:${temp.price}
            `)
            return true; // That UTxO has been taken
           
            
        }
        return false; // That UTxO is not selected
    } catch (e) {
        return false; // That UTxO is not selected
    }
});
const datums: DatumBid[]=[
    {
        policyId:"30536421d43e6247a1a0ba9c71d184cac936a7222dc574a8913147c5",
        assetName: "436f66666565",
        bidder:"384572540505c6f11e7f5ac2c01d2a363382eba5b4beb1ec8314b3d3",
        winter:"384572540505c6f11e7f5ac2c01d2a363382eba5b4beb1ec8314b3d3",
        smc_address:"6396b55efe136105aaca705704b6e91db6fe218facc8cab00763a5ce",
        author:"25d551694edc474b89c930899f4297a1f4c8aeabaf4ef92ba8668afb",
        price:10000000n//10Ada
    },//00
    {
        policyId:"30536421d43e6247a1a0ba9c71d184cac936a7222dc574a8913147c5",
        assetName: "436f66666565",
        bidder:"384572540505c6f11e7f5ac2c01d2a363382eba5b4beb1ec8314b3d3",
        winter:"384572540505c6f11e7f5ac2c01d2a363382eba5b4beb1ec8314b3d3",
        smc_address:"6396b55efe136105aaca705704b6e91db6fe218facc8cab00763a5ce",
        author:"25d551694edc474b89c930899f4297a1f4c8aeabaf4ef92ba8668afb",
        price:25000000n//10Ada
    },//01
    {
        policyId:"5444c748eb01aa93d2cb4441e84c340d0a2b8154f341494d9f9ae787",
        assetName: "446f676572",
        bidder:"f484eb9c0a537c084fd61b0750e9ef4d20e23c27f491c72f304d21a7",
        winter:"f484eb9c0a537c084fd61b0750e9ef4d20e23c27f491c72f304d21a7",
        smc_address:"6396b55efe136105aaca705704b6e91db6fe218facc8cab00763a5ce",
        author:"25d551694edc474b89c930899f4297a1f4c8aeabaf4ef92ba8668afb",
        price:10000000n//15ada
    },//10
    {
        policyId:"5444c748eb01aa93d2cb4441e84c340d0a2b8154f341494d9f9ae787",
        assetName: "446f676572",
        bidder:"384572540505c6f11e7f5ac2c01d2a363382eba5b4beb1ec8314b3d3",
        winter:"384572540505c6f11e7f5ac2c01d2a363382eba5b4beb1ec8314b3d3",
        smc_address:"6396b55efe136105aaca705704b6e91db6fe218facc8cab00763a5ce",
        author:"25d551694edc474b89c930899f4297a1f4c8aeabaf4ef92ba8668afb",
        price:15000000n//15ada
    },//11
    {
        policyId:"6fa09568177b414920682fc5dfff422223629ba4ba13765121cf23d6",
        assetName: "526f6164",
        bidder:"f484eb9c0a537c084fd61b0750e9ef4d20e23c27f491c72f304d21a7",
        winter:"f484eb9c0a537c084fd61b0750e9ef4d20e23c27f491c72f304d21a7",// bidder 1
        smc_address:"6396b55efe136105aaca705704b6e91db6fe218facc8cab00763a5ce",
        author:"25d551694edc474b89c930899f4297a1f4c8aeabaf4ef92ba8668afb",
        price:25000000n
    }//20
]
let bidderhash={type:"Key",hash:"384572540505c6f11e7f5ac2c01d2a363382eba5b4beb1ec8314b3d3"};
let bidderAdd=lucid.utils.credentialToAddress(bidderhash);
console.log(`bidderAddr: ${bidderAdd}`);
const redeemer = Data.void();
// const txbid = await bidding(utxosMoney,utxosNFT, { into: validatorBid, datum: datums[1], using:redeemer });

// // Time until the transaction is confirmed on the Blockchain
// await lucid.awaitTx(txbid);

// console.log(`Bidded success into the contract
//   Tx ID: ${txbid}
//   Transaction success
// `);
console.log(bidContractAdd)
async function bidding(utxosMoney,utxosNFT, { into, datum, using }): Promise<TxHash> {
    // Read the contract address from the validator variable
    const contractAddress = lucid.utils.validatorToAddress(into);
    console.log(`contract address: ${contractAddress}`)
    const utxoLastBid = filterUtxosByPolicyId(utxosMoney, datum);
    const utxoNFT = filterUtxosByPolicyId(utxosNFT, datum);
   // console.log(contractAddress);
   console.log(utxoLastBid.length)
   let datumUtxoLastBid: DatumBid;
   if(utxoLastBid.length>0){
    datumUtxoLastBid= Data.from<DatumBid>(utxoLastBid[0].datum, DatumBid);
   }
    
   const datumUtxoNFT= Data.from<DatumBid>(utxoNFT[0].datum, DatumBid);
//    console.log(typeof datumUtxoNFT)
//    console.log(typeof datumUtxoLastBid)
//    console.log(111)
 //  console.log(typeof datum.price)
 let tmp = Data.to<DatumBid>( datum,DatumBid);



let tx = await lucid
    .newTx();

   if(datumUtxoLastBid!==undefined && datumUtxoNFT!==undefined){
        console.log(`Find utxo with policyId ${datumUtxoLastBid.policyId}`)
        let winter= { type: "Key",hash: datumUtxoLastBid.winter }//hash: datumUtxoLastBid.winter
        let winterAddr = lucid.utils.credentialToAddress(winter)
        console.log(`winter address:${winterAddr}`)
        console.log(`Datum utxo last bid: 
        winter: ${datumUtxoLastBid.winter}
        ${datumUtxoLastBid.policyId}
        bidder: ${datumUtxoLastBid.bidder}
        `);
        tx= await tx
        .payToAddress(winterAddr, { lovelace:datumUtxoLastBid.price})
        .payToContract(contractAddress, { inline: tmp }, { lovelace:datum.price})
        .collectFrom(utxosMoney, using)
        .attachSpendingValidator(into)
        .addSigner(await lucid.wallet.address());
    }
    else if(datumUtxoNFT!==undefined){
        console.log(`First Bid`)
        console.log(`Price: ${datum.price}`)
        tx = await tx.payToContract(contractAddress, { inline: tmp }, { lovelace: datum.price});
        console.log(11)

    }
    
    tx = await tx
    .complete();

    // Create transaction
    // Sign transaction
    console.log(1)
    const signedTx = await tx.sign().complete();
  
    // Send transactions to onchain
    return signedTx.submit();
  }

  function filterUtxosByPolicyId(utxos, datum) {
    return utxos.filter((utxo) => {
        try {
            // Pour datum data into the temp variable of the current UTxO
            const temp = Data.from<DatumBid>(utxo.datum, DatumBid);
            // Check to see if that UTxO actually contains the NFT you want to buy?
            if (temp.policyId === datum.policyId) {
                return true; // That UTxO has been taken
            }
            return false; // That UTxO is not selected
        } catch (e) {
            return false; // That UTxO is not selected
        }
    });
}
