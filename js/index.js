import { abi as gasGainTokenABI } from './abi/GasGainz.js';
import { abi as gasGainsDistributionABI } from "./abi/GaasGainsDistribution.js";

import { abi as ethanolTokenABI } from "./abi/EthanolToken.js";
import { abi as ethanolVaultABI } from "./abi/EthanolVault.js";

import { abi as gcbTokenABI } from "./abi/GcbToken.js";
import { abi as gcbVaultABI } from "./abi/GcbVault.js";

import { abi as undgTokenABI } from "./abi/UndgToken.js";

const walletAddress = document.querySelector('.walletAddress');
const txnLists = document.querySelector('.inject-txns-lists');
const totalEthUsed = document.querySelector('.total-eth-used');
const averageGasPrice = document.querySelector('.average-gas-per-txn');
const failedTransactions = document.querySelector('.failed-gas-txns');

const enolUserTokenBalance = document.querySelector('.enol-user-token-balance');
const enolClaimableCahback = document.querySelector('.enol-claimable-cashback');
const enolClaimCashback = document.querySelector('.enol-claim-cashback');
const enolStakedBalance = document.querySelector('.enol-staked-balance');

const gasgUserTokenBalance = document.querySelector('.gasg-user-token-balance');
const gasgClaimableCahback = document.querySelector('.gasg-claimable-cashback');
const gasgUpcomingRewards = document.querySelector('.gasg-upcoming-rewards');
const gasgClaimCashback = document.querySelector('.gasg-claim-cashback');
const gasgStakedBalance = document.querySelector('.gasg-staked-balance');

const undgUserTokenBalance = document.querySelector('.undg-user-token-balance');
const undgClaimableCahback = document.querySelector('.undg-claimable-cashback');
const undgUpcomingRewards = document.querySelector('.undg-upcoming-rewards');
// const undgClaimCashback = document.querySelector('.undg-claim-cashback');
const undgStakedBalance = document.querySelector('.undg-staked-balance');

const gcbUserTokenBalance = document.querySelector('.gcb-user-token-balance');
const gcbClaimableCahback = document.querySelector('.gcb-claimable-cashback');
const gcbUpcomingRewards = document.querySelector('.gcb-upcoming-rewards');
// const gcbClaimCashback = document.querySelector('.gcb-claim-cashback');
const gcbStakedBalance = document.querySelector('.gcb-staked-balance');


const GasGainTokenAddress = '0xc58467b855401EF3FF8FdA9216F236e29f0d6277';
const GasGainsDistributionAddress = "0x0358531350B7e183080C9D713fc4475d835fC249";

const EthanolTokenAddress = "0x63D0eEa1D7C0d1e89d7e665708d7e8997C0a9eD6";
const EthnolVaultAddress = '0xf34F69fB72B7B6CCDbdA906Ad58AF1EBfAa76c42';

const GcbTokenAddress = "0x3539a4f4c0dffc813b75944821e380c9209d3446";
const GcbVaultAddress = '0x50A7aEa3c8B5e230b5C39e73964fB1Dc517Fb5C4';

const UndgTokenAddress = "0xA5959E9412d27041194c3c3bcBE855faCE2864F7";

const apiKey = "7QEMXYNDAD5WT7RTA5TQUCJ5NIA99CSYVI";
const startBlock = "11706820";
const undgAdmin = "0xe58895617068b01d49d6ad74dff6d8b6f63cc18d";


let web3;
let GasGainToken;
let GasGainsDistribution;
let EthanolToken;
let EthanolVault;
let GcbToken;
let GcbVault;
let UndgToken;
let user;
let normalTransactionists;

const toWei = _amount => web3.utils.toWei(_amount.toString(), 'ether');
const fromWei = _amount => web3.utils.fromWei(_amount.toString(), 'ether');

window.addEventListener('DOMContentLoaded', async () => {
  await connectDAPP();
})

const connectDAPP = async () => {
    await loadWeb3();
    await loadBlockchainData(); 
}

const loadWeb3 = async () => {
    try {
        await ethereum.enable();

        if(!ethereum) return alert("Non-Ethereum browser detected. You should consider trying Metamask");
        web3 = new Web3(ethereum);
        // Get Network / chainId
        const _chainId = await ethereum.request({ method: 'eth_chainId' });
        if(parseInt(_chainId, 16) !== 1) return alert("Connect wallet to a main network");

        const _accounts = await ethereum.request({ method: 'eth_accounts' });
        user = web3.utils.toChecksumAddress(_accounts[0]);
        // user = "0x10f24fbc2a4addf445adf143beb5e4236319f50b";
    } catch (error) {
        console.log(error.message);
        return error.message;
    }       
}

