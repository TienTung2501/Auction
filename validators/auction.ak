use aiken/hash.{Blake2b_224,Hash}
use aiken/transaction/credential.{VerificationKey}
use aiken/interval.{Finite}
use aiken/list
use aiken/transaction.{Transaction,ScriptContext,Spend,ValidityRange}
use aiken/transaction/value.{AssetName, PolicyId, lovelace_of, quantity_of}

use auction/types.{VerificationKeyHash,POSIXTime}
use auction/utils.{must_start_after, must_be_signed_by}
type DatumVote {
  policyId: PolicyId,
  assetName: AssetName,
  lock_until: POSIXTime,
  voter: VerificationKeyHash,
  auction: VerificationKeyHash
}
type DatumLock{
    policyId: PolicyId,
    assetName: AssetName,
    bidder: VerificationKeyHash,
    auction: VerificationKeyHash,
}
// check có tối thiểu 1 tài sản có tên là asset name trong ví nếu không thì không được vote nhưng trước mắt cứ thế này trước đã
validator{
    fn vote(datum: DatumVote, _redeemer: Void, ctx: ScriptContext){
        // Về nguyên tắc(in principle), tập lệnh(scripts) có thể được sử dụng cho nhiều mục đích khác nhau (ví dụ: đúc tài sản). Ở đây chúng tôi đảm bảo rằng nó chỉ được sử dụng khi 'chi tiêu' từ eUTxO
        // In principle, scripts can be used for different purpose (e.g. minting
        // assets). Here we make sure it's only used when 'spending' from a eUTxO
        when ctx.purpose is{
            Spend(_)->{
                    must_be_signed_by(ctx.transaction,datum.auction) &&
                    must_start_after(ctx.transaction.validity_range,datum.lock_until)
                }
            _ -> False
        }
    }
}
validator{
    fn lockAssets(datum: DatumLock, _redeemer: Void, ctx: ScriptContext){
        // Về nguyên tắc(in principle), tập lệnh(scripts) có thể được sử dụng cho nhiều mục đích khác nhau (ví dụ: đúc tài sản). Ở đây chúng tôi đảm bảo rằng nó chỉ được sử dụng khi 'chi tiêu' từ eUTxO
        // In principle, scripts can be used for different purpose (e.g. minting
        // assets). Here we make sure it's only used when 'spending' from a eUTxO
        when ctx.purpose is{
            Spend(_)->{
                    must_be_signed_by(ctx.transaction,datum.auction)// kí bởi sàn
                }
            _ -> False
        }
    }
}
type DatumBid {
  policyId: PolicyId,
  assetName: AssetName,
  lock_until: POSIXTime,
  bidder: VerificationKeyHash,
  winner: VerificationKeyHash,
  smc_address: VerificationKeyHash,
  auction: VerificationKeyHash,
  author: VerificationKeyHash,
  price: Int,
}
validator{
    fn bidAsset(datum: DatumBid, _redeemer: Void, ctx: ScriptContext){
        // Về nguyên tắc(in principle), tập lệnh(scripts) có thể được sử dụng cho nhiều mục đích khác nhau (ví dụ: đúc tài sản). Ở đây chúng tôi đảm bảo rằng nó chỉ được sử dụng khi 'chi tiêu' từ eUTxO
        // In principle, scripts can be used for different purpose (e.g. minting
        // assets). Here we make sure it's only used when 'spending' from a eUTxO
        let ScriptContext {purpose,..} =ctx
        when purpose is{
            Spend(_)->
               True
                   // kí bởi người thụ hưởng
                    //must_start_after(ctx.transaction.validity_range,datum.lock_until)
                    // thời gian sau khoảng thời gian đã ràng buộc
                
            _ -> False
        }
    }
}// redeemer là bid thi auto refun;
//redeemer la refun thi ki la san+ thoi gian thoa man 


