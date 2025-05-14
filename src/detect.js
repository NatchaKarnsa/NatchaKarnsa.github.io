import detectEthereumProvider from "@metamask/detect-provider";

async function setup() {
  const provider = await detectEthereumProvider();

  if (provider && provider === window.ethereum) {
    console.log("MetaMask is available!");
    startApp(provider);
  } else {
    console.log("Please install MetaMask!");
  }
}

function startApp(provider) {
  if (provider !== window.ethereum) {
    console.error("Do you have multiple wallets installed?");
  }
}

window.addEventListener("load", setup);

/**********************************************************/
/* Handle chain (network) and chainChanged (per EIP-1193) */
/**********************************************************/

//const chainId = await window.ethereum.request({ method: "eth_chainId" });

window.ethereum.on("chainChanged", handleChainChanged);

function handleChainChanged(chainId) {
  window.location.reload();
}

/*********************************************/
/* Access the user's accounts (per EIP-1102) */
/*********************************************/

// const logOutButton = document.querySelector(".logOutEthereumButton");

// logOutButton.addEventListener("click", () => {
//   logout();
// });

const ethereumButton = document.querySelector(".enableEthereumButton");

if (ethereumButton) {
  ethereumButton.addEventListener("click", () => {
    getAccount();
  });
}

const logOutButton = document.querySelector(".logOutEthereumButton");

logOutButton.addEventListener("click", () => {
  logout();
});

async function getAccount() {
  const accounts = await window.ethereum
    .request({ method: "eth_requestAccounts" })
    .catch((err) => {
      if (err.code === 4001) {
        console.log("Please connect to MetaMask.");
      } else {
        console.error(err);
      }
    });
  const account = accounts[0];
  // showAccount.innerHTML = account
  console.log("hello!");
  localStorage.setItem("userAccount", account); // Store the account in localStorage
  window.location.href = "dashboard.html";
}

function logout() {
  console.log("Logging out...");
  localStorage.removeItem("userAccount"); // Clear the stored account
  window.location.href = "/index.html"; // Redirect to the login page
}

// Ensure the button is set up after DOM is loaded
