import { REGISTER_URL } from "./constants.js"

export async function registerUser(id, walletAddress) {
    let data = {
        discordId: id,
        address: walletAddress
    }
    await fetch(
        REGISTER_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
}