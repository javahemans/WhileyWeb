Systemd Setup
=============

Systemd setup for WhileyWeb is easy:
* Create a new user and group named `whiley`
* Clone the repository to `/opt/WhileyWeb` and `cd` to that folder
* Setup the configuration file: `cp example-config.py config.py` (the default settings are OK for this setup)
* Make sure that the `data` folder is owned by our whiley user: `chmod -R whiley:whiley data`
* Copy the `whiley-web.service` file to `/etc/systemd/system/`
* Reload systemd: `sudo systemctl daemon-reload`
* Start the service: `sudo systemctl start whiley-web.service`
   * Optional: Autostart the service on every boot: `sudo systemctl enable whiley-web.service`
* Visit http://localhost:8080/
