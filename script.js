const contractAddress = "YOUR_CONTRACT_ADDRESS";  // Replace with your deployed contract address
const contractABI = [ /* YOUR_CONTRACT_ABI */ ];  // Replace with your contract's ABI

let nftContract;
let accounts;

// Initialize Web3
async function initialize() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        accounts = await web3.eth.getAccounts();
        nftContract = new web3.eth.Contract(contractABI, contractAddress);
        document.getElementById("status").innerText = "Connected to MetaMask";
        loadNFTs();
    } else {
        alert("Please install MetaMask!");
    }
}

// Mint a new NFT
document.getElementById("mintForm").onsubmit = async (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const eyeColor = document.getElementById("eyeColor").value;
    const shirtType = document.getElementById("shirtType").value;
    const faceShape = document.getElementById("faceShape").value;
    const bling = document.getElementById("bling").value;
    const metadataURI = document.getElementById("metadataURI").value;

    try {
        await nftContract.methods.mintNFT(name, eyeColor, shirtType, faceShape, bling, metadataURI)
            .send({ from: accounts[0] });
        document.getElementById("status").innerText = "NFT minted successfully!";
        loadNFTs();  // Refresh NFT list
    } catch (error) {
        document.getElementById("status").innerText = "Error minting NFT: " + error.message;
    }
};

// Pause Minting
document.getElementById("pauseMinting").onclick = async () => {
    try {
        await nftContract.methods.pauseMinting().send({ from: accounts[0] });
        document.getElementById("status").innerText = "Minting paused.";
    } catch (error) {
        document.getElementById("status").innerText = "Error pausing minting: " + error.message;
    }
};

// Resume Minting
document.getElementById("resumeMinting").onclick = async () => {
    try {
        await nftContract.methods.resumeMinting().send({ from: accounts[0] });
        document.getElementById("status").innerText = "Minting resumed.";
    } catch (error) {
        document.getElementById("status").innerText = "Error resuming minting: " + error.message;
    }
};

// Withdraw funds
document.getElementById("withdraw").onclick = async () => {
    try {
        await nftContract.methods.withdraw().send({ from: accounts[0] });
        document.getElementById("status").innerText = "Funds withdrawn.";
    } catch (error) {
        document.getElementById("status").innerText = "Error withdrawing funds: " + error.message;
    }
};

// Load and display NFTs
async function loadNFTs() {
    try {
        const totalSupply = await nftContract.methods.getTotalSupply().call();
        const nftList = document.getElementById("nftList");
        nftList.innerHTML = "";

        for (let i = 1; i <= totalSupply; i++) {
            const nft = await nftContract.methods.getNFTDetails(i).call();
            const nftItem = document.createElement("div");
            nftItem.className = "nft-item";
            nftItem.innerHTML = `
                <h3>${nft.name}</h3>
                <p>Eye Color: ${nft.eyeColor}</p>
                <p>Shirt Type: ${nft.shirtType}</p>
                <p>Face Shape: ${nft.faceShape}</p>
                <p>Bling: ${nft.bling}</p>
                <p>Metadata URI: <a href="${nft.metadataURI}" target="_blank">${nft.metadataURI}</a></p>
            `;
            nftList.appendChild(nftItem);
        }
    } catch (error) {
        document.getElementById("status").innerText = "Error loading NFTs: " + error.message;
    }
}

window.onload = initialize;
