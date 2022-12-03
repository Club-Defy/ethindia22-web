import { ethers } from "https://cdn.ethers.io/lib/ethers-5.2.esm.min.js";
import { registerUser } from "./api.js"

let provider
let signer

function decodePayload(encodedString) {
    // decode payload or {}
}

function fetchQueryParameters() {
    let encodedString = URLSearchParams.get("q") || "";
    return {
        id: URLSearchParams.get("id") || "",
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
    if (!id && !payload) return;
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
