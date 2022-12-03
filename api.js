import axios from "https://unpkg.com/axios/dist/axios.min.js";
import { REGISTER_URL } from "./constants.js"

export async function registerUser(id, walletAddress) {
    await axios.post(
        REGISTER_URL,
        {
            discordId: id,
            address: walletAddress
        }
    )
}