const loadBlockchainData = async () => {
    try {
        GasGainToken = new web3.eth.Contract(gasGainTokenABI, GasGainTokenAddress);
        GasGainsDistribution = new web3.eth.Contract(gasGainsDistributionABI, GasGainsDistributionAddress);

        EthanolToken = new web3.eth.Contract(ethanolTokenABI, EthanolTokenAddress);
        EthanolVault = new web3.eth.Contract(ethanolVaultABI, EthnolVaultAddress);

        UndgToken = new web3.eth.Contract(undgTokenABI, UndgTokenAddress);

        GcbToken = new web3.eth.Contract(gcbTokenABI, GcbTokenAddress);
        GcbVault = new web3.eth.Contract(gcbVaultABI, GcbVaultAddress);

        const firstAddressPart = walletShortner(user, 0, 4);
        const lastAddressPart = walletShortner(user, 38, 42);
        walletAddress.textContent = `${firstAddressPart}...${lastAddressPart}`;
        
        await settings();
    } catch (error) {
        console.error(error.message);
        return error;
    }
}

const toFixed = _amount => Number(_amount).toFixed(2);

const walletShortner = (_data, _start, _end) => {
    let result = '';
    for(let i = _start;  i < _end; i++) result = [...result, _data[i]];
    return result.join('');
}

const shortener = (_data, isHash) => {
    const tempItems = _data.split('');
    let result = [];

    if(isHash) {
        for(let i = 60;  i < tempItems.length; i++) result = [...result, tempItems[i]];
        return result.join('');
    }
    for(let i = 37;  i < tempItems.length; i++) result = [...result, tempItems[i]];
    return result.join('');
}

const settings = async () => {
    // Get user balance in GAS Token Contracts
    const _enolUserBalance = await balanceOf(EthanolToken, user);
    const _gasgUserBalance = await balanceOf(GasGainToken, user);
    const _undgUserBalance = await balanceOf(UndgToken, user);
    const _gcbUserBalance = await balanceOf(GcbToken, user);


    // gasgUserTokenBalance
    enolUserTokenBalance.textContent = `${toFixed(fromWei(_enolUserBalance))} ENOL`;
    gasgUserTokenBalance.textContent = `${toFixed(fromWei(_gasgUserBalance))} GASG`;
    undgUserTokenBalance.textContent = `${toFixed(fromWei(_undgUserBalance))} GASG`;
    gcbUserTokenBalance.textContent = `${toFixed(fromWei(_gcbUserBalance))} GCB`;




    // Get user rewards
    const _enolClaimableCashback = await ethanolCheckRewards();
    enolClaimableCahback.textContent = `${toFixed(fromWei(_enolClaimableCashback))} ENOL`;

    const _gsngClaimableCashback = await gasgGainsCheckRewards();
    gasgClaimableCahback.textContent = `${toFixed(fromWei(_gsngClaimableCashback))} GASG`;

    // Upcoming rewards
    const _gasgUpcomingRewards = (Number(fromWei(_gasgUserBalance)) * 75) / 100;
    gasgUpcomingRewards.textContent = `${toFixed(_gasgUpcomingRewards)} GASG`;


    // Staked Balance
    const _enolStakedBalance = await EthanolVault.methods.getLockedTokens(user).call();
    enolStakedBalance.textContent = `${toFixed(fromWei(_enolStakedBalance))} ENOL`;

    // const _gasgStakedBalance = await getPastEvents();
    let _userGasgGainStakedBalance = 0;
    let _getUserGasgGainStakedBalance = await (await fetch(`https://gasgains-node-deploy.herokuapp.com/api/v1/deposit/getStakesByAddress?user=${user}`)).json();
    if(_getUserGasgGainStakedBalance.length > 0) {
        _userGasgGainStakedBalance = _getUserGasgGainStakedBalance.reduce((prev, next) => {
            prev += Number(next.depositAmount);
            return prev;
        }, 0)
    }
    gasgStakedBalance.textContent = `${toFixed(_userGasgGainStakedBalance)} GASG`;

    normalTransactionists = await getNormalTransactionLists("0");
    await userEhtGasSpent(normalTransactionists);
    await displayTransactionsList(normalTransactionists);
    console.log("Done");

    // await undgTransferEvents();
}

const balanceOf = async (_token, _account) => {
    const _user = _account ? _account : user;
    return await _token.methods.balanceOf(_user).call();
}

