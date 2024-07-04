import Debug "mo:base/Debug"; // importing Debug module from base library of mototko to use printing function
import Time "mo:base/Time";
import Float "mo:base/Float";

// A new Cannister
actor DBank {
  // stable keyword adds persistence to the variable currentValue
  stable var currentValue: Float = 0;
  // currentValue := 0;  // := replacing operator

  stable var startTime = Time.now();
  // startTime := Time.now();
  Debug.print(debug_show(startTime));


  // constant
  let id = 2349204802042;
  // Debug.print(debug_show(id));

  // topUp and topDown are update methods (asynchronous and slow)
  public func topUp(amount: Float) { // Nat - Natural number datatype
    currentValue += amount;
    Debug.print(debug_show(currentValue));
  };

  public func withdraw(amount: Float){
    let tempValue: Float = currentValue - amount;
    if(tempValue >= 0){
      currentValue -= amount;
      Debug.print(debug_show(currentValue));
    } else {
      Debug.print("Withdrawl Not Possible");
    }
  };

  // query method (synchronous and fast)
  // : Nat -> return data type
  // every returning query function must return output asynchronously
  public query func checkBalance(): async Float {
    return currentValue;
  };


  public func compound() {
    let currentTime = Time.now();
    let timeElapsedNS = currentTime - startTime;
    let timeElapsedS = timeElapsedNS / 1000000000;
    currentValue := currentValue * (1.01 ** Float.fromInt(timeElapsedS));
    startTime := currentTime;
  };
} 

