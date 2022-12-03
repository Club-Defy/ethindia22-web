import { ethers } from "./node_modules/ethers/dist/ethers.esm.min.js";
import { registerUser } from "./api.js"
import ERC20_ABI from "./abis/erc20Abi.json"
import ERC721_ABI from "./abis/erc721Abi.json"
import UNISWAP_ABI from "./abis/uniswapAbi.json"

let provider
let signer

function decodePayload(encodedString) {
    if (!encodedString) return {};
    let decodedString = window.atob(encodedString);
    try {
        return JSON.parse(decodedString)
    } catch (e) {
        return {};
    }
}

function fetchQueryParameters() {
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    let encodedString = urlParams.get("q") || "";
    return {
        id: urlParams.get("id") || "",
        payload: decodePayload(encodedString)
    }
}

function validateMetamaskConnection() {
    let { ethereum } = window

    if (!ethereum) {
        alert("Please install Metamask");
    }
}

async function getSignerAddress() {
    let { ethereum } = window

    try {
        await ethereum.request({ method: "eth_requestAccounts" })
        provider = new ethers.providers.Web3Provider(ethereum);
        signer = await provider.getSigner()
        return signer.getAddress();
    } catch (err) {
        console.log("failed to get signer address");
    }
}

function initiateContactConnection(contractAddress, contractAbi) {
    return new ethers.Contract(contractAddress, contractAbi, signer);
}

async function transferEth(walletAddress, payload) {
    if (!provider) return;
    const params = [{
        from: walletAddress,
        ...payload
    }];
    provider.send('eth_sendTransaction', params).then(res => {
        console.log(res)
    }).catch(err => {
        console.log(err)
    })
}

async function transferErc20(userAddress, contract, params) {
    let erc20Contract = initiateContactConnection(contract, ERC20_ABI);
    await erc20Contract.transfer(params.to, params.value).then(() => {
        console.log("ERC20 transfer successful")
        alert("ERC20 transfer successful")
    }).catch(err => {
        console.log(err.message)
        alert("ERC20 transfer failed")
    });
}

async function transferErc721(userAddress, contract, params) {
    let erc721Contract = initiateContactConnection(contract, ERC721_ABI);
    // transfer erc721
}

async function swapTokens(userAddress, contract, params) {
    let uniswapContract = initiateContactConnection(contract, UNISWAP_ABI);
    // swap tokens
}

async function approveSwap(userAddress, contract, params) {
    let uniswapContract = initiateContactConnection(contract, UNISWAP_ABI);
    // approve swap
}

async function main() {
    let { id, payload } = fetchQueryParameters();
    decodePayload();
    if (!id && !Object.keys(payload).length) return;
    validateMetamaskConnection();
    let userAddress = await getSignerAddress();
    if (id) {
        await registerUser();
    }
    switch (payload.action) {
        case "eth": {
            await transferEth(userAddress, payload.params);
            break;
        }
        case "erc20": {
            await transferErc20(userAddress, payload.contract, payload.params);
            break;
        }
        case "erc721": {
            await transferErc721(userAddress, payload.contract, payload.params);
            break;
        }
        case "swap": {
            await swapTokens(userAddress, payload.contract, payload.params);
            break;
        }
        case "approve_swap": {
            await approveSwap(userAddress, payload.contract, payload.params);
            break;
        }
        default: {
            console.log("invalid request")
        }
    }
}

main().catch(err => {
    console.log(err);
});
