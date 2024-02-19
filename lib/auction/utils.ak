use aiken/list
use aiken/transaction.{Output, Transaction, ValidityRange}
// Declare the libraries to use
use aiken/transaction/credential.{Address}
use aiken/transaction/value.{AssetName, PolicyId, lovelace_of, quantity_of}
use auction/types.{POSIXTime, VerificationKeyHash}
use aiken/interval.{Finite}

// khoảng thời gian hợp lệ là khoảng thời gian hiệu lực của hợp đồng sau khi hợp đồng được khóa
pub fn must_start_after(range: ValidityRange, lock_expiration_time: POSIXTime){////lock_expiration_time là thời điểm hết hạn của hợp đồng.
/// Phần mã này định nghĩa hàm must_start_after để kiểm tra xem thời điểm bắt đầu của một khoảng thời gian hợp lệ (ValidityRange) có sau thời điểm hết hạn của một hợp đồng khoá không (lock_expiration_time)
    when range.lower_bound.bound_type is{// Sử dụng câu lệnh when để xác định hành động kiểm tra dựa trên loại bound_type của giới hạn dưới (lower_bound) của khoảng thời gian hợp lệ.
        Finite(tx_earliest_time)-> lock_expiration_time<=tx_earliest_time
//         Finite(tx_earliest_time) -> lock_expiration_time <= tx_earliest_time: Nếu giới hạn dưới là một thời điểm cụ thể 
//         (Finite), thì kiểm tra xem lock_expiration_time có sau thời điểm này không. 
//         Nếu đúng, hàm trả về true, ngược lại trả về false.
// _ -> false: Nếu giới hạn dưới không phải là Finite (có thể là PositiveInfinity), 
// thì hàm trả về false. Cụ thể, PositiveInfinity đại diện cho một khoảng thời gian 
// không có giới hạn dưới, vì vậy nếu nó xuất hiện, ta giả sử rằng nó
        _ -> False
    }
}
pub fn must_be_signed_by(transaction: Transaction, vk: VerificationKeyHash){
    list.has(transaction.extra_signatories,vk)
}
