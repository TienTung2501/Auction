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
const wallet = await lucid.selectWalletFromSeed(await Deno.readTextFile("./bidder.seed"));
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
    auction: typeof Data.String,
    author: typeof Data.String,
    price: typeof Data.BigInt
});
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
            utxo Money:
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


console.log(utxosMoney.length)
console.log(utxosNFT.length)
const redeemer = Data.void();
const txdoneBid = await doneBidding(utxos,utxosMoney,utxosNFT, { into: validatorBid,using:redeemer });

// Time until the transaction is confirmed on the Blockchain
await lucid.awaitTx(txdoneBid);

console.log(`NFT locked into the contract
  Tx ID: ${txdoneBid}
  Transaction success
`);
async function doneBidding(utxos,utxosMoney,utxosNFT, { into, using }): Promise<TxHash> {
    // Read the contract address from the validator variable
    const contractAddress = lucid.utils.validatorToAddress(into);
   // console.log(contractAddress);
   let tx = await lucid
        .newTx();

        for(let i=0;i<utxosNFT;i++){
            const datumUtxoNFT = Data.from<DatumBid>(utxosNFT[i].datum, DatumBid);
            const utxoMoney=utxosMoney.find(element => element.policyId ===datumUtxoNFT.policyId );
            let author={ type: "Key",hash: datumUtxoNFT.author }
            let auction={ type: "Key",hash: datumUtxoNFT.winter };
            let bidder={ type: "Key",hash: datumUtxoNFT.winter };
            let auctionAddr= lucid.utils.credentialToAddress(auction);// lấy địa chỉ của sàn
            let bidderAddr=lucid.utils.credentialToAddress(bidder);// lấy địa chỉ của bidder( người đưa NFT lên)
            let authorAddr= lucid.utils.credentialToAddress(author);// lấy địa chỉ của tác giả
            let NFT= datumUtxoNFT.policyId+datumUtxoNFT.assetName; 
            if(utxoMoney!==undefined){// nếu như NFT này có người đặt giá 
                const datumUtxoMoney= Data.from<DatumBid>(utxoMoney.datum, DatumBid);
                let winter= { type: "Key",hash: datumUtxoMoney.winter }//hash: datumUtxoLastBid.winter
                let winterAddr = lucid.utils.credentialToAddress(winter);
                let priceWin=datumUtxoMoney.price;
                let priceAuction=priceWin/100*15;
                let priceAuthor=priceWin/100*5;
                let priceBidder=priceWin/100*80;
    
                tx= await lucid
                .payToAddress(bidderAddr,{ lovelace: priceBidder} )
                .payToAddress(authorAddr,{lovelace: priceAuthor})
                .payToAddress(auctionAddr,{lovelace:priceAuction})
                .payToAddress(winterAddr,{[NFT]:(1n)})
    
            }
            else if(utxoMoney=== undefined){
                tx= await lucid
                .payToAddress(bidderAddr,{ [NFT]: (1n)} )
            }
        }
    tx=await tx
        .collectFrom(utxos, using)
        .attachSpendingValidator(into)
        .addSigner(await lucid.wallet.address())
        .complete();
    // Create transaction
    // Sign transaction
    const signedTx = await tx.sign().complete();
  
    // Send transactions to onchain
    return signedTx.submit();
  }

