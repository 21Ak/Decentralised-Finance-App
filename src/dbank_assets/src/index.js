import { HttpAgent, Actor } from '@dfinity/agent';
import { idlFactory as dbankIdl, canisterId as dbankCanisterId } from "../../declarations/dbank";

// Create a new HttpAgent with verifyQuerySignatures set to false
const agent = new HttpAgent({ verifyQuerySignatures: false });

// Fetch the root key if running in a local development environment
async function configureAgent() {
  if (process.env.NODE_ENV === 'development') {
    await agent.fetchRootKey();
  }
}

// Create a variable to hold the actor
let dbankActor;

// Create an actor for the dbank canister using the custom agent
async function createDbankActor() {
  await configureAgent();
  dbankActor = Actor.createActor(dbankIdl, {
    agent,
    canisterId: dbankCanisterId,
  });
}

window.addEventListener('load', async function() {
  try {
    await createDbankActor();
    update();
  } catch (error) {
    console.error('Error fetching balance:', error);
  }
});

document.querySelector("form").addEventListener("submit", async function(event) {
  event.preventDefault();
  // console.log("submitted");

  const button = event.target.querySelector("#submit-btn");

  const inputAmount = parseFloat(document.getElementById("input-amount").value);
  const outputAmount = parseFloat(document.getElementById("withdrawal-amount").value);

  button.setAttribute("disabled", true);

  if (!isNaN(inputAmount) && inputAmount > 0) {
    await dbankActor.topUp(inputAmount);
  }

  if (!isNaN(outputAmount) && outputAmount > 0) {
    await dbankActor.withdraw(outputAmount);
  }

  await dbankActor.compound();

  // Update balance after the transaction
  await update();
  
  document.getElementById('input-amount').value = "";
  document.getElementById('withdrawal-amount').value = "";
  button.removeAttribute("disabled");
});

async function update() {
  const currentAmount = await dbankActor.checkBalance();
  document.getElementById('value').innerText = Math.round(currentAmount * 100) / 100;
}