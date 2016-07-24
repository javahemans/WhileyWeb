#!/usr/bin/env python

import sys

# Set up the path.
sys.path.insert(0, "lib")
sys.path.insert(0, "src")

import config
import cherrypy
import main

cherrypy_config = {
    "global": {
        "log.screen": True,
        "server.socket_host" : "0.0.0.0",
        "server.socket_port" : 80
    },
    "/": {
        "request.show_tracebacks": False,
        "request.show_mismatched_params": False,
        "log.error_file": config.ERROR_LOG
    }
}
cherrypy.quickstart(main.Main(), config=cherrypy_config)

