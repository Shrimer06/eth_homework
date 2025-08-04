pragma solidity >=0.5.1 <0.6.0;

contract FixedVoting {
    mapping (address => uint256) public remainingVotes;
    uint256[] public candidates;
    address owner;
    bool hasEnded = false;
    
    modifier notEnded() {
        require(!hasEnded, "Voting has ended");
        _;
    }
    
    constructor(uint256 amountOfCandidates) public {
        candidates.length = amountOfCandidates;
        owner = msg.sender;
    }
    
    function buyVotes() public payable notEnded {
        require(msg.value >= 1 ether, "Minimum 1 ETH required");
        remainingVotes[msg.sender] += msg.value / 1e18;
        
        uint256 refund = msg.value % 1e18;
        if (refund > 0) {
            msg.sender.transfer(refund);
        }
    }
    
    function vote(uint256 _candidateID, uint256 _amountOfVotes) public notEnded {
        require(_candidateID < candidates.length, "Invalid candidate ID");
        require(remainingVotes[msg.sender] >= _amountOfVotes, "Insufficient votes");
        require(_amountOfVotes > 0, "Must vote at least 1");
        remainingVotes[msg.sender] -= _amountOfVotes;
        candidates[_candidateID] += _amountOfVotes;
    }
    
    function payoutVotes(uint256 _amount) public notEnded {
        require(remainingVotes[msg.sender] >= _amount, "Insufficient remaining votes");
        require(_amount > 0, "Amount must be greater than 0");
      remainingVotes[msg.sender] -= _amount;
      msg.sender.transfer(_amount * 1e18);
    }
    
    function endVoting() public notEnded {
        require(msg.sender == owner, "Only owner can end voting");
        hasEnded = true;
        msg.sender.transfer(address(this).balance);
    }
    
    function displayBalanceInEther() public view returns(uint256 balance) {
        return address(this).balance / 1e18;
    }
}
