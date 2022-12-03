import { ethers } from "https://cdn.ethers.io/lib/ethers-5.2.esm.min.js";

let provider

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
        return await provider.getSigner().getAddress();
    } catch (err) {
        console.log("failed to get signer address");
    }
}

function transferEth(fromAddress, toAddress, value) {
    if (!provider) return;
    provider.sendTransaction({
        from: fromAddress,
        to: toAddress,
        value: String(value * Math.pow(10, 18))
    }).then(res => {
        console.log(res)
    }).catch(err => {
        console.log(err)
    })
}

async function main() {
    validateMetamaskConnection();
    let signer = await getSignerAddress();
    transferEth(signer, "0x666bC642c526DaD7211de4df1DEd418596F693AC", "0.001")
}

main().catch(err => {
    console.log(err);
});