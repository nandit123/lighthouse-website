let contractAbi = ([
{
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "uploader",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "cid",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "config",
          "type": "string"
        }
      ],
      "name": "StorageRequest",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "string",
          "name": "cid",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "config",
          "type": "string"
        }
      ],
      "name": "store",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
]);

let ethaddress;
let web3;

async function connectWallet() {
    if (window.ethereum) {
        web3 = new ethers.providers.Web3Provider(window.ethereum)
    }

    conn = await window.ethereum.enable();

     ethconnected = conn.length > 0
     if (ethconnected) {
         ethaddress = conn[0]    // get wallet address
     }
      return true;
}

async function load() {
    await connectWallet();
}

function callContract() {
    document.getElementById("sentCid").innerHTML = "";
    document.getElementById("tHash").innerHTML = "";
    // window.web3 = new Web3("https://rinkeby.infura.io/v3/3d635004c08743daae3a5cb579559dbd");
    console.log("eth address:", ethaddress);
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    let cid = document.getElementById("cidInput").value;
    let config = document.getElementById("configInput").value;
    console.log('cid:', cid, ' and config:', config);
    let contract = new ethers.Contract("0xdFEa08D7c2B43498Bfe32778334c9279956057F0", contractAbi, provider);
    let contractWithSigner = contract.connect(signer);
    contractWithSigner.store(cid, config).then(async(res) => {
        document.getElementById("sentCid").innerHTML = '<b>CID:</b> ' + cid;
        document.getElementById("tHash").innerHTML = '<b>Transaction Hash:</b> ' + res.hash;
        console.log(res.hash);
    })
}

function getStorageInfo() {
    document.getElementById("storageInfo").innerHTML = "";
    let cid = document.getElementById("cidInput2").value;
    console.log('cid2:', cid);
    
    const socket = new io("http://13.126.82.18:3002"); // hosted
    // handle the event sent with socket.send()
    socket.on("message", data => {
        console.log(data);
    });
  
    socket.on("connect", () => {
        console.log('connection made cid:', cid);
        socket.emit("cid", cid);
    });

    socket.on("storageInfo", (storageInfo) => {
        console.log('storageInfo for cid:', storageInfo);
        if (storageInfo.storageInfo) {
            document.getElementById("storageInfo").innerHTML = storageInfo.storageInfo;
        } else {
            document.getElementById("storageInfo").innerHTML = storageInfo.toString();
        }
        socket.disconnect() 
    });
}

function useDefaultConfig() {
  document.getElementById("configInput").value = "";
  document.getElementById("configInput").value = "{hot:{enabled:true,allowUnfreeze:true,ipfs:{addTimeout:900},unfreezeMaxPrice:0},cold:{enabled:true,filecoin:{replicationFactor:1,dealMinDuration:518400,excludedMinersList:[],trustedMinersList:[],countryCodesList:[],renew:{enabled:true,threshold:1},address:f3rpbm3bt4muydk3iq5ainss6phht4bjbe5dq6egrx4rwzqjgwc5eruyloozvf6qjunubo467neaqsvbzyxnna,maxPrice:100000000000,fastRetrieval:true,dealStartOffset:8640,verifiedDeal:true}},repairable:false}";
}
