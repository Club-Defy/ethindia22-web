import { ethers } from "./node_modules/ethers/dist/ethers.esm.min.js";
import { registerUser } from "./api.js"

let provider
let signer

function decodePayload(encodedString) {
    if(!encodedString) return {};
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

async function sendTransaction(walletAddress, payload) {
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

async function main() {
    let { id, payload } = fetchQueryParameters();
    decodePayload();
    if (!id && !Object.keys(payload).length) return;
    validateMetamaskConnection();
    let userAddress = await getSignerAddress();
    if (id) {
        await registerUser();
    } else {
        await sendTransaction(userAddress, payload)
    }
}

main().catch(err => {
    console.log(err);
});
