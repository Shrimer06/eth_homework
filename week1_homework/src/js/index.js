import React from 'react'
import ReactDOM from 'react-dom/client' // React 18的新写法
import Web3 from 'web3'
import './../css/index.css'

class App extends React.Component {
   constructor(props){
      super(props)
      this.state = {
         lastWinner: 0,
         numberOfBets: 0,
         minimumBet: 0,
         totalBet: 0,
         maxAmountOfBets: 0,
      }

      // 修复web3检测
      if(typeof window.ethereum !== 'undefined'){
         console.log("Using web3 detected from external source like Metamask")
         this.web3 = new Web3(window.ethereum)
      } else if(typeof window.web3 !== 'undefined'){
         console.log("Using legacy web3")
         this.web3 = new Web3(window.web3.currentProvider)
      } else {
         console.log("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development.");
         this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
      }

      // 修复合约实例化 - 使用新的web3语法
      const contractABI = [{"constant":false,"inputs":[],"name":"generateNumberWinner","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"myid","type":"bytes32"},{"name":"result","type":"string"}],"name":"__callback","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"numberOfBets","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_queryId","type":"bytes32"},{"name":"_result","type":"string"},{"name":"_proof","type":"bytes"}],"name":"__callback","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"player","type":"address"}],"name":"checkPlayerExists","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"resetData","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"bets","type":"uint256"}],"name":"updateMaxBets","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"number","type":"uint256"}],"name":"bet","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"amountWei","type":"uint256"}],"name":"updateMinimumBet","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"distributePrizes","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"numberWinner","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"minimumBet","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"maxAmountOfBets","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"players","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalBet","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"_maxAmountOfBets","type":"uint256"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"}];
      
      this.state.ContractInstance = new this.web3.eth.Contract(contractABI, "0x430d959fa54714aca8eecd61fae2661fca900e04")

      window.a = this.state
   }

   async componentDidMount(){
      // 请求连接MetaMask
      if (window.ethereum) {
         try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
         } catch (error) {
            console.error("User denied account access");
         }
      }

      this.updateState()
      this.setupListeners()

      setInterval(this.updateState.bind(this), 7e3)
   }

   async updateState(){
      try {
         // 使用新的web3语法
         const minimumBet = await this.state.ContractInstance.methods.minimumBet().call()
         this.setState({
            minimumBet: parseFloat(this.web3.utils.fromWei(minimumBet, 'ether'))
         })

         const totalBet = await this.state.ContractInstance.methods.totalBet().call()
         this.setState({
            totalBet: parseFloat(this.web3.utils.fromWei(totalBet, 'ether'))
         })

         const numberOfBets = await this.state.ContractInstance.methods.numberOfBets().call()
         this.setState({
            numberOfBets: parseInt(numberOfBets)
         })

         const maxAmountOfBets = await this.state.ContractInstance.methods.maxAmountOfBets().call()
         this.setState({
            maxAmountOfBets: parseInt(maxAmountOfBets)
         })
      } catch (error) {
         console.error("Error updating state:", error)
      }
   }

   // Listen for events and executes the voteNumber method
   setupListeners(){
      let liNodes = this.refs.numbers.querySelectorAll('li')
      liNodes.forEach(number => {
         number.addEventListener('click', event => {
            event.target.className = 'number-selected'
            this.voteNumber(parseInt(event.target.innerHTML), done => {

               // Remove the other number selected
               for(let i = 0; i < liNodes.length; i++){
                  liNodes[i].className = ''
               }
            })
         })
      })
   }

   async voteNumber(number, cb){
      let bet = this.refs['ether-bet'].value

      if(!bet) bet = 0.1

      if(parseFloat(bet) < this.state.minimumBet){
         alert('You must bet more than the minimum')
         cb()
      } else {
         try {
            const accounts = await this.web3.eth.getAccounts()
            await this.state.ContractInstance.methods.bet(number).send({
               gas: 300000,
               from: accounts[0],
               value: this.web3.utils.toWei(bet.toString(), 'ether')
            })
            cb()
         } catch (error) {
            console.error("Betting error:", error)
            cb()
         }
      }
   }

   render(){
      return (
         <div className="main-container">
            <h1>Bet for your best number and win huge amounts of Ether</h1>

            <div className="block">
               <b>Number of bets:</b> &nbsp;
               <span>{this.state.numberOfBets}</span>
            </div>

            <div className="block">
               <b>Last number winner:</b> &nbsp;
               <span>{this.state.lastWinner}</span>
            </div>

            <div className="block">
               <b>Total ether bet:</b> &nbsp;
               <span>{this.state.totalBet} ether</span>
            </div>

            <div className="block">
               <b>Minimum bet:</b> &nbsp;
               <span>{this.state.minimumBet} ether</span>
            </div>

            <div className="block">
               <b>Max amount of bets:</b> &nbsp;
               <span>{this.state.maxAmountOfBets}</span>
            </div>

            <hr/>

            <h2>Vote for the next number</h2>

            <label>
               <b>How much Ether do you want to bet? <input className="bet-input" ref="ether-bet" type="number" placeholder={this.state.minimumBet}/></b> ether
               <br/>
            </label>

            <ul ref="numbers">
               <li>1</li>
               <li>2</li>
               <li>3</li>
               <li>4</li>
               <li>5</li>
               <li>6</li>
               <li>7</li>
               <li>8</li>
               <li>9</li>
               <li>10</li>
            </ul>

            <hr/>

            <div><i>Only working with the Ropsten Test Network</i></div>
            <div><i>You can only vote once per account</i></div>
            <div><i>Your vote will be reflected when the next block is mined</i></div>
         </div>
      )
   }
}

// React 18的新渲染方式
const root = ReactDOM.createRoot(document.querySelector('#root'))
root.render(<App />)