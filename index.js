import { ethers } from "./ethers.js";
import { registerUser } from "./api.js";
import ERC20_ABI from "./abis/erc20Abi.json" assert { type: "json" };
import ERC721_ABI from "./abis/erc721Abi.json" assert { type: "json" };
import UNISWAP_ABI from "./abis/uniswapAbi.json" assert { type: "json" };
import {
    TRANSFER_ETH,
    TRANSFER_ERC20,
    TRANSFER_ERC721,
    SWAP_ETH_TO_ERC20,
    SWAP_ERC20_TO_ETH,
    SWAP_ERC20_TO_ERC20,
    APPROVE_SWAP,
    REQUEST_ACCOUNTS,
    SEND_TRANSACTION,
    PAYLOAD,
    EMPTY_STRING,
    DISCORD_ID
} from "./constants.js";

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
    let encodedString = urlParams.get(PAYLOAD) || EMPTY_STRING;
    return {
        id: urlParams.get(DISCORD_ID) || EMPTY_STRING,
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
        await ethereum.request({ method: REQUEST_ACCOUNTS })
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
        to: payload.to_address,
        value: payload.value.toString()
    }];
    provider.send(SEND_TRANSACTION, params).then(res => {
        console.log(res)
    }).catch(err => {
        console.log(err)
    })
}

async function transferErc20(contract, params) {
    let erc20Contract = initiateContactConnection(contract, ERC20_ABI);
    await erc20Contract.transfer(params.to_address, params.value.toString()).then(() => {
        console.log("ERC20 transfer successful")
        alert("ERC20 transfer successful")
    }).catch(err => {
        console.log(err.message)
        alert("ERC20 transfer failed")
    });
}

async function transferErc721(userAddress, contract, params) {
    let erc721Contract = initiateContactConnection(contract, ERC721_ABI);
    await erc721Contract.safeTransferFrom(userAddress, params.to_address, params.value).then(() => {
        console.log("ERC721 transfer successful")
        alert("ERC721 transfer successful")
    }).catch(err => {
        console.log(err.message)
        alert("ERC721 transfer failed")
    });
}

async function swapEthToErc20(userAddress, contract, params) {
    let uniswapContract = initiateContactConnection(contract, UNISWAP_ABI);
    await uniswapContract.swapExactETHForTokens(
        params.amountOutMin,
        params.path,
        userAddress,
        params.deadline,
        {
            value: params.value.toString()
        }
    ).then(() => {
        console.log("Eth to Erc20 swap successful")
        alert("Eth to Erc20 swap successful")
    }).catch(err => {
        console.log(err.message)
        alert("Eth to Erc20 swap failed")
    });
}

async function swapErc20ToEth(userAddress, contract, params) {
    let uniswapContract = initiateContactConnection(contract, UNISWAP_ABI);
    await uniswapContract.swapExactTokensForETH(
        params.amountIn.toString(),
        params.amountOutMin,
        params.path,
        userAddress,
        params.deadline
    ).then(() => {
        console.log("Erc20 to Eth swap successful")
        alert("Erc20 to Eth swap successful")
    }).catch(err => {
        console.log(err.message)
        alert("Erc20 to Eth swap failed")
    });
}

async function swapErc20ToErc20(userAddress, contract, params) {
    let uniswapContract = initiateContactConnection(contract, UNISWAP_ABI);
    await uniswapContract.swapExactTokensForTokens(
        params.amountIn.toString(),
        params.amountOutMin,
        params.path,
        userAddress,
        params.deadline
    ).then(() => {
        console.log("Erc20 to Erc20 swap successful")
        alert("Erc20 to Erc20 swap successful")
    }).catch(err => {
        console.log(err.message)
        alert("Erc20 to Erc20 swap failed")
    });
}

async function approveSwap(contract, params) {
    let erc20Contract = initiateContactConnection(contract, ERC20_ABI);
    await erc20Contract.approve(params.to_address, params.value.toString()).then(() => {
        console.log("Successfully approved");
        alert("Successfully approved");
    }).catch(err => {
        console.log(err.message);
        alert("Approval failed");
    });
}

async function main() {
    let { id, payload } = fetchQueryParameters();
    decodePayload();
    if (!id && !Object.keys(payload).length) return;
    validateMetamaskConnection();
    let userAddress = await getSignerAddress();
    if (id) {
        await registerUser(id, userAddress);
        alert("User Registration Successful")
        window.close();
        return;
    }
    switch (payload.action) {
        case TRANSFER_ETH: {
            await transferEth(userAddress, payload.params);
            break;
        }
        case TRANSFER_ERC20: {
            await transferErc20(payload.contract, payload.params);
            break;
        }
        case TRANSFER_ERC721: {
            await transferErc721(userAddress, payload.contract, payload.params);
            break;
        }
        case SWAP_ETH_TO_ERC20: {
            await swapEthToErc20(userAddress, payload.contract, payload.params);
            break;
        }
        case SWAP_ERC20_TO_ETH: {
            await swapErc20ToEth(userAddress, payload.contract, payload.params);
            break;
        }
        case SWAP_ERC20_TO_ERC20: {
            await swapErc20ToErc20(userAddress, payload.contract, payload.params);
            break;
        }
        case APPROVE_SWAP: {
            await approveSwap(payload.contract, payload.params);
            break;
        }
        default: {
            alert("invalid request")
        }
        window.close();
    }
}

main().catch(err => {
    console.log(err);
});
