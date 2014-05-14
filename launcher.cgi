#!/usr/bin/env python

import sys

# Set up the path.
sys.path.insert(0, "lib")
sys.path.insert(0, "src")

import cherrypy
import main

cherrypy_config = {
    "global": {
        "log.screen": None
    },
    "/": {
        "request.show_tracebacks": False,
        "request.show_mismatched_params": False
    }
}
cherrypy.quickstart(main.Main(), config=cherrypy_config)

