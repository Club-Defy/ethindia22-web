import axios from "./node_modules/axios/dist/esm/axios.min.js";
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