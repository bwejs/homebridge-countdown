
# Homebridge-Countdown

With this plugin, you can create any number of Countdowns. Writing the Value will result in Counting Down to 0 in 1 second intervals.

## How to install

 * ```sudo npm install -g https://github.com/bwejs/homebridge-countdown```
* Create an accessory in your config.json file
* Restart homebridge

## Example config.json:

 ```
    "accessories": [
        {
          "accessory": "Coutdown",
          "name": "My Countdown"
        }   
    ]

```
