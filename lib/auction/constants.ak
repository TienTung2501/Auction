use aiken/transaction/credential.{Address, Inline, VerificationKeyCredential}
use auction/types.{VerificationKeyHash}
// Payment address of the exchange
pub const demarket_payment_vkh: VerificationKeyHash =
  #"cee92c06f49e3494378dc7e023b5628c20e4645039aec57093b9935f"

// Staking address of the exchange
pub const demarket_stake_vkh: VerificationKeyHash =
  #"90189ff2cef86afa5a7326c19e60ae22e235027a2858cca6768bbcdd"

// Combine the above 2 addresses into the trading exchange address
pub fn demarket_addr() -> Address {
  Address {
    payment_credential: VerificationKeyCredential(demarket_payment_vkh),
    stake_credential: Some(
      Inline(VerificationKeyCredential(demarket_stake_vkh)),
    ),
  }
}

// Transaction fee percentage
pub const demarket_pct: Int = 1