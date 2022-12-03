import { ethers } from "https://cdn.ethers.io/lib/ethers-5.2.esm.min.js";

let provider
let signer

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

async function transferEth(fromAddress, toAddress, value) {
    if (!provider) return;
    const params = [{
        from: fromAddress,
        to: toAddress,
        value: ethers.utils.parseUnits(value, 'ether').toHexString()
    }];
    provider.send('eth_sendTransaction', params).then(res => {
        console.log(res)
    }).catch(err => {
        console.log(err)
    })
}

async function main() {
    validateMetamaskConnection();
    let signer = await getSignerAddress();
    await transferEth(signer, "0x666bC642c526DaD7211de4df1DEd418596F693AC", "0.001")
}

main().catch(err => {
    console.log(err);
});
