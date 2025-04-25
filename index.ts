import { Account, Aptos, Ed25519PrivateKey, Network } from "@aptos-labs/ts-sdk";
import { AptosConfig } from "@aptos-labs/ts-sdk";

async function main() {

    // Create Aptos instance and set it to testnet
    const config = new AptosConfig({ network: Network.MAINNET });
    const aptos = new Aptos(config);

    // Wallet Account from Petra Wallet
    const PRIVATE_KEY = new Ed25519PrivateKey("ed25519-priv-0x79fc3a1199cf848e17019a083f111258cd9ce5c455a8fda0e2ea2219a89abbe9");

    // Check Balance
    const MY_ACCOUNT = Account.fromPrivateKey({
    privateKey: PRIVATE_KEY,
    });

    // Build the transaction
    const transaction = await aptos.transaction.build.simple({
        sender: MY_ACCOUNT.accountAddress,
        data: {
        function:
            "0x777b93e13ff2a1bc872eb4d099ae15a52fb70f2f01dd18d7c809e217fb0e543e::tba_exam::add_participant",
        functionArguments: [
            "0x5583699c33686f47a963754eb702f662772975df43a945ed1e98043b8b5c6bdd",
            "Nilmar T. Pesaras", 
            "<https://github.com/npesaras",
            "nilmar.pesarast@gmail.com",
            "nilmarp",
        ],
        },
    });

    // Sign the transaction
    const senderAuthenticator = aptos.transaction.sign({
        signer: MY_ACCOUNT,
        transaction,
    });

    // Send transaction to Aptos Network
    const pendingTransaction = await aptos.transaction.submit.simple({
        transaction,
        senderAuthenticator,
    });

    // Wait for the transaction to be confirmed
    const txnResult = await aptos.waitForTransaction({
        transactionHash: pendingTransaction.hash,
    });
    
    // optional: so we can see if it succeeded
    console.log(
        `Transaction completed with status: ${
            txnResult.success ? "SUCCESS" : "FAILURE"
        }`
    );
}

main().catch(console.error);
