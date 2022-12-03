import axios from "axios";

const REGISTER_URL =  "";

export async function registerUser(id, walletAddress) {
    await axios.post(
        REGISTER_URL,
        {
            id,
            walletAddress
        }
    )
}