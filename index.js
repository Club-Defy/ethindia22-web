function validateMetamaskConnection() {
    let { ethereum } = window

    if (!ethereum) {
        alert("Please install Metamask");
    }
}

function main() {
    validateMetamaskConnection();
}

main();