const getCurrentPrice = async (token) => {
    try {
        let result = await (await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=USD`)).json();
        return result;
    } catch (error) {
        console.log(error)
    }
}


const ethanolCheckRewards = async () => {
    try {
        let result = await EthanolVault.methods.checkRewards(user).call();
        return result.toString();
    } catch (error) {
        console.error(error.message)
    }
}

const gasgGainsCheckRewards = async () => {
    try {
        const result = await GasGainsDistribution.methods.checkRewards(user).call();
        return result;
    } catch (error) {
        console.log(error.message);
        return error.message;
    }
}

const getNormalTransactionLists = async (_startTime, account) => {
    try {
        const _endBlock = await web3.eth.getBlockNumber();
        const _user = account ? account : user; 
        let result = await (await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${_user}&startblock=${_startTime}&endblock=${_endBlock}&sort=desc&apikey=${apiKey}`)).json();

        result = await result.result.map(item => {
            const { hash, from, to, gasPrice, gasUsed, nonce } = item;
            return { hash, from, to, gasPrice, gasUsed, nonce };
        })
        return result;
    } catch (error) {
        return error.message;
    }
}

const displayTransactionsList = async (_normalTransactionists) => {
    try {
        let tempItems = [];
        let _ethUSDPrice = await getCurrentPrice("ethereum");
        _ethUSDPrice = toFixed(_ethUSDPrice.ethereum.usd);

        let nonce = _normalTransactionists.length;
        
        tempItems = _normalTransactionists.map(item => {
            const { from, to, hash, gasUsed, gasPrice } =  item;
            let ethGasUsed = Number(gasUsed) * Number(gasPrice);
            ethGasUsed = fromWei(ethGasUsed * Number(_ethUSDPrice));
            const _data = `
                <tr>
                    <td>${Number(nonce)}</td>
                    <td>
                        <a href=https://etherscan.io/tx/${hash} target="_blank" style="color: #fff">
                            0x...${shortener(hash, true)}
                        </a>
                    </td>
                    <td>
                        <a href=https://etherscan.io/address/${from} target="_blank" style="color: #fff">
                            0x...${shortener(from, false)}
                        </a>
                    </td>
                    <td>
                        <a href=https://etherscan.io/address/${to} target="_blank" style="color: #fff">
                            0x...${shortener(to, false)}
                        </a>
                    </td>
                    <td>$${toFixed(ethGasUsed)}</td>
                    <td>100</td>
                </tr>
            `
            nonce--;
            return _data;
        })

        tempItems = tempItems.join("");
        txnLists.innerHTML = tempItems;
        return tempItems;
    } catch (error) {
        return error.message;
    }
}

const userEhtGasSpent = async (_normalTransactionists) => {
    let _ethUSDPrice = await getCurrentPrice("ethereum");
    _ethUSDPrice = toFixed(_ethUSDPrice.ethereum.usd);
    let _totalEthUsed = 0;
    let _totalGasPrice = 0;
    let txnStatus = [];
   
    for(let i = 0; i < _normalTransactionists.length; i++) {
        const { gasUsed, gasPrice, hash } =  _normalTransactionists[i];
        const _status = await transactionStatus(hash);
        txnStatus = [...txnStatus, _status];
        _totalGasPrice = Number(_totalGasPrice) + Number(web3.utils.fromWei(gasPrice, 'gwei'));
        let ethGasUsed = Number(gasUsed) * Number(gasPrice);
        _totalEthUsed = Number(_totalEthUsed) + ethGasUsed;
    }

    const _isFailedTransaction = txnStatus.filter(item => item === "0");
    // const _totalUSDUsed = fromWei(_totalEthUsed * Number(_ethUSDPrice));
    _totalEthUsed = fromWei(_totalEthUsed);

    totalEthUsed.textContent = `${toFixed(_totalEthUsed)} ETH`;
    averageGasPrice.textContent = `${toFixed(_totalGasPrice / (_normalTransactionists.length - 1))} GWEI`;
    failedTransactions.textContent = `${_isFailedTransaction.length}`;
}

const transactionStatus = async _hash => {
    try {
        let result = await (await fetch(`https://api.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${_hash}&apikey=${apiKey}`)).json();
        result = result.result.status;
        return result;
    } catch (error) {
        return error.message;
    }
}

enolClaimCashback.addEventListener('click', async e => {
    e.preventDefault();
    try {
        const _rewards = await EthanolVault.methods.checkRewards(user).call();
        await EthanolVault.methods.withdrawRewards(_rewards).send({
            from: user,
        });
        return alert("Transaction successful");
    } catch (error) {
        console.log(error.message);
        return error.message;
    }
})

gasgClaimCashback.addEventListener('click', async e => {
    e.preventDefault();
    try {
        const result = await GasGainsDistribution.methods.claimRewards().send({ from: user });
        alert("Transaction successful");
        return result;
    } catch (error) {
        console.log(error.message);
        return error.message;
    }
})


// Log if connection ends
ethereum.on('disconnect', (code, reason) => {
    console.log(`Ethereum Provider connection closed: ${reason}. Code: ${code}`);
});