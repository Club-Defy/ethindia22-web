import { ethers } from "https://cdn.ethers.io/lib/ethers-5.2.esm.min.js";

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
        let provider = new ethers.providers.Web3Provider(ethereum);
        return await provider.getSigner().getAddress();
    } catch (err) {
        console.log("failed to get signer address");
    }
}

async function main() {
    validateMetamaskConnection();
    let signer = await getSignerAddress();
    console.log(signer)
}

main().catch(err => {
    console.log(err);
});