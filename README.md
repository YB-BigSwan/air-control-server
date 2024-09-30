# Air Quality and Control

This project started as a hobby project during Summer 2024 with the goal of helping my cat with breathing issues. It continued in the Autumn as a project for the IoT Experimental Project course lead by **Heikki Hietala**.

Furthermore this project is made up of 4 parts which you can find in their respective repositories:

- **[ESP32 Air Quality Monitor](https://github.com/YB-BigSwan/air_quality)**
- **[ESP32 AC Control Unit](https://github.com/YB-BigSwan/air_control)**
- **[Express + Node Server (You are here)](https://github.com/YB-BigSwan/air-control-server)**
- **[React Client](https://github.com/YB-BigSwan/air-control-frontend)**

## Table of Contents
- [Air Quality Monitor](#air-quality-monitor)
- [AC Control Unit](#ac-control-unit)
- [Server](#server)
- [Client](#client)

## Air Quality Monitor
<img src="./images/air-quality.png" alt="Air quality monitoring device" width="50%"/>

### Components
- ESP32
- DHT11 temperature and humidity Sensor
- 10 KΩ resistor
- SGP30 CO2 and VOC sensor
- TFT Display

### Features
- Monitors the temperature, humidity, CO2 (ppm), and VOC (ppb) of my apartment
- Displays data and a sprite GIF of my cat on the screen
- Sends the air quality data to the server

### Challenges
- Converting the GIF to a C header file. All credit for that goes to [Maduinos](https://maduinos.blogspot.com/2023/06/giftorgb565-converter-v001.html) for making a great tool
- Getting everything to fit on the device as some of the libraries and the gif header file are quite large

## AC Control Unit 

### Components
- ESP32
- IR LED
- NPN Transistor
- 220 Ω resistor

### Features
- Takes commands sent by the client through the server
- Sends the appropriate command to the AC unit via the IR emitter

### Challenges
- Decoding IR signals as my AC unit's remote uses a somewhat uncommon protocol
- Config and device IP registration with server

## Server

### Features
- Express + Node Server
- Hosted on Heroku
- Routes:
    - Connect Device
    - Register local ESP32 IP address
    - Send sensor data; handled as a single object that is overwritten (I do not need to store the data)
    - Fetch sensor data
    - Generic /:command route to handle all commands to the **AC Control Unit** device

### Challenges

- Not really a challenge, more of a brainfart on my part, but route specificity. I was troubleshooting an issue for a while caused by my generic /:command route being before my post/get sensor-data routes 🤦‍♂️

## Client

### Features
- React + TS Client
- Google 0Auth (Access restricted to the members of the household)
- Fun sprite GIF of my cat. It's happy when the air is good and cries when certain air quality thresholds are exceeded
- Displays data sent to the sever by the air quality monitor to allow me to remotely monitor my apartment's air quality
- Has buttons that allow me to remotely control my AC unit to pull in fresh air, cool, or heat the apartment as needed. This is done by sending a request to the server that gets forwarded to the air control device via port forwarding. The device then sends an IR signal to my AC unit.

### Challenges
- No real challenges to note for the client. 
