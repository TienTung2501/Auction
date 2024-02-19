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