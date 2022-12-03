import axios from "./node_modules/axios/dist/esm/axios.min.js";

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