<p align="center">
  <img width="1794" height="1318" alt="image" src="https://github.com/user-attachments/assets/c18467cc-f784-45d9-8743-485c43924e4d" />
</p>

The advent of DeFi has created many novel financial mechanisms and opened the door to many individuals who would previously not been able to meaningfully participate in a global economy. However, many of the experiences remain difficult to adopt for a variety of reasons, but chiefly due to complex concepts that are presented in UIs that are not always inherently intuitive.

Through our submission we hope to provide an application, [HoliBobs](https://holibobs.vercel.app/), that provides an experience that is as simple as possible while still opening the door for many to participate in the powerful decentralized financial mechanisms that exist today.

_Built for the ETHOnline 2025 Hackathon by Conor Fallon, Sara Antole, and Josh Reid._

---

# Project Overview

The goal of this project was to create an easy, seamless onboarding experience for users to be able to allocate their annual savings, typically set aside for family vacations, in a no loss lottery pool via the [PoolTogether protocol](https://pooltogether.com/) with the chance to win and grow their savings. Below are the major components of the application and a high level overview of how they function.

## Onboarding
<img width="497" height="278" alt="emailOnboarding" src="https://github.com/user-attachments/assets/6687df08-a4b5-4f10-b187-cf8218959224" />

For signing up and future logins we leveraged Coinbase's email verification which also allowed us to automtically generate wallets for new users - ensuring the process is as frictionless as possible for those unfamiliar with web3.

## On/Off Ramp
<img width="905" height="793" alt="image" src="https://github.com/user-attachments/assets/5c720d4d-27ae-40ee-8d73-b9966c8673eb" />

Addtionally, on/off ramp is handled through Coinbase's SDK to allow users to top up their accounts and deposit with payment methods they are more likely to have coming from a more traditional financial background.


## Prize Distribution
Under the hood, the prize draw and distribution is handled via PoolTogether's protocol. For now, this provides the ability for the application and its users to deposit in pools with a higher yield, but in time and with enough traction the goal would be to establish a HoliBob's pool consisting only of its participants.

---
# The App Experience

In this initial version of the application, a majority of the data is pulled from the network. However, some things have been mocked and/or operate in a sandbox mode in an effort to deliver something as quickly as possible. These components include the on/off ramp running in sandbox mode and the deposits/withdrawals being mocked as we created a mock prize vault for testnet to be able to demo and simulate the experience with little friction.

<p align="center">
  <img width="571" height="437" alt="image" src="https://github.com/user-attachments/assets/0f3071fd-04d8-4e95-a6d6-8fa7f9a9f45e" />
</p>
